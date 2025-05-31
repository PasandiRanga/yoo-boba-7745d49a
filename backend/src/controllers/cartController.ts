import { Request, Response } from 'express';
import { pool } from '../db/index';

// Get cart items for a customer
export const getCartItems = async (req: Request, res: Response) => {
  const { customerId } = req.params;
  console.log('Fetching cart items for customer:', customerId);
  
  try {
    const { rows } = await pool.query(`
      SELECT 
        c.product_id as id,
        c.quantity,
        c.price_per_item as price,
        c.weight,
        c.subtotal,
        p.name,
        p.images as image
      FROM cart c
      JOIN products p ON c.product_id = p.product_id
      WHERE c.customerid = $1
    `, [customerId]);
    
    res.json({
      success: true,
      items: rows
    });
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cart items'
    });
  }
};

// Add item to cart
export const addToCart = async (req: Request, res: Response) => {
  const { customerId, productId, quantity, pricePerItem, weight } = req.body;
  console.error('Received request to add item to cart:', req.body);
  
  try {
    console.log('Adding item to cart:', req.body);
    
    // Check if item already exists in cart
    const { rows: existingItems } = await pool.query(`
      SELECT quantity FROM cart 
      WHERE customerid = $1 AND product_id = $2
    `, [customerId, productId]);
    
    if (existingItems.length > 0) {
      // Update existing item
      const newQuantity = existingItems[0].quantity + quantity;
      const newSubtotal = newQuantity * pricePerItem;
      
      await pool.query(`
        UPDATE cart 
        SET quantity = $1, subtotal = $2
        WHERE customerid = $3 AND product_id = $4
      `, [newQuantity, newSubtotal, customerId, productId]);
    } else {
      // Insert new item
      const subtotal = quantity * pricePerItem;
      
      await pool.query(`
        INSERT INTO cart (customerid, product_id, quantity, price_per_item, weight, subtotal)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [customerId, productId, quantity, pricePerItem, weight, subtotal]);
    }
    
    res.json({
      success: true,
      message: 'Item added to cart successfully'
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add item to cart'
    });
  }
};

// Update cart item quantity
export const updateCartItem = async (req: Request, res: Response) => {
  const { customerId, productId, quantity } = req.body;
  
  try {
    // Get current price to calculate new subtotal
    const { rows: priceRows } = await pool.query(`
      SELECT price_per_item FROM cart 
      WHERE customerid = $1 AND product_id = $2
    `, [customerId, productId]);
    
    if (priceRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }
    
    const pricePerItem = priceRows[0].price_per_item;
    const newSubtotal = quantity * pricePerItem;
    
    const { rowCount } = await pool.query(`
      UPDATE cart 
      SET quantity = $1, subtotal = $2
      WHERE customerid = $3 AND product_id = $4
    `, [quantity, newSubtotal, customerId, productId]);
    
    if (rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Cart item updated successfully'
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update cart item'
    });
  }
};

// Remove item from cart
export const removeCartItem = async (req: Request, res: Response) => {
  const { customerId, productId } = req.params;
  
  try {
    const { rowCount } = await pool.query(`
      DELETE FROM cart 
      WHERE customerid = $1 AND product_id = $2
    `, [customerId, productId]);
    
    if (rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Item removed from cart successfully'
    });
  } catch (error) {
    console.error('Error removing cart item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove cart item'
    });
  }
};

// Clear entire cart
export const clearCart = async (req: Request, res: Response) => {
  const { customerId } = req.params;
  
  try {
    await pool.query(`
      DELETE FROM cart 
      WHERE customerid = $1
    `, [customerId]);
    
    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart'
    });
  }
};

// Sync localStorage cart to database when user logs in
export const syncCart = async (req: Request, res: Response) => {
  const { customerId, cartItems } = req.body;
  
  try {
    // Clear existing cart items for this customer
    await pool.query('DELETE FROM cart WHERE customerid = $1', [customerId]);
    
    // Insert all cart items
    for (const item of cartItems) {
      const subtotal = item.quantity * item.price;
      
      await pool.query(`
        INSERT INTO cart (customerid, product_id, quantity, price_per_item, weight, subtotal)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        customerId,
        item.id,
        item.quantity,
        item.price,
        item.weight || 0,
        subtotal
      ]);
    }
    
    res.json({
      success: true,
      message: 'Cart synced successfully'
    });
  } catch (error) {
    console.error('Error syncing cart:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync cart'
    });
  }
};

// Remove ordered items from cart (after successful order)
export const removeOrderedItems = async (req: Request, res: Response) => {
  const { customerId, orderedItems } = req.body;
  
  try {
    for (const item of orderedItems) {
      // Get current quantity in cart
      const { rows: currentRows } = await pool.query(`
        SELECT quantity FROM cart 
        WHERE customerid = $1 AND product_id = $2
      `, [customerId, item.id]);
      
      if (currentRows.length > 0) {
        const currentQuantity = currentRows[0].quantity;
        const remainingQuantity = currentQuantity - item.quantity;
        
        if (remainingQuantity <= 0) {
          // Remove item completely
          await pool.query(`
            DELETE FROM cart 
            WHERE customerid = $1 AND product_id = $2
          `, [customerId, item.id]);
        } else {
          // Update quantity
          const { rows: priceRows } = await pool.query(`
            SELECT price_per_item FROM cart 
            WHERE customerid = $1 AND product_id = $2
          `, [customerId, item.id]);
          
          const pricePerItem = priceRows[0].price_per_item;
          const newSubtotal = remainingQuantity * pricePerItem;
          
          await pool.query(`
            UPDATE cart 
            SET quantity = $1, subtotal = $2 
            WHERE customerid = $3 AND product_id = $4
          `, [remainingQuantity, newSubtotal, customerId, item.id]);
        }
      }
    }
    
    res.json({
      success: true,
      message: 'Ordered items removed from cart successfully'
    });
  } catch (error) {
    console.error('Error removing ordered items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove ordered items from cart'
    });
  }
};
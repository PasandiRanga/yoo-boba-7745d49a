
import { query, transaction } from '@/lib/db';
import { Order, Customer, Address, OrderItem } from '@/models/OrderModel';

export interface DbOrder {
  id: string;
  customer_id: string;
  shipping_address_id: string;
  billing_address_id: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: string;
  payment_method: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
}

// Create an order in the database
export const createOrderInDb = async (
  customer: Customer,
  shippingAddress: Address,
  billingAddress: Address,
  items: OrderItem[],
  paymentMethod: string
): Promise<Order> => {
  return transaction(async (client) => {
    // 1. Insert customer
    const customerResult = await client.query(
      `INSERT INTO customers (first_name, last_name, email, phone, company)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [customer.firstName, customer.lastName, customer.email, customer.phone, customer.company || null]
    );
    const customerId = customerResult.rows[0].id;

    // 2. Insert shipping address
    const shippingAddressResult = await client.query(
      `INSERT INTO addresses (street1, street2, city, state, zip_code, country)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [
        shippingAddress.street1,
        shippingAddress.street2 || null,
        shippingAddress.city,
        shippingAddress.state,
        shippingAddress.zipCode,
        shippingAddress.country
      ]
    );
    const shippingAddressId = shippingAddressResult.rows[0].id;

    // 3. Insert billing address
    const billingAddressResult = await client.query(
      `INSERT INTO addresses (street1, street2, city, state, zip_code, country)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [
        billingAddress.street1,
        billingAddress.street2 || null,
        billingAddress.city,
        billingAddress.state,
        billingAddress.zipCode,
        billingAddress.country
      ]
    );
    const billingAddressId = billingAddressResult.rows[0].id;

    // 4. Calculate order totals
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 100 ? 0 : 15; // Free shipping over $100
    const total = subtotal + tax + shipping;

    // 5. Insert order
    const orderId = `ORD-${Date.now()}`;
    const orderResult = await client.query(
      `INSERT INTO orders (
        id, customer_id, shipping_address_id, billing_address_id,
        subtotal, tax, shipping, total, status, payment_method, payment_status
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        orderId,
        customerId,
        shippingAddressId,
        billingAddressId,
        subtotal,
        tax,
        shipping,
        total,
        'pending',
        paymentMethod,
        'pending'
      ]
    );

    // 6. Insert order items
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, name, price, quantity)
         VALUES ($1, $2, $3, $4, $5)`,
        [orderId, item.productId, item.name, item.price, item.quantity]
      );
    }

    // 7. Return complete order
    return {
      id: orderId,
      customer,
      shippingAddress,
      billingAddress,
      items,
      subtotal,
      tax,
      shipping,
      total,
      status: 'pending',
      paymentMethod,
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  });
};

// Get an order by ID from the database
export const getOrderByIdFromDb = async (orderId: string): Promise<Order | null> => {
  try {
    // 1. Get order
    const orderResult = await query<DbOrder>(
      `SELECT * FROM orders WHERE id = $1 LIMIT 1`,
      [orderId]
    );
    
    if (orderResult.length === 0) {
      return null;
    }
    
    const order = orderResult[0];
    
    // 2. Get customer
    const customerResult = await query(
      `SELECT * FROM customers WHERE id = $1 LIMIT 1`,
      [order.customer_id]
    );
    
    // 3. Get addresses
    const shippingAddressResult = await query(
      `SELECT * FROM addresses WHERE id = $1 LIMIT 1`,
      [order.shipping_address_id]
    );
    
    const billingAddressResult = await query(
      `SELECT * FROM addresses WHERE id = $1 LIMIT 1`,
      [order.billing_address_id]
    );
    
    // 4. Get order items
    const orderItemsResult = await query(
      `SELECT * FROM order_items WHERE order_id = $1`,
      [orderId]
    );
    
    // 5. Construct complete order
    return {
      id: order.id,
      customer: {
        firstName: customerResult[0].first_name,
        lastName: customerResult[0].last_name,
        email: customerResult[0].email,
        phone: customerResult[0].phone,
        company: customerResult[0].company
      },
      shippingAddress: {
        street1: shippingAddressResult[0].street1,
        street2: shippingAddressResult[0].street2,
        city: shippingAddressResult[0].city,
        state: shippingAddressResult[0].state,
        zipCode: shippingAddressResult[0].zip_code,
        country: shippingAddressResult[0].country
      },
      billingAddress: {
        street1: billingAddressResult[0].street1,
        street2: billingAddressResult[0].street2,
        city: billingAddressResult[0].city,
        state: billingAddressResult[0].state,
        zipCode: billingAddressResult[0].zip_code,
        country: billingAddressResult[0].country
      },
      items: orderItemsResult.map(item => ({
        productId: item.product_id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      subtotal: order.subtotal,
      tax: order.tax,
      shipping: order.shipping,
      total: order.total,
      status: order.status as any,
      paymentMethod: order.payment_method,
      paymentStatus: order.payment_status as any,
      createdAt: order.created_at,
      updatedAt: order.updated_at
    };
  } catch (error) {
    console.error('Error fetching order from database:', error);
    return null;
  }
};

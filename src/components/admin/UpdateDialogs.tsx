import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Product, PriceUpdateDialog, StockUpdateDialog } from '../../types/admin';

interface UpdateDialogsProps {
  products: Product[];
  priceUpdateDialog: PriceUpdateDialog;
  stockUpdateDialog: StockUpdateDialog;
  onClosePriceDialog: () => void;
  onCloseStockDialog: () => void;
  onPriceUpdate: (productId: string, weight: string, price: number) => void;
  onStockUpdate: (productId: string, weight: string, stockToAdd: number) => void;
}

export const UpdateDialogs: React.FC<UpdateDialogsProps> = ({
  products,
  priceUpdateDialog,
  stockUpdateDialog,
  onClosePriceDialog,
  onCloseStockDialog,
  onPriceUpdate,
  onStockUpdate,
}) => {
  const [newPriceValue, setNewPriceValue] = useState('');
  const [newStockValue, setNewStockValue] = useState('');

  const handlePriceUpdate = () => {
    const newPrice = Number(newPriceValue);
    if (newPrice > 0) {
      onPriceUpdate(priceUpdateDialog.productId, priceUpdateDialog.weight, newPrice);
      onClosePriceDialog();
      setNewPriceValue('');
    }
  };

  const handleStockUpdate = () => {
    const stockToAdd = Number(newStockValue);
    if (stockToAdd > 0) {
      onStockUpdate(stockUpdateDialog.productId, stockUpdateDialog.weight, stockToAdd);
      onCloseStockDialog();
      setNewStockValue('');
    }
  };

  return (
    <>
      {/* Price Update Dialog */}
      <Dialog open={priceUpdateDialog.open} onOpenChange={onClosePriceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Price</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Current price: Rs. {priceUpdateDialog.currentPrice.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Product: {products.find(p => p.product_id === priceUpdateDialog.productId)?.name} - {priceUpdateDialog.weight}
              </p>
            </div>
            <div>
              <Label htmlFor="newPrice">New Price (Rs.)</Label>
              <Input
                id="newPrice"
                type="number"
                placeholder="Enter new price"
                value={newPriceValue}
                onChange={(e) => setNewPriceValue(e.target.value)}
                step="0.01"
                min="0"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClosePriceDialog}>
                Cancel
              </Button>
              <Button 
                onClick={handlePriceUpdate}
                disabled={!newPriceValue || Number(newPriceValue) <= 0}
              >
                Update Price
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Stock Update Dialog */}
      <Dialog open={stockUpdateDialog.open} onOpenChange={onCloseStockDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Stock</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Current stock: {stockUpdateDialog.currentStock} items
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Product: {products.find(p => p.product_id === stockUpdateDialog.productId)?.name} - {stockUpdateDialog.weight}
              </p>
            </div>
            <div>
              <Label htmlFor="newStock">Stock to Add</Label>
              <Input
                id="newStock"
                type="number"
                placeholder="Enter quantity to add"
                value={newStockValue}
                onChange={(e) => setNewStockValue(e.target.value)}
                min="1"
              />
              {newStockValue && Number(newStockValue) > 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  New total stock will be: {stockUpdateDialog.currentStock + Number(newStockValue)} items
                </p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onCloseStockDialog}>
                Cancel
              </Button>
              <Button 
                onClick={handleStockUpdate}
                disabled={!newStockValue || Number(newStockValue) <= 0}
              >
                Add Stock
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
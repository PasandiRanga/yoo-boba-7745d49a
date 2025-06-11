import React from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Product, PriceUpdateDialog, StockUpdateDialog } from '../../types/admin';

interface InventoryTabProps {
  products: Product[];
  onUpdatePrice: (productId: string, weight: string, currentPrice: number) => void;
  onUpdateStock: (productId: string, weight: string, currentStock: number) => void;
}

export const InventoryTab: React.FC<InventoryTabProps> = ({
  products,
  onUpdatePrice,
  onUpdateStock,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Current Price</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Update Price</TableHead>
                <TableHead>Update Stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) =>
                product.variants.map((variant) => (
                  <TableRow key={`${product.product_id}-${variant.weight}`}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{variant.weight}</TableCell>
                    <TableCell>Rs. {(Number(variant.price) || 0).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={variant.stock < 10 ? "destructive" : "default"}>
                        {variant.stock}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onUpdatePrice(product.product_id, variant.weight, variant.price)}
                      >
                        Update Price
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onUpdateStock(product.product_id, variant.weight, variant.stock)}
                      >
                        Add Stock
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
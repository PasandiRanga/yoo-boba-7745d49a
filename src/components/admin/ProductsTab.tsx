import React, { useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Edit, Trash2, Plus } from 'lucide-react';
import { Product, NewProduct } from '../../types/admin';
import { EditProductDialog } from './EditProductDialog';

interface ProductsTabProps {
  products: Product[];
  showAddProductForm: boolean;
  newProduct: NewProduct;
  onToggleAddProductForm: () => void;
  onNewProductChange: (product: NewProduct) => void;
  onAddProduct: () => void;
  onUpdateProduct: (productId: string, productData: Partial<NewProduct>) => Promise<boolean>;
  onDeleteProduct: (productId: string) => void;
}

export const ProductsTab: React.FC<ProductsTabProps> = ({
  products,
  showAddProductForm,
  newProduct,
  onToggleAddProductForm,
  onNewProductChange,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
}) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  return (
    <div className="space-y-6">
      {/* Products List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Products List</CardTitle>
          <Button onClick={onToggleAddProductForm}>
            <Plus className="h-4 w-4 mr-2" />
            {showAddProductForm ? 'Cancel' : 'Add Product'}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Variants</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.product_id}>
                    <TableCell className="font-mono">{product.product_id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>
                      <Badge variant={product.featured ? "default" : "secondary"}>
                        {product.featured ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell>{product.variants.length} variants</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setEditingProduct(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Product</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this product? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => onDeleteProduct(product.product_id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add New Product Form */}
      {showAddProductForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Product</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="productId">Product ID</Label>
                <Input
                  id="productId"
                  value={newProduct.productId}
                  onChange={(e) => onNewProductChange({ ...newProduct, productId: e.target.value })}
                  placeholder="P006"
                />
              </div>
              <div>
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  id="productName"
                  value={newProduct.name}
                  onChange={(e) => onNewProductChange({ ...newProduct, name: e.target.value })}
                  placeholder="Product Name"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="productDescription">Description</Label>
              <Textarea
                id="productDescription"
                value={newProduct.description}
                onChange={(e) => onNewProductChange({ ...newProduct, description: e.target.value })}
                placeholder="Product description"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="productImages">Image URL</Label>
              <Input
                id="productImages"
                value={newProduct.images}
                onChange={(e) => onNewProductChange({ ...newProduct, images: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  value={newProduct.attributes.color}
                  onChange={(e) => onNewProductChange({
                    ...newProduct,
                    attributes: { ...newProduct.attributes, color: e.target.value }
                  })}
                  placeholder="Black"
                />
              </div>
              <div>
                <Label htmlFor="flavor">Flavor</Label>
                <Input
                  id="flavor"
                  value={newProduct.attributes.flavor}
                  onChange={(e) => onNewProductChange({
                    ...newProduct,
                    attributes: { ...newProduct.attributes, flavor: e.target.value }
                  })}
                  placeholder="Vanilla"
                />
              </div>
              <div>
                <Label htmlFor="cookingTime">Cooking Time</Label>
                <Input
                  id="cookingTime"
                  value={newProduct.attributes.cookingTime}
                  onChange={(e) => onNewProductChange({
                    ...newProduct,
                    attributes: { ...newProduct.attributes, cookingTime: e.target.value }
                  })}
                  placeholder="25 minutes"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {newProduct.variants.map((variant, index) => (
                <div key={variant.weight} className="space-y-2">
                  <Label className="font-semibold">{variant.weight}</Label>
                  <div>
                    <Label htmlFor={`price-${index}`} className="text-sm">Price (Rs.)</Label>
                    <Input
                      id={`price-${index}`}
                      type="number"
                      placeholder="Price"
                      value={variant.price}
                      onChange={(e) => {
                        const newVariants = [...newProduct.variants];
                        newVariants[index].price = Number(e.target.value);
                        onNewProductChange({ ...newProduct, variants: newVariants });
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`stock-${index}`} className="text-sm">Stock Quantity</Label>
                    <Input
                      id={`stock-${index}`}
                      type="number"
                      placeholder="Stock"
                      value={variant.stock}
                      onChange={(e) => {
                        const newVariants = [...newProduct.variants];
                        newVariants[index].stock = Number(e.target.value);
                        onNewProductChange({ ...newProduct, variants: newVariants });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button onClick={onAddProduct}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </CardContent>
        </Card>
      )}

      <EditProductDialog
        product={editingProduct}
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        onUpdate={onUpdateProduct}
      />
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Product, NewProduct } from '../../types/admin';

interface EditProductDialogProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (productId: string, productData: Partial<NewProduct>) => Promise<boolean>;
}

export const EditProductDialog: React.FC<EditProductDialogProps> = ({
  product,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const [formData, setFormData] = useState<Partial<NewProduct>>({
    name: '',
    description: '',
    images: '',
    attributes: {
      color: '',
      flavor: '',
      texture: '',
      cookingTime: '',
      ingredients: [],
      storageInstructions: '',
    },
    featured: false,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        images: Array.isArray(product.images) ? product.images.join(', ') : product.images || '',
        attributes: {
          color: product.attributes?.color || '',
          flavor: product.attributes?.flavor || '',
          texture: product.attributes?.texture || '',
          cookingTime: product.attributes?.cookingTime || '',
          ingredients: product.attributes?.ingredients || [],
          storageInstructions: product.attributes?.storageInstructions || '',
        },
        featured: product.featured || false,
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    const success = await onUpdate(product.product_id, formData);
    if (success) {
      onClose();
    }
  };

  const handleClose = () => {
    onClose();
    // Reset form when closing
    setFormData({
      name: '',
      description: '',
      images: '',
      attributes: {
        color: '',
        flavor: '',
        texture: '',
        cookingTime: '',
        ingredients: [],
        storageInstructions: '',
      },
      featured: false,
    });
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product: {product.name}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="productName">Product Name</Label>
            <Input
              id="productName"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Product Name"
              required
            />
          </div>

          <div>
            <Label htmlFor="productDescription">Description</Label>
            <Textarea
              id="productDescription"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Product description"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="productImages">Image URLs (comma-separated)</Label>
            <Input
              id="productImages"
              value={formData.images}
              onChange={(e) => setFormData({ ...formData, images: e.target.value })}
              placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                value={formData.attributes?.color || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  attributes: { ...formData.attributes, color: e.target.value }
                })}
                placeholder="Black"
              />
            </div>
            <div>
              <Label htmlFor="flavor">Flavor</Label>
              <Input
                id="flavor"
                value={formData.attributes?.flavor || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  attributes: { ...formData.attributes, flavor: e.target.value }
                })}
                placeholder="Vanilla"
              />
            </div>
            <div>
              <Label htmlFor="cookingTime">Cooking Time</Label>
              <Input
                id="cookingTime"
                value={formData.attributes?.cookingTime || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  attributes: { ...formData.attributes, cookingTime: e.target.value }
                })}
                placeholder="25 minutes"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
            />
            <Label htmlFor="featured">Featured Product</Label>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              Update Product
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
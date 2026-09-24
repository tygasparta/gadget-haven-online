
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProducts } from '@/hooks/useProducts';
import { X, Plus, Star, ShoppingCart } from 'lucide-react';
import { useAddToCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';

interface ComparisonProduct {
  id: number;
  name: string;
  price: number;
  original_price: number | null;
  image: string;
  rating: number;
  reviews: number;
  specifications: Array<{key: string, value: string}> | null;
  colors: Array<{name: string, hex_code: string}> | null;
  brand: string | null;
  category: string | null;
}

const ProductComparison: React.FC = () => {
  const [selectedProducts, setSelectedProducts] = useState<ComparisonProduct[]>([]);
  const [showProductSelector, setShowProductSelector] = useState(false);
  const { data: products = [] } = useProducts();
  const addToCart = useAddToCart();
  const { toast } = useToast();

  const addProductToComparison = (product: ComparisonProduct) => {
    if (selectedProducts.length >= 3) {
      toast({
        title: "Maximum products reached",
        description: "You can compare up to 3 products at once",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedProducts.find(p => p.id === product.id)) {
      toast({
        title: "Product already added",
        description: "This product is already in comparison",
        variant: "destructive"
      });
      return;
    }

    setSelectedProducts([...selectedProducts, product]);
    toast({
      title: "Product added to comparison",
      description: `${product.name} has been added to comparison`,
    });
  };

  const removeProductFromComparison = (productId: number) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  const handleAddToCart = (productId: number) => {
    addToCart.mutate({ productId, quantity: 1 });
  };

  const getAllSpecifications = () => {
    const allSpecs = new Set<string>();
    selectedProducts.forEach(product => {
      product.specifications?.forEach(spec => {
        allSpecs.add(spec.key);
      });
    });
    return Array.from(allSpecs);
  };

  const getSpecValue = (product: ComparisonProduct, specKey: string) => {
    return product.specifications?.find(spec => spec.key === specKey)?.value || 'N/A';
  };

  if (selectedProducts.length === 0) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Product Comparison</span>
            <Badge variant="outline">Up to 3 products</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">Select products to compare side by side</p>
            <Button 
              onClick={() => setShowProductSelector(true)}
              className="bg-sky-600 hover:bg-sky-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product to Compare
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mb-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Product Comparison ({selectedProducts.length}/3)</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowProductSelector(true)}
              disabled={selectedProducts.length >= 3}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Product Headers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {selectedProducts.map((product) => (
              <Card key={product.id} className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeProductFromComparison(product.id)}
                  className="absolute top-2 right-2 p-1 h-6 w-6 text-destructive hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
                <CardContent className="p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h3 className="font-medium text-sm mb-2 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-1">
                      <span className="text-lg font-bold text-sky-600">${product.price}</span>
                      {product.original_price && product.original_price > product.price && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${product.original_price}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-rating fill-current" />
                      <span className="text-sm">{product.rating}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">({product.reviews} reviews)</span>
                  </div>
                  <Button
                    onClick={() => handleAddToCart(product.id)}
                    className="w-full bg-sky-600 hover:bg-sky-700 text-white py-2 text-sm"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border">
              <thead>
                <tr className="bg-muted/50">
                  <th className="border border-border p-3 text-left font-medium">Specification</th>
                  {selectedProducts.map((product) => (
                    <th key={product.id} className="border border-border p-3 text-left font-medium">
                      {product.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Basic Info */}
                <tr>
                  <td className="border border-border p-3 font-medium bg-muted/50">Brand</td>
                  {selectedProducts.map((product) => (
                    <td key={product.id} className="border border-border p-3">
                      {product.brand || 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border border-border p-3 font-medium bg-muted/50">Category</td>
                  {selectedProducts.map((product) => (
                    <td key={product.id} className="border border-border p-3">
                      {product.category || 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border border-border p-3 font-medium bg-muted/50">Price</td>
                  {selectedProducts.map((product) => (
                    <td key={product.id} className="border border-border p-3">
                      <span className="font-bold text-sky-600">${product.price}</span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border border-border p-3 font-medium bg-muted/50">Rating</td>
                  {selectedProducts.map((product) => (
                    <td key={product.id} className="border border-border p-3">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-rating fill-current" />
                        <span>{product.rating}</span>
                        <span className="text-xs text-muted-foreground">({product.reviews})</span>
                      </div>
                    </td>
                  ))}
                </tr>
                
                {/* Dynamic Specifications - This is the key fix */}
                {getAllSpecifications().map((specKey) => (
                  <tr key={specKey}>
                    <td className="border border-border p-3 font-medium bg-muted/50">
                      {specKey}
                    </td>
                    {selectedProducts.map((product) => (
                      <td key={product.id} className="border border-border p-3">
                        {getSpecValue(product, specKey)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Product Selector Modal */}
      {showProductSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Select Product to Compare</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowProductSelector(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <Card key={product.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <h3 className="font-medium text-sm mb-2 line-clamp-2">{product.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-sky-600">${product.price}</span>
                        <Button
                          onClick={() => {
                            addProductToComparison(product as ComparisonProduct);
                            setShowProductSelector(false);
                          }}
                          disabled={selectedProducts.find(p => p.id === product.id) !== undefined}
                          className="bg-sky-600 hover:bg-sky-700 text-white px-3 py-1 text-sm"
                        >
                          {selectedProducts.find(p => p.id === product.id) ? 'Added' : 'Compare'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProductComparison;

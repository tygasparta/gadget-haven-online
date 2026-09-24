import React, { useState, useMemo } from 'react';
import { Plus, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useProducts } from '@/hooks/useProducts';
import { useAddToCart } from '@/hooks/useCart';
import { useAuthContext } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface FrequentlyBoughtTogetherProps {
  mainProduct: { id: number; name: string; price: number; image: string };
  category: string | null;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200&h=200&fit=crop';

const FrequentlyBoughtTogether: React.FC<FrequentlyBoughtTogetherProps> = ({ mainProduct, category }) => {
  const { data: allProducts = [] } = useProducts();
  const { mutate: addToCart } = useAddToCart();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const companions = useMemo(() => {
    return allProducts
      .filter((p) => p.id !== mainProduct.id && category && p.category?.toLowerCase() === category.toLowerCase())
      .slice(0, 2)
      .map((p) => ({ id: p.id, name: p.name, price: p.price, image: p.image }));
  }, [allProducts, mainProduct.id, category]);

  const bundle = [
    { id: mainProduct.id, name: mainProduct.name, price: mainProduct.price, image: mainProduct.image },
    ...companions,
  ];

  const [checked, setChecked] = useState<Record<number, boolean>>({});

  if (companions.length === 0) return null;

  // Items default to checked unless the shopper explicitly unchecked them —
  // avoids needing to pre-seed state before the async product list resolves.
  const selectedItems = bundle.filter((p) => checked[p.id] !== false);
  const total = selectedItems.reduce((sum, p) => sum + p.price, 0);

  const handleAddAll = () => {
    if (!user) {
      toast.error('Please log in to add items to cart');
      navigate('/auth');
      return;
    }
    selectedItems.forEach((p) => addToCart({ productId: p.id }));
    toast.success(`${selectedItems.length} item${selectedItems.length > 1 ? 's' : ''} added to cart`);
  };

  return (
    <div className="mb-12 bg-card border border-border rounded-xl p-5 sm:p-6">
      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4">Frequently Bought Together</h2>

      <div className="flex flex-wrap items-center gap-3 mb-5">
        {bundle.map((item, index) => (
          <div key={item.id} className="flex items-center gap-3">
            {index > 0 && <Plus className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
            <div className="flex items-center gap-2">
              <Checkbox
                checked={checked[item.id] !== false}
                onCheckedChange={(v) => setChecked((prev) => ({ ...prev, [item.id]: v === true }))}
              />
              <div className="w-16 h-16 rounded-lg border border-border overflow-hidden bg-muted/40">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Total Price ({selectedItems.length} items)</p>
          <p className="text-2xl font-bold text-primary">${total.toFixed(2)}</p>
        </div>
        <Button onClick={handleAddAll} disabled={selectedItems.length === 0} className="bg-primary hover:bg-primary/90">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add All to Cart
        </Button>
      </div>
    </div>
  );
};

export default FrequentlyBoughtTogether;

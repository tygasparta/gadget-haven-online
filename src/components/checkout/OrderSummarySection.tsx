import React from 'react';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

interface CartItem {
  id: string;
  quantity: number;
  products: { id: number; name: string; price: number; image: string };
}

interface OrderSummarySectionProps {
  cartItems: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  finalTotal: number;
  paymentMethod: string;
  mobileMethod: string;
  isProcessing: boolean;
  onSubmit: () => void;
  hideAction?: boolean;
}

const money = (n: number) => `$${n.toFixed(2)}`;

const OrderSummarySection: React.FC<OrderSummarySectionProps> = ({
  cartItems, subtotal, tax, shipping, finalTotal, paymentMethod, isProcessing, onSubmit, hideAction,
}) => (
  <section className="bg-background border border-border rounded-lg p-4 lg:sticky lg:top-24">
    <h2 className="text-sm font-semibold mb-3">Order summary · {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</h2>
    <ul className="space-y-3 max-h-72 overflow-y-auto">
      {cartItems.map((item) => (
        <li key={item.id} className="flex items-center gap-3">
          <div className="w-12 h-12 shrink-0 rounded-md border border-border p-1 bg-background">
            <img src={item.products.image} alt={item.products.name} loading="lazy" className="w-full h-full object-contain" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground line-clamp-1">{item.products.name}</p>
            <p className="text-xs text-muted-foreground">Qty {item.quantity} × {money(item.products.price)}</p>
          </div>
          <p className="text-sm font-medium">{money(item.products.price * item.quantity)}</p>
        </li>
      ))}
    </ul>
    <dl className="mt-4 pt-3 border-t border-border space-y-2 text-sm">
      <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{money(subtotal)}</dd></div>
      <div className="flex justify-between"><dt className="text-muted-foreground">Tax (2%)</dt><dd>{money(tax)}</dd></div>
      <div className="flex justify-between"><dt className="text-muted-foreground">Delivery</dt><dd className={shipping === 0 ? 'text-success' : ''}>{shipping === 0 ? 'Free' : money(shipping)}</dd></div>
      <div className="flex justify-between pt-2 border-t border-border text-base font-bold"><dt>Total</dt><dd>{money(finalTotal)}</dd></div>
    </dl>
    {!hideAction && (
      <Button onClick={onSubmit} disabled={isProcessing} className="w-full h-11 mt-4">
        {isProcessing ? 'Processing…' : `Pay ${money(finalTotal)} with ${paymentMethod === 'paypal' ? 'PayPal' : 'PesePay'}`}
      </Button>
    )}
    <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
      <Lock className="w-3.5 h-3.5" /> Payments are encrypted and secure
    </p>
  </section>
);

export default OrderSummarySection;

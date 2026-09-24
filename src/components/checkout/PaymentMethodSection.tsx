import React from 'react';

interface PaymentMethodSectionProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  totalAmount: number;
  onInitiatePesePayPayment: () => void;
  isPesePayProcessing: boolean;
  onInitiatePayPalPayment: () => void;
  isPayPalProcessing: boolean;
}

const OPTIONS = [
  { value: 'pesepay', title: 'PesePay', note: 'EcoCash, Visa, Mastercard and more' },
  { value: 'paypal', title: 'PayPal', note: 'Pay securely with your PayPal account (USD)' },
];

const PaymentMethodSection: React.FC<PaymentMethodSectionProps> = ({ paymentMethod, setPaymentMethod }) => (
  <section className="bg-background border border-border rounded-lg p-4">
    <h2 className="text-sm font-semibold mb-3">Payment method</h2>
    <div role="radiogroup" className="space-y-2">
      {OPTIONS.map((o) => {
        const active = paymentMethod === o.value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setPaymentMethod(o.value)}
            className={`w-full flex items-center gap-3 p-3 rounded-md border text-left transition-colors ${active ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'}`}
          >
            <span className={`w-4 h-4 rounded-full border-2 grid place-items-center shrink-0 ${active ? 'border-primary' : 'border-muted-foreground/50'}`}>
              {active && <span className="w-2 h-2 rounded-full bg-primary" />}
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-sm font-medium text-foreground">{o.title}</span>
              <span className="block text-xs text-muted-foreground">{o.note}</span>
            </span>
          </button>
        );
      })}
    </div>
    <p className="mt-3 text-xs text-muted-foreground">
      You'll be taken to {paymentMethod === 'paypal' ? 'PayPal' : 'PesePay'} to finish paying securely, then brought back here.
    </p>
  </section>
);

export default PaymentMethodSection;

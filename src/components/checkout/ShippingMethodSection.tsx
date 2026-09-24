import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Truck, MapPin, Clock, DollarSign } from 'lucide-react';

interface ShippingMethodSectionProps {
  shippingMethod: 'shipping' | 'collection';
  setShippingMethod: (method: 'shipping' | 'collection') => void;
}

const ShippingMethodSection: React.FC<ShippingMethodSectionProps> = ({
  shippingMethod,
  setShippingMethod
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="shadow-sm border-0 bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-foreground">
            <Truck className="w-5 h-5 text-primary" />
            <span>Delivery Method</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">Choose how you'd like to receive your order</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={shippingMethod}
            onValueChange={(value) => setShippingMethod(value as 'shipping' | 'collection')}
            className="space-y-4"
          >
            {/* Collection Option */}
            <div className="relative">
              <RadioGroupItem value="collection" id="collection" className="peer sr-only" />
              <Label
                htmlFor="collection"
                className="flex items-center justify-between p-4 border-2 border-border rounded-xl cursor-pointer transition-all hover:bg-muted/50 peer-checked:border-primary peer-checked:bg-primary/10"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-success/10 rounded-lg">
                    <MapPin className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Collect at Shop</div>
                    <div className="text-sm text-muted-foreground">Pick up from our store location</div>
                    <div className="flex items-center space-x-1 text-xs text-success mt-1">
                      <Clock className="w-3 h-3" />
                      <span>Ready in 2-3 business days</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-success text-lg">FREE</div>
                  <div className="text-xs text-muted-foreground">No delivery charge</div>
                </div>
              </Label>
            </div>

            {/* Shipping Option */}
            <div className="relative">
              <RadioGroupItem value="shipping" id="shipping" className="peer sr-only" />
              <Label
                htmlFor="shipping"
                className="flex items-center justify-between p-4 border-2 border-border rounded-xl cursor-pointer transition-all hover:bg-muted/50 peer-checked:border-primary peer-checked:bg-primary/10"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Truck className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Home Delivery</div>
                    <div className="text-sm text-muted-foreground">Delivered to your address</div>
                    <div className="flex items-center space-x-1 text-xs text-primary mt-1">
                      <Clock className="w-3 h-3" />
                      <span>3-5 business days</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 font-bold text-primary text-lg">
                    <DollarSign className="w-4 h-4" />
                    <span>5.00</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Shipping fee</div>
                </div>
              </Label>
            </div>
          </RadioGroup>

          {/* Additional Info */}
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <div className="text-xs text-muted-foreground space-y-1">
              {shippingMethod === 'collection' ? (
                <>
                  <p className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>Shop Address: 123 Main Street, City Center</span>
                  </p>
                  <p>• Bring a valid ID for collection</p>
                  <p>• We'll notify you when your order is ready</p>
                </>
              ) : (
                <>
                  <p>• Tracked delivery with signature required</p>
                  <p>• Insurance included for all items</p>
                  <p>• Delivery attempts between 9 AM - 6 PM</p>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ShippingMethodSection;
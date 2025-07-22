
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
}

interface ShippingAddressSectionProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
}

const ShippingAddressSection: React.FC<ShippingAddressSectionProps> = ({
  formData,
  setFormData
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-3 text-gray-800">
            <div className="p-2 bg-green-100 rounded-lg">
              <MapPin className="w-5 h-5 text-green-600" />
            </div>
            <span>Shipping Address</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium text-gray-700">
              Street Address *
            </Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="h-12 border-gray-200 focus:border-green-500 focus:ring-green-500/20 transition-all bg-white"
              placeholder="123 Main Street"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                City *
              </Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                className="h-12 border-gray-200 focus:border-green-500 focus:ring-green-500/20 transition-all bg-white"
                placeholder="Harare"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode" className="text-sm font-medium text-gray-700">
                ZIP Code
              </Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                className="h-12 border-gray-200 focus:border-green-500 focus:ring-green-500/20 transition-all bg-white"
                placeholder="12345"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="country" className="text-sm font-medium text-gray-700">
              Country
            </Label>
            <Select value={formData.country} onValueChange={(value) => setFormData({...formData, country: value})}>
              <SelectTrigger className="h-12 border-gray-200 focus:border-green-500 focus:ring-green-500/20 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Zimbabwe">Zimbabwe</SelectItem>
                <SelectItem value="South Africa">South Africa</SelectItem>
                <SelectItem value="Botswana">Botswana</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ShippingAddressSection;

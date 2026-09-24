import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FormData {
  email: string; firstName: string; lastName: string; address: string; city: string; zipCode: string; country: string;
}

interface ShippingAddressSectionProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
}

const ShippingAddressSection: React.FC<ShippingAddressSectionProps> = ({ formData, setFormData }) => (
  <section className="bg-background border border-border rounded-lg p-4 space-y-3">
    <h2 className="text-sm font-semibold">Delivery address</h2>
    <div className="space-y-1.5">
      <Label htmlFor="address" className="text-xs">Street address</Label>
      <Input id="address" autoComplete="street-address" className="h-11" value={formData.address}
        onChange={(e) => setFormData({ ...formData, address: e.target.value })} required />
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1.5">
        <Label htmlFor="city" className="text-xs">City</Label>
        <Input id="city" autoComplete="address-level2" className="h-11" value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })} placeholder="Harare" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="zipCode" className="text-xs">Postal code (optional)</Label>
        <Input id="zipCode" autoComplete="postal-code" className="h-11" value={formData.zipCode}
          onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })} />
      </div>
    </div>
    <div className="space-y-1.5">
      <Label htmlFor="country" className="text-xs">Country</Label>
      <Select value={formData.country} onValueChange={(v) => setFormData({ ...formData, country: v })}>
        <SelectTrigger id="country" className="h-11"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="Zimbabwe">Zimbabwe</SelectItem>
          <SelectItem value="South Africa">South Africa</SelectItem>
          <SelectItem value="Botswana">Botswana</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </section>
);

export default ShippingAddressSection;

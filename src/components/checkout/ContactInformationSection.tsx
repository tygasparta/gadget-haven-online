import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormData {
  email: string; firstName: string; lastName: string; address: string; city: string; zipCode: string; country: string;
}

interface ContactInformationSectionProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
}

const ContactInformationSection: React.FC<ContactInformationSectionProps> = ({ formData, setFormData }) => (
  <section className="bg-background border border-border rounded-lg p-4 space-y-3">
    <h2 className="text-sm font-semibold">Contact details</h2>
    <div className="space-y-1.5">
      <Label htmlFor="email" className="text-xs">Email</Label>
      <Input id="email" type="email" inputMode="email" autoComplete="email" className="h-11" value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="you@example.com" required />
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1.5">
        <Label htmlFor="firstName" className="text-xs">First name</Label>
        <Input id="firstName" autoComplete="given-name" className="h-11" value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="lastName" className="text-xs">Last name</Label>
        <Input id="lastName" autoComplete="family-name" className="h-11" value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required />
      </div>
    </div>
  </section>
);

export default ContactInformationSection;

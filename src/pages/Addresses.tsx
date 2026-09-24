
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, MapPin, Plus, Edit, Trash2, Home, Building } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAddresses, useAddAddress, useDeleteAddress } from '@/hooks/useAddresses';

const Addresses = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    zipcode: '',
    country: 'United States',
    type: 'home' as 'home' | 'work' | 'other',
    isdefault: false
  });

  const { data: addresses = [], isLoading } = useAddresses();
  const { mutate: addAddress, isPending: isAdding } = useAddAddress();
  const { mutate: deleteAddress } = useDeleteAddress();

  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user) return null;

  const getAddressIcon = (type: string) => {
    return type === 'home' ? <Home className="w-5 h-5" /> : <Building className="w-5 h-5" />;
  };

  const handleAddAddress = () => {
    addAddress(formData, {
      onSuccess: () => {
        setShowAddAddress(false);
        setFormData({
          name: '',
          line1: '',
          line2: '',
          city: '',
          state: '',
          zipcode: '',
          country: 'United States',
          type: 'home',
          isdefault: false
        });
      }
    });
  };

  const handleDeleteAddress = (id: string) => {
    deleteAddress(id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/50">
        <Header />
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/50">
      <Header />
      
      <div className={`max-w-2xl mx-auto px-4 py-8 ${isMobile ? 'pb-20' : ''}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Addresses</h1>
              <p className="text-muted-foreground">Manage your shipping addresses</p>
            </div>
          </div>
          
          <Button
            onClick={() => setShowAddAddress(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Address
          </Button>
        </div>

        {/* Addresses List */}
        <div className="space-y-4">
          {addresses.map((address) => (
            <Card key={address.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="text-muted-foreground mt-1">
                      {getAddressIcon(address.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium text-foreground">{address.name}</h3>
                        {address.isdefault && (
                          <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>{address.line1}</p>
                        {address.line2 && <p>{address.line2}</p>}
                        <p>{address.city}, {address.state} {address.zipcode}</p>
                        <p>{address.country}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteAddress(address.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Address Form */}
        {showAddAddress && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Add New Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="addressName">Address Name</Label>
                  <Input
                    id="addressName"
                    placeholder="e.g., Home, Work, etc."
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="type">Address Type</Label>
                  <Select value={formData.type} onValueChange={(value: 'home' | 'work' | 'other') => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home">Home</SelectItem>
                      <SelectItem value="work">Work</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="line1">Address Line 1</Label>
                  <Input
                    id="line1"
                    placeholder="Street address"
                    value={formData.line1}
                    onChange={(e) => setFormData({...formData, line1: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="line2">Address Line 2 (Optional)</Label>
                  <Input
                    id="line2"
                    placeholder="Apartment, suite, unit, etc."
                    value={formData.line2}
                    onChange={(e) => setFormData({...formData, line2: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      placeholder="State"
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="zipcode">ZIP Code</Label>
                    <Input
                      id="zipcode"
                      placeholder="12345"
                      value={formData.zipcode}
                      onChange={(e) => setFormData({...formData, zipcode: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      placeholder="Country"
                      value={formData.country}
                      onChange={(e) => setFormData({...formData, country: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  onClick={handleAddAddress} 
                  className="flex-1"
                  disabled={isAdding || !formData.name || !formData.line1 || !formData.city}
                >
                  {isAdding ? 'Adding...' : 'Add Address'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddAddress(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {addresses.length === 0 && !showAddAddress && (
          <Card className="text-center py-16">
            <CardContent>
              <MapPin className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No addresses saved</h3>
              <p className="text-muted-foreground mb-6">Add an address to make checkout faster</p>
              <Button onClick={() => setShowAddAddress(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Address
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {!isMobile && <Footer />}
    </div>
  );
};

export default Addresses;

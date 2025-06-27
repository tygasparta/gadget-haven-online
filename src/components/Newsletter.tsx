
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <div className="bg-blue-600 py-12 mb-8">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Stay Updated!</h2>
        <p className="text-blue-100 mb-8 text-lg">
          Get the latest deals and tech news delivered to your inbox
        </p>
        
        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-3">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-white border-0 py-3"
            required
          />
          <Button 
            type="submit"
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 font-semibold"
          >
            Subscribe
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Newsletter;

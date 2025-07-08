
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AIProductGeneratorProps {
  onGenerate: (generatedData: {
    name: string;
    description: string;
    category: string;
    brand: string;
  }) => void;
}

const AIProductGenerator: React.FC<AIProductGeneratorProps> = ({ onGenerate }) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [basicInfo, setBasicInfo] = useState({
    productType: '',
    keyFeatures: '',
    targetAudience: ''
  });

  const generateProductDetails = async () => {
    if (!basicInfo.productType.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide at least the product type",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const prompt = `Generate detailed product information for an e-commerce store based on the following:

Product Type: ${basicInfo.productType}
Key Features: ${basicInfo.keyFeatures || 'Standard features for this product type'}
Target Audience: ${basicInfo.targetAudience || 'General consumers'}

Please provide:
1. A compelling product name (max 80 characters)
2. A detailed product description (150-300 words) that highlights benefits and features
3. The most appropriate category from: Smartphones, Laptops, Tablets, Headphones, Cameras, Gaming, Accessories, Smart Watches, Audio, Home & Garden, Electronics
4. A suitable brand name if not specified

Format the response as JSON with keys: name, description, category, brand`;

      const { data, error } = await supabase.functions.invoke('generate-product-details', {
        body: { prompt }
      });

      if (error) throw error;

      if (data?.generatedData) {
        const parsedData = JSON.parse(data.generatedData);
        onGenerate(parsedData);
        
        toast({
          title: "Product details generated!",
          description: "AI has generated detailed product information for you.",
        });
        
        // Reset form
        setBasicInfo({
          productType: '',
          keyFeatures: '',
          targetAudience: ''
        });
      }
    } catch (error: any) {
      console.error('AI generation error:', error);
      toast({
        title: "Generation failed",
        description: error.message || "Failed to generate product details",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-blue-400" />
          AI Product Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="productType" className="text-gray-300">Product Type *</Label>
          <Input
            id="productType"
            value={basicInfo.productType}
            onChange={(e) => setBasicInfo({...basicInfo, productType: e.target.value})}
            placeholder="e.g., Wireless Bluetooth Headphones, Gaming Laptop, etc."
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>

        <div>
          <Label htmlFor="keyFeatures" className="text-gray-300">Key Features</Label>
          <Textarea
            id="keyFeatures"
            value={basicInfo.keyFeatures}
            onChange={(e) => setBasicInfo({...basicInfo, keyFeatures: e.target.value})}
            placeholder="e.g., Noise cancelling, 30-hour battery, premium build quality..."
            className="bg-gray-700 border-gray-600 text-white"
            rows={2}
          />
        </div>

        <div>
          <Label htmlFor="targetAudience" className="text-gray-300">Target Audience</Label>
          <Input
            id="targetAudience"
            value={basicInfo.targetAudience}
            onChange={(e) => setBasicInfo({...basicInfo, targetAudience: e.target.value})}
            placeholder="e.g., Gamers, Professionals, Music lovers, etc."
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>

        <Button 
          onClick={generateProductDetails}
          disabled={isGenerating || !basicInfo.productType.trim()}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating Details...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Product Details
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AIProductGenerator;

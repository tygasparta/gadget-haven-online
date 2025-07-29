
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Loader2, Bot, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AIProductGeneratorProps {
  onGenerate: (generatedData: {
    name: string;
    description: string;
    category: string;
    brand: string;
    price: number;
    features: string[];
    whats_in_box: string[];
    tags: string[];
    specifications: Array<{key: string, value: string}>;
  }) => void;
}

const AIProductGenerator: React.FC<AIProductGeneratorProps> = ({ onGenerate }) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [productName, setProductName] = useState('');

  const generateProductDetails = async () => {
    if (!productName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide the product name",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const prompt = `You are a product listing assistant for an electronics store called "Gadget Genie".

Generate a complete and SEO-optimized product listing for the following item:

Product: ${productName}

The listing must be structured as **JSON** and include the following fields:

- **name**: The official product name
- **description**: A short, compelling product description (2–3 sentences)
- **features**: A list of 5–10 bullet-point key features
- **whats_in_the_box**: A list of items included with the product
- **price_usd**: Estimated price in USD
- **tags**: A comma-separated list of search-friendly tags
- **category**: Most appropriate category from: Smartphones, Laptops, Tablets, Headphones, Cameras, Gaming, Accessories, Smart Watches, Audio, Home & Garden, Electronics
- **brand**: The brand name of the product
- **specifications**: An array of key-value pairs with proper specification names like "Display", "Storage", "RAM", "Processor", "Battery", "Camera", "Operating System", "Weight", "Dimensions", "Connectivity", "Warranty" etc.

Only return the JSON structure. Do not explain anything. Do not include image URLs.

Example format:
{
  "name": "Samsung Galaxy A55 5G – 256GB (Awesome Graphite)",
  "description": "The Samsung Galaxy A55 5G delivers flagship-level performance and a stunning Super AMOLED display at an affordable price. Perfect for users who want premium features without the premium price tag.",
  "features": [
    "6.6\\" Super AMOLED Display",
    "Exynos 1480 Processor",
    "50MP Triple Camera System",
    "5000mAh Battery with 25W Fast Charging",
    "8GB RAM / 256GB Storage",
    "5G Connectivity",
    "Side Fingerprint Sensor",
    "IP67 Dust & Water Resistance"
  ],
  "whats_in_the_box": [
    "Samsung Galaxy A55 5G",
    "USB-C Cable",
    "Quick Start Guide",
    "SIM Ejector Tool"
  ],
  "price_usd": 449,
  "tags": "Samsung, Galaxy A55, Smartphone, 5G, Android, 256GB",
  "category": "Smartphones",
  "brand": "Samsung",
  "specifications": [
    {"key": "Display", "value": "6.6-inch Super AMOLED, 2340x1080"},
    {"key": "Storage", "value": "256GB internal storage"},
    {"key": "RAM", "value": "8GB RAM"},
    {"key": "Processor", "value": "Exynos 1480 chipset"},
    {"key": "Battery", "value": "5000mAh with 25W fast charging"},
    {"key": "Camera", "value": "50MP + 12MP + 5MP triple rear camera"},
    {"key": "Operating System", "value": "Android 14 with One UI 6.1"},
    {"key": "Weight", "value": "213g"},
    {"key": "Dimensions", "value": "161.1 x 77.4 x 8.2 mm"},
    {"key": "Connectivity", "value": "5G, Wi-Fi 6, Bluetooth 5.3"},
    {"key": "Warranty", "value": "1 year manufacturer warranty"}
  ]
}`;

      console.log('Calling AI function with prompt:', prompt);

      const { data, error } = await supabase.functions.invoke('generate-product-details', {
        body: { prompt }
      });

      if (error) {
        console.error('Function invoke error:', error);
        throw error;
      }

      console.log('AI function response:', data);

      if (data?.generatedData) {
        try {
          const parsedData = JSON.parse(data.generatedData);
          console.log('Parsed AI data:', parsedData);
          
          // Transform the AI response to match our component's expected format
          const transformedData = {
            name: parsedData.name || productName,
            description: parsedData.description || '',
            category: parsedData.category || 'Electronics',
            brand: parsedData.brand || 'Generic',
            price: parsedData.price_usd || 0,
            features: parsedData.features || [],
            whats_in_box: parsedData.whats_in_the_box || [],
            tags: parsedData.tags ? parsedData.tags.split(', ').map((tag: string) => tag.trim()) : [],
            specifications: parsedData.specifications || []
          };
          
          onGenerate(transformedData);
          
          toast({
            title: "Product details generated!",
            description: "AI has generated detailed product information with proper specifications.",
          });
          
          // Reset form
          setProductName('');
        } catch (parseError) {
          console.error('Failed to parse AI response:', parseError);
          throw new Error('Invalid response format from AI');
        }
      } else {
        throw new Error('No data received from AI');
      }
    } catch (error: any) {
      console.error('AI generation error:', error);
      toast({
        title: "Generation failed",
        description: error.message || "Failed to generate product details. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-gray-700">
        <CardTitle className="text-white flex items-center">
          <Bot className="w-6 h-6 mr-3 text-blue-400" />
          AI Product Generator
          <Zap className="w-4 h-4 ml-2 text-yellow-400" />
        </CardTitle>
        <p className="text-gray-300 text-sm mt-2">
          Let AI create a complete product listing with proper specifications and features
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="productName" className="text-gray-300 font-medium">
              Product Name *
            </Label>
            <Input
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g., iPhone 15 Pro, MacBook Air M3, Sony WH-1000XM5..."
              className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20 mt-2"
            />
            <p className="text-xs text-gray-400 mt-1">
              Enter the product name and AI will generate complete specifications with proper naming
            </p>
          </div>

          <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
            <h4 className="text-white font-medium mb-2 flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-purple-400" />
              What AI will generate:
            </h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Complete product description</li>
              <li>• Key features and specifications</li>
              <li>• Proper spec names (Display, Storage, RAM, etc.)</li>
              <li>• Estimated pricing</li>
              <li>• What's included in the box</li>
              <li>• SEO-friendly tags</li>
              <li>• Appropriate category and brand</li>
            </ul>
          </div>
        </div>

        <Button 
          onClick={generateProductDetails}
          disabled={isGenerating || !productName.trim()}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 mr-3 animate-spin" />
              Generating Product Details...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-3" />
              Generate with AI
            </>
          )}
        </Button>

        {isGenerating && (
          <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4">
            <div className="flex items-center text-blue-400">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              <span className="text-sm">AI is analyzing your product and generating proper specifications...</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIProductGenerator;

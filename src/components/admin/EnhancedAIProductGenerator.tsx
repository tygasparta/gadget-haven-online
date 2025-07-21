
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Loader2, Wand2 } from 'lucide-react';

interface EnhancedAIProductGeneratorProps {
  onGenerate: (data: any) => void;
}

const KNOWN_BRANDS = [
  'Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Huawei', 'Sony', 'Dell', 
  'HP', 'Lenovo', 'Asus', 'Acer', 'Microsoft', 'Canon', 'Nikon', 'Bose', 
  'Beats', 'Garmin', 'Fitbit', 'LG', 'Panasonic', 'Philips', 'Logitech',
  'AMD', 'Intel', 'NVIDIA', 'Corsair', 'SteelSeries', 'HyperX', 'Anker'
];

const EnhancedAIProductGenerator: React.FC<EnhancedAIProductGeneratorProps> = ({ onGenerate }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const detectBrand = (productName: string, description: string): string => {
    const text = `${productName} ${description}`.toLowerCase();
    
    for (const brand of KNOWN_BRANDS) {
      if (text.includes(brand.toLowerCase())) {
        return brand;
      }
    }
    
    // Additional brand detection patterns
    const brandPatterns = {
      'Apple': ['iphone', 'ipad', 'macbook', 'airpods', 'imac', 'ios'],
      'Samsung': ['galaxy', 'note', 'tab s', 'gear'],
      'Google': ['pixel', 'nest', 'chromecast', 'android'],
      'Sony': ['playstation', 'ps5', 'ps4', 'xperia', 'bravia'],
      'Microsoft': ['surface', 'xbox', 'windows', 'office'],
      'Dell': ['inspiron', 'xps', 'alienware', 'latitude'],
      'HP': ['pavilion', 'elitebook', 'omen', 'envy'],
      'Lenovo': ['thinkpad', 'yoga', 'legion', 'ideapad'],
      'Asus': ['rog', 'zenbook', 'vivobook', 'tuf'],
      'Acer': ['aspire', 'predator', 'swift', 'nitro']
    };

    for (const [brand, patterns] of Object.entries(brandPatterns)) {
      if (patterns.some(pattern => text.includes(pattern))) {
        return brand;
      }
    }

    return 'Other';
  };

  const generateColors = (productName: string, category: string): Array<{name: string, hex_code: string}> => {
    const commonColors = [
      { name: 'Black', hex_code: '#000000' },
      { name: 'White', hex_code: '#FFFFFF' },
      { name: 'Silver', hex_code: '#C0C0C0' },
      { name: 'Space Gray', hex_code: '#5C5C5C' }
    ];

    const phoneColors = [
      { name: 'Midnight Blue', hex_code: '#1B263B' },
      { name: 'Rose Gold', hex_code: '#E8B4B8' },
      { name: 'Gold', hex_code: '#FFD700' },
      { name: 'Red', hex_code: '#FF3B30' },
      { name: 'Green', hex_code: '#34C759' }
    ];

    const laptopColors = [
      { name: 'Platinum', hex_code: '#E5E4E2' },
      { name: 'Graphite', hex_code: '#41424C' },
      { name: 'Blue', hex_code: '#007AFF' }
    ];

    if (category.toLowerCase().includes('phone') || productName.toLowerCase().includes('phone')) {
      return [...commonColors, ...phoneColors.slice(0, 3)];
    }
    
    if (category.toLowerCase().includes('laptop') || productName.toLowerCase().includes('laptop')) {
      return [...commonColors, ...laptopColors];
    }

    return commonColors;
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt required",
        description: "Please enter a product description",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/generate-product-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate product details');
      }

      const data = await response.json();
      
      // Enhanced brand detection
      const detectedBrand = detectBrand(data.name, data.description);
      const generatedColors = generateColors(data.name, data.category);
      
      const enhancedData = {
        ...data,
        brand: detectedBrand,
        colors: generatedColors,
        price: typeof data.price === 'string' ? parseFloat(data.price) : data.price,
        tags: [...(data.tags || []), detectedBrand.toLowerCase(), data.category.toLowerCase()],
        whats_in_box: data.whats_in_box || [
          `${data.name}`,
          'USB Cable',
          'User Manual',
          'Warranty Card'
        ]
      };

      onGenerate(enhancedData);
      setPrompt('');
      
      toast({
        title: "AI Generation Complete!",
        description: `Generated ${data.name} with brand: ${detectedBrand}`,
      });
      
    } catch (error) {
      console.error('Error generating product:', error);
      toast({
        title: "Generation failed",
        description: "Please try again with a different prompt",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-blue-500/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Wand2 className="w-5 h-5 mr-2" />
          Enhanced AI Product Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="ai-prompt" className="text-gray-300">
            Product Description
          </Label>
          <Textarea
            id="ai-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the product you want to create (e.g., 'Latest iPhone 15 Pro Max smartphone with advanced camera system')"
            className="bg-gray-800 border-gray-600 text-white min-h-[100px]"
            disabled={isGenerating}
          />
        </div>

        <div className="bg-gray-800/50 p-3 rounded-lg">
          <p className="text-sm text-gray-300 mb-2">
            <strong>Enhanced Features:</strong>
          </p>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• Automatic brand detection from product name and description</li>
            <li>• Smart color generation based on product category</li>
            <li>• Intelligent tagging and categorization</li>
            <li>• Auto-generated "What's in the box" content</li>
          </ul>
        </div>

        <Button 
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Enhanced Product
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EnhancedAIProductGenerator;

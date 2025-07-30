
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
      const prompt = `Generate a complete product listing for: ${productName}

CRITICAL REQUIREMENT: You MUST include a "specifications" array with REAL technical specification names, NOT generic placeholders.

For "${productName}", create specifications using actual technical terms:
- If it's a tablet/iPad: Display, Storage, Processor, RAM, Battery Life, Operating System, Weight, Dimensions, Camera, Connectivity
- If it's a phone: Display, Storage, RAM, Processor, Battery, Camera, Operating System, Connectivity, Weight, Dimensions  
- If it's a laptop: Display, Processor, RAM, Storage, Graphics, Operating System, Battery Life, Weight, Ports

NEVER use "Feature 1", "Feature 2", etc. Always use proper specification names with real values.

Example correct specifications for iPad:
[
  {"key": "Display", "value": "10.9-inch Liquid Retina display"},
  {"key": "Storage", "value": "256GB internal storage"},
  {"key": "Processor", "value": "A14 Bionic chip"},
  {"key": "RAM", "value": "8GB RAM"},
  {"key": "Battery Life", "value": "Up to 10 hours"}
]

Return valid JSON with the specifications array included.`;

      console.log('Calling AI function with enhanced prompt:', prompt);

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
          
          // Validate specifications array
          if (!parsedData.specifications || !Array.isArray(parsedData.specifications)) {
            throw new Error('AI did not generate specifications array');
          }

          // Check for invalid specification names
          const hasGenericSpecs = parsedData.specifications.some((spec: any) => 
            spec.key && spec.key.toLowerCase().includes('feature')
          );

          if (hasGenericSpecs) {
            throw new Error('AI generated generic specification names. Please try again.');
          }
          
          // Transform the AI response to match our component's expected format
          const transformedData = {
            name: parsedData.name || productName,
            description: parsedData.description || '',
            category: parsedData.category || 'Electronics',
            brand: parsedData.brand || 'Generic',
            price: parsedData.price || 0,
            features: parsedData.features || [],
            whats_in_box: parsedData.whats_in_box || [],
            tags: Array.isArray(parsedData.tags) ? parsedData.tags : (parsedData.tags ? parsedData.tags.split(', ').map((tag: string) => tag.trim()) : []),
            specifications: parsedData.specifications || []
          };
          
          onGenerate(transformedData);
          
          toast({
            title: "Product details generated!",
            description: `AI generated ${transformedData.specifications.length} proper specifications for your product.`,
          });
          
          // Reset form
          setProductName('');
        } catch (parseError) {
          console.error('Failed to parse AI response:', parseError);
          throw new Error('Invalid response format from AI. Please try again.');
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
          Generate products with proper technical specifications (RAM, Storage, Display, etc.)
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
              placeholder="e.g., iPhone 15 Pro, MacBook Air M3, iPad Air..."
              className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20 mt-2"
            />
            <p className="text-xs text-gray-400 mt-1">
              Enter the product name and AI will generate proper specifications with real technical names
            </p>
          </div>

          <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
            <h4 className="text-white font-medium mb-2 flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-purple-400" />
              AI will generate:
            </h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Complete product description</li>
              <li>• <strong>Real specifications:</strong> Display, RAM, Storage, Processor, etc.</li>
              <li>• <strong>NO generic names</strong> like "Feature 1" or "Feature 2"</li>
              <li>• Proper technical values for each specification</li>
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
              Generating with Real Specifications...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-3" />
              Generate with Proper Specs
            </>
          )}
        </Button>

        {isGenerating && (
          <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4">
            <div className="flex items-center text-blue-400">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              <span className="text-sm">AI is generating proper specifications like RAM, Storage, Display...</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIProductGenerator;

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Loader2, Wand2, Zap, Brain, Target, Palette, Tag, Package, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const KNOWN_BRANDS = [
  'Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Huawei', 'Sony', 'Dell', 
  'HP', 'Lenovo', 'Asus', 'Acer', 'Microsoft', 'Canon', 'Nikon', 'Bose', 
  'Beats', 'Garmin', 'Fitbit', 'LG', 'Panasonic', 'Philips', 'Logitech',
  'AMD', 'Intel', 'NVIDIA', 'Corsair', 'SteelSeries', 'HyperX', 'Anker'
];

interface EnhancedAIProductGeneratorProps {
  onGenerate: (data: any) => void;
}

const EnhancedAIProductGenerator: React.FC<EnhancedAIProductGeneratorProps> = ({ onGenerate }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState('');
  const [error, setError] = useState('');
  const { toast } = useToast();

  const detectBrand = (productName: string, description: string): string => {
    const text = `${productName} ${description}`.toLowerCase();
    
    for (const brand of KNOWN_BRANDS) {
      if (text.includes(brand.toLowerCase())) {
        return brand;
      }
    }
    
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
      { name: 'Product Red', hex_code: '#FF3B30' },
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

  const simulateGenerationStages = () => {
    const stages = [
      'Analyzing product description...',
      'Detecting brand and category...',
      'Generating product specifications...',
      'Creating color variations...',
      'Generating tags and features...',
      'Finalizing product details...'
    ];

    let currentStage = 0;
    const stageInterval = setInterval(() => {
      if (currentStage < stages.length) {
        setGenerationStage(stages[currentStage]);
        currentStage++;
      } else {
        clearInterval(stageInterval);
      }
    }, 800);

    return stageInterval;
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt required",
        description: "Please enter a product description to generate",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setError('');
    setGenerationStage('Initializing AI generation...');
    
    const stageInterval = simulateGenerationStages();

    try {
      const enhancedPrompt = `Generate a complete product listing for: ${prompt}

Please return a valid JSON object with the following structure:
{
  "name": "Product name",
  "description": "Product description (2-3 sentences)",
  "category": "Category from: Smartphones, Laptops, Tablets, Headphones, Cameras, Gaming, Accessories, Smart Watches, Audio, Home & Garden, Electronics",
  "brand": "Brand name",
  "price": 299.99,
  "features": ["Feature 1", "Feature 2", "Feature 3"],
  "whats_in_box": ["Item 1", "Item 2", "Item 3"],
  "tags": ["tag1", "tag2", "tag3"]
}

Only return the JSON object, no additional text.`;

      console.log('Calling generate-product-details function with prompt:', enhancedPrompt);
      
      const { data, error: functionError } = await supabase.functions.invoke('generate-product-details', {
        body: { prompt: enhancedPrompt }
      });

      if (functionError) {
        console.error('Supabase function error:', functionError);
        throw new Error(functionError.message || 'Failed to generate product details');
      }

      if (!data || !data.generatedData) {
        throw new Error('No data received from AI generation');
      }

      console.log('Generated data received:', data.generatedData);
      
      let parsedData;
      try {
        // Handle both string and object responses
        parsedData = typeof data.generatedData === 'string' 
          ? JSON.parse(data.generatedData) 
          : data.generatedData;
      } catch (parseError) {
        console.error('Error parsing generated data:', parseError);
        console.log('Raw data:', data.generatedData);
        throw new Error('Invalid response format from AI. Please try again.');
      }
      
      // Validate required fields
      if (!parsedData.name || !parsedData.description) {
        throw new Error('Generated data is missing required fields');
      }
      
      // Enhanced brand detection
      const detectedBrand = detectBrand(parsedData.name || '', parsedData.description || '');
      const generatedColors = generateColors(parsedData.name || '', parsedData.category || '');
      
      const enhancedData = {
        name: parsedData.name,
        description: parsedData.description,
        category: parsedData.category || 'Electronics',
        brand: parsedData.brand || detectedBrand,
        price: typeof parsedData.price === 'string' ? parseFloat(parsedData.price) : (parsedData.price || 99.99),
        features: Array.isArray(parsedData.features) ? parsedData.features : [],
        whats_in_box: Array.isArray(parsedData.whats_in_box) ? parsedData.whats_in_box : [
          parsedData.name || 'Product',
          'USB Cable',
          'User Manual',
          'Warranty Card'
        ],
        tags: Array.isArray(parsedData.tags) ? parsedData.tags : [detectedBrand.toLowerCase(), (parsedData.category || 'electronics').toLowerCase()],
        colors: generatedColors
      };

      clearInterval(stageInterval);
      setGenerationStage('Generation complete!');
      
      setTimeout(() => {
        onGenerate(enhancedData);
        setPrompt('');
        setGenerationStage('');
        
        toast({
          title: "✨ AI Generation Complete!",
          description: `Successfully generated "${parsedData.name}" with brand: ${enhancedData.brand}`,
        });
      }, 1000);
      
    } catch (error: any) {
      clearInterval(stageInterval);
      console.error('Error generating product:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      setGenerationStage('');
      toast({
        title: "Generation failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
        setGenerationStage('');
        setError('');
      }, 1000);
    }
  };

  const quickPrompts = [
    "Latest iPhone 15 Pro Max with titanium design and advanced camera system",
    "Samsung Galaxy S24 Ultra with S Pen and 200MP camera",
    "MacBook Pro 16-inch with M3 chip and Liquid Retina XDR display",
    "Sony WH-1000XM5 wireless noise-canceling headphones",
    "Dell XPS 13 Plus ultrabook with 4K OLED display"
  ];

  return (
    <Card className="bg-navy-900 backdrop-blur-sm border-navy-700 shadow-2xl">
      <CardHeader className="border-b border-navy-700 bg-gradient-to-r from-navy-800 to-navy-900">
        <CardTitle className="text-white flex items-center text-xl">
          <div className="flex items-center">
            <div className="relative">
              <Wand2 className="w-6 h-6 mr-3 text-blue-400" />
              <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-400" />
            </div>
            Enhanced AI Product Generator
          </div>
        </CardTitle>
        <p className="text-gray-300 text-sm mt-2">
          Generate comprehensive product details with intelligent brand detection and smart features
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6 bg-navy-900">
        {/* Error Display */}
        {error && (
          <div className="bg-gradient-to-r from-red-900/50 to-red-800/50 rounded-lg p-4 border border-red-600/50">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-red-200 font-medium">Generation Failed</div>
                <div className="text-red-300 text-sm mt-1">{error}</div>
                <div className="text-red-400 text-xs mt-2">
                  Please try again with a different prompt or check your connection
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Status Display */}
        {isGenerating && (
          <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg p-4 border border-blue-600/50">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Brain className="w-5 h-5 text-blue-400 animate-pulse" />
                <div className="absolute inset-0 bg-blue-400/20 rounded-full animate-ping"></div>
              </div>
              <div className="flex-1">
                <div className="text-blue-200 font-medium">AI Processing</div>
                <div className="text-blue-300 text-sm">{generationStage}</div>
              </div>
              <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
            </div>
            <div className="mt-3 bg-blue-800/50 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-full animate-pulse rounded-full"></div>
            </div>
          </div>
        )}

        {/* Success State */}
        {!isGenerating && !error && generationStage === 'Generation complete!' && (
          <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 rounded-lg p-4 border border-green-600/50">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <div className="text-green-200 font-medium">Generation Successful!</div>
            </div>
          </div>
        )}

        {/* Main Input */}
        <div className="space-y-3">
          <Label htmlFor="ai-prompt" className="text-gray-200 flex items-center text-base font-medium">
            <Target className="w-4 h-4 mr-2" />
            Product Description *
          </Label>
          <Textarea
            id="ai-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the product you want to create in detail... (e.g., 'Latest iPhone with advanced camera features and titanium design')"
            className="bg-navy-800 border-navy-600 text-white placeholder-gray-400 min-h-[120px] focus:border-blue-500 focus:ring-blue-500/20 resize-none"
            disabled={isGenerating}
          />
          <p className="text-gray-400 text-xs">
            Be specific about features, specifications, and brand to get better results
          </p>
        </div>

        {/* Quick Prompts */}
        <div className="space-y-3">
          <Label className="text-gray-200 flex items-center text-base font-medium">
            <Zap className="w-4 h-4 mr-2" />
            Quick Examples
          </Label>
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
            {quickPrompts.map((quickPrompt, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setPrompt(quickPrompt)}
                disabled={isGenerating}
                className="bg-navy-800 border-navy-600 text-gray-200 hover:bg-navy-700 hover:text-white text-left justify-start h-auto py-3 px-4 font-normal"
              >
                <span className="text-sm text-left leading-relaxed">{quickPrompt}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Enhanced Features Grid */}
        <div className="bg-navy-800 rounded-lg p-5 border border-navy-600">
          <h3 className="text-gray-200 font-medium mb-4 flex items-center text-base">
            <Sparkles className="w-4 h-4 mr-2 text-yellow-400" />
            AI-Powered Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Brain className="w-5 h-5 text-blue-400 flex-shrink-0" />
              <span className="text-gray-300 text-sm">Smart brand detection</span>
            </div>
            <div className="flex items-center space-x-3">
              <Palette className="w-5 h-5 text-purple-400 flex-shrink-0" />
              <span className="text-gray-300 text-sm">Automatic color generation</span>
            </div>
            <div className="flex items-center space-x-3">
              <Tag className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span className="text-gray-300 text-sm">Intelligent tagging</span>
            </div>
            <div className="flex items-center space-x-3">
              <Package className="w-5 h-5 text-orange-400 flex-shrink-0" />
              <span className="text-gray-300 text-sm">Box contents generation</span>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <Button 
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium py-4 text-base shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Enhanced Product
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EnhancedAIProductGenerator;

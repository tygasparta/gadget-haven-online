
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Loader2, Wand2, Zap, Brain, Target, Palette, Tag, Package } from 'lucide-react';

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
  const [generationStage, setGenerationStage] = useState('');
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
    setGenerationStage('Initializing AI generation...');
    
    const stageInterval = simulateGenerationStages();

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

      clearInterval(stageInterval);
      setGenerationStage('Generation complete!');
      
      setTimeout(() => {
        onGenerate(enhancedData);
        setPrompt('');
        setGenerationStage('');
        
        toast({
          title: "✨ AI Generation Complete!",
          description: `Successfully generated "${data.name}" with brand: ${detectedBrand}`,
        });
      }, 1000);
      
    } catch (error) {
      clearInterval(stageInterval);
      console.error('Error generating product:', error);
      setGenerationStage('');
      toast({
        title: "Generation failed",
        description: "Please try again with a different prompt",
        variant: "destructive"
      });
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
        setGenerationStage('');
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
    <Card className="bg-gradient-to-br from-blue-900/50 via-purple-900/50 to-indigo-900/50 border-blue-500/20 shadow-2xl">
      <CardHeader className="border-b border-blue-500/20">
        <CardTitle className="text-white flex items-center text-xl">
          <div className="flex items-center">
            <div className="relative">
              <Wand2 className="w-6 h-6 mr-3 text-blue-400" />
              <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-400" />
            </div>
            Enhanced AI Product Generator
          </div>
        </CardTitle>
        <p className="text-blue-200 text-sm mt-2">
          Generate comprehensive product details with intelligent brand detection and smart features
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* AI Status Display */}
        {isGenerating && (
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-4 border border-blue-500/20">
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
            <div className="mt-3 bg-blue-900/20 rounded-full h-1 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-400 to-purple-400 h-full animate-pulse"></div>
            </div>
          </div>
        )}

        {/* Main Input */}
        <div className="space-y-3">
          <Label htmlFor="ai-prompt" className="text-gray-300 flex items-center">
            <Target className="w-4 h-4 mr-2" />
            Product Description
          </Label>
          <Textarea
            id="ai-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the product you want to create in detail..."
            className="bg-gray-800/50 border-gray-600 text-white min-h-[120px] focus:border-blue-400 focus:ring-blue-400/20"
            disabled={isGenerating}
          />
        </div>

        {/* Quick Prompts */}
        <div className="space-y-3">
          <Label className="text-gray-300 flex items-center">
            <Zap className="w-4 h-4 mr-2" />
            Quick Examples
          </Label>
          <div className="grid grid-cols-1 gap-2">
            {quickPrompts.map((quickPrompt, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setPrompt(quickPrompt)}
                disabled={isGenerating}
                className="bg-gray-800/30 border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white text-left justify-start h-auto py-2 px-3"
              >
                <span className="text-xs truncate">{quickPrompt}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Enhanced Features Grid */}
        <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
          <h3 className="text-white font-medium mb-3 flex items-center">
            <Sparkles className="w-4 h-4 mr-2 text-yellow-400" />
            AI-Powered Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center space-x-2">
              <Brain className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span className="text-gray-300 text-sm">Smart brand detection</span>
            </div>
            <div className="flex items-center space-x-2">
              <Palette className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span className="text-gray-300 text-sm">Color generation</span>
            </div>
            <div className="flex items-center space-x-2">
              <Tag className="w-4 h-4 text-green-400 flex-shrink-0" />
              <span className="text-gray-300 text-sm">Intelligent tagging</span>
            </div>
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4 text-orange-400 flex-shrink-0" />
              <span className="text-gray-300 text-sm">Box contents generation</span>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <Button 
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-medium py-3 text-base shadow-lg hover:shadow-xl transition-all duration-200"
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

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

interface EnhancedAIProductGeneratorProps { onGenerate: (data: any) => void; }

const EnhancedAIProductGenerator: React.FC<EnhancedAIProductGeneratorProps> = ({ onGenerate }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState('');
  const [error, setError] = useState('');
  const { toast } = useToast();

  const detectBrand = (productName: string, description: string): string => {
    const text = `${productName} ${description}`.toLowerCase();
    for (const brand of KNOWN_BRANDS) { if (text.includes(brand.toLowerCase())) return brand; }
    const brandPatterns: Record<string, string[]> = {
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
    for (const [brand, patterns] of Object.entries(brandPatterns)) { if (patterns.some(p => text.includes(p))) return brand; }
    return 'Other';
  };

  const generateColors = (productName: string, category: string): Array<{name: string, hex_code: string}> => {
    const common = [{ name: 'Black', hex_code: '#000000' }, { name: 'White', hex_code: '#FFFFFF' }, { name: 'Silver', hex_code: '#C0C0C0' }, { name: 'Space Gray', hex_code: '#5C5C5C' }];
    const phone = [{ name: 'Midnight Blue', hex_code: '#1B263B' }, { name: 'Rose Gold', hex_code: '#E8B4B8' }, { name: 'Gold', hex_code: '#FFD700' }];
    const laptop = [{ name: 'Platinum', hex_code: '#E5E4E2' }, { name: 'Graphite', hex_code: '#41424C' }, { name: 'Blue', hex_code: '#007AFF' }];
    if (category.toLowerCase().includes('phone') || productName.toLowerCase().includes('phone')) return [...common, ...phone];
    if (category.toLowerCase().includes('laptop') || productName.toLowerCase().includes('laptop')) return [...common, ...laptop];
    return common;
  };

  const simulateGenerationStages = () => {
    const stages = ['Analyzing product description...', 'Detecting brand and category...', 'Generating product specifications...', 'Creating color variations...', 'Generating tags and features...', 'Finalizing product details...'];
    let current = 0;
    const interval = setInterval(() => { if (current < stages.length) { setGenerationStage(stages[current]); current++; } else clearInterval(interval); }, 800);
    return interval;
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) { toast({ title: "Prompt required", description: "Please enter a product description to generate", variant: "destructive" }); return; }
    setIsGenerating(true); setError(''); setGenerationStage('Initializing AI generation...');
    const stageInterval = simulateGenerationStages();
    try {
      const enhancedPrompt = `Generate a complete product listing for: ${prompt}\n\nReturn only the JSON object described in your instructions, including a "specifications" array of 5-8 real technical specs as {"key": "...", "value": "..."} objects.`;
      const { data, error: functionError } = await supabase.functions.invoke('generate-product-details', { body: { prompt: enhancedPrompt } });
      if (functionError) throw new Error(functionError.message || 'Failed to generate product details');
      if (!data || !data.generatedData) throw new Error('No data received from AI generation');
      let parsedData;
      try { parsedData = typeof data.generatedData === 'string' ? JSON.parse(data.generatedData) : data.generatedData; } catch { throw new Error('Invalid response format from AI. Please try again.'); }
      if (!parsedData.name || !parsedData.description) throw new Error('Generated data is missing required fields');
      const detectedBrand = detectBrand(parsedData.name || '', parsedData.description || '');
      const generatedColors = generateColors(parsedData.name || '', parsedData.category || '');
      const finalPrice = typeof parsedData.price === 'string' ? parseFloat(parsedData.price) : (parsedData.price || 99.99);
      const enhancedData = {
        name: parsedData.name, description: parsedData.description, category: parsedData.category || 'Electronics',
        brand: parsedData.brand || detectedBrand, price: finalPrice,
        features: Array.isArray(parsedData.features) ? parsedData.features : [],
        whats_in_box: Array.isArray(parsedData.whats_in_box) ? parsedData.whats_in_box : [parsedData.name || 'Product', 'USB Cable', 'User Manual', 'Warranty Card'],
        tags: Array.isArray(parsedData.tags) ? parsedData.tags : [detectedBrand.toLowerCase(), (parsedData.category || 'electronics').toLowerCase()],
        colors: generatedColors,
        specifications: Array.isArray(parsedData.specifications)
          ? parsedData.specifications
              .filter((s: any) => typeof s?.key === 'string' && typeof s?.value === 'string')
              .map((s: any) => ({ key: s.key, value: s.value }))
          : []
      };
      clearInterval(stageInterval); setGenerationStage('Generation complete!');
      setTimeout(() => { onGenerate(enhancedData); setPrompt(''); setGenerationStage(''); toast({ title: "✨ AI Generation Complete!", description: `Successfully generated \"${parsedData.name}\" with brand: ${enhancedData.brand} ($${enhancedData.price})` }); }, 1000);
    } catch (error: any) {
      clearInterval(stageInterval);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage); setGenerationStage('');
      toast({ title: "Generation failed", description: errorMessage, variant: "destructive" });
    } finally {
      setTimeout(() => { setIsGenerating(false); setGenerationStage(''); setError(''); }, 1000);
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
    <Card className="border">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-foreground flex items-center text-xl">
          <div className="flex items-center">
            <div className="relative"><Wand2 className="w-6 h-6 mr-3 text-primary" /><Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-amber-400" /></div>
            Enhanced AI Product Generator
          </div>
        </CardTitle>
        <p className="text-muted-foreground text-sm mt-2">Generate comprehensive product details with intelligent brand detection and smart features</p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {error && (
          <div className="bg-destructive/10 rounded-lg p-4 border border-destructive/30">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
              <div className="flex-1">
                <div className="text-destructive font-medium">Generation Failed</div>
                <div className="text-destructive/80 text-sm mt-1">{error}</div>
                <div className="text-muted-foreground text-xs mt-2">Please try again with a different prompt or check your connection</div>
              </div>
            </div>
          </div>
        )}

        {isGenerating && (
          <div className="bg-primary/10 rounded-lg p-4 border border-primary/30">
            <div className="flex items-center space-x-3">
              <div className="relative"><Brain className="w-5 h-5 text-primary animate-pulse" /></div>
              <div className="flex-1">
                <div className="text-primary font-medium">AI Processing</div>
                <div className="text-primary/80 text-sm">{generationStage}</div>
              </div>
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
            </div>
            <div className="mt-3 bg-primary/20 rounded-full h-2 overflow-hidden"><div className="bg-primary h-full animate-pulse rounded-full"></div></div>
          </div>
        )}

        {!isGenerating && !error && generationStage === 'Generation complete!' && (
          <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
            <div className="flex items-center space-x-3"><CheckCircle className="w-5 h-5 text-emerald-600" /><div className="text-emerald-700 font-medium">Generation Successful!</div></div>
          </div>
        )}

        <div className="space-y-3">
          <Label htmlFor="ai-prompt" className="flex items-center text-base font-medium"><Target className="w-4 h-4 mr-2" />Product Description *</Label>
          <Textarea id="ai-prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe the product you want to create in detail..." className="min-h-[120px] resize-none" disabled={isGenerating} />
          <p className="text-muted-foreground text-xs">Be specific about features, specifications, and brand to get better results</p>
        </div>

        <div className="space-y-3">
          <Label className="flex items-center text-base font-medium"><Zap className="w-4 h-4 mr-2" />Quick Examples</Label>
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
            {quickPrompts.map((qp, index) => (
              <Button key={index} variant="outline" size="sm" onClick={() => setPrompt(qp)} disabled={isGenerating} className="text-left justify-start h-auto py-3 px-4 font-normal">
                <span className="text-sm text-left leading-relaxed">{qp}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-5 border border-border">
          <h3 className="font-medium mb-4 flex items-center text-base"><Sparkles className="w-4 h-4 mr-2 text-amber-400" />AI-Powered Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3"><Brain className="w-5 h-5 text-primary flex-shrink-0" /><span className="text-muted-foreground text-sm">Smart brand detection</span></div>
            <div className="flex items-center space-x-3"><Palette className="w-5 h-5 text-violet-500 flex-shrink-0" /><span className="text-muted-foreground text-sm">Automatic color generation</span></div>
            <div className="flex items-center space-x-3"><Tag className="w-5 h-5 text-emerald-500 flex-shrink-0" /><span className="text-muted-foreground text-sm">Intelligent tagging</span></div>
            <div className="flex items-center space-x-3"><Package className="w-5 h-5 text-amber-500 flex-shrink-0" /><span className="text-muted-foreground text-sm">Box contents generation</span></div>
          </div>
        </div>

        <Button onClick={handleGenerate} disabled={isGenerating || !prompt.trim()} className="w-full py-4 text-base">
          {isGenerating ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Generating...</> : <><Sparkles className="w-5 h-5 mr-2" />Generate Enhanced Product</>}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EnhancedAIProductGenerator;

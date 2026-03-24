import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles, Loader2, ImagePlus, Wand2 } from 'lucide-react';

interface AIBannerGeneratorProps {
  onImageGenerated: (imageUrl: string) => void;
}

const PROMPT_SUGGESTIONS = [
  'Premium wireless headphones with neon lighting on dark background',
  'Latest smartphones floating with holographic effects',
  'Gaming laptops with RGB lighting and futuristic backdrop',
  'Smart home devices arranged in modern living room setting',
  'Samsung Galaxy phones with cosmic galaxy background',
  'Apple products with sleek minimalist design aesthetic',
];

const AIBannerGenerator: React.FC<AIBannerGeneratorProps> = ({ onImageGenerated }) => {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({ title: 'Enter a prompt', description: 'Describe the banner image you want to generate', variant: 'destructive' });
      return;
    }

    setGenerating(true);
    setPreviewUrl(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({ title: 'Not authenticated', description: 'Please log in to generate banners', variant: 'destructive' });
        return;
      }

      const { data, error } = await supabase.functions.invoke('generate-banner-image', {
        body: { prompt: prompt.trim() },
      });

      if (error) {
        throw new Error(error.message || 'Generation failed');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.imageUrl) {
        setPreviewUrl(data.imageUrl);
        toast({ title: 'Banner generated!', description: 'Preview your AI-generated banner below' });
      }
    } catch (error: any) {
      console.error('AI generation error:', error);
      toast({
        title: 'Generation failed',
        description: error.message || 'Failed to generate banner image. Try again.',
        variant: 'destructive',
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleUseImage = () => {
    if (previewUrl) {
      onImageGenerated(previewUrl);
      setPreviewUrl(null);
      setPrompt('');
      toast({ title: 'Banner applied', description: 'AI-generated image has been set as the banner' });
    }
  };

  return (
    <div className="space-y-4 p-4 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 rounded-lg border border-primary/20">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">AI Banner Generator</h3>
        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Powered by AI</span>
      </div>

      <p className="text-muted-foreground text-sm">
        Describe the banner image you want and AI will generate it for you. Best results with detailed, descriptive prompts.
      </p>

      <div className="space-y-2">
        <Label className="text-muted-foreground text-xs">Prompt</Label>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Premium wireless headphones with neon blue lighting on a dark reflective surface, cinematic product photography"
          className="min-h-[80px] resize-none"
          disabled={generating}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-muted-foreground text-xs">Quick prompts</Label>
        <div className="flex flex-wrap gap-2">
          {PROMPT_SUGGESTIONS.map((suggestion, i) => (
            <button
              key={i}
              onClick={() => setPrompt(suggestion)}
              disabled={generating}
              className="text-xs px-3 py-1.5 rounded-full border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              {suggestion.length > 40 ? suggestion.slice(0, 40) + '…' : suggestion}
            </button>
          ))}
        </div>
      </div>

      <Button
        onClick={handleGenerate}
        disabled={generating || !prompt.trim()}
        className="w-full"
      >
        {generating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generating banner... (this may take a moment)
          </>
        ) : (
          <>
            <Wand2 className="w-4 h-4 mr-2" />
            Generate Banner Image
          </>
        )}
      </Button>

      {previewUrl && (
        <div className="space-y-3">
          <Label className="text-muted-foreground text-xs">Preview</Label>
          <div className="rounded-lg overflow-hidden border border-border">
            <img
              src={previewUrl}
              alt="AI Generated Banner"
              className="w-full h-auto object-cover"
              style={{ aspectRatio: '1920/544' }}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleUseImage} className="flex-1">
              <ImagePlus className="w-4 h-4 mr-2" />
              Use This Image
            </Button>
            <Button variant="outline" onClick={handleGenerate} disabled={generating}>
              <Wand2 className="w-4 h-4 mr-2" />
              Regenerate
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIBannerGenerator;

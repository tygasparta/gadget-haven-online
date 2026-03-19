import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Image, Plus, Trash2, Save, Upload, GripVertical, Eye } from 'lucide-react';

export interface BannerSlide {
  id: string;
  image: string;
  path: string;
  alt: string;
}

const DEFAULT_SLIDES: BannerSlide[] = [
  { id: '1', image: '/banners/audio-banner.jpg', path: '/audio', alt: 'Premium Audio Collection' },
  { id: '2', image: '/banners/phones-banner.jpg', path: '/phones', alt: 'Latest Smartphones' },
  { id: '3', image: '/banners/electronics-banner.jpg', path: '/deals', alt: 'Electronics Mega Deals' },
];

const BannerManagement: React.FC = () => {
  const { toast } = useToast();
  const [slides, setSlides] = useState<BannerSlide[]>(DEFAULT_SLIDES);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => { fetchBanners(); }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('admin_settings').select('value').eq('key', 'desktop_banners').single();
      if (error && error.code !== 'PGRST116') throw error;
      if (data?.value) {
        const banners = data.value as unknown as BannerSlide[];
        if (Array.isArray(banners) && banners.length > 0) setSlides(banners);
      }
    } catch (error: any) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (index: number, file: File) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast({ title: 'File too large', description: 'Max file size is 5MB', variant: 'destructive' }); return; }
    if (!file.type.startsWith('image/')) { toast({ title: 'Invalid file', description: 'Please select an image file', variant: 'destructive' }); return; }

    setUploadingIndex(index);
    try {
      const ext = file.name.split('.').pop();
      const fileName = `banner_${Date.now()}_${index}.${ext}`;
      const { data, error } = await supabase.storage.from('gallary').upload(fileName, file, { upsert: true });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from('gallary').getPublicUrl(data.path);
      const updated = [...slides];
      updated[index] = { ...updated[index], image: urlData.publicUrl };
      setSlides(updated);
      toast({ title: 'Image uploaded', description: 'Banner image updated successfully' });
    } catch (error: any) {
      toast({ title: 'Upload failed', description: error.message, variant: 'destructive' });
    } finally {
      setUploadingIndex(null);
    }
  };

  const addSlide = () => {
    setSlides([...slides, { id: Date.now().toString(), image: '', path: '/products', alt: 'New Banner' }]);
  };

  const removeSlide = (index: number) => {
    if (slides.length <= 1) { toast({ title: 'Cannot remove', description: 'At least one banner is required', variant: 'destructive' }); return; }
    setSlides(slides.filter((_, i) => i !== index));
  };

  const updateSlide = (index: number, field: keyof BannerSlide, value: string) => {
    const updated = [...slides];
    updated[index] = { ...updated[index], [field]: value };
    setSlides(updated);
  };

  const saveBanners = async () => {
    if (slides.some(s => !s.image)) { toast({ title: 'Missing images', description: 'All banners must have an image', variant: 'destructive' }); return; }
    setSaving(true);
    try {
      const { error } = await supabase.from('admin_settings').upsert({ key: 'desktop_banners', value: slides as any, updated_at: new Date().toISOString() }, { onConflict: 'key' });
      if (error) throw error;
      toast({ title: 'Banners saved', description: 'Desktop banners updated successfully' });
    } catch (error: any) {
      toast({ title: 'Save failed', description: error.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="border">
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border">
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Image className="w-5 h-5" />
          Desktop Banner Management
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <p className="text-muted-foreground text-sm">
          Manage the hero banner slides shown on the homepage. Recommended size: 1292×300px.
        </p>

        <div className="space-y-4">
          {slides.map((slide, index) => (
            <div key={slide.id} className="p-4 bg-muted/30 rounded-lg border border-border space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground font-medium text-sm">Banner {index + 1}</span>
                </div>
                <div className="flex items-center gap-2">
                  {slide.image && (
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={() => setPreviewIndex(previewIndex === index ? null : index)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => removeSlide(index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {previewIndex === index && slide.image && (
                <div className="rounded-lg overflow-hidden border border-border">
                  <img src={slide.image} alt={slide.alt} className="w-full h-auto object-cover" style={{ aspectRatio: '1292/300' }} />
                </div>
              )}

              <div className="flex items-center gap-3">
                <input type="file" accept="image/*" className="hidden" ref={(el) => { fileInputRefs.current[index] = el; }} onChange={(e) => { const file = e.target.files?.[0]; if (file) handleImageUpload(index, file); e.target.value = ''; }} />
                <Button variant="outline" size="sm" onClick={() => fileInputRefs.current[index]?.click()} disabled={uploadingIndex === index}>
                  <Upload className="w-4 h-4 mr-2" />
                  {uploadingIndex === index ? 'Uploading...' : slide.image ? 'Change Image' : 'Upload Image'}
                </Button>
                {slide.image && <span className="text-emerald-600 text-xs">✓ Image set</span>}
              </div>

              <div>
                <Label className="text-muted-foreground text-xs">Image URL (or upload above)</Label>
                <Input value={slide.image} onChange={(e) => updateSlide(index, 'image', e.target.value)} placeholder="https://... or /lovable-uploads/..." />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-muted-foreground text-xs">Link Path</Label>
                  <Input value={slide.path} onChange={(e) => updateSlide(index, 'path', e.target.value)} placeholder="/deals" />
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Alt Text</Label>
                  <Input value={slide.alt} onChange={(e) => updateSlide(index, 'alt', e.target.value)} placeholder="Banner description" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button variant="outline" onClick={addSlide} className="w-full border-dashed">
          <Plus className="w-4 h-4 mr-2" />
          Add Banner Slide
        </Button>

        <Button onClick={saveBanners} disabled={saving} className="w-full">
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Banners'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default BannerManagement;

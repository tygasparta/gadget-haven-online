import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_settings')
        .select('value')
        .eq('key', 'desktop_banners')
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data?.value) {
        const banners = data.value as unknown as BannerSlide[];
        if (Array.isArray(banners) && banners.length > 0) {
          setSlides(banners);
        }
      }
    } catch (error: any) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (index: number, file: File) => {
    if (!file) return;

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({ title: 'File too large', description: 'Max file size is 5MB', variant: 'destructive' });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({ title: 'Invalid file', description: 'Please select an image file', variant: 'destructive' });
      return;
    }

    setUploadingIndex(index);
    try {
      const ext = file.name.split('.').pop();
      const fileName = `banner_${Date.now()}_${index}.${ext}`;

      const { data, error } = await supabase.storage
        .from('gallary')
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('gallary')
        .getPublicUrl(data.path);

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
    const newSlide: BannerSlide = {
      id: Date.now().toString(),
      image: '',
      path: '/products',
      alt: 'New Banner',
    };
    setSlides([...slides, newSlide]);
  };

  const removeSlide = (index: number) => {
    if (slides.length <= 1) {
      toast({ title: 'Cannot remove', description: 'At least one banner is required', variant: 'destructive' });
      return;
    }
    setSlides(slides.filter((_, i) => i !== index));
  };

  const updateSlide = (index: number, field: keyof BannerSlide, value: string) => {
    const updated = [...slides];
    updated[index] = { ...updated[index], [field]: value };
    setSlides(updated);
  };

  const saveBanners = async () => {
    const hasEmpty = slides.some(s => !s.image);
    if (hasEmpty) {
      toast({ title: 'Missing images', description: 'All banners must have an image', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('admin_settings')
        .upsert({
          key: 'desktop_banners',
          value: slides as any,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'key' });

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
      <Card className="bg-white/5 backdrop-blur-sm border-white/20">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-white/10 rounded w-1/3" />
            <div className="h-32 bg-white/10 rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/5 backdrop-blur-sm border-white/20">
      <CardHeader className="border-b border-white/10">
        <CardTitle className="text-white flex items-center space-x-2">
          <Image className="w-5 h-5" />
          <span>Desktop Banner Management</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <p className="text-gray-400 text-sm">
          Manage the hero banner slides shown on the homepage. Recommended size: 1292×300px.
        </p>

        <div className="space-y-4">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className="p-4 bg-white/5 rounded-lg border border-white/10 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <GripVertical className="w-4 h-4 text-gray-500" />
                  <span className="text-white font-medium text-sm">Banner {index + 1}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {slide.image && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white"
                      onClick={() => setPreviewIndex(previewIndex === index ? null : index)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    onClick={() => removeSlide(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Image preview */}
              {previewIndex === index && slide.image && (
                <div className="rounded-lg overflow-hidden border border-white/10">
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    className="w-full h-auto object-cover"
                    style={{ aspectRatio: '1292/300' }}
                  />
                </div>
              )}

              {/* Upload area */}
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={(el) => { fileInputRefs.current[index] = el; }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(index, file);
                    e.target.value = '';
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  onClick={() => fileInputRefs.current[index]?.click()}
                  disabled={uploadingIndex === index}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploadingIndex === index ? 'Uploading...' : slide.image ? 'Change Image' : 'Upload Image'}
                </Button>
                {slide.image && (
                  <span className="text-green-400 text-xs truncate max-w-[200px]">
                    ✓ Image set
                  </span>
                )}
              </div>

              {/* Or paste URL */}
              <div>
                <Label className="text-gray-400 text-xs">Image URL (or upload above)</Label>
                <Input
                  value={slide.image}
                  onChange={(e) => updateSlide(index, 'image', e.target.value)}
                  placeholder="https://... or /lovable-uploads/..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-gray-400 text-xs">Link Path</Label>
                  <Input
                    value={slide.path}
                    onChange={(e) => updateSlide(index, 'path', e.target.value)}
                    placeholder="/deals"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-gray-400 text-xs">Alt Text</Label>
                  <Input
                    value={slide.alt}
                    onChange={(e) => updateSlide(index, 'alt', e.target.value)}
                    placeholder="Banner description"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          onClick={addSlide}
          className="w-full bg-white/5 border-white/20 border-dashed text-gray-400 hover:text-white hover:bg-white/10"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Banner Slide
        </Button>

        <Button
          onClick={saveBanners}
          disabled={saving}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Banners'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default BannerManagement;

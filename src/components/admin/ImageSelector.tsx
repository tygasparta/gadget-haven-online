
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Image, Check, Plus, Upload } from 'lucide-react';

interface ImageSelectorProps {
  selectedImages: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({ 
  selectedImages, 
  onImagesChange, 
  maxImages = 5 
}) => {
  const { toast } = useToast();
  const [availableImages, setAvailableImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadAvailableImages();
  }, []);

  const loadAvailableImages = async () => {
    try {
      setLoading(true);
      console.log('Loading available images from gallery bucket...');
      
      const { data: files, error } = await supabase.storage
        .from('gallary')
        .list('products', {
          limit: 100,
          offset: 0,
        });

      if (error) {
        console.error('Error loading images:', error);
        throw error;
      }

      if (files && files.length > 0) {
        const imageUrls = files
          .filter(file => file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i))
          .map(file => {
            const { data } = supabase.storage
              .from('gallary')
              .getPublicUrl(`products/${file.name}`);
            return data.publicUrl;
          });

        console.log('Loaded available images:', imageUrls);
        setAvailableImages(imageUrls);
      } else {
        console.log('No images found in gallery');
        setAvailableImages([]);
      }
    } catch (error: any) {
      console.error('Failed to load available images:', error);
      toast({
        title: "Error loading images",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (imageUrl: string) => {
    if (selectedImages.includes(imageUrl)) {
      // Remove image if already selected
      const newImages = selectedImages.filter(img => img !== imageUrl);
      onImagesChange(newImages);
    } else {
      // Add image if not selected and under limit
      if (selectedImages.length < maxImages) {
        const newImages = [...selectedImages, imageUrl];
        onImagesChange(newImages);
      } else {
        toast({
          title: "Maximum images reached",
          description: `You can only select up to ${maxImages} images`,
          variant: "destructive"
        });
      }
    }
  };

  const uploadNewImage = async (file: File): Promise<string | null> => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('You must be logged in to upload images');
      }

      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      console.log('Uploading new image to gallery bucket:', fileName);

      const { data, error } = await supabase.storage
        .from('gallary')
        .upload(`products/${fileName}`, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (error) {
        console.error('Storage upload error:', error);
        throw new Error(`Upload failed: ${error.message}`);
      }

      const { data: urlData } = supabase.storage
        .from('gallary')
        .getPublicUrl(`products/${fileName}`);

      if (!urlData.publicUrl) {
        throw new Error('Failed to generate public URL');
      }

      console.log('Image uploaded successfully:', urlData.publicUrl);
      return urlData.publicUrl;
    } catch (error: any) {
      console.error('Image upload failed:', error);
      toast({
        title: "Image upload failed",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;
    
    // Validate files
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select only image files",
          variant: "destructive"
        });
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select images smaller than 5MB",
          variant: "destructive"
        });
        return;
      }
    }

    setUploading(true);
    
    try {
      const uploadPromises = files.map(file => uploadNewImage(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      
      const successfulUploads = uploadedUrls.filter(url => url !== null) as string[];
      
      if (successfulUploads.length > 0) {
        // Refresh available images
        await loadAvailableImages();
        
        // Auto-select the newly uploaded images
        const newSelectedImages = [...selectedImages, ...successfulUploads].slice(0, maxImages);
        onImagesChange(newSelectedImages);
        
        toast({
          title: "Images uploaded successfully",
          description: `${successfulUploads.length} image(s) uploaded and added to gallery`,
        });
        
        setShowUpload(false);
      }
    } catch (error) {
      console.error('Batch upload error:', error);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-gray-300 font-medium">Select Product Images *</label>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">{selectedImages.length}/{maxImages}</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowUpload(!showUpload)}
            className="bg-blue-600 hover:bg-blue-700 text-white border-blue-500"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add New
          </Button>
        </div>
      </div>

      {showUpload && (
        <div className="p-4 bg-gray-800 rounded-lg border border-gray-600">
          <div className="flex items-center space-x-3">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="new-image-upload"
              disabled={uploading}
            />
            <label
              htmlFor="new-image-upload"
              className={`flex items-center space-x-2 px-4 py-2 rounded-md cursor-pointer transition-colors ${
                uploading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              } text-white`}
            >
              <Upload className="w-4 h-4" />
              <span>{uploading ? 'Uploading...' : 'Upload New Images'}</span>
            </label>
            {uploading && (
              <div className="flex items-center space-x-2 text-blue-400">
                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Processing...</span>
              </div>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-400">Loading available images...</span>
        </div>
      ) : availableImages.length > 0 ? (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-96 overflow-y-auto">
          {availableImages.map((imageUrl, index) => {
            const isSelected = selectedImages.includes(imageUrl);
            return (
              <div
                key={index}
                className={`relative cursor-pointer group transition-all duration-200 ${
                  isSelected ? 'ring-2 ring-blue-500' : 'hover:ring-2 hover:ring-gray-400'
                }`}
                onClick={() => handleImageSelect(imageUrl)}
              >
                <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={`Available image ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Failed to load image:', imageUrl);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                {isSelected && (
                  <div className="absolute inset-0 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <div className="bg-blue-600 rounded-full p-1">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
                <div className="absolute top-1 right-1 bg-black/50 rounded text-xs text-white px-1">
                  {selectedImages.indexOf(imageUrl) + 1 || ''}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
          <Image className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-400 mb-2">No images available in gallery</p>
          <p className="text-sm text-gray-500">Upload some images to get started</p>
        </div>
      )}

      {selectedImages.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Selected Images ({selectedImages.length}):</h4>
          <div className="grid grid-cols-5 gap-2">
            {selectedImages.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-gray-800 rounded border-2 border-blue-500 overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={`Selected ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute top-1 left-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {index + 1}
                </div>
                {index === 0 && (
                  <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-1 rounded">
                    Main
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageSelector;

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, AlertCircle, Image } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProductImageGalleryProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  productId?: number; // For editing existing products
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ 
  images, 
  onImagesChange, 
  maxImages = 5,
  productId 
}) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('You must be logged in to upload images');
      }

      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const fileName = `products/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      console.log('Uploading image to "images" bucket:', fileName);

      const { data, error } = await supabase.storage
        .from('images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (error) {
        console.error('Storage upload error:', error);
        throw new Error(`Upload failed: ${error.message}`);
      }

      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

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

  const saveGalleryImage = async (imageUrl: string, displayOrder: number, isMain: boolean = false) => {
    if (!productId) return; // Only save to gallery for existing products
    
    try {
      const { error } = await supabase.from('product_galleries').insert({
        product_id: productId,
        image_url: imageUrl,
        display_order: displayOrder,
        is_main: isMain
      });

      if (error) {
        console.error('Error saving gallery image:', error);
        throw error;
      }
    } catch (error) {
      console.error('Failed to save gallery image:', error);
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;
    
    if (images.length + files.length > maxImages) {
      toast({
        title: "Too many images",
        description: `Maximum ${maxImages} images allowed`,
        variant: "destructive"
      });
      return;
    }

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
      const uploadPromises = files.map(file => uploadImage(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      
      const successfulUploads = uploadedUrls.filter(url => url !== null) as string[];
      
      if (successfulUploads.length > 0) {
        const newImages = [...images, ...successfulUploads];
        onImagesChange(newImages);
        
        // Save to gallery if editing existing product
        if (productId) {
          for (let i = 0; i < successfulUploads.length; i++) {
            await saveGalleryImage(successfulUploads[i], images.length + i, images.length === 0 && i === 0);
          }
        }
        
        toast({
          title: "Images uploaded",
          description: `${successfulUploads.length} image(s) uploaded successfully`,
        });
      }
    } catch (error) {
      console.error('Batch upload error:', error);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = async (indexToRemove: number) => {
    const imageToRemove = images[indexToRemove];
    const newImages = images.filter((_, index) => index !== indexToRemove);
    onImagesChange(newImages);

    // Remove from gallery if editing existing product
    if (productId && imageToRemove) {
      try {
        const { error } = await supabase
          .from('product_galleries')
          .delete()
          .eq('product_id', productId)
          .eq('image_url', imageToRemove);

        if (error) {
          console.error('Error removing gallery image:', error);
        }
      } catch (error) {
        console.error('Failed to remove gallery image:', error);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-gray-300 font-medium">Product Images</label>
        <span className="text-sm text-gray-400">{images.length}/{maxImages}</span>
      </div>

      {/* Upload Button */}
      <div className="flex items-center space-x-3">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageSelect}
          className="hidden"
          id="gallery-upload"
          disabled={uploading || images.length >= maxImages}
        />
        <label
          htmlFor="gallery-upload"
          className={`flex items-center space-x-2 px-4 py-2 rounded-md cursor-pointer transition-colors ${
            uploading || images.length >= maxImages
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
        >
          <Upload className="w-4 h-4" />
          <span>{uploading ? 'Uploading...' : 'Add Images'}</span>
        </label>
        {uploading && (
          <div className="flex items-center space-x-2 text-blue-400">
            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Processing...</span>
          </div>
        )}
      </div>

      {/* Image Gallery */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-600">
                <img
                  src={imageUrl}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop";
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              >
                <X className="w-3 h-3" />
              </button>
              {index === 0 && (
                <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                  Main
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
          <Image className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-400 mb-2">No images uploaded yet</p>
          <p className="text-sm text-gray-500">Upload up to {maxImages} product images</p>
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;

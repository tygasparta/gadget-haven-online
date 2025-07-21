import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, AlertCircle, Image } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ImageUploadComponent from './ImageUploadComponent';

interface ProductImageGalleryProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  productId?: number;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ 
  images, 
  onImagesChange, 
  maxImages = 15,
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
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      console.log('Uploading image to "gallary" bucket:', fileName);

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

  const saveGalleryImage = async (imageUrl: string, displayOrder: number, isMain: boolean = false) => {
    if (!productId) return;
    
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

  const handleImageUploaded = async (imageUrl: string) => {
    if (images.length >= maxImages) {
      toast({
        title: "Maximum images reached",
        description: `Maximum ${maxImages} images allowed`,
        variant: "destructive"
      });
      return;
    }

    const newImages = [...images, imageUrl];
    onImagesChange(newImages);

    if (productId) {
      await saveGalleryImage(imageUrl, images.length, images.length === 0);
    }

    toast({
      title: "Image added successfully",
      description: "Image has been added to the gallery",
    });
  };

  const removeImage = async (indexToRemove: number) => {
    const imageToRemove = images[indexToRemove];
    const newImages = images.filter((_, index) => index !== indexToRemove);
    onImagesChange(newImages);

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
        <label className="text-gray-300 font-medium">Product Images *</label>
        <span className="text-sm text-gray-400">{images.length}/{maxImages}</span>
      </div>

      {/* Enhanced Upload Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <ImageUploadComponent
          onImageUploaded={handleImageUploaded}
          buttonText={uploading ? 'Uploading...' : 'Add Image'}
        />
        
        {uploading && (
          <div className="flex items-center space-x-2 text-blue-400">
            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Processing...</span>
          </div>
        )}
        
        <p className="text-xs text-gray-500">
          Supports JPEG, PNG, WebP, GIF (max 5MB)
        </p>
      </div>

      {images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-600">
                <img
                  src={imageUrl}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Failed to load image:', imageUrl);
                    e.currentTarget.style.display = 'none';
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
          <p className="text-sm text-gray-500">Please upload at least one product image (up to {maxImages} images)</p>
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;

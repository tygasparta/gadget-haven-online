import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, ImageIcon, Star, StarOff } from 'lucide-react';

interface ProductImageGalleryProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  productId?: string;
  featuredImageIndex?: number;
  onFeaturedImageChange?: (index: number) => void;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  onImagesChange,
  maxImages = 10,
  productId,
  featuredImageIndex = 0,
  onFeaturedImageChange
}) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      toast({
        title: "Too many images",
        description: `You can only upload up to ${maxImages} images total`,
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    const newImages: string[] = [];

    try {
      // Check if user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('You must be logged in to upload images');
      }

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast({
            title: "Invalid file type",
            description: `${file.name} is not a valid image file`,
            variant: "destructive"
          });
          continue;
        }

        // Validate file size (10MB limit increased from 5MB)
        if (file.size > 10 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: `${file.name} is too large. Maximum size is 10MB`,
            variant: "destructive"
          });
          continue;
        }

        // Create a clean filename
        const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const cleanFileName = file.name
          .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special chars with underscores
          .replace(/_{2,}/g, '_') // Replace multiple underscores with single
          .toLowerCase();
        
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}_${cleanFileName}`;
        const filePath = `product-images/${fileName}`;

        console.log('Uploading file:', fileName, 'Size:', file.size, 'Type:', file.type);

        try {
          // Upload to gallary bucket (which has the correct RLS policies)
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('gallary')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false,
              contentType: file.type
            });

          if (uploadError) {
            console.error('Upload error for file:', fileName, uploadError);
            throw new Error(`Upload failed for ${file.name}: ${uploadError.message}`);
          }

          console.log('Upload successful:', uploadData);

          // Get public URL from gallary bucket
          const { data: urlData } = supabase.storage
            .from('gallary')
            .getPublicUrl(filePath);

          if (!urlData.publicUrl) {
            throw new Error(`Failed to get public URL for ${file.name}`);
          }

          console.log('Public URL generated:', urlData.publicUrl);
          newImages.push(urlData.publicUrl);

        } catch (fileError: any) {
          console.error('Error processing file:', file.name, fileError);
          toast({
            title: "Upload failed",
            description: `Failed to upload ${file.name}: ${fileError.message}`,
            variant: "destructive"
          });
        }
      }

      if (newImages.length > 0) {
        const updatedImages = [...images, ...newImages];
        onImagesChange(updatedImages);
        
        toast({
          title: "Images uploaded successfully",
          description: `${newImages.length} image(s) uploaded`
        });
      } else if (files.length > 0) {
        toast({
          title: "Upload failed",
          description: "No images were successfully uploaded. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Upload process error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "An error occurred while uploading images",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      // Reset the input
      event.target.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
    
    // Adjust featured image index if needed
    if (onFeaturedImageChange) {
      if (index === featuredImageIndex) {
        onFeaturedImageChange(0); // Reset to first image
      } else if (index < featuredImageIndex) {
        onFeaturedImageChange(featuredImageIndex - 1);
      }
    }
  };

  const handleSetFeaturedImage = (index: number) => {
    if (onFeaturedImageChange) {
      onFeaturedImageChange(index);
      toast({
        title: "Featured image updated",
        description: `Image ${index + 1} is now the featured image`
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-gray-300 text-lg font-semibold">
          Product Images ({images.length}/{maxImages})
        </Label>
        <div className="flex items-center space-x-2">
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            disabled={isUploading || images.length >= maxImages}
            className="hidden"
            id="image-upload"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('image-upload')?.click()}
            disabled={isUploading || images.length >= maxImages}
            className="bg-blue-600 hover:bg-blue-700 text-white border-blue-500"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isUploading ? 'Uploading...' : 'Upload Images'}
          </Button>
        </div>
      </div>

      {images.length === 0 ? (
        <Card className="bg-gray-800 border-gray-600 border-2 border-dashed">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <ImageIcon className="w-16 h-16 text-gray-400 mx-auto" />
              <div>
                <p className="text-gray-300 text-lg font-medium">No images uploaded yet</p>
                <p className="text-gray-500 text-sm mt-2">
                  Click "Upload Images" to add product photos
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className={`relative rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                index === featuredImageIndex 
                  ? 'border-yellow-400 shadow-lg shadow-yellow-400/20' 
                  : 'border-gray-600 hover:border-gray-500'
              }`}>
                <img
                  src={image}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-32 object-cover"
                  onError={(e) => {
                    console.error('Failed to load image:', image);
                    e.currentTarget.style.display = 'none';
                  }}
                />
                
                {/* Featured badge */}
                {index === featuredImageIndex && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                    Featured
                  </div>
                )}

                {/* Action buttons */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  {onFeaturedImageChange && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleSetFeaturedImage(index)}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white border-yellow-500"
                      disabled={index === featuredImageIndex}
                    >
                      {index === featuredImageIndex ? (
                        <Star className="w-4 h-4 fill-current" />
                      ) : (
                        <StarOff className="w-4 h-4" />
                      )}
                    </Button>
                  )}
                  
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleRemoveImage(index)}
                    className="bg-red-600 hover:bg-red-700 text-white border-red-500"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <p className="text-xs text-gray-400 mt-1 text-center truncate">
                Image {index + 1}
              </p>
            </div>
          ))}
        </div>
      )}
      
      {onFeaturedImageChange && images.length > 0 && (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span>
              <strong>Featured Image:</strong> Image {featuredImageIndex + 1} will be used as the main product image
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;

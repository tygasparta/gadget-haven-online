
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadComponentProps {
  onImageUploaded: (imageUrl: string) => void;
  buttonText?: string;
  maxSize?: number; // in MB
  allowedTypes?: string[];
}

const ImageUploadComponent: React.FC<ImageUploadComponentProps> = ({
  onImageUploaded,
  buttonText = "Upload Image",
  maxSize = 5,
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
}) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('You must be logged in to upload images');
      }

      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
      }

      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        throw new Error(`File size too large. Maximum size: ${maxSize}MB`);
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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    try {
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        onImageUploaded(imageUrl);
        toast({
          title: "Image uploaded successfully",
          description: "Image has been uploaded and is ready to use",
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <input
        type="file"
        accept={allowedTypes.join(',')}
        onChange={handleFileSelect}
        className="hidden"
        id="image-upload"
        disabled={uploading}
      />
      <label
        htmlFor="image-upload"
        className={`flex items-center space-x-2 px-4 py-2 rounded-md cursor-pointer transition-colors ${
          uploading
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        } text-white`}
      >
        <Upload className="w-4 h-4" />
        <span>{uploading ? 'Uploading...' : buttonText}</span>
      </label>
      {uploading && (
        <div className="flex items-center space-x-2 text-blue-400">
          <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm">Processing...</span>
        </div>
      )}
    </div>
  );
};

export default ImageUploadComponent;

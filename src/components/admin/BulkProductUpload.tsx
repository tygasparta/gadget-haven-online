
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Download, AlertCircle, CheckCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

interface BulkUploadResult {
  success: number;
  failed: number;
  errors: string[];
}

const BulkProductUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<BulkUploadResult | null>(null);
  const { toast } = useToast();

  const downloadTemplate = () => {
    const headers = [
      'name',
      'description',
      'price',
      'original_price',
      'image',
      'category',
      'brand',
      'stock',
      'is_featured',
      'is_flash_sale',
      'discount_percentage',
      'colors',
      'tags',
      'whats_in_box',
      'specifications'
    ];

    const sampleData = [
      'Sample Product',
      'This is a sample product description',
      '29.99',
      '39.99',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400',
      'Electronics',
      'Sample Brand',
      '100',
      'false',
      'true',
      '25',
      '[{"name":"Black","hex_code":"#000000"},{"name":"White","hex_code":"#FFFFFF"}]',
      '["tag1","tag2","tag3"]',
      '["Item 1","Item 2","Item 3"]',
      '[{"key":"Screen Size","value":"6.1 inches"},{"key":"Battery","value":"3000mAh"}]'
    ];

    const csvContent = [headers.join(','), sampleData.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product_upload_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const parseCSV = (csvText: string): any[] => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const products = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split(',').map(v => v.trim());
      const product: any = {};

      headers.forEach((header, index) => {
        const value = values[index] || '';
        
        switch (header) {
          case 'price':
          case 'original_price':
            product[header] = value ? parseFloat(value) : null;
            break;
          case 'stock':
          case 'discount_percentage':
            product[header] = value ? parseInt(value) : 0;
            break;
          case 'is_featured':
          case 'is_flash_sale':
            product[header] = value.toLowerCase() === 'true';
            break;
          case 'colors':
          case 'tags':
          case 'whats_in_box':
          case 'specifications':
            try {
              product[header] = value ? JSON.parse(value) : null;
            } catch (e) {
              product[header] = null;
            }
            break;
          default:
            product[header] = value || null;
        }
      });

      products.push(product);
    }

    return products;
  };

  const handleFileUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to upload",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setUploadResult(null);

    try {
      const fileContent = await file.text();
      const products = parseCSV(fileContent);
      
      let successCount = 0;
      let failedCount = 0;
      const errors: string[] = [];

      for (const product of products) {
        try {
          // Validate required fields
          if (!product.name || !product.price) {
            errors.push(`Product "${product.name || 'Unknown'}" is missing required fields`);
            failedCount++;
            continue;
          }

          const { error } = await supabase
            .from('products')
            .insert({
              name: product.name,
              description: product.description,
              price: product.price,
              original_price: product.original_price,
              image: product.image,
              category: product.category,
              brand: product.brand,
              stock: product.stock || 0,
              is_featured: product.is_featured || false,
              is_flash_sale: product.is_flash_sale || false,
              discount_percentage: product.discount_percentage || 0,
              colors: product.colors,
              tags: product.tags,
              whats_in_box: product.whats_in_box,
              specifications: product.specifications,
              rating: 0,
              reviews: 0
            });

          if (error) {
            errors.push(`Product "${product.name}": ${error.message}`);
            failedCount++;
          } else {
            successCount++;
          }
        } catch (error: any) {
          errors.push(`Product "${product.name}": ${error.message}`);
          failedCount++;
        }
      }

      setUploadResult({
        success: successCount,
        failed: failedCount,
        errors: errors.slice(0, 10) // Show only first 10 errors
      });

      toast({
        title: "Upload completed",
        description: `${successCount} products uploaded successfully, ${failedCount} failed`,
      });

    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to process the file",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="w-5 h-5" />
          <span>Bulk Product Upload</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Button
            onClick={downloadTemplate}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Template</span>
          </Button>
          <Badge variant="secondary">CSV Format</Badge>
        </div>

        <div className="space-y-2">
          <Label htmlFor="csvFile">Upload CSV File</Label>
          <Input
            id="csvFile"
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>

        <Button
          onClick={handleFileUpload}
          disabled={!file || isUploading}
          className="w-full"
        >
          {isUploading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Uploading...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span>Upload Products</span>
            </div>
          )}
        </Button>

        {uploadResult && (
          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-green-600">Success: {uploadResult.success}</span>
              </div>
              <div className="flex items-center space-x-2">
                <X className="w-5 h-5 text-red-500" />
                <span className="text-red-600">Failed: {uploadResult.failed}</span>
              </div>
            </div>

            {uploadResult.errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-red-700 font-medium">Errors:</span>
                </div>
                <ul className="text-sm text-red-600 space-y-1">
                  {uploadResult.errors.map((error, index) => (
                    <li key={index} className="list-disc list-inside">
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BulkProductUpload;

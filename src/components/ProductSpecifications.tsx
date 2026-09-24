
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cpu } from 'lucide-react';

interface ProductSpecificationsProps {
  specifications: Array<{key: string, value: string}> | null;
}

const ProductSpecifications: React.FC<ProductSpecificationsProps> = ({ specifications }) => {
  if (!specifications || specifications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="w-5 h-5" />
            Key Specifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No specifications available for this product.</p>
        </CardContent>
      </Card>
    );
  }

  // Filter out specifications with generic keys like "Feature 1", "Feature 2", etc.
  const validSpecs = specifications.filter(spec => 
    spec.key && 
    spec.value && 
    !spec.key.toLowerCase().startsWith('feature') &&
    spec.key.trim() !== ''
  );

  if (validSpecs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="w-5 h-5" />
            Key Specifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No valid specifications available for this product.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cpu className="w-5 h-5" />
          Key Specifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {validSpecs.map((spec, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                <span className="font-medium text-foreground">{spec.key}</span>
              </div>
              <span className="text-muted-foreground text-right">{spec.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductSpecifications;


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
          <p className="text-gray-500">No specifications available for this product.</p>
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
          {specifications.map((spec, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                <span className="font-medium text-gray-700">{spec.key}</span>
              </div>
              <span className="text-gray-600 text-right">{spec.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductSpecifications;

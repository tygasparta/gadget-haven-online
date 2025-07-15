
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Plus, Cpu } from 'lucide-react';

interface ProductSpecsInputProps {
  specs: Array<{key: string, value: string}>;
  onSpecsChange: (specs: Array<{key: string, value: string}>) => void;
}

const ProductSpecsInput: React.FC<ProductSpecsInputProps> = ({ specs, onSpecsChange }) => {
  const addSpec = () => {
    onSpecsChange([...specs, { key: '', value: '' }]);
  };

  const removeSpec = (index: number) => {
    const newSpecs = specs.filter((_, i) => i !== index);
    onSpecsChange(newSpecs);
  };

  const updateSpec = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = specs.map((spec, i) => 
      i === index ? { ...spec, [field]: value } : spec
    );
    onSpecsChange(newSpecs);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-gray-300 flex items-center gap-2">
          <Cpu className="w-4 h-4" />
          Product Specifications
        </Label>
        <Button
          type="button"
          onClick={addSpec}
          variant="outline"
          size="sm"
          className="bg-blue-600 border-blue-500 text-white hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Spec
        </Button>
      </div>
      
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {specs.map((spec, index) => (
          <div key={index} className="flex gap-2 items-center bg-gray-800/50 p-3 rounded-lg border border-gray-700">
            <div className="flex-1 space-y-2 sm:space-y-0 sm:flex sm:gap-2">
              <Input
                placeholder="Specification name (e.g., Screen Size)"
                value={spec.key}
                onChange={(e) => updateSpec(index, 'key', e.target.value)}
                className="bg-gray-800 border-gray-600 text-white flex-1"
              />
              <Input
                placeholder="Value (e.g., 6.1 inches)"
                value={spec.value}
                onChange={(e) => updateSpec(index, 'value', e.target.value)}
                className="bg-gray-800 border-gray-600 text-white flex-1"
              />
            </div>
            <Button
              type="button"
              onClick={() => removeSpec(index)}
              variant="outline"
              size="sm"
              className="bg-red-700 border-red-600 text-white hover:bg-red-600 px-2 flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
      
      {specs.length === 0 && (
        <div className="text-center py-8 bg-gray-800/30 rounded-lg border-2 border-dashed border-gray-600">
          <Cpu className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">
            No specifications added yet. Click "Add Spec" to add product specifications.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductSpecsInput;

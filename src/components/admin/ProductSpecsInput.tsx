
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Plus } from 'lucide-react';

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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-gray-300">Product Specifications</Label>
        <Button
          type="button"
          onClick={addSpec}
          variant="outline"
          size="sm"
          className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Spec
        </Button>
      </div>
      
      {specs.map((spec, index) => (
        <div key={index} className="flex gap-2 items-center">
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
          <Button
            type="button"
            onClick={() => removeSpec(index)}
            variant="outline"
            size="sm"
            className="bg-red-700 border-red-600 text-white hover:bg-red-600 px-2"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ))}
      
      {specs.length === 0 && (
        <p className="text-gray-500 text-sm italic">
          No specifications added yet. Click "Add Spec" to add product specifications.
        </p>
      )}
    </div>
  );
};

export default ProductSpecsInput;

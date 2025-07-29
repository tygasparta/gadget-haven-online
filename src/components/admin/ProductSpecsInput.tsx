
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
    const nextIndex = specs.length;
    const defaultSpecs = [
      { key: 'Display', value: '' },
      { key: 'Storage', value: '' },
      { key: 'RAM', value: '' },
      { key: 'Processor', value: '' },
      { key: 'Battery', value: '' },
      { key: 'Camera', value: '' },
      { key: 'Connectivity', value: '' },
      { key: 'Operating System', value: '' },
      { key: 'Weight', value: '' },
      { key: 'Dimensions', value: '' },
      { key: 'Color Options', value: '' },
      { key: 'Warranty', value: '' }
    ];
    
    const newSpec = nextIndex < defaultSpecs.length 
      ? defaultSpecs[nextIndex] 
      : { key: '', value: '' };
    
    onSpecsChange([...specs, newSpec]);
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

  const getValuePlaceholder = (specKey: string) => {
    const valuePlaceholders: { [key: string]: string } = {
      'Display': '6.7-inch AMOLED, 2800x1260',
      'Storage': '256GB internal storage',
      'RAM': '8GB RAM',
      'Processor': 'Snapdragon 8 Gen 2',
      'Battery': '4000mAh with 25W fast charging',
      'Camera': '108MP triple camera system',
      'Connectivity': '5G, Wi-Fi 6, Bluetooth 5.2',
      'Operating System': 'Android 14',
      'Weight': '195g',
      'Dimensions': '158.2 x 73.8 x 8.2 mm',
      'Color Options': 'Midnight Black, Ocean Blue, Rose Gold',
      'Warranty': '1 year manufacturer warranty'
    };
    return valuePlaceholders[specKey] || 'Enter specification value...';
  };

  const specificationSuggestions = [
    'Display', 'Storage', 'RAM', 'Processor', 'Battery', 'Camera',
    'Connectivity', 'Operating System', 'Weight', 'Dimensions',
    'Color Options', 'Warranty', 'Materials', 'Ports', 'Sensors',
    'Audio', 'Video', 'Network', 'Security', 'Compatibility'
  ];

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
              <div className="flex-1 relative">
                <Input
                  list={`spec-suggestions-${index}`}
                  placeholder="e.g., Display, Storage, RAM..."
                  value={spec.key}
                  onChange={(e) => updateSpec(index, 'key', e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                />
                <datalist id={`spec-suggestions-${index}`}>
                  {specificationSuggestions.map((suggestion) => (
                    <option key={suggestion} value={suggestion} />
                  ))}
                </datalist>
              </div>
              <Input
                placeholder={getValuePlaceholder(spec.key)}
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

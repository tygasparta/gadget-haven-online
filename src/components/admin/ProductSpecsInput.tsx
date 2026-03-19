
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
  const defaultSpecs = [
    { key: 'Display', value: '' }, { key: 'Storage', value: '' }, { key: 'RAM', value: '' },
    { key: 'Processor', value: '' }, { key: 'Battery', value: '' }, { key: 'Camera', value: '' },
    { key: 'Connectivity', value: '' }, { key: 'Operating System', value: '' },
    { key: 'Weight', value: '' }, { key: 'Dimensions', value: '' },
    { key: 'Color Options', value: '' }, { key: 'Warranty', value: '' }
  ];

  const addSpec = () => {
    const newSpec = specs.length < defaultSpecs.length ? defaultSpecs[specs.length] : { key: '', value: '' };
    onSpecsChange([...specs, newSpec]);
  };
  const removeSpec = (index: number) => onSpecsChange(specs.filter((_, i) => i !== index));
  const updateSpec = (index: number, field: 'key' | 'value', value: string) => {
    onSpecsChange(specs.map((spec, i) => i === index ? { ...spec, [field]: value } : spec));
  };

  const getValuePlaceholder = (specKey: string) => {
    const p: Record<string, string> = {
      'Display': '6.7-inch AMOLED, 2800x1260', 'Storage': '256GB internal storage',
      'RAM': '8GB RAM', 'Processor': 'Snapdragon 8 Gen 2',
      'Battery': '4000mAh with 25W fast charging', 'Camera': '108MP triple camera system',
      'Connectivity': '5G, Wi-Fi 6, Bluetooth 5.2', 'Operating System': 'Android 14',
      'Weight': '195g', 'Dimensions': '158.2 x 73.8 x 8.2 mm',
      'Color Options': 'Midnight Black, Ocean Blue, Rose Gold', 'Warranty': '1 year manufacturer warranty'
    };
    return p[specKey] || 'Enter specification value...';
  };

  const suggestions = [
    'Display', 'Storage', 'RAM', 'Processor', 'Battery', 'Camera',
    'Connectivity', 'Operating System', 'Weight', 'Dimensions',
    'Color Options', 'Warranty', 'Materials', 'Ports', 'Sensors',
    'Audio', 'Video', 'Network', 'Security', 'Compatibility'
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2"><Cpu className="w-4 h-4" />Product Specifications</Label>
        <Button type="button" onClick={addSpec} variant="outline" size="sm"><Plus className="w-4 h-4 mr-1" />Add Spec</Button>
      </div>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {specs.map((spec, index) => (
          <div key={index} className="flex gap-2 items-center bg-muted/30 p-3 rounded-lg border border-border">
            <div className="flex-1 space-y-2 sm:space-y-0 sm:flex sm:gap-2">
              <div className="flex-1 relative">
                <Input list={`spec-suggestions-${index}`} placeholder="e.g., Display, Storage, RAM..." value={spec.key} onChange={(e) => updateSpec(index, 'key', e.target.value)} />
                <datalist id={`spec-suggestions-${index}`}>{suggestions.map((s) => <option key={s} value={s} />)}</datalist>
              </div>
              <Input placeholder={getValuePlaceholder(spec.key)} value={spec.value} onChange={(e) => updateSpec(index, 'value', e.target.value)} className="flex-1" />
            </div>
            <Button type="button" onClick={() => removeSpec(index)} variant="destructive" size="sm" className="px-2 flex-shrink-0"><X className="w-4 h-4" /></Button>
          </div>
        ))}
      </div>
      {specs.length === 0 && (
        <div className="text-center py-8 bg-muted/30 rounded-lg border-2 border-dashed border-border">
          <Cpu className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No specifications added yet. Click "Add Spec" to add product specifications.</p>
        </div>
      )}
    </div>
  );
};

export default ProductSpecsInput;

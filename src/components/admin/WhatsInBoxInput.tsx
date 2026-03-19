
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Package } from 'lucide-react';

interface WhatsInBoxInputProps { items: string[]; onItemsChange: (items: string[]) => void; }

const WhatsInBoxInput: React.FC<WhatsInBoxInputProps> = ({ items, onItemsChange }) => {
  const addItem = () => onItemsChange([...items, '']);
  const removeItem = (index: number) => onItemsChange(items.filter((_, i) => i !== index));
  const updateItem = (index: number, value: string) => { const u = [...items]; u[index] = value; onItemsChange(u); };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Package className="w-4 h-4 text-muted-foreground" />
        <Label>What's in the Box</Label>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input value={item} onChange={(e) => updateItem(index, e.target.value)} placeholder={`Item ${index + 1} (e.g., iPhone 15 Pro, USB-C Cable)`} className="flex-1" />
            {items.length > 1 && (
              <Button type="button" onClick={() => removeItem(index)} size="sm" variant="destructive" className="px-2"><Minus className="w-4 h-4" /></Button>
            )}
          </div>
        ))}
      </div>
      <Button type="button" onClick={addItem} size="sm" variant="outline"><Plus className="w-4 h-4 mr-1" />Add Item</Button>
      <p className="text-xs text-muted-foreground">List all items included with this product</p>
    </div>
  );
};

export default WhatsInBoxInput;

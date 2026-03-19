
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { useProductColors } from '@/hooks/useProductColors';

interface Color { name: string; hex_code: string; }
interface ColorSelectorProps { selectedColors: Color[]; onColorsChange: (colors: Color[]) => void; }

const ColorSelector: React.FC<ColorSelectorProps> = ({ selectedColors, onColorsChange }) => {
  const { data: predefinedColors = [] } = useProductColors();
  const [customColor, setCustomColor] = useState({ name: '', hex_code: '#000000' });
  const [showCustomForm, setShowCustomForm] = useState(false);

  const addPredefinedColor = (color: Color) => {
    if (!selectedColors.find(c => c.hex_code === color.hex_code)) onColorsChange([...selectedColors, color]);
  };
  const addCustomColor = () => {
    if (customColor.name && customColor.hex_code && !selectedColors.find(c => c.hex_code === customColor.hex_code)) {
      onColorsChange([...selectedColors, customColor]); setCustomColor({ name: '', hex_code: '#000000' }); setShowCustomForm(false);
    }
  };
  const removeColor = (colorToRemove: Color) => onColorsChange(selectedColors.filter(c => c.hex_code !== colorToRemove.hex_code));

  return (
    <div className="space-y-4">
      <Label>Product Colors</Label>
      <div className="flex flex-wrap gap-2">
        {selectedColors.map((color) => (
          <Badge key={color.hex_code} variant="secondary" className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border border-border" style={{ backgroundColor: color.hex_code }} />
            {color.name}
            <button onClick={() => removeColor(color)} className="ml-1 hover:text-destructive"><X className="w-3 h-3" /></button>
          </Badge>
        ))}
      </div>
      <div>
        <Label className="text-muted-foreground text-sm">Choose from predefined colors:</Label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {predefinedColors.map((color) => (
            <button key={color.id} onClick={() => addPredefinedColor({ name: color.name, hex_code: color.hex_code })}
              className="flex items-center gap-2 p-2 rounded bg-muted/50 hover:bg-muted text-left text-sm text-foreground"
              disabled={selectedColors.some(c => c.hex_code === color.hex_code)}>
              <div className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: color.hex_code }} />{color.name}
            </button>
          ))}
        </div>
      </div>
      {!showCustomForm ? (
        <Button type="button" onClick={() => setShowCustomForm(true)} variant="outline" size="sm"><Plus className="w-4 h-4 mr-1" />Add Custom Color</Button>
      ) : (
        <div className="space-y-2 p-3 bg-muted/50 rounded border border-border">
          <div className="grid grid-cols-2 gap-2">
            <div><Label className="text-sm">Color Name</Label><Input value={customColor.name} onChange={(e) => setCustomColor({ ...customColor, name: e.target.value })} placeholder="e.g., Navy Blue" /></div>
            <div><Label className="text-sm">Hex Code</Label><Input type="color" value={customColor.hex_code} onChange={(e) => setCustomColor({ ...customColor, hex_code: e.target.value })} className="h-10" /></div>
          </div>
          <div className="flex gap-2">
            <Button type="button" onClick={addCustomColor} size="sm">Add</Button>
            <Button type="button" onClick={() => setShowCustomForm(false)} variant="outline" size="sm">Cancel</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorSelector;

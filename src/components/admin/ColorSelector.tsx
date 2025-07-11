
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { useProductColors } from '@/hooks/useProductColors';

interface Color {
  name: string;
  hex_code: string;
}

interface ColorSelectorProps {
  selectedColors: Color[];
  onColorsChange: (colors: Color[]) => void;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({ selectedColors, onColorsChange }) => {
  const { data: predefinedColors = [] } = useProductColors();
  const [customColor, setCustomColor] = useState({ name: '', hex_code: '#000000' });
  const [showCustomForm, setShowCustomForm] = useState(false);

  const addPredefinedColor = (color: Color) => {
    if (!selectedColors.find(c => c.hex_code === color.hex_code)) {
      onColorsChange([...selectedColors, color]);
    }
  };

  const addCustomColor = () => {
    if (customColor.name && customColor.hex_code && !selectedColors.find(c => c.hex_code === customColor.hex_code)) {
      onColorsChange([...selectedColors, customColor]);
      setCustomColor({ name: '', hex_code: '#000000' });
      setShowCustomForm(false);
    }
  };

  const removeColor = (colorToRemove: Color) => {
    onColorsChange(selectedColors.filter(c => c.hex_code !== colorToRemove.hex_code));
  };

  return (
    <div className="space-y-4">
      <Label className="text-gray-300">Product Colors</Label>
      
      {/* Selected Colors */}
      <div className="flex flex-wrap gap-2">
        {selectedColors.map((color) => (
          <Badge 
            key={color.hex_code} 
            variant="secondary" 
            className="flex items-center gap-2 bg-gray-700 text-white"
          >
            <div 
              className="w-3 h-3 rounded-full border border-gray-400" 
              style={{ backgroundColor: color.hex_code }}
            />
            {color.name}
            <button 
              onClick={() => removeColor(color)}
              className="ml-1 hover:text-red-400"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>

      {/* Predefined Colors */}
      <div>
        <Label className="text-gray-400 text-sm">Choose from predefined colors:</Label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {predefinedColors.map((color) => (
            <button
              key={color.id}
              onClick={() => addPredefinedColor({ name: color.name, hex_code: color.hex_code })}
              className="flex items-center gap-2 p-2 rounded bg-gray-800 hover:bg-gray-700 text-left text-sm"
              disabled={selectedColors.some(c => c.hex_code === color.hex_code)}
            >
              <div 
                className="w-4 h-4 rounded-full border border-gray-400" 
                style={{ backgroundColor: color.hex_code }}
              />
              {color.name}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Color Form */}
      {!showCustomForm ? (
        <Button 
          type="button"
          onClick={() => setShowCustomForm(true)}
          variant="outline"
          size="sm"
          className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Custom Color
        </Button>
      ) : (
        <div className="space-y-2 p-3 bg-gray-800 rounded">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-gray-300 text-sm">Color Name</Label>
              <Input
                value={customColor.name}
                onChange={(e) => setCustomColor({ ...customColor, name: e.target.value })}
                placeholder="e.g., Navy Blue"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label className="text-gray-300 text-sm">Hex Code</Label>
              <Input
                type="color"
                value={customColor.hex_code}
                onChange={(e) => setCustomColor({ ...customColor, hex_code: e.target.value })}
                className="bg-gray-700 border-gray-600 h-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              type="button"
              onClick={addCustomColor}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              Add
            </Button>
            <Button 
              type="button"
              onClick={() => setShowCustomForm(false)}
              variant="outline"
              size="sm"
              className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorSelector;

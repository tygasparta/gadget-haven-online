
import React from 'react';
import { Check } from 'lucide-react';

interface ColorOption {
  name: string;
  hex_code: string;
}

interface ColorSelectorProps {
  colors: ColorOption[];
  selectedColor: string | null;
  onColorSelect: (color: string) => void;
  className?: string;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({
  colors,
  selectedColor,
  onColorSelect,
  className = ""
}) => {
  if (!colors || colors.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <h4 className="text-sm font-medium text-gray-700">Choose Color:</h4>
      <div className="flex flex-wrap gap-3">
        {colors.map((color, index) => (
          <button
            key={`${color.name}-${index}`}
            onClick={() => onColorSelect(color.name)}
            className={`
              relative w-10 h-10 rounded-full border-2 transition-all duration-200
              ${selectedColor === color.name 
                ? 'border-blue-500 ring-2 ring-blue-200' 
                : 'border-gray-300 hover:border-gray-400'
              }
            `}
            style={{ backgroundColor: color.hex_code }}
            title={color.name}
          >
            {selectedColor === color.name && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Check className="w-5 h-5 text-white drop-shadow-lg" />
              </div>
            )}
          </button>
        ))}
      </div>
      {selectedColor && (
        <p className="text-sm text-gray-600">
          Selected: <span className="font-medium">{selectedColor}</span>
        </p>
      )}
    </div>
  );
};

export default ColorSelector;

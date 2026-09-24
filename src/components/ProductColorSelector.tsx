
import React from 'react';
import { Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ColorOption {
  name: string;
  hex_code: string;
}

interface ProductColorSelectorProps {
  colors: ColorOption[];
  selectedColor: string | null;
  onColorSelect: (color: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSelectedName?: boolean;
}

const ProductColorSelector: React.FC<ProductColorSelectorProps> = ({
  colors,
  selectedColor,
  onColorSelect,
  className = "",
  size = 'md',
  showSelectedName = true
}) => {
  if (!colors || colors.length === 0) {
    return null;
  }

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const checkSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-foreground">
          Color: {selectedColor && showSelectedName && (
            <span className="font-semibold text-foreground">{selectedColor}</span>
          )}
        </h4>
        {selectedColor && (
          <Badge variant="secondary" className="text-xs">
            Selected
          </Badge>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {colors.map((color, index) => (
          <button
            key={`${color.name}-${index}`}
            onClick={() => onColorSelect(color.name)}
            className={`
              relative ${sizeClasses[size]} rounded-full border-2 transition-all duration-200
              hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
              ${selectedColor === color.name
                ? 'border-primary ring-2 ring-primary/20 scale-105'
                : 'border-border hover:border-muted-foreground'
              }
            `}
            style={{ backgroundColor: color.hex_code }}
            title={color.name}
            aria-label={`Select ${color.name} color`}
          >
            {selectedColor === color.name && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Check 
                  className={`${checkSizes[size]} text-white drop-shadow-lg`}
                  style={{
                    color: color.hex_code === '#FFFFFF' || color.hex_code === '#ffffff' ? '#000000' : '#ffffff'
                  }}
                />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductColorSelector;

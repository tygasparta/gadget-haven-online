import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { SlidersHorizontal, X } from 'lucide-react';

export interface FilterDrawerProps {
  isMobile: boolean;
  isOpen: boolean;
  onClose: () => void;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  maxPrice: number;
  brands: string[];
  selectedBrands: string[];
  setSelectedBrands: (brands: string[]) => void;
  categories: string[];
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  onClear: () => void;
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isMobile,
  isOpen,
  onClose,
  priceRange,
  setPriceRange,
  maxPrice,
  brands,
  selectedBrands,
  setSelectedBrands,
  categories,
  selectedCategories,
  setSelectedCategories,
  onClear,
}) => {
  const toggleBrand = (brand: string, checked: boolean) => {
    setSelectedBrands(checked ? [...selectedBrands, brand] : selectedBrands.filter((b) => b !== brand));
  };

  const toggleCategory = (cat: string, checked: boolean) => {
    setSelectedCategories(checked ? [...selectedCategories, cat] : selectedCategories.filter((c) => c !== cat));
  };

  const content = (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-base">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClear} className="text-muted-foreground">
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold text-sm mb-3">Price Range</h3>
          <Slider value={priceRange} onValueChange={setPriceRange} max={maxPrice} min={0} step={50} className="mb-3" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>

        {brands.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="font-semibold text-sm mb-3">Brands</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {brands.map((brand) => (
                  <div key={brand} className="flex items-center space-x-2">
                    <Checkbox
                      id={`brand-${brand}`}
                      checked={selectedBrands.includes(brand)}
                      onCheckedChange={(checked) => toggleBrand(brand, checked === true)}
                    />
                    <label htmlFor={`brand-${brand}`} className="text-sm font-medium leading-none cursor-pointer">
                      {brand}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {categories.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="font-semibold text-sm mb-3">Categories</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {categories.map((cat) => (
                  <div key={cat} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${cat}`}
                      checked={selectedCategories.includes(cat)}
                      onCheckedChange={(checked) => toggleCategory(cat, checked === true)}
                    />
                    <label htmlFor={`category-${cat}`} className="text-sm font-medium leading-none cursor-pointer">
                      {cat}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );

  if (!isMobile) {
    return <div className="w-72 flex-shrink-0">{content}</div>;
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-background rounded-t-2xl max-h-[85vh] overflow-y-auto animate-scale-in" style={{ transformOrigin: 'bottom' }}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-border sticky top-0 bg-background">
          <h2 className="text-base font-semibold">Filters & Sort</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="p-4">
          {content}
          <Button className="w-full mt-4 bg-primary hover:bg-primary/90" onClick={onClose}>
            Show Results
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterDrawer;

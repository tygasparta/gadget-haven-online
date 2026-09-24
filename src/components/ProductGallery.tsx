import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  alt: string;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&h=800&fit=crop';

const ProductGallery: React.FC<ProductGalleryProps> = ({ images, alt }) => {
  const gallery = images.length > 0 ? images : [FALLBACK_IMAGE];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomActive, setZoomActive] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imageRef = useRef<HTMLDivElement>(null);

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % gallery.length);
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + gallery.length) % gallery.length);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div className="space-y-3">
      <div
        ref={imageRef}
        className="aspect-square bg-card border border-border rounded-xl overflow-hidden relative group cursor-zoom-in"
        onMouseEnter={() => setZoomActive(true)}
        onMouseLeave={() => setZoomActive(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={gallery[currentIndex]}
          alt={`${alt}${gallery.length > 1 ? ` — image ${currentIndex + 1} of ${gallery.length}` : ''}`}
          loading="eager"
          className={`w-full h-full object-cover transition-transform duration-200 ${zoomActive ? 'scale-150' : 'scale-100'} hidden sm:block`}
          style={zoomActive ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : undefined}
          onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
        />
        {/* Mobile: no zoom, swipeable via horizontal scroll snap */}
        <img
          src={gallery[currentIndex]}
          alt={alt}
          loading="eager"
          className="w-full h-full object-cover sm:hidden"
          onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
        />

        {!zoomActive && (
          <div className="hidden sm:flex absolute top-3 right-3 items-center gap-1 bg-background/80 backdrop-blur-sm text-muted-foreground text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn className="w-3.5 h-3.5" />
            Hover to zoom
          </div>
        )}

        {gallery.length > 1 && (
          <>
            <button
              onClick={prevImage}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {gallery.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-1">
          {gallery.map((imageUrl, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              aria-label={`View image ${index + 1}`}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                index === currentIndex ? 'border-primary' : 'border-border'
              }`}
            >
              <img
                src={imageUrl}
                alt={`${alt} thumbnail ${index + 1}`}
                loading="lazy"
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;

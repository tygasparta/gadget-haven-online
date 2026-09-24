import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  name: string;
  image: string;
  path: string;
  count?: number;
  compact?: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ name, image, path, count, compact }) => (
  <Link
    to={path}
    className="group flex flex-col overflow-hidden rounded-lg bg-card border border-border hover:border-primary/40 hover:shadow-md transition-all duration-200"
  >
    <div className="aspect-square w-full overflow-hidden bg-muted/40">
      <img
        src={image}
        alt={`${name} category`}
        width={816}
        height={816}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
    <div className={cn('text-center', compact ? 'px-1.5 py-2' : 'px-2 py-2.5')}>
      <span className={cn('block font-semibold text-foreground leading-tight group-hover:text-primary transition-colors', compact ? 'text-[11px]' : 'text-xs sm:text-sm')}>
        {name}
      </span>
      {typeof count === 'number' && count > 0 && (
        <span className="block text-[11px] text-muted-foreground mt-0.5">{count} {count === 1 ? 'item' : 'items'}</span>
      )}
    </div>
  </Link>
);

export default CategoryCard;

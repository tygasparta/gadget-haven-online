import React, { useState, useRef, useEffect } from 'react';
import { Search, Clock, TrendingUp, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';

const RECENT_SEARCHES_KEY = 'gg_recent_searches';
const MAX_RECENT = 5;

const POPULAR_SEARCHES = [
  'iPhone 15', 'Samsung Galaxy', 'Gaming Laptop', 'Wireless Earbuds', 'Smart Watch',
];

function getRecentSearches(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function addRecentSearch(term: string) {
  try {
    const existing = getRecentSearches().filter((t) => t.toLowerCase() !== term.toLowerCase());
    const updated = [term, ...existing].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch {
    // localStorage unavailable — ignore
  }
}

interface SearchAutocompleteProps {
  variant?: 'desktop' | 'mobile';
  /** Pass an incrementing number (or true) to (re-)focus the input imperatively, e.g. from a bottom-nav "Search" tap. */
  autoFocus?: boolean | number;
  onClose?: () => void;
}

const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({ variant = 'desktop', autoFocus, onClose }) => {
  const navigate = useNavigate();
  const { data: products = [] } = useProducts();
  const [term, setTerm] = useState('');
  const [showPanel, setShowPanel] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
      setShowPanel(true);
    }
  }, [autoFocus]);

  useEffect(() => {
    if (showPanel) setRecent(getRecentSearches());
  }, [showPanel]);

  const results = term.length > 1
    ? products.filter((p) => {
        const q = term.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
        );
      }).slice(0, 6)
    : [];

  const commitSearch = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    addRecentSearch(trimmed);
    setShowPanel(false);
    setTerm('');
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    onClose?.();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    commitSearch(term);
  };

  const handleRemoveRecent = (e: React.MouseEvent, value: string) => {
    e.stopPropagation();
    const updated = getRecentSearches().filter((t) => t !== value);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    setRecent(updated);
  };

  const showSuggestions = term.length <= 1 && (recent.length > 0 || POPULAR_SEARCHES.length > 0);
  const showResults = term.length > 1;

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="relative flex">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search for products, brands..."
          className={`w-full pl-4 pr-4 rounded-l-sm rounded-r-none border-border focus-visible:ring-1 focus-visible:ring-ring ${
            variant === 'mobile' ? 'py-2 text-sm bg-muted/40' : 'py-2.5'
          }`}
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          onFocus={() => setShowPanel(true)}
          onBlur={() => setTimeout(() => setShowPanel(false), 150)}
        />
        <Button type="submit" className="rounded-l-none rounded-r-sm px-5 bg-primary hover:bg-primary/90">
          <Search className={variant === 'mobile' ? 'w-4 h-4' : 'w-5 h-5'} />
        </Button>
      </form>

      {showPanel && (showSuggestions || showResults) && (
        <div className="absolute top-full left-0 right-0 bg-popover text-popover-foreground border border-border rounded-sm mt-1 shadow-lg z-[100] max-h-96 overflow-y-auto animate-scale-in" style={{ transformOrigin: 'top' }}>
          {showResults ? (
            results.length > 0 ? (
              <>
                {results.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center p-3 hover:bg-muted/60 cursor-pointer border-b border-border last:border-b-0"
                    onMouseDown={() => { navigate(`/product/${product.id}`); setShowPanel(false); setTerm(''); onClose?.(); }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded mr-3"
                      onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop'; }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                      <p className="text-sm font-semibold text-primary">${product.price}</p>
                    </div>
                  </div>
                ))}
                <div className="p-2 border-t border-border">
                  <button
                    onMouseDown={() => commitSearch(term)}
                    className="w-full text-center text-primary hover:text-primary/80 font-medium py-2 text-sm"
                  >
                    View all results for "{term}"
                  </button>
                </div>
              </>
            ) : (
              <div className="p-4 text-sm text-muted-foreground text-center">No products found for "{term}"</div>
            )
          ) : (
            <div className="p-3 space-y-3">
              {recent.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground px-1 mb-1.5">Recent searches</p>
                  {recent.map((r) => (
                    <div
                      key={r}
                      onMouseDown={() => commitSearch(r)}
                      className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-muted/60 cursor-pointer group"
                    >
                      <span className="flex items-center gap-2 text-sm">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                        {r}
                      </span>
                      <button
                        onMouseDown={(e) => handleRemoveRecent(e, r)}
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-opacity"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div>
                <p className="text-xs font-medium text-muted-foreground px-1 mb-1.5">Popular searches</p>
                {POPULAR_SEARCHES.map((p) => (
                  <div
                    key={p}
                    onMouseDown={() => commitSearch(p)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted/60 cursor-pointer text-sm"
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
                    {p}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAutocomplete;

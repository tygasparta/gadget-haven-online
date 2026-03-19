
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

interface TagsInputProps { tags: string[]; onTagsChange: (tags: string[]) => void; }

const TagsInput: React.FC<TagsInputProps> = ({ tags, onTagsChange }) => {
  const [inputValue, setInputValue] = useState('');
  const addTag = () => { const t = inputValue.trim(); if (t && !tags.includes(t)) { onTagsChange([...tags, t]); setInputValue(''); } };
  const removeTag = (tagToRemove: string) => onTagsChange(tags.filter(tag => tag !== tagToRemove));
  const handleKeyPress = (e: React.KeyboardEvent) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } };

  return (
    <div className="space-y-3">
      <Label>Product Tags</Label>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="flex items-center gap-2 bg-primary/10 text-primary">
            {tag}
            <button onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive"><X className="w-3 h-3" /></button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={handleKeyPress} placeholder="Add a tag (e.g., waterproof, wireless, premium)" />
        <Button type="button" onClick={addTag} size="sm"><Plus className="w-4 h-4" /></Button>
      </div>
      <p className="text-xs text-muted-foreground">Press Enter or click + to add tags</p>
    </div>
  );
};

export default TagsInput;

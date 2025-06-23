import React, { useState, KeyboardEvent } from 'react';
import { X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  icon?: React.ReactNode;
}

export const TagInput: React.FC<TagInputProps> = ({
  tags,
  onChange,
  placeholder = "日記を分類するためのタグを追加してください...",
  icon,
}) => {
  const [inputValue, setInputValue] = useState('');

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onChange([...tags, trimmedTag]);
    }
    setInputValue('');
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const suggestedTags = ['感謝', '不安', '興奮', '内省', '創造的', '社交', '仕事', '家族'];

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        タグ
      </label>
      
      <div className="flex flex-wrap gap-2 mb-3">
        <AnimatePresence>
          {tags.map((tag) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 text-primary-800 text-sm font-medium"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-2 text-primary-600 hover:text-primary-800"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 pl-3 pr-10"
        />
        <button
          type="button"
          onClick={() => addTag(inputValue)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-primary-600"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {suggestedTags
          .filter(tag => !tags.includes(tag))
          .slice(0, 5)
          .map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => addTag(tag)}
              className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-xs hover:bg-gray-200 transition-colors"
            >
              <Plus className="w-3 h-3 mr-1" />
              {tag}
            </button>
          ))}
      </div>
    </div>
  );
};
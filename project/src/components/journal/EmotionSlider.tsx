import React from 'react';
import { motion } from 'framer-motion';
import type { EmotionScale } from '../../types';

interface EmotionSliderProps {
  value: EmotionScale;
  onChange: (value: EmotionScale) => void;
  label?: string;
}

const emotionLabels = {
  1: 'とても悪い',
  2: '悪い',
  3: 'やや悪い',
  4: '少し悪い',
  5: '普通',
  6: 'まあまあ',
  7: '良い',
  8: 'とても良い',
  9: '素晴らしい',
  10: '最高',
};

const emotionColors = {
  1: '#dc2626', 2: '#ea580c', 3: '#f59e0b', 4: '#eab308', 5: '#84cc16',
  6: '#22c55e', 7: '#10b981', 8: '#06b6d4', 9: '#3b82f6', 10: '#8b5cf6',
};

export const EmotionSlider: React.FC<EmotionSliderProps> = ({
  value,
  onChange,
  label = '今日の気分はいかがですか？',
}) => {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      <div className="px-4">
        <div className="relative">
          <input
            type="range"
            min="1"
            max="10"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value) as EmotionScale)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #dc2626 0%, #f59e0b 50%, #8b5cf6 100%)`,
            }}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>1</span>
            <span>5</span>
            <span>10</span>
          </div>
        </div>
        
        <motion.div
          key={value}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center mt-4"
        >
          <div
            className="inline-flex items-center px-4 py-2 rounded-full text-white font-medium"
            style={{ backgroundColor: emotionColors[value] }}
          >
            <span className="text-lg mr-2">{value}</span>
            <span>{emotionLabels[value]}</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
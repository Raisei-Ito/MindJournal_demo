import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = false 
}) => {
  return (
    <motion.div
      whileHover={hover ? { y: -2, shadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)' } : {}}
      className={`
        bg-white rounded-xl shadow-sm border border-gray-100
        backdrop-blur-sm bg-white/80
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};
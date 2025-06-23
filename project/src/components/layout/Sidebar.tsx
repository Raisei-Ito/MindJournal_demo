import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  PenTool, 
  BarChart3, 
  Settings, 
  BookOpen,
  Calendar
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen?: boolean;
}

const navigation = [
  { id: 'dashboard', name: 'ダッシュボード', icon: Home },
  { id: 'write', name: '日記を書く', icon: PenTool },
  { id: 'entries', name: '日記一覧', icon: BookOpen },
  { id: 'analytics', name: '分析', icon: BarChart3 },
  { id: 'calendar', name: 'カレンダー', icon: Calendar },
  { id: 'settings', name: '設定', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  onTabChange, 
  isOpen = true 
}) => {
  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`
        bg-white/80 backdrop-blur-md border-r border-gray-200 h-screen
        ${isOpen ? 'w-64' : 'w-0 overflow-hidden lg:w-64'}
        transition-all duration-300 ease-in-out
      `}
    >
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onTabChange(item.id)}
                className={`
                  w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200
                  ${activeTab === item.id
                    ? 'bg-primary-100 text-primary-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </motion.aside>
  );
};
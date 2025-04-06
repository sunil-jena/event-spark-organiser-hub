
import React, { useState } from 'react';
import { SidebarItem, SidebarItemProps } from './SidebarItem';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '@/contexts/AppContext';

interface SidebarListProps {
  items: SidebarItemProps[];
  depth?: number;
  className?: string;
}

export const SidebarList: React.FC<SidebarListProps> = ({ 
  items, 
  depth = 0,
  className = "" 
}) => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const { sidebarMinimized } = useAppContext();

  const toggleExpand = (title: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  // Filter items based on user permissions
  return (
    <ul className={className}>
      {items.map(item => {
        const isExpanded = expandedItems[item.title] || false;
        
        return (
          <li key={item.title} className="mb-1">
            <SidebarItem
              {...item}
              depth={depth}
              expanded={isExpanded}
              onToggleExpand={() => toggleExpand(item.title)}
            />
            
            {!sidebarMinimized && item.children && (
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <SidebarList
                      items={item.children}
                      depth={depth + 1}
                      className="pl-4 mt-1 border-l border-white/10"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </li>
        );
      })}
    </ul>
  );
};

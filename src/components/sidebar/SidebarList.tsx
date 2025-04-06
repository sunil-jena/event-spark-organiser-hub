
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SidebarItem, SidebarItemProps } from './SidebarItem';
import { useAppContext } from '@/contexts/AppContext';

interface SidebarListProps {
  items: SidebarItemProps[];
  className?: string;
}

export const SidebarList: React.FC<SidebarListProps> = ({
  items,
  className = ""
}) => {
  const { sidebarMinimized } = useAppContext();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleItem = (title: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const renderItem = (item: SidebarItemProps, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems[item.title] || false;

    return (
      <li key={item.title} className={cn("relative", depth > 0 ? "ml-4" : "")}>
        <SidebarItem
          {...item}
          depth={depth}
          expanded={isExpanded}
          onToggleExpand={() => hasChildren && toggleItem(item.title)}
        />
        
        {/* Dropdown content for nested items */}
        {hasChildren && !sidebarMinimized && (
          <AnimatePresence>
            {isExpanded && (
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-1 ml-2 overflow-hidden border-l border-white/20 pl-2"
              >
                {item.children.map(child => renderItem(child, depth + 1))}
              </motion.ul>
            )}
          </AnimatePresence>
        )}
      </li>
    );
  };

  return (
    <ul className={cn("space-y-1", className)}>
      {items.map(item => renderItem(item))}
    </ul>
  );
};

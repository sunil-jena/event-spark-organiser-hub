import React, { useState } from 'react';
import { SidebarItem, SidebarItemProps } from './SidebarItem';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '@/contexts/AppContext';
import { useLocation } from 'react-router-dom';

interface SidebarListProps {
  items: SidebarItemProps[];
  depth?: number;
  className?: string;
}

export const SidebarList: React.FC<SidebarListProps> = ({
  items,
  depth = 0,
  className = '',
}) => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );
  const { sidebarMinimized } = useAppContext();
  const location = useLocation();

  // Auto-expand items based on current route
  React.useEffect(() => {
    const currentPath = location.pathname;
    const currentHash = location.hash.substring(1); // Remove the '#' character

    // Check if any item matches the current path or has a matching child
    items.forEach((item) => {
      if (item.children) {
        // Check if this item should be expanded
        const shouldExpand =
          // For event steps, only check if the pathname matches the base path (like /events/create)
          (item.href &&
            item.href.includes('#') &&
            item.href.split('#')[0] === currentPath) ||
          // For regular items, check exact path match
          item.href === currentPath ||
          // Or if any child has a matching href or hash
          item.children.some(
            (child) =>
              // Check exact path match for regular items
              child.href === currentPath ||
              // For event steps with hash, check if the hash part matches
              (child.href &&
                child.href.includes('#') &&
                child.href.split('#')[0] === currentPath &&
                (currentHash ? child.href.includes(currentHash) : false))
          );

        if (shouldExpand) {
          setExpandedItems((prev) => ({
            ...prev,
            [item.title]: true,
          }));
        }
      }
    });
  }, [location.pathname, location.hash, items]);

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  // Check if item is an event creation step
  const isEventStep = (item: SidebarItemProps): boolean => {
    return item.href?.includes('/events/create#') || false;
  };

  // Filter items based on user permissions
  return (
    <ul className={className}>
      {items.map((item) => {
        const isExpanded = expandedItems[item.title] || false;

        return (
          <li key={item.title} className='mb-1'>
            <SidebarItem
              {...item}
              depth={depth}
              expanded={isExpanded}
              onToggleExpand={() => toggleExpand(item.title)}
              isEventStep={isEventStep(item)}
            />

            {!sidebarMinimized && item.children && (
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className='overflow-hidden'
                  >
                    <SidebarList
                      items={item.children}
                      depth={depth + 1}
                      className='pl-4 mt-1 border-l border-white/10'
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

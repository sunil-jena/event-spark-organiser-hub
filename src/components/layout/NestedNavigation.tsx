
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export interface NavItem {
  title: string;
  href?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  external?: boolean;
  label?: string;
  children?: NavItem[];
}

interface NestedNavigationProps {
  items: NavItem[];
  className?: string;
  minimized?: boolean;
}

export const NestedNavigation: React.FC<NestedNavigationProps> = ({ 
  items, 
  className = "",
  minimized = false
}) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleItem = (title: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    return location.pathname === href || location.pathname.startsWith(`${href}/`);
  };

  const renderNavItem = (item: NavItem, depth = 0) => {
    const isItemActive = isActive(item.href);
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems[item.title] || false;
    
    // Check if any child is active to keep parent expanded
    const isChildActive = hasChildren && item.children?.some(
      child => isActive(child.href) || 
      (child.children?.some(grandchild => isActive(grandchild.href)))
    );
    
    // Auto-expand if child is active
    if (isChildActive && !isExpanded) {
      toggleItem(item.title);
    }

    // Customize classes based on possible sidebar theme
    const activeClass = "bg-white/20 font-medium"; 
    const hoverClass = "hover:bg-white/10";
    
    return (
      <li key={item.title} className={cn("relative", depth > 0 ? "ml-4" : "")}>
        {item.href && !hasChildren ? (
          <NavLink
            to={item.href}
            className={({ isActive }) => cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm",
              "transition-colors duration-200",
              isActive ? activeClass : hoverClass,
              item.disabled && "pointer-events-none opacity-60",
              minimized && "justify-center"
            )}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noreferrer" : undefined}
          >
            {item.icon}
            {!minimized && (
              <>
                <span>{item.title}</span>
                {item.label && (
                  <span className="ml-auto text-xs font-medium bg-white/20 px-1.5 py-0.5 rounded">
                    {item.label}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ) : (
          <button
            onClick={() => hasChildren && toggleItem(item.title)}
            className={cn(
              "flex items-center w-full gap-2 px-3 py-2 rounded-md text-sm",
              "transition-colors duration-200",
              (isItemActive || isChildActive) ? activeClass : hoverClass,
              item.disabled && "pointer-events-none opacity-60",
              minimized && "justify-center"
            )}
            disabled={item.disabled}
          >
            {item.icon}
            {!minimized && (
              <>
                <span>{item.title}</span>
                {hasChildren && (
                  <span className="ml-auto">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </span>
                )}
                {item.label && (
                  <span className="ml-auto text-xs font-medium bg-white/20 px-1.5 py-0.5 rounded">
                    {item.label}
                  </span>
                )}
              </>
            )}
          </button>
        )}
        
        {/* Dropdown content for nested items */}
        {hasChildren && !minimized && (
          <AnimatePresence>
            {isExpanded && (
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-1 ml-2 overflow-hidden border-l border-white/20 pl-2"
              >
                {item.children?.map(child => renderNavItem(child, depth + 1))}
              </motion.ul>
            )}
          </AnimatePresence>
        )}
      </li>
    );
  };

  return (
    <ul className={cn("space-y-1", className)}>
      {items.map(item => renderNavItem(item))}
    </ul>
  );
};

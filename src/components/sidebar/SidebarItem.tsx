
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/contexts/AppContext';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

export interface SidebarItemProps {
  title: string;
  href?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  external?: boolean;
  label?: string;
  children?: SidebarItemProps[];
  onClick?: () => void;
  expanded?: boolean;
  onToggleExpand?: () => void;
  depth?: number;
  moduleName?: string; // Associated module name for permissions
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  title,
  href,
  icon,
  disabled = false,
  external = false,
  label,
  children,
  onClick,
  expanded = false,
  onToggleExpand,
  depth = 0,
  moduleName
}) => {
  const location = useLocation();
  const { sidebarMinimized, activeRoute, setActiveRoute, hasPermission } = useAppContext();
  
  // Check if user has permission to view this item
  const canView = !moduleName || hasPermission(moduleName, 'view');
  
  // If user doesn't have permission, don't render the item
  if (!canView) return null;
  
  const hasChildren = children && children.length > 0;
  
  // Check if this item or any of its children are active
  const isItemActive = href ? location.pathname === href || location.pathname.startsWith(`${href}/`) : false;
  const isChildActive = hasChildren && children?.some(
    child => (child.href && (location.pathname === child.href || location.pathname.startsWith(`${child.href}/`)))
  );
  
  // Combine active states
  const isActive = isItemActive || isChildActive;
  
  // Handle click events including updating active route
  const handleClick = () => {
    if (disabled) return;
    
    if (hasChildren && onToggleExpand) {
      onToggleExpand();
    }
    
    if (href) {
      setActiveRoute(href);
    }
    
    if (onClick) {
      onClick();
    }
  };

  // Classes for active and hover states
  const activeClass = "bg-white/20 font-medium";
  const hoverClass = "hover:bg-white/10";
  
  // The content of the item
  const itemContent = (
    <div className={cn(
      "flex items-center w-full gap-2 px-3 py-2 rounded-md text-sm",
      "transition-colors duration-200",
      isActive ? activeClass : hoverClass,
      disabled && "pointer-events-none opacity-60",
      sidebarMinimized && "justify-center px-2"
    )}>
      {icon && <span className={sidebarMinimized ? "mx-auto" : ""}>{icon}</span>}
      {!sidebarMinimized && (
        <>
          <span className="truncate">{title}</span>
          {hasChildren && (
            <span className="ml-auto">
              {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </span>
          )}
          {label && (
            <span className="ml-auto text-xs font-medium bg-white/20 px-1.5 py-0.5 rounded">
              {label}
            </span>
          )}
        </>
      )}
    </div>
  );
  
  // Wrap with tooltip if sidebar is minimized
  const wrappedContent = sidebarMinimized ? (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          {href ? (
            <NavLink 
              to={href} 
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer" : undefined}
              onClick={handleClick}
              className={({ isActive }) => cn(
                "flex items-center gap-2 px-2 py-2 rounded-md text-sm",
                "transition-colors duration-200",
                isActive ? activeClass : hoverClass,
                disabled && "pointer-events-none opacity-60",
                "justify-center"
              )}
            >
              {icon}
            </NavLink>
          ) : (
            <button 
              onClick={handleClick}
              disabled={disabled}
              className="w-full"
            >
              {itemContent}
            </button>
          )}
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{title}</p>
          {label && (
            <span className="ml-1 text-xs font-medium bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">
              {label}
            </span>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    href ? (
      <NavLink 
        to={href} 
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        onClick={handleClick}
        className={({ isActive }) => cn(
          "flex items-center gap-2 px-3 py-2 rounded-md text-sm",
          "transition-colors duration-200",
          isActive ? activeClass : hoverClass,
          disabled && "pointer-events-none opacity-60"
        )}
      >
        {icon}
        <span className="truncate">{title}</span>
        {label && (
          <span className="ml-auto text-xs font-medium bg-white/20 px-1.5 py-0.5 rounded">
            {label}
          </span>
        )}
      </NavLink>
    ) : (
      <button 
        onClick={handleClick}
        disabled={disabled}
        className="w-full"
      >
        {itemContent}
      </button>
    )
  );
  
  return wrappedContent;
};

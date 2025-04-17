import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/contexts/AppContext';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
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
  isEventStep?: boolean; // Flag to indicate if this is an event creation step
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
  moduleName,
  isEventStep = false,
}) => {
  const location = useLocation();
  const {
    sidebarMinimized,
    activeRoute,
    setActiveRoute,
    hasPermission,
    eventStepStatuses, // Get event step statuses from AppContext
    isEditingEvent, // Flag to check if user is editing an event
  } = useAppContext();

  // Check if user has permission to view this item
  const canView = !moduleName || hasPermission(moduleName, 'view');

  // If user doesn't have permission, don't render the item
  if (!canView) return null;

  const hasChildren = children && children.length > 0;

  // Check if current path exactly matches this item's href
  const isExactPathMatch = href && location.pathname === href;

  // For event creation steps, check if the hash matches
  const isHashMatch =
    href &&
    href.includes('#') &&
    location.hash === href.substring(href.indexOf('#'));

  // Only consider "active" based on EXACT path matches, not partial ones
  // For event steps, we ONLY use hash-based activation
  const isActiveRoute = isEventStep ? isHashMatch : isExactPathMatch;

  // For parent items, check if any child is active
  const isChildActive =
    hasChildren &&
    children?.some((child) => {
      if (child.isEventStep) {
        // For event step children, only check hash match
        return (
          child.href &&
          location.hash === child.href.substring(child.href.indexOf('#'))
        );
      }
      // For regular children, check EXACT path match only
      return child.href && location.pathname === child.href;
    });

  // Combine active states
  const isActive = isActiveRoute || isChildActive;

  // Determine if this step is clickable based on the event context
  let isClickable = !disabled;

  // If this is an event creation step, check its clickable status
  if (isEventStep && href) {
    const stepId = href.split('#')[1] as keyof typeof eventStepStatuses;
    if (stepId && eventStepStatuses[stepId]) {
      isClickable = eventStepStatuses[stepId].isClickable || isEditingEvent;
    }
  }

  // Handle click events including updating active route
  const handleClick = () => {
    if (!isClickable) return;

    if (hasChildren && onToggleExpand) {
      onToggleExpand();
    }

    if (href) {
      // For event steps, only set the main route, let the hash be managed separately
      if (isEventStep && href.includes('#')) {
        const mainRoute = href.split('#')[0];
        setActiveRoute(mainRoute);
      } else {
        setActiveRoute(href);
      }
    }

    if (onClick) {
      onClick();
    }
  };

  // Classes for active and hover states
  const activeClass = 'bg-white/20 font-medium';
  const hoverClass = 'hover:bg-white/10';

  // The content of the item
  const itemContent = (
    <div
      className={cn(
        'flex items-center w-full gap-2 px-3 py-2 rounded-md text-sm',
        'transition-colors duration-200',
        isActive ? activeClass : hoverClass,
        !isClickable && 'pointer-events-none opacity-60',
        sidebarMinimized && 'justify-center px-2'
      )}
    >
      {icon && (
        <span
          className={cn(
            'flex items-center justify-center',
            sidebarMinimized && 'mx-auto'
          )}
        >
          {icon}
        </span>
      )}
      {!sidebarMinimized && (
        <>
          <span className='truncate'>{title}</span>
          {hasChildren && (
            <span className='ml-auto'>
              {expanded ? (
                <ChevronDown className='h-4 w-4' />
              ) : (
                <ChevronRight className='h-4 w-4' />
              )}
            </span>
          )}
          {label && (
            <span className='ml-auto text-xs font-medium bg-white/20 px-1.5 py-0.5 rounded'>
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
              target={external ? '_blank' : undefined}
              rel={external ? 'noreferrer' : undefined}
              onClick={handleClick}
              className={cn(
                'flex items-center justify-center gap-2 px-2 py-2 rounded-md text-sm',
                'transition-colors duration-200',
                isActive ? activeClass : hoverClass,
                !isClickable && 'pointer-events-none opacity-60'
              )}
            >
              {icon}
            </NavLink>
          ) : (
            <button
              onClick={handleClick}
              disabled={!isClickable}
              className='w-full flex items-center justify-center'
            >
              {itemContent}
            </button>
          )}
        </TooltipTrigger>
        <TooltipContent side='right'>
          <p>{title}</p>
          {label && (
            <span className='ml-1 text-xs font-medium bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded'>
              {label}
            </span>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : href ? (
    <NavLink
      to={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      onClick={handleClick}
      className={({ isActive: linkActive }) => {
        // For event steps, only use hash-based activation
        if (isEventStep) {
          const stepMatch =
            href &&
            href.includes('#') &&
            location.hash === href.substring(href.indexOf('#'));
          return cn(
            'flex items-center gap-2 px-3 py-2 rounded-md text-sm',
            'transition-colors duration-200',
            stepMatch ? activeClass : hoverClass,
            !isClickable && 'pointer-events-none opacity-60'
          );
        }

        // For regular items, use exact path match only
        return cn(
          'flex items-center gap-2 px-3 py-2 rounded-md text-sm',
          'transition-colors duration-200',
          linkActive && isExactPathMatch ? activeClass : hoverClass,
          !isClickable && 'pointer-events-none opacity-60'
        );
      }}
    >
      {icon && <span className='flex items-center justify-center'>{icon}</span>}
      <span className='truncate'>{title}</span>
      {label && (
        <span className='ml-auto text-xs font-medium bg-white/20 px-1.5 py-0.5 rounded'>
          {label}
        </span>
      )}
    </NavLink>
  ) : (
    <button onClick={handleClick} disabled={!isClickable} className='w-full'>
      {itemContent}
    </button>
  );

  return wrappedContent;
};

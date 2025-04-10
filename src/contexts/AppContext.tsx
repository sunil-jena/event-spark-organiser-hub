/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { EventCreationStep, StepStatus } from '@/components/events/CreateEventSidebar';

// Define the user permission types
export type ModulePermission = {
  moduleName: string;
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canCreate: boolean;
};

export type UserPermissions = {
  modules: ModulePermission[];
};

// Define the structure of our context state
interface AppContextState {
  // App-wide state
  sidebarMinimized: boolean;
  toggleSidebar: () => void;
  scrollToTop: () => void;
  activeRoute: string;
  setActiveRoute: (route: string) => void;
  
  // User permissions
  userPermissions: UserPermissions;
  setUserPermissions: (permissions: UserPermissions) => void;
  
  // Check if user has specific permission
  hasPermission: (moduleName: string, permissionType: 'view' | 'edit' | 'delete' | 'create') => boolean;
  
  // Event creation state
  eventStepStatuses: Record<EventCreationStep, StepStatus>;
  setEventStepStatuses: (statuses: Record<EventCreationStep, StepStatus>) => void;
  isEditingEvent: boolean;
  setIsEditingEvent: (isEditing: boolean) => void;
}

// Default permissions
const defaultPermissions: UserPermissions = {
  modules: [
    {
      moduleName: 'dashboard',
      canView: true,
      canEdit: true,
      canDelete: true,
      canCreate: true
    },
    {
      moduleName: 'events',
      canView: true,
      canEdit: true,
      canDelete: true,
      canCreate: true
    },
    {
      moduleName: 'tickets',
      canView: true,
      canEdit: true,
      canDelete: true,
      canCreate: true
    },
    {
      moduleName: 'orders',
      canView: true,
      canEdit: true,
      canDelete: false,
      canCreate: false
    }
  ]
};

// Default event step statuses
const defaultEventStepStatuses: Record<EventCreationStep, StepStatus> = {
  basicDetails: { status: 'current', isClickable: true },
  venues: { status: 'incomplete', isClickable: false },
  dates: { status: 'incomplete', isClickable: false },
  times: { status: 'incomplete', isClickable: false },
  tickets: { status: 'incomplete', isClickable: false },
  media: { status: 'incomplete', isClickable: false },
  additionalInfo: { status: 'incomplete', isClickable: false },
  review: { status: 'incomplete', isClickable: false },
};

// Create the context with a default value
const AppContext = createContext<AppContextState | undefined>(undefined);

// Create a provider component
export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const [activeRoute, setActiveRoute] = useState('/');
  const [userPermissions, setUserPermissions] = useState<UserPermissions>(defaultPermissions);
  const [eventStepStatuses, setEventStepStatuses] = useState<Record<EventCreationStep, StepStatus>>(defaultEventStepStatuses);
  const [isEditingEvent, setIsEditingEvent] = useState(false);

  // Function to toggle the sidebar
  const toggleSidebar = () => {
    setSidebarMinimized(prev => !prev);
  };

  // Function to scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Function to check if user has permission
  const hasPermission = (moduleName: string, permissionType: 'view' | 'edit' | 'delete' | 'create'): boolean => {
    const module = userPermissions.modules.find(m => m.moduleName === moduleName);
    if (!module) return false;
    
    switch (permissionType) {
      case 'view': return module.canView;
      case 'edit': return module.canEdit;
      case 'delete': return module.canDelete;
      case 'create': return module.canCreate;
      default: return false;
    }
  };

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    sidebarMinimized,
    toggleSidebar,
    scrollToTop,
    activeRoute,
    setActiveRoute,
    userPermissions,
    setUserPermissions,
    hasPermission,
    eventStepStatuses,
    setEventStepStatuses,
    isEditingEvent,
    setIsEditingEvent
  }), [sidebarMinimized, activeRoute, userPermissions, eventStepStatuses, isEditingEvent]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the app context
export const useAppContext = (): AppContextState => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};

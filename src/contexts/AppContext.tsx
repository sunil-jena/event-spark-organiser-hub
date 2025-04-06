
import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';

// Define the structure of our context state
interface AppContextState {
  // App-wide state
  sidebarMinimized: boolean;
  toggleSidebar: () => void;
  scrollToTop: () => void;
  activeRoute: string;
  setActiveRoute: (route: string) => void;
}

// Create the context with a default value
const AppContext = createContext<AppContextState | undefined>(undefined);

// Create a provider component
export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const [activeRoute, setActiveRoute] = useState('/');

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

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    sidebarMinimized,
    toggleSidebar,
    scrollToTop,
    activeRoute,
    setActiveRoute
  }), [sidebarMinimized, activeRoute]);

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

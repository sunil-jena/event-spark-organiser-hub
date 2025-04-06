
import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppContext } from '@/contexts/AppContext';
import Sidebar from './Sidebar';
import Header from './Header';
import { ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Layout = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const { 
    sidebarMinimized, 
    toggleSidebar, 
    scrollToTop, 
    setActiveRoute 
  } = useAppContext();
  
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [datePickerOpen, setDatePickerOpen] = React.useState(false);
  const [showScrollTop, setShowScrollTop] = React.useState(false);

  // Update active route on location change
  useEffect(() => {
    setActiveRoute(location.pathname);
  }, [location.pathname, setActiveRoute]);

  // Add scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSidebarOpen = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    // Close other elements when search is opened
    if (!searchOpen) {
      setNotificationsOpen(false);
      setDatePickerOpen(false);
    }
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    // Close other elements when notifications are opened
    if (!notificationsOpen) {
      setSearchOpen(false);
      setDatePickerOpen(false);
    }
  };

  const toggleDatePicker = () => {
    setDatePickerOpen(!datePickerOpen);
    // Close other elements when date picker is opened
    if (!datePickerOpen) {
      setSearchOpen(false);
      setNotificationsOpen(false);
    }
  };

  // Add escape key listener to close elements
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setNotificationsOpen(false);
        setDatePickerOpen(false);
        if (isMobile) {
          setSidebarOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleEscapeKey);
    return () => window.removeEventListener('keydown', handleEscapeKey);
  }, [isMobile]);

  // Calculate main content width based on sidebar state
  const mainContentStyle = {
    width: isMobile ? '100%' : sidebarMinimized ? 'calc(100% - 80px)' : 'calc(100% - 280px)',
    transition: 'margin-left 0.3s ease, width 0.3s ease',
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Sidebar
        isMobile={isMobile}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        minimized={sidebarMinimized}
        toggleMinimize={toggleSidebar}
      />

      <div
        className="flex flex-col flex-1 overflow-hidden h-screen"
        style={!isMobile ? mainContentStyle : undefined}
      >
        <Header
          onMenuClick={toggleSidebarOpen}
          minimized={sidebarMinimized}
          toggleMinimize={toggleSidebar}
          toggleSearch={toggleSearch}
          toggleNotifications={toggleNotifications}
          toggleDatePicker={toggleDatePicker}
          isSearchOpen={searchOpen}
          isNotificationsOpen={notificationsOpen}
          isDatePickerOpen={datePickerOpen}
        />

        <motion.main
          className="flex-1 overflow-y-auto p-4 md:p-6 bg-purple-50 bg-main-background"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
          
          {/* Scroll to top button */}
          <AnimatePresence>
            {showScrollTop && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-8 right-8 z-50"
              >
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full shadow-md"
                  onClick={scrollToTop}
                >
                  <ChevronUp className="h-5 w-5" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.main>
      </div>
    </div>
  );
};

export default Layout;

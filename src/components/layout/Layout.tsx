
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import Sidebar from './Sidebar';
import Header from './Header';
import { motion } from 'framer-motion';

const Layout = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMinimize = () => {
    setMinimized(!minimized);
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

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Sidebar
        isMobile={isMobile}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        minimized={minimized}
        toggleMinimize={toggleMinimize}
      />

      <div className="flex flex-col flex-1 overflow-hidden h-screen">
        <Header
          onMenuClick={toggleSidebar}
          minimized={minimized}
          toggleMinimize={toggleMinimize}
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
          <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none -z-10">
            <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-violet-100/30 to-transparent" />
            <div className="absolute top-0 right-0 w-1/3 h-72 bg-gradient-to-bl from-purple-100/20 to-transparent rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-1/4 h-48 bg-gradient-to-tr from-indigo-100/10 to-transparent rounded-tr-full" />
          </div>
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
};

export default Layout;

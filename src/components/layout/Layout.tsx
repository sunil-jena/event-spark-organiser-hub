
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [minimized, setMinimized] = useState(true);
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
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 ">
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

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-purple-50  bg-main-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
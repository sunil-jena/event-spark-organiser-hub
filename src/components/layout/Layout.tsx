
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMinimize = () => {
    setMinimized(!minimized);
  };

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
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-purple-50  bg-main-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

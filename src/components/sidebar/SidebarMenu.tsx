
import React from 'react';
import { cn } from '@/lib/utils';
import { SidebarList } from './SidebarList';
import { SidebarItemProps } from './SidebarItem';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppContext } from '@/contexts/AppContext';

interface SidebarMenuProps {
  mainItems: SidebarItemProps[];
  supportItems: SidebarItemProps[];
  className?: string;
}

export const SidebarMenu: React.FC<SidebarMenuProps> = ({
  mainItems,
  supportItems,
  className = ""
}) => {
  const { hasPermission, sidebarMinimized } = useAppContext();

  // Filter items based on permissions
  const filteredMainItems = mainItems.filter(item =>
    !item.moduleName || hasPermission(item.moduleName, 'view')
  );

  const filteredSupportItems = supportItems.filter(item =>
    !item.moduleName || hasPermission(item.moduleName, 'view')
  );

  return (
    <ScrollArea className="flex-1 h-full pr-2" type="auto" scrollHideDelay={400}>
      <div className={cn("space-y-6", className)}>
        <div>
          {!sidebarMinimized && (
            <h2 className="mb-2 px-4 text-xs font-semibold text-white/80">Main</h2>
          )}
          <SidebarList items={filteredMainItems} />
        </div>

        <div>
          {!sidebarMinimized && (
            <h2 className="mb-2 px-4 text-xs font-semibold text-white/80">Support</h2>
          )}
          <SidebarList items={filteredSupportItems} />
        </div>
      </div>
    </ScrollArea>
  );
};

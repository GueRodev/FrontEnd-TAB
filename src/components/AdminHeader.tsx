import React from 'react';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NotificationsPopover from './NotificationsPopover';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface AdminHeaderProps {
  title?: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ title }) => {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
      <SidebarTrigger className="-ml-2" />
      
      {title && (
        <h1 className="text-xl font-semibold text-foreground flex-1">
          {title}
        </h1>
      )}
      
      <div className="ml-auto flex items-center gap-2">
        <NotificationsPopover />
        <Button variant="ghost" size="icon" className="relative">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;

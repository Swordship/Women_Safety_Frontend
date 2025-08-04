
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Camera, 
  MapPin, 
  Bell, 
  Settings, 
  LogOut
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label, isActive }) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "hover:bg-accent hover:text-accent-foreground"
      )}
    >
      {icon}
      {label}
    </Link>
  );
};

export const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="hidden md:flex flex-col w-64 bg-card border-r shadow-sm h-screen sticky top-0">
      <div className="p-6">
        <h1 className="text-xl font-bold gradient-text">EmpowerHer Analytics</h1>
      </div>
      
      <div className="flex-1 px-3 py-2 space-y-1">
        <SidebarLink
          to="/dashboard"
          icon={<LayoutDashboard className="h-5 w-5" />}
          label="Dashboard"
          isActive={isActive('/dashboard')}
        />
        <SidebarLink
          to="/cameras"
          icon={<Camera className="h-5 w-5" />}
          label="Cameras"
          isActive={isActive('/cameras')}
        />
        <SidebarLink
          to="/safety-map"
          icon={<MapPin className="h-5 w-5" />}
          label="Safety Map"
          isActive={isActive('/safety-map')}
        />
        <SidebarLink
          to="/alerts"
          icon={<Bell className="h-5 w-5" />}
          label="Alerts"
          isActive={isActive('/alerts')}
        />
        <SidebarLink
          to="/settings"
          icon={<Settings className="h-5 w-5" />}
          label="Settings"
          isActive={isActive('/settings')}
        />
      </div>
      
      <div className="p-4 border-t">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-empowerher-danger hover:bg-empowerher-danger/10 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

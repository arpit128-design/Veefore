import React from 'react';
import ModernPureSidebar from './ModernPureSidebar';

interface PureLightLayoutProps {
  children: React.ReactNode;
}

const PureLightLayout: React.FC<PureLightLayoutProps> = ({ children }) => {
  return (
    <div 
      className="min-h-screen flex"
      style={{ backgroundColor: 'rgb(249, 250, 251)' }}
    >
      {/* Modern Pure Sidebar */}
      <ModernPureSidebar />
      
      {/* Main content area */}
      <div 
        className="flex-1 lg:ml-0 min-h-screen"
        style={{ backgroundColor: 'rgb(249, 250, 251)' }}
      >
        <div 
          className="h-screen overflow-y-auto"
          style={{ backgroundColor: 'rgb(249, 250, 251)' }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default PureLightLayout;
import React from 'react';
import PureLightSidebar from './PureLightSidebar';

interface PureLightLayoutProps {
  children: React.ReactNode;
}

const PureLightLayout: React.FC<PureLightLayoutProps> = ({ children }) => {
  return (
    <div 
      className="min-h-screen flex"
      style={{ backgroundColor: 'rgb(255, 255, 255)' }}
    >
      {/* Sidebar */}
      <PureLightSidebar />
      
      {/* Main content */}
      <div 
        className="flex-1 lg:ml-0"
        style={{ backgroundColor: 'rgb(255, 255, 255)' }}
      >
        <div 
          className="h-screen overflow-y-auto"
          style={{ backgroundColor: 'rgb(255, 255, 255)' }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default PureLightLayout;
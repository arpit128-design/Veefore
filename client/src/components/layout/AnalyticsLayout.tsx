import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { ProfessionalSidebar } from './ProfessionalSidebar';
import AnalyticsSidebar from './AnalyticsSidebar';
import { ProfessionalHeader } from './ProfessionalHeader';

interface AnalyticsLayoutProps {
  children: React.ReactNode;
}

const AnalyticsLayout: React.FC<AnalyticsLayoutProps> = ({ children }) => {
  const [location, navigate] = useLocation();
  const [showAnalyticsSidebar, setShowAnalyticsSidebar] = useState(true);

  const toggleToAnalytics = () => {
    setShowAnalyticsSidebar(true);
  };

  const backToMain = () => {
    setShowAnalyticsSidebar(false);
    navigate('/dashboard');
  };

  const handlePageChange = (page: string) => {
    navigate(page);
  };

  return (
    <div className="veefore-app-container bg-gray-50">
      <ProfessionalHeader />
      <div className="flex flex-1 overflow-hidden">
        {showAnalyticsSidebar ? (
          <AnalyticsSidebar 
            onBackToMain={backToMain} 
            currentPage={location}
            onPageChange={handlePageChange}
          />
        ) : (
          <ProfessionalSidebar onAnalyticsToggle={toggleToAnalytics} />
        )}
        <main className="veefore-main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AnalyticsLayout;
import React, { useState } from 'react';
import { ProfessionalSidebar } from './ProfessionalSidebar';
import AnalyticsSidebar from './AnalyticsSidebar';
import { ProfessionalHeader } from './ProfessionalHeader';
import Analytics from '@/pages/Analytics';

interface AnalyticsLayoutProps {
  children: React.ReactNode;
}

const AnalyticsLayout: React.FC<AnalyticsLayoutProps> = ({ children }) => {
  const [showAnalyticsSidebar, setShowAnalyticsSidebar] = useState(true);
  const [currentPage, setCurrentPage] = useState('overview');

  const toggleToAnalytics = () => {
    setShowAnalyticsSidebar(true);
  };

  const backToMain = () => {
    setShowAnalyticsSidebar(false);
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfessionalHeader />
      <div className="flex">
        {showAnalyticsSidebar ? (
          <AnalyticsSidebar 
            onBackToMain={backToMain} 
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        ) : (
          <ProfessionalSidebar onAnalyticsToggle={toggleToAnalytics} />
        )}
        <main className="flex-1">
          {showAnalyticsSidebar ? (
            <Analytics currentPage={currentPage} onPageChange={handlePageChange} />
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
};

export default AnalyticsLayout;
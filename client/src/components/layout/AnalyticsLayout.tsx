import React, { useState } from 'react';
import { ProfessionalSidebar } from './ProfessionalSidebar';
import AnalyticsSidebar from './AnalyticsSidebar';
import { ProfessionalHeader } from './ProfessionalHeader';

interface AnalyticsLayoutProps {
  children: React.ReactNode;
}

const AnalyticsLayout: React.FC<AnalyticsLayoutProps> = ({ children }) => {
  const [showAnalyticsSidebar, setShowAnalyticsSidebar] = useState(true);

  const toggleToAnalytics = () => {
    setShowAnalyticsSidebar(true);
  };

  const backToMain = () => {
    setShowAnalyticsSidebar(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfessionalHeader />
      <div className="flex">
        {showAnalyticsSidebar ? (
          <AnalyticsSidebar onBackToMain={backToMain} />
        ) : (
          <ProfessionalSidebar onAnalyticsToggle={toggleToAnalytics} />
        )}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AnalyticsLayout;
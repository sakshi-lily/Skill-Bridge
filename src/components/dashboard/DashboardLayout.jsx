import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

export default function DashboardLayout({ 
  children, 
  title = "Overview", 
  breadcrumb = "Dashboard / Overview" 
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#121711] text-slate-800 dark:text-slate-100 transition-colors duration-200">
      
      {/* Fixed Sidebar Navigation */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Content Layout with Left Offset for Fixed Sidebar */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        
        {/* Fixed Top Navbar */}
        <TopNavbar 
          onOpenSidebar={() => setSidebarOpen(true)}
          title={title}
          breadcrumb={breadcrumb}
        />

        {/* Scrollable Main Area with Proper Vertical Spacing Below Fixed Navbar */}
        <main className="flex-1 w-full pt-20 sm:pt-24 lg:pt-[104px] pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>

      </div>

    </div>
  );
}

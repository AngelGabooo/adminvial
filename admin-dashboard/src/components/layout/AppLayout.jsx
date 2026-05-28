import { useState } from 'react';
import { Sidebar } from '../common/Sidebar';
import { Menu } from 'lucide-react';

export const AppLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="lg:ml-64">
        {children}
      </div>
    </div>
  );
};
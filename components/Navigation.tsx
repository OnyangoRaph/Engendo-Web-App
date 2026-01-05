
import React from 'react';
import { AppTab } from '../types';

interface NavProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

const Navigation: React.FC<NavProps> = ({ activeTab, setActiveTab }) => {
  // Removed Budget tab as it's now integrated into Planner
  const navItems = [
    { id: AppTab.DASHBOARD, label: 'Home' },
    { id: AppTab.PLANNER, label: 'Plan' },
    { id: AppTab.NEARBY, label: 'Explore' },
    { id: AppTab.SOCIAL, label: 'Social' },
    { id: AppTab.RACE, label: 'Race' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 z-50 py-3 flex justify-center gap-[20px] md:top-0 md:bottom-auto md:border-b md:border-t-0">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`flex flex-col items-center px-2 py-1 rounded-lg transition-all ${
            activeTab === item.id 
              ? 'text-blue-600' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <span className={`text-[11px] font-bold uppercase tracking-widest ${
            activeTab === item.id ? 'opacity-100' : 'opacity-70'
          }`}>
            {item.label}
          </span>
          {activeTab === item.id && (
            <div className="w-1 h-1 bg-blue-600 rounded-full mt-1 animate-pulse"></div>
          )}
        </button>
      ))}
    </nav>
  );
};

export default Navigation;

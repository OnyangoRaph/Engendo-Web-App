
import React, { useState } from 'react';
import { AppTab } from './types';
import Navigation from './components/Navigation';
import PlannerModule from './components/PlannerModule';
import SocialModule from './components/SocialModule';
import RaceModule from './components/RaceModule';
import NearbyModule from './components/NearbyModule';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.DASHBOARD:
        return (
          <div className="p-6 space-y-8 animate-in fade-in duration-700">
            <header className="space-y-2">
              <h1 className="text-4xl font-black text-slate-900">Hey Explorer! 👋</h1>
              <p className="text-slate-500 font-medium">Ready for your next adventure?</p>
            </header>

            <div className="grid grid-cols-2 gap-4">
              <div 
                onClick={() => setActiveTab(AppTab.PLANNER)}
                className="bg-blue-600 p-6 rounded-3xl text-white shadow-xl shadow-blue-200 cursor-pointer hover:scale-[1.02] transition-transform"
              >
                <span className="text-3xl">🗺️</span>
                <h3 className="font-bold mt-4">Plan New Trip</h3>
                <p className="text-blue-100 text-xs mt-1">AI-powered itinerary</p>
              </div>
              <div 
                onClick={() => setActiveTab(AppTab.NEARBY)}
                className="bg-white p-6 rounded-3xl text-slate-900 border border-slate-100 shadow-sm cursor-pointer hover:scale-[1.02] transition-transform"
              >
                <span className="text-3xl">📍</span>
                <h3 className="font-bold mt-4">Near Me</h3>
                <p className="text-slate-500 text-xs mt-1">Find local gems</p>
              </div>
            </div>

            <section className="space-y-4">
              <h2 className="text-xl font-bold flex justify-between items-center">
                <span>Current Race</span>
                <span className="text-blue-600 text-sm">Live</span>
              </h2>
              <div 
                onClick={() => setActiveTab(AppTab.RACE)}
                className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <div className="relative">
                  <img src="https://picsum.photos/seed/me/100" className="w-12 h-12 rounded-full border-2 border-blue-500" alt="Me" />
                  <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1">
                  <p className="font-bold">Race to San Francisco</p>
                  <p className="text-xs text-slate-500">2 friends trailing • 15km left</p>
                </div>
                <span className="text-xl">🏁</span>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold">Popular Communities</h2>
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {[
                  { name: 'Tokyo Explorers', img: 'https://picsum.photos/seed/tokyo/300/200' },
                  { name: 'Swiss Alps Hiking', img: 'https://picsum.photos/seed/alps/300/200' },
                  { name: 'London Foodies', img: 'https://picsum.photos/seed/london/300/200' },
                ].map((club, idx) => (
                  <div key={idx} className="min-w-[200px] bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
                    <img src={club.img} className="h-24 w-full object-cover" alt={club.name} />
                    <div className="p-4">
                      <p className="font-bold text-sm">{club.name}</p>
                      <button className="text-blue-600 text-xs font-bold mt-2">Join Club</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        );
      case AppTab.PLANNER:
        return <PlannerModule />;
      case AppTab.SOCIAL:
        return <SocialModule />;
      case AppTab.RACE:
        return <RaceModule />;
      case AppTab.NEARBY:
        return <NearbyModule />;
      default:
        return <div>Not found</div>;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 pb-20 md:pb-0 md:pt-16">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="pb-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;

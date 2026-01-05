
import React, { useState } from 'react';
import { SocialGroup } from '../types';

const SocialModule: React.FC = () => {
  const [groups, setGroups] = useState<SocialGroup[]>([
    { id: '1', name: 'Swiss Alps Hiking 2024', members: 243, destination: 'Switzerland', type: 'nature' },
    { id: '2', name: 'Tokyo Foodie Crawl', members: 1205, destination: 'Tokyo, Japan', type: 'city' },
    { id: '3', name: 'West Coast Road Trip', members: 56, destination: 'California, USA', type: 'roadtrip' },
    { id: '4', name: 'Icelandic Aurora Chasers', members: 89, destination: 'Reykjavik', type: 'nature' },
  ]);

  const toggleJoin = (id: string) => {
    setGroups(prev => prev.map(g => g.id === id ? { ...g, isJoined: !g.isJoined } : g));
  };

  return (
    <div className="p-6 space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Groups & Clubs 👥</h2>
        <button className="text-blue-600 font-bold text-sm">+ Create</button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {groups.map(group => (
          <div key={group.id} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${
              group.type === 'nature' ? 'bg-green-100' : 
              group.type === 'roadtrip' ? 'bg-orange-100' : 'bg-purple-100'
            }`}>
              {group.type === 'nature' ? '🌲' : group.type === 'roadtrip' ? '🚗' : '🌆'}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900">{group.name}</h3>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-tight">{group.destination} • {group.members} Members</p>
            </div>
            <button 
              onClick={() => toggleJoin(group.id)}
              className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${
                group.isJoined 
                  ? 'bg-slate-100 text-slate-600' 
                  : 'bg-blue-600 text-white shadow-md shadow-blue-100'
              }`}
            >
              {group.isJoined ? 'Joined' : 'Join'}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-4">
        <h3 className="text-xl font-bold">Planning a similar trip?</h3>
        <p className="text-slate-400 text-sm">Join groups of people heading to the same area at the same time to share tips, carpool, or race!</p>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search by destination" 
            className="w-full bg-slate-800 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default SocialModule;

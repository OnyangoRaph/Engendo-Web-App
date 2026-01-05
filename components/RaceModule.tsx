
import React, { useState, useEffect } from 'react';
import { FriendPosition } from '../types';

const RaceModule: React.FC = () => {
  const [friends, setFriends] = useState<FriendPosition[]>([
    { id: '1', name: 'Alex', distanceToTarget: 12.5, status: 'moving', avatar: 'https://picsum.photos/seed/alex/100' },
    { id: '2', name: 'Sarah', distanceToTarget: 8.2, status: 'moving', avatar: 'https://picsum.photos/seed/sarah/100' },
    { id: '3', name: 'James', distanceToTarget: 0, status: 'arrived', avatar: 'https://picsum.photos/seed/james/100' },
  ]);

  const [userDistance, setUserDistance] = useState(15.0);

  // Simulate movement
  useEffect(() => {
    const interval = setInterval(() => {
      setFriends(prev => prev.map(f => ({
        ...f,
        distanceToTarget: Math.max(0, f.distanceToTarget - (Math.random() * 0.5)),
        status: f.distanceToTarget <= 0 ? 'arrived' : 'moving'
      })));
      setUserDistance(prev => Math.max(0, prev - (Math.random() * 0.4)));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const sortedRace = [...friends, { id: 'me', name: 'You', distanceToTarget: userDistance, status: userDistance <= 0 ? 'arrived' : 'moving', avatar: 'https://picsum.photos/seed/me/100' } as FriendPosition]
    .sort((a, b) => a.distanceToTarget - b.distanceToTarget);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Race to the Hotel 🏁</h2>
        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold">Live Tracking</span>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-8">
        {sortedRace.map((participant, index) => (
          <div key={participant.id} className="relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="relative">
                   <img src={participant.avatar} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt={participant.name} />
                   <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${participant.status === 'arrived' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                </div>
                <span className={`font-semibold ${participant.id === 'me' ? 'text-blue-600' : 'text-slate-700'}`}>
                  {participant.name} {participant.id === 'me' && '(You)'}
                </span>
              </div>
              <span className="text-sm font-mono text-slate-500">
                {participant.status === 'arrived' ? 'ARRIVED!' : `${participant.distanceToTarget.toFixed(2)} km to go`}
              </span>
            </div>
            
            {/* Progress Bar Container */}
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden flex items-center">
              <div 
                className={`h-full transition-all duration-1000 ease-out ${participant.id === 'me' ? 'bg-blue-500' : 'bg-slate-400'}`}
                style={{ width: `${Math.max(0, 100 - (participant.distanceToTarget * 5))}%` }}
              ></div>
            </div>
            
            <div className="absolute -top-6 right-0 text-xs font-bold text-slate-300">
              {index + 1}{index === 0 ? 'st' : index === 1 ? 'nd' : index === 2 ? 'rd' : 'th'} Place
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-600 text-white p-6 rounded-3xl shadow-lg shadow-blue-200">
        <h3 className="text-lg font-bold mb-2">Road Trip Challenge</h3>
        <p className="text-blue-100 text-sm mb-4">You're currently in {sortedRace.findIndex(p => p.id === 'me') + 1} place! Speed up (safely) or find a shortcut to beat Sarah.</p>
        <button className="w-full bg-white text-blue-600 py-3 rounded-2xl font-bold hover:bg-blue-50 transition-colors">
          Share My ETA
        </button>
      </div>
    </div>
  );
};

export default RaceModule;

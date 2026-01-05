
import React, { useState } from 'react';
import { generateTripPlan, estimateBudget } from '../services/geminiService';
import { TripPlan, BudgetEstimate } from '../types';

const PlannerModule: React.FC = () => {
  const [destination, setDestination] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [duration, setDuration] = useState('3 days');
  const [travelers, setTravelers] = useState(1);
  const [budgetStyle, setBudgetStyle] = useState('Moderate');
  const [friendInput, setFriendInput] = useState('');
  const [invitedFriends, setInvitedFriends] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<TripPlan | null>(null);
  const [budget, setBudget] = useState<BudgetEstimate | null>(null);

  const handleInterestToggle = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const addFriend = () => {
    if (friendInput.trim() && !invitedFriends.includes(friendInput)) {
      setInvitedFriends([...invitedFriends, friendInput.trim()]);
      setFriendInput('');
    }
  };

  const removeFriend = (name: string) => {
    setInvitedFriends(invitedFriends.filter(f => f !== name));
  };

  const handleGenerate = async () => {
    if (!destination) return;
    setLoading(true);
    try {
      // Run both AI requests in parallel for better performance
      const [planResult, budgetResult] = await Promise.all([
        generateTripPlan(destination, interests, duration),
        estimateBudget(destination, travelers, budgetStyle)
      ]);
      setPlan(planResult);
      setBudget(budgetResult);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const commonInterests = ['Food', 'Nature', 'Art', 'History', 'Shopping', 'Adventure'];

  if (plan && budget) {
    return (
      <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
        <header className="space-y-2">
          <button 
            onClick={() => { setPlan(null); setBudget(null); }}
            className="text-blue-600 text-sm font-bold flex items-center gap-1 mb-4"
          >
            ← Back to Planner
          </button>
          <h2 className="text-3xl font-black text-slate-900">{plan.destination}</h2>
          <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <span className="bg-slate-100 px-2 py-1 rounded">{duration}</span>
            <span className="bg-slate-100 px-2 py-1 rounded">{travelers} {travelers === 1 ? 'Traveler' : 'Travelers'}</span>
            <span className="bg-slate-100 px-2 py-1 rounded">{budgetStyle} Budget</span>
          </div>
        </header>

        {/* Travel Crew Section */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
          <h3 className="text-lg font-bold flex justify-between items-center">
            <span>Travel Crew</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{invitedFriends.length + 1} Going</span>
          </h3>
          <div className="flex flex-wrap gap-3">
            <div className="flex flex-col items-center gap-1">
              <img src="https://picsum.photos/seed/me/100" className="w-12 h-12 rounded-full border-2 border-blue-500 p-0.5" alt="You" />
              <span className="text-[10px] font-bold text-slate-400">You</span>
            </div>
            {invitedFriends.map((friend, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1 group relative">
                <img src={`https://picsum.photos/seed/${friend}/100`} className="w-12 h-12 rounded-full border-2 border-slate-100 p-0.5" alt={friend} />
                <span className="text-[10px] font-bold text-slate-400 truncate w-12 text-center">{friend}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Budget Summary Section */}
        <section className="bg-blue-600 rounded-3xl p-6 shadow-lg shadow-blue-100 text-white space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-blue-100 text-sm font-medium">Estimated Total</p>
              <p className="text-4xl font-black">${budget.total}</p>
            </div>
            <div className="text-right text-xs text-blue-100">
              <p>Style: {budgetStyle}</p>
              <p>Per person: ~${Math.round(budget.total / travelers)}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blue-500/30">
            {Object.entries(budget.breakdown).slice(0, 4).map(([key, val]) => (
              <div key={key}>
                <p className="text-[10px] uppercase font-bold text-blue-200">{key}</p>
                <p className="font-bold">${val}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Itinerary Section */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-6">
          <h3 className="text-xl font-bold">Daily Itinerary</h3>
          <div className="space-y-8">
            {plan.itinerary.map((day) => (
              <div key={day.day} className="relative pl-6 border-l-2 border-slate-100 last:border-l-0">
                <div className="absolute -left-2.5 top-0 w-5 h-5 bg-blue-500 rounded-full border-4 border-white shadow-sm"></div>
                <h4 className="font-bold text-lg mb-3">Day {day.day}</h4>
                <div className="space-y-3">
                  {day.schedule.map((task, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-2xl text-sm text-slate-600 border border-slate-100">
                      {task}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-xl">
          Confirm and Book Trip
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 pb-24">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-slate-900">Plan your adventure 🌍</h2>
        
        <div className="space-y-6 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          {/* Destination */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-400">Where to?</label>
            <div className="relative">
              <input
                type="text"
                placeholder="City or Country"
                className="w-full p-3 pl-10 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all border-none"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2">📍</span>
            </div>
          </div>

          {/* Group & Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-400">Duration</label>
              <select 
                value={duration} 
                onChange={(e) => setDuration(e.target.value)}
                className="w-full p-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 border-none"
              >
                <option>2 days</option>
                <option>3 days</option>
                <option>5 days</option>
                <option>1 week</option>
                <option>2 weeks</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-400">Travelers</label>
              <input
                type="number"
                min="1"
                value={travelers}
                onChange={(e) => setTravelers(parseInt(e.target.value) || 1)}
                className="w-full p-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 border-none"
              />
            </div>
          </div>

          {/* Budget Style */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-400">Budget Style</label>
            <div className="flex gap-2">
              {['Backpacker', 'Moderate', 'Luxury'].map(style => (
                <button
                  key={style}
                  onClick={() => setBudgetStyle(style)}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                    budgetStyle === style 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100' 
                    : 'bg-white text-slate-500 border-slate-200'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Invite Friends */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-400">Invite Friends</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Name or email"
                className="flex-1 p-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 border-none"
                value={friendInput}
                onChange={(e) => setFriendInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addFriend()}
              />
              <button 
                onClick={addFriend}
                className="bg-slate-100 px-4 rounded-xl font-bold text-slate-600"
              >
                +
              </button>
            </div>
            {invitedFriends.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {invitedFriends.map(friend => (
                  <span key={friend} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                    {friend}
                    <button onClick={() => removeFriend(friend)} className="text-blue-300 hover:text-blue-500">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Interests */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase text-slate-400 px-1">Interests</label>
          <div className="flex flex-wrap gap-2">
            {commonInterests.map(interest => (
              <button
                key={interest}
                onClick={() => handleInterestToggle(interest)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  interests.includes(interest) 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !destination}
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:bg-slate-300 disabled:shadow-none transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Architecting your trip...
            </>
          ) : 'Generate Full Trip Plan'}
        </button>
      </div>
    </div>
  );
};

export default PlannerModule;


import React, { useState } from 'react';
import { estimateBudget } from '../services/geminiService';
import { BudgetEstimate } from '../types';

const BudgetModule: React.FC = () => {
  const [destination, setDestination] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [style, setStyle] = useState('Moderate');
  const [loading, setLoading] = useState(false);
  const [budget, setBudget] = useState<BudgetEstimate | null>(null);
  const [userBudget, setUserBudget] = useState(2000);

  const handleEstimate = async () => {
    if (!destination) return;
    setLoading(true);
    try {
      const result = await estimateBudget(destination, travelers, style);
      setBudget(result);
      if (result.total) setUserBudget(result.total);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-8 pb-24">
      <h2 className="text-2xl font-bold">Smart Budgeting 💵</h2>
      
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-500 mb-1">Destination</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500"
            placeholder="Where are you going?"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-500 mb-1">Travelers</label>
            <input
              type="number"
              value={travelers}
              onChange={(e) => setTravelers(parseInt(e.target.value))}
              className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-500 mb-1">Style</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Backpacker</option>
              <option>Moderate</option>
              <option>Luxury</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleEstimate}
          disabled={loading || !destination}
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all"
        >
          {loading ? 'Calculating...' : 'Get AI Estimate'}
        </button>
      </div>

      {budget && (
        <div className="space-y-6">
          <div className="text-center">
            <span className="text-slate-500 text-sm font-medium">Your Desired Budget</span>
            <div className="text-4xl font-black text-slate-900 mt-1">${userBudget}</div>
            <input 
              type="range" 
              min="100" 
              max="10000" 
              step="100"
              value={userBudget}
              onChange={(e) => setUserBudget(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer mt-4 accent-blue-600"
            />
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="font-bold mb-4 flex justify-between">
              <span>AI Estimated Breakdown</span>
              <span className="text-blue-600">${budget.total}</span>
            </h3>
            <div className="space-y-4">
              {/* Fix: Explicitly cast breakdown value to number to avoid arithmetic error on progress bar calculation */}
              {Object.entries(budget.breakdown).map(([key, val]) => (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize text-slate-600">{key}</span>
                    <span className="font-bold">${val}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-400 rounded-full"
                      style={{ width: `${(Number(val) / budget.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            {userBudget < budget.total && (
              <div className="mt-6 p-4 bg-orange-50 border border-orange-100 rounded-2xl flex gap-3">
                <span className="text-xl">⚠️</span>
                <p className="text-sm text-orange-800">
                  Your desired budget is ${budget.total - userBudget} lower than the estimate. 
                  Try adjusting your style or reducing travel days.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetModule;

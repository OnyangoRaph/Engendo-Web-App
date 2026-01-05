
import React, { useState, useEffect } from 'react';
import { findNearbyPlaces } from '../services/geminiService';

const NearbyModule: React.FC = () => {
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [results, setResults] = useState<{text: string, sources: any[]} | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => setLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
        () => setError("Could not access location. Please enable permissions.")
      );
    }
  }, []);

  const handleSearch = async () => {
    if (!location) return;
    setLoading(true);
    try {
      const res = await findNearbyPlaces(location.lat, location.lng, ['Food', 'Hidden Gems', 'Parks']);
      setResults(res);
    } catch (e) {
      setError("Failed to fetch nearby places.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 pb-24">
      <h2 className="text-2xl font-bold">Nearby Hidden Gems 💎</h2>
      
      {!location && !error && (
        <div className="p-8 text-center text-slate-500">Getting your location...</div>
      )}
      
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm">{error}</div>
      )}

      {location && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center space-y-4">
            <div className="text-4xl">📍</div>
            <div>
              <p className="text-slate-500 text-sm">Searching around you in</p>
              <p className="font-bold">Current Location</p>
            </div>
            <button 
              onClick={handleSearch}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all disabled:bg-slate-300"
            >
              {loading ? "Searching..." : "Explore My Surroundings"}
            </button>
          </div>

          {results && (
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 prose prose-sm max-w-none">
                <h3 className="font-bold mb-2">AI Suggestions</h3>
                <div className="whitespace-pre-wrap text-slate-600 text-sm leading-relaxed">
                  {results.text}
                </div>
              </div>

              {results.sources.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Map References</h4>
                  {results.sources.map((source, i) => (
                    <a 
                      key={i} 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-blue-300 transition-all group"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-800">{source.title || "View on Maps"}</span>
                        <span className="text-blue-500 group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NearbyModule;

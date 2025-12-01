import React, { useMemo } from 'react';
import { MenuItem, UserPreferences, ScoredMenuItem, CourseType } from '../types';
import { calculateRecommendations } from '../utils/recommendationEngine';

interface ResultsProps {
  menuItems: MenuItem[];
  preferences: UserPreferences;
  onRestart: () => void;
}

const Results: React.FC<ResultsProps> = ({ menuItems, preferences, onRestart }) => {
  const recommendations = useMemo(() => {
    return calculateRecommendations(menuItems, preferences);
  }, [menuItems, preferences]);

  const topPicks = useMemo(() => {
    // Attempt to pick one Starter, one Main, one Dessert
    const starter = recommendations.find(i => i.tags.course === CourseType.STARTER);
    const main = recommendations.find(i => i.tags.course === CourseType.MAIN);
    const dessert = recommendations.find(i => i.tags.course === CourseType.DESSERT);

    const selection: ScoredMenuItem[] = [];
    
    // Add in order of a typical meal
    if (starter) selection.push(starter);
    if (main) selection.push(main);
    if (dessert) selection.push(dessert);

    // If we have fewer than 3 items (e.g. menu lacks desserts), fill with next best available items
    const selectedIds = new Set(selection.map(s => s.id));
    
    for (const item of recommendations) {
      if (selection.length >= 3) break;
      if (!selectedIds.has(item.id)) {
        selection.push(item);
        selectedIds.add(item.id);
      }
    }
    
    return selection;
  }, [recommendations]);

  const otherOptions = useMemo(() => {
    const topIds = new Set(topPicks.map(p => p.id));
    return recommendations.filter(i => !topIds.has(i.id)).slice(0, 5); // Take next 5 best matches
  }, [recommendations, topPicks]);

  return (
    <div className="max-w-2xl mx-auto w-full pb-24">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Bon Appétit! 🍽️</h2>
        <p className="text-slate-600">Here are the best dishes for you based on your taste.</p>
      </div>

      <h3 className="text-xl font-bold text-brand-800 mb-4 flex items-center">
        <span className="mr-2">🏆</span> Top Recommendations
      </h3>

      <div className="space-y-6 mb-10">
        {topPicks.map((item, index) => (
          <div key={item.id} className="bg-white rounded-2xl shadow-lg border border-brand-100 overflow-hidden transform transition hover:-translate-y-1 duration-300">
            <div className="bg-brand-500 text-white text-xs font-bold px-3 py-1 inline-block rounded-br-lg">
              #{index + 1} Recommendation
            </div>
            <div className="p-6 pt-2">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-xl font-bold text-slate-900">{item.name}</h4>
                <span className="text-lg font-bold text-brand-600">{item.price}</span>
              </div>
              <p className="text-slate-600 mb-4">{item.description}</p>
              
              {item.matchReason && (
                <div className="bg-brand-50 rounded-lg p-3 border border-brand-100">
                   <p className="text-sm text-brand-800 flex items-start">
                     <svg className="w-5 h-5 mr-2 flex-shrink-0 text-brand-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
                     <span className="font-medium">{item.matchReason}</span>
                   </p>
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                 <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md capitalize">{item.tags.course}</span>
                 {item.tags.spiciness !== 'none' && <span className="px-2 py-1 bg-red-50 text-red-600 text-xs rounded-md capitalize">🌶️ {item.tags.spiciness}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {otherOptions.length > 0 && (
        <>
          <h3 className="text-lg font-bold text-slate-800 mb-4">Other Good Options</h3>
          <div className="grid grid-cols-1 gap-4 mb-8">
            {otherOptions.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm opacity-90">
                 <div className="flex justify-between">
                    <h4 className="font-semibold text-slate-800">{item.name}</h4>
                    <span className="text-slate-500 text-sm">{item.price}</span>
                 </div>
                 <p className="text-xs text-slate-500 mt-1 line-clamp-1">{item.description}</p>
                 {item.tags.course && (
                   <span className="text-xs text-brand-600 mt-1 inline-block capitalize font-medium">
                     {item.tags.course}
                   </span>
                 )}
              </div>
            ))}
          </div>
        </>
      )}

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-200 flex justify-center z-10">
        <button 
          onClick={onRestart}
          className="px-6 py-3 bg-slate-900 text-white font-medium rounded-full shadow-lg hover:bg-slate-800 transition-colors"
        >
          Start Over with New Menu
        </button>
      </div>
    </div>
  );
};

export default Results;
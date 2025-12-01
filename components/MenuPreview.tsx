import React from 'react';
import { MenuItem } from '../types';

interface MenuPreviewProps {
  items: MenuItem[];
  onConfirm: () => void;
  onRetry: () => void;
}

const MenuPreview: React.FC<MenuPreviewProps> = ({ items, onConfirm, onRetry }) => {
  return (
    <div className="max-w-2xl mx-auto w-full pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Menu Ready!</h2>
          <p className="text-sm text-slate-500">We found {items.length} dishes. Please verify below.</p>
        </div>
        <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full border border-green-200">
          ✓ Parsed
        </span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        <div className="max-h-[60vh] overflow-y-auto divide-y divide-slate-100">
          {items.map((item) => (
            <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors group">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-slate-900 group-hover:text-brand-700 transition-colors">{item.name}</h3>
                <span className="text-slate-600 font-medium text-sm whitespace-nowrap ml-2">{item.price}</span>
              </div>
              <p className="text-slate-500 text-sm mb-2 line-clamp-2 leading-relaxed">{item.description}</p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 capitalize border border-slate-200">
                  {item.tags.course}
                </span>
                {item.tags.spiciness !== 'none' && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700 capitalize border border-red-100">
                    🌶️ {item.tags.spiciness}
                  </span>
                )}
                {item.tags.dietary.map((tag, idx) => (
                  <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 capitalize border border-green-100">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
        <div className="max-w-2xl mx-auto flex gap-4">
            <button
                onClick={onRetry}
                className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
                Wrong Menu? Retry
            </button>
            <button
                onClick={onConfirm}
                className="flex-[2] px-4 py-3 bg-brand-600 rounded-xl text-white font-bold hover:bg-brand-700 transition-all shadow-lg hover:shadow-brand-500/30 active:scale-[0.98]"
            >
                See My Top Picks →
            </button>
        </div>
      </div>
    </div>
  );
};

export default MenuPreview;
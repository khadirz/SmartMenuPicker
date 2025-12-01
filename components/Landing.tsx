import React from 'react';

interface LandingProps {
  onStart: () => void;
}

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 text-center">
      {/* Hero Image - Transparent Layered Dish Illustration */}
      <div className="mb-10 relative w-64 h-64 sm:w-80 sm:h-80 animate-in fade-in zoom-in duration-700">
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="glass" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="bowlGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f8fafc" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          
          {/* Background decoration */}
          <circle cx="100" cy="110" r="90" fill="rgba(251, 146, 60, 0.1)" />
          <circle cx="100" cy="110" r="75" fill="rgba(251, 146, 60, 0.15)" />

          {/* Bowl Back */}
          <path d="M30 110 Q100 180 170 110" fill="url(#bowlGradient)" stroke="#cbd5e1" strokeWidth="1" />
          
          {/* Food Content - Stacked with transparency */}
          {/* Greens */}
          <path d="M50 110 Q40 70 80 80 T120 70 T150 100" fill="rgba(134, 239, 172, 0.9)" stroke="#4ade80" strokeWidth="1" />
          <path d="M40 100 Q30 60 70 70 T110 50 T140 90" fill="rgba(74, 222, 128, 0.85)" stroke="#22c55e" strokeWidth="1" />
          
          {/* Meat/Protein */}
          <ellipse cx="100" cy="85" rx="30" ry="20" fill="rgba(252, 165, 165, 0.9)" transform="rotate(-10 100 85)" />
          <path d="M80 85 Q100 75 120 85" stroke="rgba(239, 68, 68, 0.4)" strokeWidth="2" fill="none" transform="rotate(-10 100 85)" />
          
          {/* Garnish / Toppings */}
          <circle cx="80" cy="70" r="8" fill="rgba(239, 68, 68, 0.9)" />
          <circle cx="115" cy="65" r="8" fill="rgba(250, 204, 21, 0.9)" />
          <path d="M90 60 L100 50 L110 60" stroke="#16a34a" strokeWidth="3" fill="none" strokeLinecap="round" />

          {/* Bowl Front (Glassy effect) */}
          <path d="M30 110 Q100 170 170 110" fill="rgba(255, 255, 255, 0.3)" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
          <path d="M35 115 Q100 165 165 115" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>

      <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight drop-shadow-sm">
        Smart Menu Picker
      </h1>
      <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mb-12 leading-relaxed">
        Let AI handle the menu anxiety. <br className="hidden md:block"/>
        We find the best dishes for your taste.
      </p>
      
      <button 
        onClick={onStart}
        className="group relative inline-flex items-center justify-center px-12 py-6 text-xl font-bold text-white transition-all duration-200 bg-brand-600 rounded-full hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-500/50 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
      >
        <span>Get Started</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 ml-3 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-5xl">
        <div className="flex flex-col items-center p-6 bg-white/50 backdrop-blur-sm rounded-3xl shadow-sm border border-slate-100">
          <span className="text-5xl mb-4 transform hover:scale-110 transition-transform cursor-default">📸</span>
          <span className="text-xl font-bold text-slate-900">1. Snap Menu</span>
          <span className="text-base text-slate-600 mt-2">Upload a photo or paste a link</span>
        </div>
        <div className="flex flex-col items-center p-6 bg-white/50 backdrop-blur-sm rounded-3xl shadow-sm border border-slate-100">
          <span className="text-5xl mb-4 transform hover:scale-110 transition-transform cursor-default">🧠</span>
          <span className="text-xl font-bold text-slate-900">2. Quick Quiz</span>
          <span className="text-base text-slate-600 mt-2">Tell us what you're craving</span>
        </div>
        <div className="flex flex-col items-center p-6 bg-white/50 backdrop-blur-sm rounded-3xl shadow-sm border border-slate-100">
          <span className="text-5xl mb-4 transform hover:scale-110 transition-transform cursor-default">🍽️</span>
          <span className="text-xl font-bold text-slate-900">3. Eat Well</span>
          <span className="text-base text-slate-600 mt-2">Get personalized top picks</span>
        </div>
      </div>
    </div>
  );
};

export default Landing;
import React, { useState } from 'react';
import Landing from './components/Landing';
import MenuInput from './components/MenuInput';
import MenuPreview from './components/MenuPreview';
import Questionnaire from './components/Questionnaire';
import Results from './components/Results';
import { AppStep, MenuItem, UserPreferences } from './types';
import { parseMenuFromImage, parseMenuFromText } from './services/geminiService';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.LANDING);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parsingError, setParsingError] = useState<string | null>(null);

  const handleStart = () => setCurrentStep(AppStep.INPUT);

  const handleInputSubmit = (type: 'image' | 'text', data: string, mimeType?: string) => {
    // 1. Immediately move to Questionnaire to save time
    // If we already have preferences (retry flow), we might want to go to Preview, 
    // but typically a new menu means we should re-confirm preferences or just show results?
    // Let's assume re-parsing a menu keeps preferences if set, but we show questionnaire if not.
    if (!userPreferences) {
      setCurrentStep(AppStep.QUESTIONNAIRE);
    } else {
      setCurrentStep(AppStep.PREVIEW);
    }

    // 2. Start parsing in background
    setIsParsing(true);
    setParsingError(null);
    setMenuItems([]); 

    // Define the async operation
    const parsePromise = async () => {
      try {
        let items: MenuItem[] = [];
        if (type === 'image') {
          items = await parseMenuFromImage(data, mimeType || 'image/jpeg');
        } else {
          items = await parseMenuFromText(data);
        }

        if (items.length === 0) {
          throw new Error("No menu items found. Please try again.");
        }
        setMenuItems(items);
      } catch (err) {
        console.error(err);
        setParsingError(err instanceof Error ? err.message : "Failed to parse menu");
      } finally {
        setIsParsing(false);
      }
    };

    // Execute background task
    parsePromise();
  };

  const handleQuestionnaireComplete = (prefs: UserPreferences) => {
    setUserPreferences(prefs);
    
    // Check if parsing failed while they were answering
    if (parsingError) {
      alert(`Error reading menu: ${parsingError}. Please try uploading again.`);
      setCurrentStep(AppStep.INPUT);
      return;
    }
    
    // If parsing is done or still running, go to PREVIEW.
    // The Preview component will show a loading spinner if `isParsing` is true.
    setCurrentStep(AppStep.PREVIEW);
  };

  const handlePreviewConfirm = () => {
    setCurrentStep(AppStep.RESULTS);
  };
  
  const handleMenuRetry = () => {
    setMenuItems([]);
    setParsingError(null);
    setCurrentStep(AppStep.INPUT);
  };

  const handleRestart = () => {
    setMenuItems([]);
    setUserPreferences(null);
    setParsingError(null);
    setIsParsing(false);
    setCurrentStep(AppStep.LANDING);
  };

  return (
    <div className="min-h-screen bg-brand-50 text-slate-900 font-sans selection:bg-brand-200">
      <header className="py-4 px-6 border-b border-brand-100 bg-white/50 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
           <div className="flex items-center space-x-2" onClick={handleRestart} style={{cursor: 'pointer'}}>
             <div className="bg-brand-500 rounded-lg p-1">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
               </svg>
             </div>
             <span className="font-bold text-lg text-slate-800 tracking-tight">SmartMenu</span>
           </div>
           {currentStep !== AppStep.LANDING && (
              <button onClick={handleRestart} className="text-xs font-medium text-slate-500 hover:text-brand-600">
                Restart
              </button>
           )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {currentStep === AppStep.LANDING && <Landing onStart={handleStart} />}
        
        {currentStep === AppStep.INPUT && (
            <MenuInput onInputSubmit={handleInputSubmit} onCancel={() => setCurrentStep(AppStep.LANDING)} />
        )}
        
        {currentStep === AppStep.QUESTIONNAIRE && (
            <Questionnaire onComplete={handleQuestionnaireComplete} />
        )}

        {currentStep === AppStep.PREVIEW && (
            // If parsing is still happening, show loading
            isParsing ? (
                <div className="flex flex-col items-center justify-center min-h-[50vh] animate-in fade-in duration-500">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-brand-500 mb-6"></div>
                      <div className="absolute top-0 left-0 h-20 w-20 flex items-center justify-center text-2xl">🍽️</div>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Reading the Menu...</h3>
                    <p className="text-slate-500">Our AI chef is analyzing every dish while you finished the quiz.</p>
                </div>
            ) : parsingError ? (
                <div className="max-w-xl mx-auto text-center pt-10 animate-in fade-in zoom-in">
                    <div className="bg-red-50 p-6 rounded-xl border border-red-100 mb-6 shadow-sm">
                        <span className="text-4xl block mb-2">😕</span>
                        <h3 className="text-red-800 font-bold text-lg mb-2">Couldn't Read Menu</h3>
                        <p className="text-red-600 mb-4">{parsingError}</p>
                        <p className="text-sm text-red-500">Please try uploading a clearer image or a direct link.</p>
                    </div>
                    <button onClick={handleMenuRetry} className="bg-brand-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-brand-700 transition-all">Try Again</button>
                </div>
            ) : (
                <MenuPreview items={menuItems} onConfirm={handlePreviewConfirm} onRetry={handleMenuRetry} />
            )
        )}
        
        {currentStep === AppStep.RESULTS && userPreferences && (
          <Results menuItems={menuItems} preferences={userPreferences} onRestart={handleRestart} />
        )}
      </main>
    </div>
  );
};

export default App;
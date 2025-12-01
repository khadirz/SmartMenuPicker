import React, { useState, useRef } from 'react';

interface MenuInputProps {
  onInputSubmit: (type: 'image' | 'text', data: string, mimeType?: string) => void;
  onCancel: () => void;
}

const MenuInput: React.FC<MenuInputProps> = ({ onInputSubmit, onCancel }) => {
  const [activeTab, setActiveTab] = useState<'image' | 'text'>('image');
  const [error, setError] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        onInputSubmit('image', base64Data, file.type);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError("Error reading file.");
    }
  };

  const handleTextSubmit = () => {
    if (!textInput.trim()) return;
    onInputSubmit('text', textInput);
  };

  return (
    <div className="max-w-xl mx-auto w-full">
      <div className="mb-6 flex items-center justify-between">
         <button onClick={onCancel} className="text-sm text-slate-500 hover:text-brand-600 font-medium flex items-center">
            ← Back
         </button>
         <h2 className="text-2xl font-bold text-slate-900">Add Menu</h2>
         <div className="w-10"></div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="flex border-b border-slate-100">
          <button
            onClick={() => setActiveTab('image')}
            className={`flex-1 py-4 text-sm font-medium transition-colors ${
              activeTab === 'image' ? 'bg-brand-50 text-brand-700 border-b-2 border-brand-500' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            Upload Image
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 py-4 text-sm font-medium transition-colors ${
              activeTab === 'text' ? 'bg-brand-50 text-brand-700 border-b-2 border-brand-500' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            Paste Link / Text
          </button>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm flex items-start">
               {error}
            </div>
          )}

          {activeTab === 'image' ? (
            <div className="space-y-4">
              <input
                type="file"
                ref={cameraInputRef}
                className="hidden"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
              />
              <input
                type="file"
                ref={galleryInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />

              <button 
                onClick={() => cameraInputRef.current?.click()}
                className="w-full flex items-center justify-center p-6 border-2 border-slate-100 rounded-xl hover:bg-brand-50 hover:border-brand-200 transition-all group"
              >
                <div className="bg-brand-100 p-3 rounded-full mr-4 group-hover:bg-brand-200 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <span className="block text-lg font-bold text-slate-800">Take Photo</span>
                  <span className="text-sm text-slate-500">Use your camera</span>
                </div>
              </button>

              <button 
                onClick={() => galleryInputRef.current?.click()}
                className="w-full flex items-center justify-center p-6 border-2 border-slate-100 rounded-xl hover:bg-brand-50 hover:border-brand-200 transition-all group"
              >
                <div className="bg-slate-100 p-3 rounded-full mr-4 group-hover:bg-brand-200 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-600 group-hover:text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <span className="block text-lg font-bold text-slate-800">Upload File</span>
                  <span className="text-sm text-slate-500">From gallery or files</span>
                </div>
              </button>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <p className="text-sm text-slate-600 mb-2">Paste a restaurant website URL or copy-paste the menu text directly.</p>
              <textarea
                className="w-full h-48 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 mb-4 text-slate-800 placeholder:text-slate-400 bg-transparent"
                placeholder="https://restaurant.com/menu OR&#10;Burger - $15 - Delicious beef patty..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
              />
              <button
                onClick={handleTextSubmit}
                disabled={!textInput.trim()}
                className="w-full bg-brand-600 text-white font-medium py-3 rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Use this Text
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuInput;
import React, { useState, useRef, useEffect } from 'react';
import { Voice } from '../types';
import { MaleIcon, FemaleIcon, ChildIcon, ChevronDownIcon } from './icons';

interface VoiceSelectorProps {
  voices: Voice[];
  selectedVoice: Voice;
  onSelectVoice: (voice: Voice) => void;
}

const GenderIcon: React.FC<{ gender: 'male' | 'female' | 'child' }> = ({ gender }) => {
  switch (gender) {
    case 'male':
      return <MaleIcon className="h-5 w-5 text-blue-500" />;
    case 'female':
      return <FemaleIcon className="h-5 w-5 text-pink-500" />;
    case 'child':
      return <ChildIcon className="h-5 w-5 text-green-500" />;
    default:
      return null;
  }
};

const VoiceSelector: React.FC<VoiceSelectorProps> = ({ voices, selectedVoice, onSelectVoice }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelectVoice = (voice: Voice) => {
    onSelectVoice(voice);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-700 h-full border-t-4 border-t-brand-orange">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white pb-4 mb-4 border-b border-slate-200 dark:border-slate-700">اختر صوتاً</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="voice-select-button" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            الشخصية الصوتية
          </label>
          <div className="relative" ref={dropdownRef}>
            <button
              id="voice-select-button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              type="button"
              aria-haspopup="listbox"
              aria-expanded={isDropdownOpen}
              className="w-full flex justify-between items-center pl-3 pr-2 py-2.5 text-base border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent sm:text-sm rounded-lg bg-slate-50 dark:bg-slate-900 text-right transition"
            >
              <span className="truncate">{selectedVoice.name}</span>
              <ChevronDownIcon className={`h-5 w-5 text-slate-700 dark:text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <ul
                role="listbox"
                aria-activedescendant={`voice-option-${selectedVoice.id}`}
                className="absolute z-20 w-full mt-1 overflow-y-auto bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                {voices.map((voice) => (
                  <li
                    key={voice.id}
                    id={`voice-option-${voice.id}`}
                    onClick={() => handleSelectVoice(voice)}
                    className="px-4 py-2 text-sm text-slate-900 dark:text-slate-200 cursor-pointer hover:bg-orange-100 dark:hover:bg-brand-orange/20"
                    role="option"
                    aria-selected={voice.id === selectedVoice.id}
                  >
                    {voice.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        <div className="p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-4">
               <div className="flex-shrink-0 bg-white dark:bg-slate-700 rounded-full p-2.5 ring-1 ring-slate-200 dark:ring-slate-600">
                 <GenderIcon gender={selectedVoice.gender} />
               </div>
               <div className="flex-1">
                  <p className="font-semibold text-slate-800 dark:text-slate-100">{selectedVoice.name}</p>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mt-1 space-y-1">
                      <p><span className="font-semibold text-slate-700 dark:text-slate-300">الوظيفة:</span> {selectedVoice.useCase}</p>
                      <p><span className="font-semibold text-slate-700 dark:text-slate-300">الخصائص:</span> {selectedVoice.characteristics}</p>
                  </div>
               </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceSelector;
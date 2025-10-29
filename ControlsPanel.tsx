import React, { useState, useRef, useEffect } from 'react';
import { AudioConfig } from '../types';
import { ResetIcon, ChevronDownIcon } from './icons';
import { TONES } from '../constants';

interface ControlsPanelProps {
  config: AudioConfig;
  onConfigChange: (newConfig: AudioConfig) => void;
}

const ControlSlider: React.FC<{
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (value: number) => void;
    onReset: () => void;
    disabled?: boolean;
    disabledText?: string;
}> = ({ label, value, min, max, step, onChange, onReset, disabled=false, disabledText }) => (
    <div className="space-y-3">
        <div className="flex justify-between items-center">
            <label className="font-semibold text-slate-700 dark:text-slate-300">{label}</label>
            <div className="flex items-center gap-2">
                <span className={`text-sm font-mono px-2 py-1 rounded ${disabled ? 'bg-slate-200 dark:bg-slate-700 text-slate-500' : 'bg-orange-100 dark:bg-brand-orange/20 text-brand-orange-dark dark:text-orange-300'}`}>
                    {value.toFixed(1)}x
                </span>
                <button 
                  onClick={onReset} 
                  className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 disabled:opacity-50"
                  disabled={disabled}
                  aria-label={`Reset ${label}`}
                >
                    <ResetIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            disabled={disabled}
            className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-brand-orange disabled:accent-slate-400 disabled:cursor-not-allowed"
        />
        {disabled && disabledText && <p className="text-xs text-slate-500 dark:text-slate-400">{disabledText}</p>}
    </div>
);

const ControlsPanel: React.FC<ControlsPanelProps> = ({ config, onConfigChange }) => {
  const [isToneDropdownOpen, setIsToneDropdownOpen] = useState(false);
  const toneDropdownRef = useRef<HTMLDivElement>(null);

  const handleSpeedChange = (speed: number) => {
    onConfigChange({ ...config, speed });
  };
  
  const resetSpeed = () => {
    onConfigChange({ ...config, speed: 1.0 });
  };

  const handleToneChange = (toneId: string) => {
    onConfigChange({ ...config, toneId });
    setIsToneDropdownOpen(false);
  };

  const selectedTone = TONES.find(t => t.id === config.toneId) || TONES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toneDropdownRef.current && !toneDropdownRef.current.contains(event.target as Node)) {
        setIsToneDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-700 h-full border-t-4 border-t-brand-orange">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white pb-4 mb-6 border-b border-slate-200 dark:border-slate-700">خصائص الصوت</h2>
      <div className="space-y-8">
        <div className="space-y-3">
          <label htmlFor="tone-select-button" className="font-semibold text-slate-700 dark:text-slate-300">
            النبرة الاحترافية
          </label>
           <div className="relative" ref={toneDropdownRef}>
            <button
              id="tone-select-button"
              onClick={() => setIsToneDropdownOpen(!isToneDropdownOpen)}
              type="button"
              aria-haspopup="listbox"
              aria-expanded={isToneDropdownOpen}
              className="w-full flex justify-between items-center pl-3 pr-2 py-2.5 text-base border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent sm:text-sm rounded-lg bg-slate-50 dark:bg-slate-900 text-right transition"
            >
              <span className="truncate">{selectedTone.name}</span>
              <ChevronDownIcon className={`h-5 w-5 text-slate-700 dark:text-slate-400 transition-transform duration-200 ${isToneDropdownOpen ? 'transform rotate-180' : ''}`} />
            </button>
            {isToneDropdownOpen && (
              <ul
                role="listbox"
                aria-activedescendant={`tone-option-${selectedTone.id}`}
                className="absolute z-20 w-full mt-1 overflow-y-auto bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                {TONES.map((tone) => (
                  <li
                    key={tone.id}
                    id={`tone-option-${tone.id}`}
                    onClick={() => handleToneChange(tone.id)}
                    className="px-4 py-2 text-sm text-slate-900 dark:text-slate-200 cursor-pointer hover:bg-orange-100 dark:hover:bg-brand-orange/20"
                    role="option"
                    aria-selected={tone.id === config.toneId}
                  >
                    {tone.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <ControlSlider
            label="سرعة النطق"
            value={config.speed}
            min={0.5}
            max={2.0}
            step={0.1}
            onChange={handleSpeedChange}
            onReset={resetSpeed}
        />
        <ControlSlider
            label="نبرة الصوت (Pitch)"
            value={1.0}
            min={0.5}
            max={1.5}
            step={0.1}
            onChange={()=>{}}
            onReset={()=>{}}
            disabled={true}
            disabledText="ميزة التحكم في النبرة غير متاحة حاليًا."
        />
      </div>
    </div>
  );
};

export default ControlsPanel;
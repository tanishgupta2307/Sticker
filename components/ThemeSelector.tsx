import React from 'react';
import { StickerTheme } from '../types';
import { THEME_CONFIG } from '../constants';

interface ThemeSelectorProps {
  selectedTheme: StickerTheme;
  onSelectTheme: (theme: StickerTheme) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ selectedTheme, onSelectTheme }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
          Pick a Vibe
        </label>
        <span className="text-xs font-semibold text-indigo-400 bg-indigo-50 px-2 py-1 rounded-full">
          Scroll for more →
        </span>
      </div>
      
      <div className="flex overflow-x-auto pb-6 -mx-4 px-4 gap-3 no-scrollbar snap-x cursor-grab active:cursor-grabbing">
        {Object.values(StickerTheme).map((theme) => {
          const config = THEME_CONFIG[theme];
          const Icon = config.icon;
          const isSelected = selectedTheme === theme;

          return (
            <button
              key={theme}
              onClick={() => onSelectTheme(theme)}
              className={`
                snap-start flex-shrink-0 relative group flex flex-col items-center justify-between
                w-28 h-32 p-3 rounded-3xl transition-all duration-300 ease-out
                ${isSelected 
                  ? 'bg-white ring-4 ring-indigo-400 ring-offset-2 ring-offset-indigo-50 shadow-xl -translate-y-1 z-10' 
                  : 'bg-white/60 hover:bg-white hover:shadow-lg border border-transparent hover:scale-105'
                }
              `}
            >
              <div className={`
                w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300
                ${config.color} 
                ${isSelected ? 'scale-110 rotate-3' : 'group-hover:scale-105'}
              `}>
                <Icon size={24} strokeWidth={2.5} />
              </div>
              
              <div className="text-center w-full">
                <span className={`block text-xs font-bold truncate ${isSelected ? 'text-indigo-600' : 'text-slate-500'}`}>
                  {theme}
                </span>
              </div>
              
              {isSelected && (
                <div className="absolute top-2 right-2 w-3 h-3 bg-indigo-500 rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ThemeSelector;
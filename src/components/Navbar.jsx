import React from 'react';
import { useDiary } from '../context/DiaryContext';

export default function Navbar() {
  const { 
    currentUser, 
    logout, 
    themeMode, 
    setThemeMode, 
    secretHiddenMode, 
    setSecretHiddenMode 
  } = useDiary();

  const toggleTheme = () => {
    setThemeMode(prev => prev === 'pastel' ? 'dark' : 'pastel');
  };

  if (!currentUser) return null;

  return (
    <header className={`w-full py-4 px-6 md:px-12 sticky top-0 z-40 transition-all duration-300 backdrop-blur-md border-b ${
      themeMode === 'pastel'
        ? 'bg-white/60 border-pink-100/60 shadow-sm'
        : 'bg-[#1c1623]/70 border-pink-900/30 shadow-lg shadow-black/10'
    }`}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Title / Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl select-none animate-pulse-heart">🔐</span>
          <h1 className={`font-serif text-2xl font-bold tracking-wide transition-colors duration-300 ${
            themeMode === 'pastel' 
              ? 'bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent' 
              : 'text-pink-400 bg-gradient-to-r from-pink-400 to-fuchsia-400 bg-clip-text text-transparent'
          }`}>
            My Secret Diary
          </h1>
        </div>

        {/* User Status and Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
          <span className={`text-sm font-semibold tracking-wide flex items-center gap-1.5 py-1 px-3.5 rounded-full border ${
            themeMode === 'pastel'
              ? 'bg-pink-50/60 border-pink-100 text-pink-600'
              : 'bg-pink-950/20 border-pink-900/40 text-pink-300'
          }`}>
            <span>👑</span> {currentUser.displayName}
          </span>

          <div className="flex items-center gap-2">
            {/* Secret Calculator Disguise Button */}
            <button
              onClick={() => setSecretHiddenMode(true)}
              className={`p-2 rounded-full border transition-all duration-300 hover:scale-105 active:scale-95 group relative ${
                themeMode === 'pastel'
                  ? 'bg-white border-pink-100 text-gray-500 hover:text-pink-500 hover:border-pink-300'
                  : 'bg-[#1e152a] border-pink-900/60 text-gray-400 hover:text-pink-400 hover:border-pink-600'
              }`}
              title="Disguise Mode (Quick Lock) 🧮"
            >
              <span className="text-base">🧮</span>
              <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                Disguise Mode (Quick Lock)
              </span>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full border transition-all duration-300 hover:scale-105 active:scale-95 group relative ${
                themeMode === 'pastel'
                  ? 'bg-white border-pink-100 text-pink-500 hover:bg-pink-50'
                  : 'bg-[#1e152a] border-pink-900/60 text-pink-400 hover:bg-pink-950/30'
              }`}
              title={themeMode === 'pastel' ? 'Toggle Dark Mode 🌙' : 'Toggle Pastel Mode 🌸'}
            >
              <span className="text-base">{themeMode === 'pastel' ? '🌙' : '🌸'}</span>
              <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                {themeMode === 'pastel' ? 'Magical Night' : 'Sweet Pastel'}
              </span>
            </button>

            {/* Logout Button */}
            <button
              onClick={logout}
              className={`py-1.5 px-4 rounded-full text-xs font-bold border transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-1 ${
                themeMode === 'pastel'
                  ? 'bg-rose-50 border-rose-100 text-rose-500 hover:bg-rose-100'
                  : 'bg-rose-950/20 border-rose-900/40 text-rose-400 hover:bg-rose-950/50'
              }`}
            >
              <span>🔒</span> Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

import React from 'react';
import { useDiary } from '../context/DiaryContext';

export default function Home({ onEnter }) {
  const { themeMode } = useDiary();

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[90vh] px-6 text-center select-none">
      
      {/* Floating Diary Illustration */}
      <div className="relative mb-6 animate-float-bubble">
        {/* Soft pink romantic glow */}
        <div className="absolute inset-0 bg-pink-400 rounded-full blur-3xl scale-75 opacity-35" />

        {/* Custom SVG book outline */}
        <div className={`relative z-10 w-44 h-48 rounded-[30px] border-4 flex flex-col justify-between p-6 shadow-2xl transition-all duration-500 hover:rotate-6 ${
          themeMode === 'pastel'
            ? 'bg-gradient-to-tr from-pink-300 via-pink-200 to-purple-200 border-white text-pink-600'
            : 'bg-gradient-to-tr from-[#2d122b] via-[#3a1638] to-[#4c1c49] border-pink-900/60 text-pink-400 shadow-black/40'
        }`}>
          {/* Gold Corners */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-yellow-300 rounded-tl-[26px]" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-yellow-300 rounded-tr-[26px]" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-yellow-300 rounded-bl-[26px]" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-yellow-300 rounded-br-[26px]" />

          {/* Book Details */}
          <div className="flex justify-between items-center w-full">
            <span className="text-xl">🌸</span>
            <span className="text-xl">✨</span>
          </div>

          <div className="flex flex-col items-center justify-center flex-1 my-2">
            <span className="text-5xl animate-pulse-heart">🔐</span>
          </div>

          <div className="w-full text-center">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-white bg-pink-500/80 px-2 py-0.5 rounded-full">
              My secrets
            </span>
          </div>
        </div>
      </div>

      {/* Main Title Headers */}
      <h1 className={`font-serif text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-4 select-none animate-glow leading-[1.15] ${
        themeMode === 'pastel'
          ? 'text-purple-950'
          : 'text-pink-100'
      }`}>
        My Secret Diary <span className="inline-block animate-pulse-heart text-rose-500">💖</span>
      </h1>

      {/* Subtitles */}
      <p className={`max-w-xl text-base sm:text-lg leading-relaxed font-sans mb-10 select-none ${
        themeMode === 'pastel' ? 'text-gray-500 font-medium' : 'text-gray-400'
      }`}>
        A magical private space for your feelings, dreams, secrets, memories, and heart. 
        Only you hold the key to unlock this hidden world.
      </p>

      {/* Primary Pulsing Enter Button */}
      <button
        onClick={onEnter}
        className="group relative py-4 px-12 rounded-full text-base sm:text-lg font-bold bg-gradient-to-r from-pink-500 via-rose-400 to-purple-500 text-white shadow-xl hover:shadow-2xl hover:shadow-pink-300/40 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2"
      >
        {/* Glow halo */}
        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-300 -z-10" />

        <span>Unlock My World</span>
        <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110">✨</span>
      </button>

      {/* Heart ribbon doodads */}
      <div className="flex gap-4 mt-8 text-lg opacity-40 select-none">
        <span>🎀</span>
        <span>🦋</span>
        <span>☁️</span>
        <span>🌸</span>
        <span>👑</span>
      </div>

    </div>
  );
}

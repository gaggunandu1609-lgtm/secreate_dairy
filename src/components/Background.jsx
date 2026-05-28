import React, { useEffect, useState } from 'react';
import { useDiary } from '../context/DiaryContext';

export default function Background() {
  const { themeMode } = useDiary();
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate a fixed set of floating particles with random sizing/delays
    const symbols = ['💖', '🌸', '✨', '⭐', '☁️', '🦋', '🎈', '💝'];
    const generated = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      left: `${Math.random() * 95}%`,
      size: `${Math.random() * 1.5 + 1}rem`,
      delay: `${Math.random() * 10}s`,
      duration: `${Math.random() * 12 + 10}s`,
      opacity: Math.random() * 0.4 + 0.2
    }));
    setParticles(generated);
  }, []);

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden select-none transition-colors duration-1000">
      {/* Background gradients */}
      {themeMode === 'pastel' ? (
        <div className="absolute inset-0 bg-gradient-to-tr from-[#ffe4e6] via-[#faf5ff] to-[#ffedd5] animate-pulse-slow opacity-100 transition-opacity duration-1000" 
             style={{ backgroundSize: '200% 200%', animation: 'floatBubble 15s ease-in-out infinite' }} />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-tr from-[#130f1a] via-[#1a1124] to-[#2d122b] transition-opacity duration-1000" />
      )}

      {/* Magical glowing radial highlights */}
      <div className={`absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full blur-[100px] transition-colors duration-1000 ${
        themeMode === 'pastel' ? 'bg-[#ffd3e2]/40' : 'bg-[#e879f9]/15'
      }`} />
      <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[100px] transition-colors duration-1000 ${
        themeMode === 'pastel' ? 'bg-[#e8d5ff]/50' : 'bg-[#f43f5e]/10'
      }`} />

      {/* Floating Sparkles & Hearts */}
      {particles.map(p => (
        <span
          key={p.id}
          className="absolute font-sans pointer-events-none animate-float-heart"
          style={{
            left: p.left,
            fontSize: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
            opacity: p.opacity,
            textShadow: themeMode === 'dark' ? '0 0 10px rgba(232, 121, 249, 0.4)' : 'none'
          }}
        >
          {p.symbol}
        </span>
      ))}
    </div>
  );
}

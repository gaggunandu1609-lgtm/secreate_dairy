import React, { useState, useEffect, useRef } from 'react';
import { useDiary } from '../context/DiaryContext';

export default function SparkleCursor() {
  const { themeMode } = useDiary();
  const [sparkles, setSparkles] = useState([]);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isMobile, setIsMobile] = useState(false);
  const sparkleIdCounter = useRef(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches || ('ontouchstart' in window));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      // Only spawn sparkle occasionally to prevent performance lag
      if (Math.random() < 0.25) {
        const symbols = ['✨', '⭐', '💖', '🌸', 'ﾟ'];
        const newSparkle = {
          id: sparkleIdCounter.current++,
          x: e.clientX + (Math.random() * 12 - 6),
          y: e.clientY + (Math.random() * 12 - 6),
          symbol: symbols[Math.floor(Math.random() * symbols.length)],
          size: Math.random() * 0.8 + 0.6,
          rotation: Math.random() * 360,
          scale: 1,
          opacity: 1
        };

        setSparkles((prev) => [...prev.slice(-30), newSparkle]); // limit size to max 30
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);

  // Tick loop to animate sparkles downward, rotating, and fading
  useEffect(() => {
    if (isMobile || sparkles.length === 0) return;

    const interval = setInterval(() => {
      setSparkles((prev) =>
        prev
          .map((s) => ({
            ...s,
            y: s.y + 1.2, // Drift downward
            rotation: s.rotation + 4,
            opacity: s.opacity - 0.05,
            scale: s.scale - 0.04
          }))
          .filter((s) => s.opacity > 0)
      );
    }, 40);

    return () => clearInterval(interval);
  }, [sparkles.length, isMobile]);

  if (isMobile) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {/* Sparkle particles */}
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="absolute inline-block select-none"
          style={{
            left: s.x,
            top: s.y,
            fontSize: `${s.size}rem`,
            opacity: s.opacity,
            transform: `translate(-50%, -50%) rotate(${s.rotation}deg) scale(${s.scale})`,
            color: themeMode === 'pastel' ? '#ec4899' : '#f472b6',
            textShadow: '0 0 4px rgba(244, 114, 182, 0.6)'
          }}
        >
          {s.symbol}
        </span>
      ))}

      {/* Main cursor heart follower */}
      <div
        className={`fixed -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center transition-all duration-75 pointer-events-none ${
          themeMode === 'pastel' 
            ? 'w-6 h-6 border border-pink-300 bg-white/70 text-[10px] shadow-sm text-pink-500' 
            : 'w-6 h-6 border border-pink-500 bg-[#1c1623]/80 text-[10px] shadow-lg shadow-pink-500/20 text-pink-400'
        }`}
        style={{
          left: mousePos.x,
          top: mousePos.y
        }}
      >
        💖
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { useDiary } from '../context/DiaryContext';

export default function FingerprintUnlock({ onUnlock }) {
  const { themeMode } = useDiary();
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scanMessage, setScanMessage] = useState('Hold to scan fingerprint 💖');
  const timerRef = useRef(null);
  const audioCtxRef = useRef(null);

  // Play scanning synth sweep sound
  const playScanSound = (isDone = false) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      if (isDone) {
        // Success sound chord
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      } else {
        // Scan sweep sound
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 1.5);
        gainNode.gain.setValueAtTime(0.04, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
        osc.start();
        osc.stop(ctx.currentTime + 1.5);
      }
    } catch (e) {
      // Audio context block safeguard
    }
  };

  const handleStartScan = (e) => {
    e.preventDefault();
    setIsScanning(true);
    setProgress(0);
    setScanMessage('Scanning fingerprint... ⚡');
    playScanSound(false);

    let currentProgress = 0;
    timerRef.current = setInterval(() => {
      currentProgress += 5;
      if (currentProgress >= 100) {
        clearInterval(timerRef.current);
        setProgress(100);
        setIsScanning(false);
        setScanMessage('Access Granted! 💖🔑');
        playScanSound(true);
        setTimeout(() => {
          onUnlock();
        }, 600);
      } else {
        setProgress(currentProgress);
      }
    }, 80); // scans in ~1.6 seconds
  };

  const handleCancelScan = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (progress < 100) {
      setIsScanning(false);
      setProgress(0);
      setScanMessage('Hold to scan fingerprint 💖');
    }
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6 select-none">
      <div 
        className="relative group cursor-pointer flex items-center justify-center"
        onMouseDown={handleStartScan}
        onMouseUp={handleCancelScan}
        onMouseLeave={handleCancelScan}
        onTouchStart={handleStartScan}
        onTouchEnd={handleCancelScan}
      >
        {/* Pulsing glow background rings */}
        <div className={`absolute inset-0 rounded-full blur-xl scale-75 opacity-40 transition-all duration-500 group-hover:scale-100 ${
          isScanning 
            ? 'bg-rose-500 animate-pulse' 
            : themeMode === 'pastel' ? 'bg-pink-400' : 'bg-pink-600'
        }`} />

        {/* Heart shaped lock frame */}
        <div className={`relative z-10 w-28 h-28 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
          isScanning 
            ? 'border-rose-400 bg-white/30 backdrop-blur-md shadow-[0_0_15px_#f43f5e]' 
            : themeMode === 'pastel'
              ? 'border-pink-200 bg-white/70 hover:border-pink-400 shadow-sm'
              : 'border-pink-900/60 bg-[#1e152a]/70 hover:border-pink-600 shadow-lg'
        }`}>
          {/* Scanning line indicator */}
          {isScanning && <div className="scanner-line" />}

          {/* SVG Heart + Fingerprint illustration */}
          <svg 
            viewBox="0 0 100 100" 
            className={`w-16 h-16 transition-all duration-300 ${
              isScanning ? 'fill-rose-500 text-rose-500' : 'fill-none'
            }`}
          >
            {/* Heart shape background path */}
            <path 
              d="M12,30 A18,18 0 0,1 48,30 A18,18 0 0,1 84,30 Q84,55 48,82 Q12,55 12,30 Z" 
              className={`stroke-2 transition-colors duration-300 ${
                isScanning 
                  ? 'stroke-rose-600' 
                  : themeMode === 'pastel' ? 'stroke-pink-300' : 'stroke-pink-700/60'
              }`}
            />
            {/* Fingerprint line meshes */}
            <path 
              d="M38,40 Q48,30 58,40 M34,48 Q48,35 62,48 M32,56 Q48,40 64,56 M35,64 Q48,46 61,64 M40,71 Q48,52 56,71"
              fill="none"
              strokeLinecap="round"
              className={`stroke-2 transition-all duration-300 ${
                isScanning 
                  ? 'stroke-white animate-pulse' 
                  : themeMode === 'pastel' ? 'stroke-pink-400/70' : 'stroke-pink-500/50'
              }`}
            />
            {/* Padlock center icon */}
            <path
              d="M43,45 L43,40 A5,5 0 0,1 53,40 L53,45"
              fill="none"
              strokeWidth="2.5"
              className={`transition-all duration-500 ${
                progress === 100
                  ? 'stroke-green-400 translate-y-[-4px] opacity-0'
                  : isScanning
                    ? 'stroke-rose-200'
                    : themeMode === 'pastel' ? 'stroke-pink-500' : 'stroke-pink-400'
              }`}
            />
          </svg>

          {/* Core progress circle border */}
          {isScanning && (
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="53"
                className="stroke-rose-500 fill-none"
                strokeWidth="3.5"
                strokeDasharray={`${2 * Math.PI * 53}`}
                strokeDashoffset={`${2 * Math.PI * 53 * (1 - progress / 100)}`}
                style={{ transform: 'translate(-2px, -2px)' }}
              />
            </svg>
          )}
        </div>
      </div>

      {/* Text feedback labels */}
      <span className={`mt-4 text-sm font-medium tracking-wide text-center transition-colors duration-300 ${
        isScanning 
          ? 'text-rose-500 animate-pulse font-semibold' 
          : themeMode === 'pastel' ? 'text-pink-600' : 'text-pink-400'
      }`}>
        {scanMessage}
      </span>

      {/* Small instruction footnote */}
      <span className="text-[10px] text-gray-400/80 mt-1">
        (Simulates mobile fingerprint auth. Press and hold with mouse/finger)
      </span>
    </div>
  );
}

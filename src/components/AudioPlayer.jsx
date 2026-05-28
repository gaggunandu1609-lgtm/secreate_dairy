import React, { useEffect, useRef } from 'react';
import { useDiary } from '../context/DiaryContext';

// Frequencies for a beautiful dreamy melody
const FREQS = {
  'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
  'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
  'C6': 1046.50, 'D6': 1174.66, 'E6': 1318.51, 'F6': 1396.91, 'G6': 1567.98, 'A6': 1760.00
};

// Dreamy music box melody sequence (notes + beats)
const MELODY = [
  { note: 'E5', dur: 1 }, { note: 'G5', dur: 1 }, { note: 'C6', dur: 1 }, { note: 'E6', dur: 1 },
  { note: 'D6', dur: 2 }, { note: 'B5', dur: 2 },
  { note: 'C6', dur: 1 }, { note: 'A5', dur: 1 }, { note: 'F5', dur: 1 }, { note: 'A5', dur: 1 },
  { note: 'G5', dur: 3 }, { note: 'rest', dur: 1 },
  { note: 'F5', dur: 1 }, { note: 'A5', dur: 1 }, { note: 'D6', dur: 1 }, { note: 'F6', dur: 1 },
  { note: 'E6', dur: 2 }, { note: 'C6', dur: 2 },
  { note: 'D6', dur: 1 }, { note: 'B5', dur: 1 }, { note: 'G5', dur: 1 }, { note: 'B5', dur: 1 },
  { note: 'C6', dur: 3 }, { note: 'rest', dur: 1 }
];

export default function AudioPlayer() {
  const { isAudioPlaying, setIsAudioPlaying, themeMode } = useDiary();
  const audioCtxRef = useRef(null);
  const nextNoteTimeRef = useRef(0);
  const melodyIndexRef = useRef(0);
  const timerRef = useRef(null);

  // Play a single music box note using oscillators
  const playMusicBoxNote = (noteName, time) => {
    if (!audioCtxRef.current || noteName === 'rest') return;
    
    const ctx = audioCtxRef.current;
    const freq = FREQS[noteName];
    if (!freq) return;

    // Create oscillator and filter nodes for standard music box pluck
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle'; // Warm woodwind-like timbre
    osc.frequency.setValueAtTime(freq, time);

    // Add a tiny bit of frequency detune for sparkling vibe
    const detuneOsc = ctx.createOscillator();
    const detuneGain = ctx.createGain();
    detuneOsc.type = 'sine';
    detuneOsc.frequency.setValueAtTime(freq * 1.5, time); // harmonic shimmer
    detuneGain.gain.setValueAtTime(0.015, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2500, time);

    // Music box amplitude envelope: instant attack, long ring out decay
    gainNode.gain.setValueAtTime(0.0, time);
    gainNode.gain.linearRampToValueAtTime(0.07, time + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, time + 1.8);

    osc.connect(filter);
    detuneOsc.connect(detuneGain);
    detuneGain.connect(filter);
    
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(time);
    detuneOsc.start(time);
    osc.stop(time + 2.0);
    detuneOsc.stop(time + 2.0);
  };

  // Scheduler loop
  const scheduleNextNotes = () => {
    if (!audioCtxRef.current) return;
    
    const ctx = audioCtxRef.current;
    
    // Look ahead 100ms
    while (nextNoteTimeRef.current < ctx.currentTime + 0.1) {
      const currentItem = MELODY[melodyIndexRef.current];
      
      if (currentItem.note !== 'rest') {
        playMusicBoxNote(currentItem.note, nextNoteTimeRef.current);
      }

      // Calculate next note time based on note duration
      const secondsPerBeat = 0.45; // Speed of melody
      nextNoteTimeRef.current += currentItem.dur * secondsPerBeat;
      
      // Increment index
      melodyIndexRef.current = (melodyIndexRef.current + 1) % MELODY.length;
    }

    timerRef.current = setTimeout(scheduleNextNotes, 25);
  };

  const togglePlayback = () => {
    if (!isAudioPlaying) {
      // Start context
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      nextNoteTimeRef.current = audioCtxRef.current.currentTime + 0.05;
      melodyIndexRef.current = 0;
      setIsAudioPlaying(true);
      scheduleNextNotes();
    } else {
      setIsAudioPlaying(false);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  return (
    <button
      onClick={togglePlayback}
      className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group focus:outline-none ${
        isAudioPlaying
          ? themeMode === 'pastel'
            ? 'bg-pink-100 text-pink-500 shadow-pink-300/40 ring-4 ring-pink-200 animate-pulse'
            : 'bg-pink-900/60 text-pink-300 border border-pink-500/50 shadow-pink-500/20 ring-4 ring-pink-900/30'
          : themeMode === 'pastel'
            ? 'bg-white text-gray-400 hover:text-pink-400 border border-pink-100 hover:border-pink-200'
            : 'bg-[#1e152a] text-gray-500 hover:text-pink-300 border border-pink-950 hover:border-pink-900/40'
      }`}
      aria-label="Toggle Dreamy Background Music"
      title="Dreamy Lullaby Music Box 🎵"
    >
      {/* Decorative pulse ring */}
      {isAudioPlaying && (
        <span className="absolute -inset-1 rounded-full border border-pink-400 opacity-60 animate-ping pointer-events-none" />
      )}
      
      <span className={`text-xl transition-transform duration-500 ${isAudioPlaying ? 'scale-110 rotate-12' : 'scale-90 group-hover:rotate-6'}`}>
        {isAudioPlaying ? '🎵' : '🔇'}
      </span>
      
      {/* Tiny tooltip showing note details */}
      <span className="absolute right-full mr-3 bg-white/90 text-pink-500 text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-pink-100 shadow-sm whitespace-nowrap font-medium font-sans">
        {isAudioPlaying ? 'Music Box Playing... ✨' : 'Dreamy Music Box 💖'}
      </span>
    </button>
  );
}

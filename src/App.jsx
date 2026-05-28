import React, { useState, useEffect } from 'react';
import { DiaryProvider, useDiary } from './context/DiaryContext';
import Background from './components/Background';
import SparkleCursor from './components/SparkleCursor';
import AudioPlayer from './components/AudioPlayer';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';

function MainAppContent() {
  const { currentUser } = useDiary();
  const [currentScreen, setCurrentScreen] = useState('home'); // 'home' | 'auth' | 'dashboard'

  // Sync screen state with auth state
  useEffect(() => {
    if (currentUser) {
      setCurrentScreen('dashboard');
    } else {
      if (currentScreen === 'dashboard') {
        setCurrentScreen('auth');
      }
    }
  }, [currentUser]);

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Aesthetic Background */}
      <Background />

      {/* Floating Stardust Cursor */}
      <SparkleCursor />

      {/* Dreamy synthesized background music */}
      <AudioPlayer />

      {/* Glassmorphic Navbar (Displays when user is logged in) */}
      <Navbar />

      {/* Screen Routing Content */}
      <main className="flex-1 flex flex-col">
        {currentScreen === 'home' && (
          <Home onEnter={() => setCurrentScreen('auth')} />
        )}
        {currentScreen === 'auth' && (
          <Auth />
        )}
        {currentScreen === 'dashboard' && (
          <Dashboard />
        )}
      </main>

      {/* Tiny Princess Footer */}
      <footer className="w-full py-4 text-center text-[10px] text-gray-400/80 font-medium select-none z-10 border-t border-dashed border-pink-200/10">
        Made with 💖, sparkles and secrets. Your thoughts are safe here. 🔐
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <DiaryProvider>
      <MainAppContent />
    </DiaryProvider>
  );
}

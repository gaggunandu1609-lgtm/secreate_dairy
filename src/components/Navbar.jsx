import React, { useState } from 'react';
import { useDiary } from '../context/DiaryContext';

export default function Navbar() {
  const { 
    currentUser, 
    logout, 
    updateUserCredentials,
    themeMode, 
    setThemeMode, 
    secretHiddenMode, 
    setSecretHiddenMode 
  } = useDiary();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [oldEmail, setOldEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const toggleTheme = () => {
    setThemeMode(prev => prev === 'pastel' ? 'dark' : 'pastel');
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!oldEmail || !oldPassword || !newEmail || !newPassword) {
      setMessage('Please fill in all the sparkling fields! ✨');
      return;
    }
    setIsSubmitting(true);
    setMessage('');
    try {
      await updateUserCredentials(oldEmail, oldPassword, newEmail, newPassword);
      setMessage('Magical keys updated successfully! 💖');
      // Clear fields after success
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setMessage(err.message || 'Update failed.');
    } finally {
      setIsSubmitting(false);
    }
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
            {/* Settings Button */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className={`p-2 rounded-full border transition-all duration-300 hover:scale-105 active:scale-95 group relative ${
                themeMode === 'pastel'
                  ? 'bg-white border-pink-100 text-gray-500 hover:text-pink-500 hover:border-pink-300'
                  : 'bg-[#1e152a] border-pink-900/60 text-gray-400 hover:text-pink-400 hover:border-pink-600'
              }`}
              title="Account Settings ⚙️"
            >
              <span className="text-base">⚙️</span>
              <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                Account Settings
              </span>
            </button>

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

      {/* SETTINGS MODAL */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className={`w-full max-w-md rounded-3xl shadow-xl overflow-hidden ${
            themeMode === 'pastel' ? 'bg-white border border-pink-100' : 'bg-[#1b1226] border border-pink-900/50 text-gray-200'
          }`}>
            
            {/* Header */}
            <div className={`px-6 py-4 flex items-center justify-between border-b ${
              themeMode === 'pastel' ? 'border-pink-100 bg-pink-50/50' : 'border-pink-900/30 bg-[#251934]'
            }`}>
              <h3 className="font-serif font-bold text-lg">Account Settings ⚙️</h3>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-xs text-gray-400 mb-6 text-center">
                Update your secret email and password here. You must provide your old credentials to make changes securely! 🔐
              </p>

              {message && (
                <div className={`p-3 text-xs text-center font-bold rounded-xl mb-4 border ${
                  message.includes('success') 
                    ? 'bg-green-50 text-green-600 border-green-200' 
                    : 'bg-rose-50 text-rose-600 border-rose-200'
                }`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleUpdateSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-extrabold mb-1 text-gray-400">Old Email</label>
                    <input
                      type="email" required placeholder="old@secret.com"
                      value={oldEmail} onChange={(e) => setOldEmail(e.target.value)}
                      className={`w-full px-3 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-pink-300 ${
                        themeMode === 'pastel' ? 'bg-white border-pink-100 text-gray-700' : 'bg-[#1b1226] border-pink-900/50'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-extrabold mb-1 text-gray-400">Old Password</label>
                    <input
                      type="password" required placeholder="••••••••"
                      value={oldPassword} onChange={(e) => setOldPassword(e.target.value)}
                      className={`w-full px-3 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-pink-300 ${
                        themeMode === 'pastel' ? 'bg-white border-pink-100 text-gray-700' : 'bg-[#1b1226] border-pink-900/50'
                      }`}
                    />
                  </div>
                </div>

                <div className="border-t border-dashed border-pink-200/40 my-1"></div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-extrabold mb-1 text-pink-400">New Email</label>
                    <input
                      type="email" required placeholder="new@secret.com"
                      value={newEmail} onChange={(e) => setNewEmail(e.target.value)}
                      className={`w-full px-3 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-pink-400 ${
                        themeMode === 'pastel' ? 'bg-pink-50 border-pink-200 text-gray-700' : 'bg-pink-950/20 border-pink-800'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-extrabold mb-1 text-pink-400">New Password</label>
                    <input
                      type="password" required placeholder="••••••••"
                      value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                      className={`w-full px-3 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-pink-400 ${
                        themeMode === 'pastel' ? 'bg-pink-50 border-pink-200 text-gray-700' : 'bg-pink-950/20 border-pink-800'
                      }`}
                    />
                  </div>
                </div>

                <button
                  type="submit" disabled={isSubmitting}
                  className="mt-4 py-2.5 rounded-xl font-bold bg-pink-500 hover:bg-pink-600 text-white shadow-sm transition-all"
                >
                  {isSubmitting ? 'Updating...' : 'Update Magical Keys ✨'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import React, { useState } from 'react';
import { useDiary } from '../context/DiaryContext';
import FingerprintUnlock from '../components/FingerprintUnlock';

export default function Auth() {
  const { login, signup, updateUserCredentials, themeMode } = useDiary();
  
  // View states
  const [isBioUnlocked, setIsBioUnlocked] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);
  const [isUpdateView, setIsUpdateView] = useState(false);
  
  // Form input fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [fakePassword, setFakePassword] = useState('fake123'); // Default fake password
  
  // Update fields
  const [oldEmail, setOldEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAuthSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      if (isUpdateView) {
        if (!oldEmail || !oldPassword || !newEmail || !newPassword) {
          throw new Error('Please fill all the sparkling fields! ✨');
        }
        await updateUserCredentials(oldEmail, oldPassword, newEmail, newPassword);
      } else {
        if (!email || !password) {
          throw new Error('Please fill in all fairy fields! 🌸');
        }
        if (isLoginView) {
          await login(email, password);
        } else {
          await signup(email, password, displayName, fakePassword);
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAuthView = () => {
    setIsLoginView(prev => !prev);
    setIsUpdateView(false);
    setErrorMessage('');
    setPassword('');
  };

  const toggleUpdateView = () => {
    setIsUpdateView(prev => !prev);
    setErrorMessage('');
    setPassword('');
    setOldPassword('');
    setNewPassword('');
  };

  return (
    <div className="flex-1 flex items-center justify-center min-h-[85vh] px-4 py-8 select-none">
      
      {/* Central Glassmorphic Card */}
      <div className={`w-full max-w-md rounded-[45px] p-6 sm:p-10 border transition-all duration-500 hover:shadow-2xl ${
        themeMode === 'pastel'
          ? 'glass border-pink-100/60 shadow-lg text-gray-700'
          : 'glass-dark border-pink-900/40 shadow-xl shadow-black/30 text-gray-200'
      }`}>
        
        {!isBioUnlocked ? (
          /* PHASE 1: Fingerprint Biometric Scanner */
          <div className="flex flex-col items-center">
            <h2 className={`font-serif text-2xl sm:text-3xl font-extrabold text-center mb-1 ${
              themeMode === 'pastel' ? 'text-purple-950' : 'text-pink-100'
            }`}>
              Biometric Lock 🔒
            </h2>
            <p className="text-xs text-gray-400 text-center mb-6 px-4">
              Unlock the diary door to enter your personal secret chamber.
            </p>
            
            <FingerprintUnlock onUnlock={() => setIsBioUnlocked(true)} />
          </div>
        ) : (
          /* PHASE 2: Login / Signup Form */
          <div className="animate-fade-in">
            {/* Header */}
            <div className="text-center mb-8">
              <span className="text-3xl select-none animate-pulse-heart block mb-2">🔐</span>
              <h2 className={`font-serif text-2xl sm:text-3xl font-extrabold mb-2 ${
                themeMode === 'pastel' ? 'text-purple-950' : 'text-pink-100'
              }`}>
                {isLoginView ? 'Welcome Back Princess' : 'Create Secret Diary'}
              </h2>
              <p className="text-xs text-gray-400">
                Only you can enter this secret world 🔐
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className={`p-3.5 mb-5 rounded-2xl text-xs font-semibold text-center border animate-shake ${
                themeMode === 'pastel'
                  ? 'bg-rose-50 border-rose-100 text-rose-500'
                  : 'bg-rose-950/20 border-rose-900/30 text-rose-400'
              }`}>
                {errorMessage}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
              
              {isUpdateView ? (
                <>
                  {/* UPDATE CREDENTIALS FORM */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-extrabold mb-1.5 text-gray-400">Old Email</label>
                      <input
                        type="email" required placeholder="old@secret.com"
                        value={oldEmail} onChange={(e) => setOldEmail(e.target.value)}
                        className={`w-full px-3 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all ${
                          themeMode === 'pastel' ? 'bg-white border-pink-100 text-gray-700' : 'bg-[#1b1226] border-pink-900/50 text-gray-200'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-extrabold mb-1.5 text-gray-400">Old Pass</label>
                      <input
                        type="password" required placeholder="••••••••"
                        value={oldPassword} onChange={(e) => setOldPassword(e.target.value)}
                        className={`w-full px-3 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all ${
                          themeMode === 'pastel' ? 'bg-white border-pink-100 text-gray-700' : 'bg-[#1b1226] border-pink-900/50 text-gray-200'
                        }`}
                      />
                    </div>
                  </div>
                  <div className="border-t border-dashed border-pink-200/40 my-1"></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-extrabold mb-1.5 text-pink-400">New Email</label>
                      <input
                        type="email" required placeholder="new@secret.com"
                        value={newEmail} onChange={(e) => setNewEmail(e.target.value)}
                        className={`w-full px-3 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all ${
                          themeMode === 'pastel' ? 'bg-pink-50 border-pink-200 text-gray-700' : 'bg-pink-950/20 border-pink-800 text-gray-200'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-extrabold mb-1.5 text-pink-400">New Pass</label>
                      <input
                        type="password" required placeholder="••••••••"
                        value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                        className={`w-full px-3 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all ${
                          themeMode === 'pastel' ? 'bg-pink-50 border-pink-200 text-gray-700' : 'bg-pink-950/20 border-pink-800 text-gray-200'
                        }`}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* NORMAL LOGIN / SIGNUP FORM */}
                  {/* Display Name Input (Signup only) */}
                  {!isLoginView && (
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-extrabold mb-1.5 text-gray-400">Princess Name</label>
                      <input
                        type="text"
                        required
                        placeholder="E.g. Lily, Chloe, Sakura... 🌸"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className={`w-full px-4 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all ${
                          themeMode === 'pastel'
                            ? 'bg-white border-pink-100 text-gray-700'
                            : 'bg-[#1b1226] border-pink-900/50 text-gray-200 focus:ring-pink-800'
                        }`}
                      />
                    </div>
                  )}

                  {/* Email Address */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-extrabold mb-1.5 text-gray-400">Secret Email</label>
                    <input
                      type="email"
                      required
                      placeholder="princess@secret.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full px-4 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all ${
                        themeMode === 'pastel'
                          ? 'bg-white border-pink-100 text-gray-700'
                          : 'bg-[#1b1226] border-pink-900/50 text-gray-200 focus:ring-pink-800'
                      }`}
                    />
                  </div>

                  {/* Password Field (Custom Heart Masking) */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-extrabold mb-1.5 text-gray-400">Magical Password</label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="opacity-0 absolute inset-0 w-full h-full z-20 cursor-text"
                      />
                      <div className={`w-full px-4 py-2.5 rounded-xl border flex items-center min-h-[42px] z-10 transition-all text-sm ${
                        themeMode === 'pastel'
                          ? 'bg-white border-pink-100'
                          : 'bg-[#1b1226] border-pink-900/50'
                      }`}>
                        {password.length === 0 ? (
                          <span className="text-gray-400">Keep it a secret... 🤫</span>
                        ) : (
                          <span className="flex items-center gap-0.5 tracking-wider select-none">
                            {Array.from({ length: password.length }).map((_, i) => (
                              <span key={i} className="text-xs text-pink-500 animate-pulse-heart">💖</span>
                            ))}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Decoy Fake Password (Signup only) */}
              {!isLoginView && !isUpdateView && (
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[10px] uppercase tracking-wider font-extrabold text-gray-400">Decoy Fake Password</label>
                    <span className="text-[8px] text-pink-400 font-bold uppercase">(Anti-Nosey Mode)</span>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="E.g. fake123"
                    value={fakePassword}
                    onChange={(e) => setFakePassword(e.target.value)}
                    className={`w-full px-4 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all ${
                      themeMode === 'pastel'
                        ? 'bg-white border-pink-100 text-gray-700'
                        : 'bg-[#1b1226] border-pink-900/50 text-gray-200 focus:ring-pink-800'
                    }`}
                  />
                  <p className="text-[9px] text-gray-400/80 mt-1">
                    Logging in with this password unlocks a fake diary dashboard with decoy boring entries!
                  </p>
                </div>
              )}

              {/* Login/Signup Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 py-3.5 rounded-2xl font-bold bg-gradient-to-r from-pink-500 via-rose-400 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-md hover:shadow-lg hover:shadow-pink-300/30 transition-all duration-300 hover:scale-102 active:scale-98 flex items-center justify-center gap-2 text-sm"
              >
                {isSubmitting ? (
                  <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <>
                    <span>{isUpdateView ? 'Update Magical Keys' : isLoginView ? 'Unlock Vault' : 'Cast Diary Spell'}</span>
                    <span>✨</span>
                  </>
                )}
              </button>
            </form>

            {/* Toggle Switch */}
            <div className="text-center mt-6 flex flex-col gap-3">
              {!isUpdateView && (
                <button
                  type="button"
                  onClick={toggleAuthView}
                  className={`text-xs font-semibold hover:underline transition-colors ${
                    themeMode === 'pastel' ? 'text-purple-600 hover:text-purple-800' : 'text-pink-400 hover:text-pink-300'
                  }`}
                >
                  {isLoginView 
                    ? "Don't have a diary yet? Create one here 🌸" 
                    : "Already registered your heart? Unlock here 🔐"}
                </button>
              )}
              
              <button
                type="button"
                onClick={toggleUpdateView}
                className="text-[10px] font-semibold text-gray-400 hover:text-pink-400 hover:underline transition-colors"
              >
                {isUpdateView ? "Back to Login 🌸" : "Forgot / Change Password? 🪄"}
              </button>
            </div>

            {/* Default credentials note for review */}
            {isLoginView && !isUpdateView && (
              <div className="text-center text-[10px] text-gray-400/80 border-t border-dashed border-pink-200/30 pt-4 mt-6">
                <p>Default Login: <strong className="text-pink-400/90">princess@secret.com</strong></p>
                <p>Real Pass: <strong className="text-pink-400/90">secret</strong> | Decoy Pass: <strong className="text-pink-400/90">fake123</strong></p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

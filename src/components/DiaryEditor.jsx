import React, { useState, useEffect, useRef } from 'react';
import { useDiary } from '../context/DiaryContext';

const MOODS = [
  { emoji: '🥰', name: 'In Love' },
  { emoji: '✨', name: 'Dreamy' },
  { emoji: '🌸', name: 'Happy' },
  { emoji: '🌧️', name: 'Sad' },
  { emoji: '😡', name: 'Grumpy' },
  { emoji: '🎉', name: 'Excited' },
  { emoji: '🤫', name: 'Secretive' }
];

const STICKERS = [
  { id: 'ribbon', symbol: '🎀', label: 'Ribbon' },
  { id: 'star', symbol: '⭐', label: 'Star' },
  { id: 'flower', symbol: '🌸', label: 'Flower' },
  { id: 'cloud', symbol: '☁️', label: 'Cloud' },
  { id: 'cherry', symbol: '🍒', label: 'Cherry' },
  { id: 'heart', symbol: '💖', label: 'Heart' },
  { id: 'crown', symbol: '👑', label: 'Crown' },
  { id: 'butterfly', symbol: '🦋', label: 'Butterfly' }
];

const CATEGORIES = ['Love 💕', 'Friends 🌸', 'Dreams ✨', 'Sad Days 🌧️', 'Happy Moments 🌈', 'Secrets 🔐'];

export default function DiaryEditor({ entry, onClose }) {
  const { addEntry, updateEntry, analyzeMoodSentiment, themeMode } = useDiary();

  // Core form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('🌸');
  const [moodName, setMoodName] = useState('Happy');
  const [category, setCategory] = useState('Secrets 🔐');
  const [sticker, setSticker] = useState('star');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [selfDestruct, setSelfDestruct] = useState(null); // in minutes or null
  
  // Voice recording mock state
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingTimerRef = useRef(null);

  // Auto save
  const autoSaveTimerRef = useRef(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState('');

  // AI Response modal
  const [aiFeedback, setAiFeedback] = useState(null);
  const [showAiModal, setShowAiModal] = useState(false);

  // Populate data if editing existing note
  useEffect(() => {
    if (entry) {
      setTitle(entry.title || '');
      setContent(entry.content || '');
      setMood(entry.mood || '🌸');
      setMoodName(entry.moodName || 'Happy');
      setCategory(entry.category || 'Secrets 🔐');
      setSticker(entry.sticker || 'star');
      setDate(entry.date || new Date().toISOString().split('T')[0]);
      setIsFavorite(entry.isFavorite || false);
      setImageUrl(entry.imageUrl || null);
      setSelfDestruct(entry.selfDestruct || null);
      if (entry.recordedAudio) setRecordedAudio(entry.recordedAudio);
    }
  }, [entry]);

  // Simulated Voice Recorder Timer
  useEffect(() => {
    if (isRecording) {
      setRecordingTime(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    }
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [isRecording]);

  const formatVoiceTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordedAudio(null);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // Simulate audio track creation
    setRecordedAudio({
      duration: recordingTime,
      url: 'mock_audio_wave'
    });
  };

  // Image base64 loading
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Auto save note logic
  useEffect(() => {
    // Skip if it's the initial empty draft load
    if (!title && !content) return;

    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);

    setAutoSaveStatus('Drafting...');
    autoSaveTimerRef.current = setTimeout(async () => {
      setAutoSaveStatus('Saving memory...');
      try {
        const payload = {
          title,
          content,
          mood,
          moodName,
          category,
          sticker,
          date,
          isFavorite,
          imageUrl,
          selfDestruct,
          recordedAudio,
          id: entry?.id
        };

        if (entry?.id) {
          await updateEntry(payload);
        }
        setAutoSaveStatus('Auto-saved ✨');
        setTimeout(() => setAutoSaveStatus(''), 2000);
      } catch (err) {
        setAutoSaveStatus('Auto-save failed 🌧️');
      }
    }, 3000); // Trigger save after 3 seconds of typing idle

    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [title, content, mood, category, sticker, date, isFavorite, imageUrl, selfDestruct, recordedAudio]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      alert("Please write down a secret first! 🤫");
      return;
    }

    const payload = {
      title: title || 'A Secret Thought 🔐',
      content,
      mood,
      moodName,
      category,
      sticker,
      date,
      isFavorite,
      imageUrl,
      selfDestruct,
      recordedAudio,
      id: entry?.id
    };

    try {
      if (entry?.id) {
        await updateEntry(payload);
      } else {
        await addEntry(payload);
      }

      // Analyze mood sentiment and display feedback modal
      const feedback = analyzeMoodSentiment(title, content);
      setAiFeedback(feedback);
      setShowAiModal(true);
    } catch (err) {
      alert('Could not save your diary. Please try again! 🥺');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in">
      <div className={`relative w-full max-w-4xl rounded-[40px] shadow-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 border transition-all duration-300 ${
        themeMode === 'pastel'
          ? 'bg-rose-50 border-pink-200 text-gray-700'
          : 'bg-[#181122] border-pink-900/60 text-gray-200'
      }`}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 md:top-6 md:right-6 w-9 h-9 rounded-full flex items-center justify-center border shadow-sm transition-all hover:scale-105 active:scale-95 ${
            themeMode === 'pastel'
              ? 'bg-white border-pink-100 text-gray-400 hover:text-pink-500 hover:border-pink-300'
              : 'bg-[#21182d] border-pink-950 text-gray-400 hover:text-pink-400 hover:border-pink-800'
          }`}
        >
          ✕
        </button>

        {/* LEFT COLUMN: Controls & Options */}
        <div className="w-full md:w-1/3 flex flex-col gap-5 border-b md:border-b-0 md:border-r border-dashed border-pink-200/40 pb-5 md:pb-0 md:pr-6">
          <h2 className={`font-serif text-xl font-bold flex items-center gap-1.5 ${
            themeMode === 'pastel' ? 'text-purple-950' : 'text-pink-400'
          }`}>
            <span>📔</span> Notebook Options
          </h2>

          {/* Date Picker */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-bold mb-1.5 text-gray-400">Memory Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`w-full px-3 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all ${
                themeMode === 'pastel'
                  ? 'bg-white border-pink-100 text-gray-700'
                  : 'bg-[#221830] border-pink-900/50 text-gray-200 focus:ring-pink-800'
              }`}
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-bold mb-1.5 text-gray-400">Category Tag</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full px-3 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all ${
                themeMode === 'pastel'
                  ? 'bg-white border-pink-100 text-gray-700'
                  : 'bg-[#221830] border-pink-900/50 text-gray-200 focus:ring-pink-800'
              }`}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Mood Selector Grid */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-bold mb-1.5 text-gray-400">How do you feel? (Mood)</label>
            <div className="flex flex-wrap gap-1.5">
              {MOODS.map(m => (
                <button
                  key={m.name}
                  type="button"
                  onClick={() => { setMood(m.emoji); setMoodName(m.name); }}
                  className={`w-9 h-9 rounded-full text-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 ${
                    mood === m.emoji
                      ? themeMode === 'pastel'
                        ? 'bg-pink-200 ring-2 ring-pink-400 text-xl shadow-sm'
                        : 'bg-pink-900/60 ring-2 ring-pink-500 text-xl shadow-[0_0_10px_#ec4899]'
                      : themeMode === 'pastel'
                        ? 'bg-white border border-pink-100 hover:border-pink-200'
                        : 'bg-[#221830] border border-pink-900/30 hover:border-pink-700'
                  }`}
                  title={m.name}
                >
                  {m.emoji}
                </button>
              ))}
            </div>
            <span className="text-[10px] text-gray-400 block mt-1.5 font-medium">Selected: {moodName} {mood}</span>
          </div>

          {/* Cute Sticker selector */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-bold mb-1.5 text-gray-400">Diary Page Sticker</label>
            <div className="flex flex-wrap gap-1.5">
              {STICKERS.map(st => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setSticker(st.id)}
                  className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${
                    sticker === st.id
                      ? themeMode === 'pastel'
                        ? 'bg-purple-100 ring-2 ring-purple-300'
                        : 'bg-purple-900/60 ring-2 ring-purple-500'
                      : themeMode === 'pastel'
                        ? 'bg-white border border-pink-100 hover:border-pink-200'
                        : 'bg-[#221830] border border-pink-900/30 hover:border-pink-700'
                  }`}
                  title={st.label}
                >
                  {st.symbol}
                </button>
              ))}
            </div>
          </div>

          {/* Self Destruct Setting */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-bold mb-1.5 text-gray-400">🔥 Self-Destruct Timer</label>
            <select
              value={selfDestruct || ''}
              onChange={(e) => setSelfDestruct(e.target.value ? parseInt(e.target.value) : null)}
              className={`w-full px-3 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all ${
                themeMode === 'pastel'
                  ? 'bg-white border-pink-100 text-gray-700'
                  : 'bg-[#221830] border-pink-900/50 text-gray-200 focus:ring-pink-800'
              }`}
            >
              <option value="">Keep memory locked forever 🔒</option>
              <option value="1">Self-destruct in 1 minute ⏱️</option>
              <option value="5">Self-destruct in 5 minutes 🔥</option>
              <option value="15">Self-destruct in 15 minutes 🌋</option>
              <option value="60">Self-destruct in 1 hour ⏳</option>
            </select>
            <p className="text-[10px] text-gray-400/80 mt-1">If enabled, note deletes itself after time expires from creation.</p>
          </div>

          {/* Simulated Voice Recorder */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-bold mb-1.5 text-gray-400">🎙️ Voice Diary Attachment</label>
            <div className="flex items-center gap-2">
              {isRecording ? (
                <button
                  type="button"
                  onClick={handleStopRecording}
                  className="py-2 px-4 rounded-xl text-xs font-bold bg-rose-500 text-white animate-pulse flex items-center gap-1.5 transition-all shadow-[0_0_10px_#f43f5e]"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" /> Stop ({formatVoiceTime(recordingTime)})
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStartRecording}
                  className={`py-2 px-4 rounded-xl text-xs font-bold border transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-1.5 ${
                    themeMode === 'pastel'
                      ? 'bg-white border-pink-100 text-pink-500 hover:bg-pink-50'
                      : 'bg-[#221830] border-pink-900/40 text-pink-300 hover:bg-pink-950/20'
                  }`}
                >
                  <span>🎙️</span> Record Voice Secret
                </button>
              )}

              {recordedAudio && !isRecording && (
                <div className={`text-xs px-2.5 py-2 rounded-xl flex items-center gap-1.5 border font-semibold ${
                  themeMode === 'pastel'
                    ? 'bg-green-50 border-green-200 text-green-600'
                    : 'bg-green-950/20 border-green-900/40 text-green-400'
                }`}>
                  <span>🔊 Voice Note Attached ({recordedAudio.duration}s)</span>
                  <button 
                    type="button" 
                    onClick={() => setRecordedAudio(null)} 
                    className="text-[10px] hover:text-rose-500 cursor-pointer"
                    title="Remove Voice Note"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
            {isRecording && (
              <div className="flex items-center gap-0.5 mt-2 h-4 justify-center">
                {Array.from({ length: 15 }).map((_, i) => (
                  <span 
                    key={i} 
                    className="w-[2px] bg-rose-400 rounded-full animate-pulse" 
                    style={{ 
                      height: `${Math.floor(Math.random() * 16) + 4}px`,
                      animationDelay: `${i * 0.05}s` 
                    }} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: The Lined Journal Notebook Sheet */}
        <form onSubmit={handleSave} className="flex-1 flex flex-col gap-4 select-none">
          
          {/* Lined Notebook Paper Layout */}
          <div className={`w-full flex-1 rounded-3xl p-6 md:p-8 flex flex-col relative border ${
            themeMode === 'pastel'
              ? 'bg-[#fffdf8] border-[#ebd9b4] shadow-sm'
              : 'bg-[#1b1523] border-pink-950/60 shadow-lg'
          }`}>
            
            {/* Ribbon Bookmark visual accent */}
            <div className="absolute top-0 right-10 w-6 h-16 bg-gradient-to-b from-rose-500 to-rose-400 rounded-b-md shadow-md z-10" />
            
            {/* Lined notebook side holes */}
            <div className="absolute top-0 bottom-0 left-3 flex flex-col justify-around py-6 pointer-events-none select-none">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className={`w-3.5 h-3.5 rounded-full border shadow-inner ${
                  themeMode === 'pastel' ? 'bg-[#ffeef2] border-pink-200' : 'bg-[#120b18] border-pink-900'
                }`} />
              ))}
            </div>

            {/* Note title */}
            <div className="pl-6 border-b border-pink-200/50 pb-2 mb-4">
              <input
                type="text"
                placeholder="Secret Title... 🌸"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full text-xl font-bold bg-transparent border-none outline-none focus:ring-0 ${
                  themeMode === 'pastel' ? 'text-purple-950 font-serif' : 'text-pink-100 font-sans'
                }`}
              />
            </div>

            {/* Polaroid Camera upload pin visual */}
            <div className="absolute top-16 right-4 md:right-8 z-10">
              <label className="cursor-pointer group flex flex-col items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {imageUrl ? (
                  <div className="bg-white p-2 pb-5 rotate-3 shadow-md w-28 border border-gray-100 rounded-sm relative hover:rotate-0 transition-transform">
                    {/* Tiny push-pin */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-base">📌</div>
                    <img src={imageUrl} alt="Polaroid Memory" className="w-full h-20 object-cover" />
                    <span className="text-[7px] text-gray-400 font-handwriting block text-center mt-1">Memory Photo 📸</span>
                    {/* Clear image button */}
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setImageUrl(null); }}
                      className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[8px] hover:bg-rose-600"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className={`p-2.5 rounded-xl border border-dashed flex items-center justify-center flex-col transition-all group-hover:scale-105 active:scale-95 ${
                    themeMode === 'pastel'
                      ? 'bg-white/80 border-pink-200 text-pink-400 hover:border-pink-300'
                      : 'bg-[#221830]/80 border-pink-900 text-pink-400 hover:border-pink-700'
                  }`}>
                    <span className="text-xl">📸</span>
                    <span className="text-[8px] font-bold uppercase tracking-wider block mt-1">Pin Polaroid</span>
                  </div>
                )}
              </label>
            </div>

            {/* Diary lines / main writing board */}
            <div className="pl-6 flex-1 flex flex-col">
              <textarea
                placeholder="Once upon a time, my heart was feeling... (Write your secret here) 💖"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={`w-full flex-1 bg-transparent border-none outline-none resize-none journal-lines font-handwriting text-2xl tracking-wide placeholder-gray-400 focus:ring-0 ${
                  themeMode === 'pastel' ? 'text-purple-950/80' : 'text-pink-100/90'
                }`}
                style={{ minHeight: '240px' }}
              />
            </div>
          </div>

          {/* Action bar and status indicator */}
          <div className="flex items-center justify-between mt-2 select-none">
            {/* Auto save message */}
            <span className={`text-xs italic font-medium flex items-center gap-1 transition-all ${
              autoSaveStatus ? 'opacity-100' : 'opacity-0'
            } ${
              themeMode === 'pastel' ? 'text-purple-600' : 'text-pink-400'
            }`}>
              <span>✨</span> {autoSaveStatus}
            </span>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className={`py-2.5 px-6 rounded-full text-xs font-bold border transition-all duration-300 hover:scale-102 active:scale-98 ${
                  themeMode === 'pastel'
                    ? 'bg-white border-pink-100 text-gray-500 hover:bg-gray-50'
                    : 'bg-[#221830] border-pink-900/50 text-gray-400 hover:bg-[#1a1224]'
                }`}
              >
                Close Draft
              </button>
              <button
                type="submit"
                className="py-2.5 px-8 rounded-full text-xs font-bold bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white shadow-md hover:shadow-lg hover:shadow-pink-300/30 transition-all duration-300 hover:scale-102 active:scale-98 flex items-center gap-1.5"
              >
                <span>🔐</span> Lock in Diary
              </button>
            </div>
          </div>

        </form>
      </div>

      {/* BEST FRIEND AI THERAPIST RESPONSE MODAL */}
      {showAiModal && aiFeedback && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-[60] animate-fade-in">
          <div className={`w-full max-w-md rounded-[35px] border p-6 md:p-8 relative text-center flex flex-col items-center gap-4 transition-all duration-300 hover:shadow-2xl animate-float-bubble ${
            themeMode === 'pastel'
              ? 'bg-white border-pink-100 text-gray-700 shadow-xl'
              : 'bg-[#1b1523] border-pink-900/60 text-gray-200 shadow-xl shadow-black/40'
          }`}>
            {/* Heart Pulsing bubble icon */}
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-2 animate-pulse-heart ${
              themeMode === 'pastel' ? 'bg-pink-50' : 'bg-pink-950/20'
            }`}>
              💖
            </div>

            <h3 className={`font-serif text-2xl font-bold ${
              themeMode === 'pastel' ? 'text-purple-950' : 'text-pink-300'
            }`}>
              Your AI Bestie Says:
            </h3>

            <div className={`text-xs uppercase tracking-wider font-semibold py-1 px-3 rounded-full ${
              themeMode === 'pastel' ? 'bg-purple-50 text-purple-600' : 'bg-purple-950/30 text-purple-300'
            }`}>
              Detected mood: {aiFeedback.sentiment}
            </div>

            <p className="text-base leading-relaxed italic text-gray-500 dark:text-gray-400 font-sans my-2 px-1">
              "{aiFeedback.response}"
            </p>

            <button
              onClick={() => {
                setShowAiModal(false);
                onClose();
              }}
              className="w-full mt-4 py-3 rounded-full font-bold bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Sweet! Thank you bestie! 💕
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useDiary } from '../context/DiaryContext';

const STICKERS = {
  ribbon: '🎀',
  star: '⭐',
  flower: '🌸',
  cloud: '☁️',
  cherry: '🍒',
  heart: '💖',
  crown: '👑',
  butterfly: '🦋'
};

export default function DiaryCard({ entry, onEdit, onDelete, onOpen }) {
  const { themeMode, updateEntry } = useDiary();
  const [timeLeft, setTimeLeft] = useState(null);

  // Toggle favorite helper
  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    updateEntry({
      ...entry,
      isFavorite: !entry.isFavorite
    });
  };

  // Self destruct timer check
  useEffect(() => {
    if (!entry.selfDestruct || !entry.createdAt) return;

    const calculateTimeLeft = () => {
      const createdTime = new Date(entry.createdAt).getTime();
      const durationMs = parseInt(entry.selfDestruct) * 60 * 1000; // duration in minutes
      const expiryTime = createdTime + durationMs;
      const difference = expiryTime - Date.now();

      if (difference <= 0) {
        onDelete(entry.id);
        return 0;
      }
      return Math.ceil(difference / 1000); // return remaining seconds
    };

    // Calculate immediately
    const remaining = calculateTimeLeft();
    if (remaining > 0) {
      setTimeLeft(remaining);
      const timer = setInterval(() => {
        const rem = calculateTimeLeft();
        if (rem <= 0) {
          clearInterval(timer);
        } else {
          setTimeLeft(rem);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [entry.selfDestruct, entry.createdAt]);

  const formatTimeLeft = (sec) => {
    if (sec === null) return '';
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      onClick={() => onOpen(entry)}
      className={`relative rounded-3xl p-6 transition-all duration-300 hover:scale-[1.02] active:scale-[0.99] cursor-pointer border flex flex-col justify-between group ${
        themeMode === 'pastel'
          ? 'glass hover:shadow-[0_15px_30px_rgba(244,63,94,0.12)] border-pink-100 hover:border-pink-300 text-gray-700'
          : 'glass-dark hover:shadow-[0_15px_30px_rgba(236,72,153,0.15)] border-pink-900/40 hover:border-pink-700/80 text-gray-200'
      }`}
    >
      {/* Decorative Floating Sticker */}
      {entry.sticker && (
        <span 
          className="absolute -top-3 -right-3 text-3xl select-none filter drop-shadow-md z-10 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
          title={`Cute ${entry.sticker} sticker`}
        >
          {STICKERS[entry.sticker] || '✨'}
        </span>
      )}

      {/* Self Destruct Timer Shield */}
      {entry.selfDestruct && (
        <div className={`absolute top-3 left-3 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 select-none z-10 border ${
          themeMode === 'pastel'
            ? 'bg-rose-50 border-rose-200 text-rose-500 animate-pulse'
            : 'bg-rose-950/40 border-rose-800 text-rose-400 animate-pulse'
        }`}>
          <span>🔥 Self-Destruct:</span>
          <span>{timeLeft !== null ? formatTimeLeft(timeLeft) : 'Loading'}</span>
        </div>
      )}

      <div>
        {/* Card Header (Mood & Date) */}
        <div className="flex items-center justify-between mt-2 mb-4">
          <span className="text-xs text-gray-400 font-medium">
            {new Date(entry.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
          <div className="flex items-center gap-1.5">
            <span 
              className="text-xl inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/70 shadow-sm border border-pink-100/30"
              title={`Mood: ${entry.moodName}`}
            >
              {entry.mood}
            </span>
          </div>
        </div>

        {/* Image Attachment Memory preview */}
        {entry.imageUrl && (
          <div className="w-full h-32 rounded-2xl overflow-hidden mb-4 border border-pink-100/40 shadow-sm relative group-hover:border-pink-300/60 transition-colors">
            <img 
              src={entry.imageUrl} 
              alt="Memory attachment" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
          </div>
        )}

        {/* Title */}
        <h3 className={`font-serif text-lg font-bold mb-2 group-hover:text-pink-500 transition-colors ${
          themeMode === 'pastel' ? 'text-purple-950' : 'text-pink-100'
        }`}>
          {entry.title || 'Untitled Secret 🔐'}
        </h3>

        {/* Snippet */}
        <p className={`text-sm leading-relaxed mb-4 line-clamp-4 font-sans ${
          themeMode === 'pastel' ? 'text-gray-500' : 'text-gray-400'
        }`}>
          {entry.content}
        </p>
      </div>

      {/* Card Footer (Tags & Action buttons) */}
      <div className="flex items-center justify-between border-t border-dashed pt-4 mt-2 border-pink-200/40">
        {/* Category tag */}
        <span className={`text-[10px] uppercase tracking-wider font-semibold py-0.5 px-2.5 rounded-full ${
          themeMode === 'pastel'
            ? 'bg-pink-100/60 text-pink-600'
            : 'bg-pink-950/40 text-pink-300 border border-pink-900/30'
        }`}>
          {entry.category}
        </span>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          {/* Favorite heart button */}
          <button
            onClick={handleToggleFavorite}
            className={`p-1.5 rounded-full transition-all duration-300 hover:scale-110 active:scale-90 ${
              entry.isFavorite
                ? 'text-rose-500 scale-105'
                : 'text-gray-300 hover:text-pink-400'
            }`}
            title={entry.isFavorite ? 'Remove from favorites' : 'Mark as favorite'}
          >
            <span className="text-sm">{entry.isFavorite ? '💖' : '🤍'}</span>
          </button>

          {/* Delete entry */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm('Are you sure you want to delete this secret memory forever? 🥺')) {
                onDelete(entry.id);
              }
            }}
            className="p-1.5 rounded-full text-gray-300 hover:text-rose-600 hover:bg-rose-50/50 transition-all duration-300 hover:scale-110 active:scale-90"
            title="Delete memory forever"
          >
            <span className="text-xs">🗑️</span>
          </button>
        </div>
      </div>
    </div>
  );
}

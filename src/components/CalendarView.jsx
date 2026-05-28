import React, { useState } from 'react';
import { useDiary } from '../context/DiaryContext';

export default function CalendarView({ onOpenEntry }) {
  const { entries, themeMode } = useDiary();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Get number of days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Get starting day index of the month (0 = Sunday, 1 = Monday, etc.)
  const startDayIndex = new Date(year, month, 1).getDay();

  // Generate date grid items
  const calendarDays = [];
  
  // Fill leading empty days
  for (let i = 0; i < startDayIndex; i++) {
    calendarDays.push(null);
  }

  // Fill actual month days
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(new Date(year, month, d));
  }

  // Match entries to a specific date (YYYY-MM-DD format)
  const getEntriesForDate = (date) => {
    if (!date) return [];
    const formattedDate = date.toISOString().split('T')[0];
    return entries.filter(e => e.date === formattedDate);
  };

  const monthNames = [
    'January ❄️', 'February 🍫', 'March 🌸', 'April 🌧️', 'May 🌷', 'June ☀️',
    'July 🍉', 'August 🌊', 'September 🍂', 'October 🎃', 'November 🌾', 'December 🎄'
  ];

  const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={`rounded-3xl p-5 md:p-6 border transition-all duration-300 ${
      themeMode === 'pastel'
        ? 'glass shadow-sm border-pink-100 text-gray-700'
        : 'glass-dark shadow-lg border-pink-900/40 text-gray-200'
    }`}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePrevMonth}
          className={`p-2 rounded-full border transition-all hover:scale-105 active:scale-95 ${
            themeMode === 'pastel'
              ? 'bg-white border-pink-100 text-pink-500 hover:bg-pink-50'
              : 'bg-[#221830] border-pink-900/40 text-pink-300 hover:bg-pink-950/20'
          }`}
        >
          ◀
        </button>

        <h3 className={`font-serif text-lg font-bold select-none ${
          themeMode === 'pastel' ? 'text-purple-950' : 'text-pink-300'
        }`}>
          {monthNames[month]} {year}
        </h3>

        <button
          onClick={handleNextMonth}
          className={`p-2 rounded-full border transition-all hover:scale-105 active:scale-95 ${
            themeMode === 'pastel'
              ? 'bg-white border-pink-100 text-pink-500 hover:bg-pink-50'
              : 'bg-[#221830] border-pink-900/40 text-pink-300 hover:bg-pink-950/20'
          }`}
        >
          ▶
        </button>
      </div>

      {/* Weekdays Labels */}
      <div className="grid grid-cols-7 gap-1.5 mb-2 text-center font-bold text-xs uppercase tracking-wider text-gray-400 select-none">
        {weekdayNames.map(day => (
          <div key={day} className="py-1">{day}</div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {calendarDays.map((dateObj, idx) => {
          if (!dateObj) {
            return <div key={`empty-${idx}`} className="aspect-square opacity-0" />;
          }

          const dayEntries = getEntriesForDate(dateObj);
          const hasEntries = dayEntries.length > 0;
          const dominantMood = hasEntries ? dayEntries[0].mood : null;
          const isToday = new Date().toDateString() === dateObj.toDateString();

          return (
            <div
              key={dateObj.toISOString()}
              onClick={() => hasEntries && onOpenEntry(dayEntries[0])}
              className={`aspect-square rounded-2xl p-1.5 flex flex-col justify-between relative transition-all duration-300 border ${
                hasEntries 
                  ? 'cursor-pointer hover:scale-105 active:scale-95' 
                  : 'select-none'
              } ${
                isToday
                  ? themeMode === 'pastel'
                    ? 'bg-pink-100/75 border-pink-300 text-pink-600 font-bold'
                    : 'bg-pink-950/30 border-pink-600 text-pink-300 font-bold shadow-[0_0_8px_rgba(236,72,153,0.3)]'
                  : hasEntries
                    ? themeMode === 'pastel'
                      ? 'bg-purple-50/70 border-purple-100 hover:border-purple-300'
                      : 'bg-purple-950/20 border-purple-900/30 hover:border-purple-700/60'
                    : themeMode === 'pastel'
                      ? 'bg-white/30 border-transparent text-gray-500'
                      : 'bg-[#221830]/20 border-transparent text-gray-400'
              }`}
            >
              {/* Day Number */}
              <span className="text-xs select-none">{dateObj.getDate()}</span>

              {/* Mood Emoji Icon Badge */}
              {hasEntries && dominantMood && (
                <div 
                  className="self-end text-lg animate-pulse-heart"
                  title={`${dayEntries.length} secrets: "${dayEntries[0].title}"`}
                >
                  {dominantMood}
                </div>
              )}

              {/* Dots tracker (if multiple entries on same day) */}
              {dayEntries.length > 1 && (
                <div className="absolute bottom-1 left-1.5 flex gap-0.5">
                  {dayEntries.map((_, i) => (
                    <span key={i} className="w-1 h-1 rounded-full bg-pink-400" />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mood Tracker Stats Legenda */}
      <div className="border-t border-dashed border-pink-200/40 mt-5 pt-4 flex flex-wrap items-center justify-between text-[10px] text-gray-400 select-none">
        <span className="font-semibold tracking-wide uppercase">Tracked Moods key:</span>
        <div className="flex gap-2.5 mt-1 sm:mt-0 font-medium">
          <span>🥰 Love</span>
          <span>✨ Dreamy</span>
          <span>🌸 Happy</span>
          <span>🌧️ Sad</span>
          <span>🤫 Secrets</span>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useDiary } from '../context/DiaryContext';
import DiaryCard from '../components/DiaryCard';
import DiaryEditor from '../components/DiaryEditor';
import CalendarView from '../components/CalendarView';

const CATEGORIES = ['All', 'Love 💕', 'Friends 🌸', 'Dreams ✨', 'Sad Days 🌧️', 'Happy Moments 🌈', 'Secrets 🔐'];

export default function Dashboard() {
  const {
    currentUser,
    isFakeMode,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    favoriteFilter,
    setFavoriteFilter,
    filteredEntries,
    deleteEntry,
    secretHiddenMode,
    setSecretHiddenMode,
    themeMode
  } = useDiary();

  // Active view tab: 'secrets' (Pinterest) or 'calendar'
  const [activeTab, setActiveTab] = useState('secrets');
  
  // Editor modal controller
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  // Calculator Disguise State
  const [calcInput, setCalcInput] = useState('');
  const [calcResult, setCalcResult] = useState('');

  const handleOpenCreate = () => {
    setEditingEntry(null);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (entry) => {
    setEditingEntry(entry);
    setIsEditorOpen(true);
  };

  // Disguise calculator logic
  const handleCalcClick = (val) => {
    if (val === 'C') {
      setCalcInput('');
      setCalcResult('');
    } else if (val === '=') {
      try {
        // Safe evaluation of basic math expressions only
        const sanitized = calcInput.replace(/[^0-9+\-*/.]/g, '');
        const res = new Function(`return ${sanitized}`)();
        setCalcResult(res.toString());
      } catch (e) {
        setCalcResult('Error');
      }
    } else {
      setCalcInput(prev => prev + val);
    }
  };

  // Secret unlock button handler (disguise exit)
  const handleExitDisguise = () => {
    setSecretHiddenMode(false);
  };

  if (secretHiddenMode) {
    /* DISGUISE MODE: Boring Calculator Spreadsheet Interface */
    return (
      <div className="fixed inset-0 z-50 bg-[#f3f4f6] text-gray-700 font-sans flex flex-col select-text fake-grid">
        {/* Boring Spreadsheet Header */}
        <div className="bg-[#1f2937] text-white px-6 py-3 flex items-center justify-between border-b border-gray-700 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            <span className="font-semibold text-sm tracking-wide">Excel - MathExercise_Homework_Ch3.xlsx</span>
          </div>
          <span className="text-xs text-gray-400">Status: Read-only</span>
        </div>

        {/* Spreadsheet Toolbar */}
        <div className="bg-gray-100 border-b border-gray-300 px-6 py-2 flex gap-4 text-xs font-medium text-gray-500">
          <span className="text-blue-600 border-b-2 border-blue-600 pb-1 cursor-pointer">File</span>
          <span className="cursor-pointer">Insert</span>
          <span className="cursor-pointer">Page Layout</span>
          <span className="cursor-pointer">Formulas</span>
          <span className="cursor-pointer">Data</span>
          <span className="cursor-pointer">Review</span>
        </div>

        {/* Main Disguise Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Main math grid */}
          <div className="flex-1 p-6 overflow-y-auto">
            <h2 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Homework Section 4.2 - Advanced Trigonometry Matrices</h2>
            
            <table className="w-full text-left border-collapse text-xs border border-gray-300 mb-6 bg-white shadow-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-300 text-gray-600 font-semibold">
                  <th className="p-2.5 border-r border-gray-300 w-10">ID</th>
                  <th className="p-2.5 border-r border-gray-300">Formula Column (A)</th>
                  <th className="p-2.5 border-r border-gray-300">Variable (B)</th>
                  <th className="p-2.5 border-r border-gray-300">Expected Result (C)</th>
                  <th className="p-2.5">Pass Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="p-2.5 border-r border-gray-300 bg-gray-50 font-bold">1</td>
                  <td className="p-2.5 border-r border-gray-300 font-mono">f(x) = sin(x)^2 + cos(x)^2</td>
                  <td className="p-2.5 border-r border-gray-300">x = 0.523rad</td>
                  <td className="p-2.5 border-r border-gray-300 font-mono">1.0000</td>
                  <td className="p-2.5 text-green-600 font-semibold">SUCCESS</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-2.5 border-r border-gray-300 bg-gray-50 font-bold">2</td>
                  <td className="p-2.5 border-r border-gray-300 font-mono">g(y) = log(y) + ln(y - 2.5)</td>
                  <td className="p-2.5 border-r border-gray-300">y = 4.120</td>
                  <td className="p-2.5 border-r border-gray-300 font-mono">1.1004</td>
                  <td className="p-2.5 text-green-600 font-semibold">SUCCESS</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-2.5 border-r border-gray-300 bg-gray-50 font-bold">3</td>
                  <td className="p-2.5 border-r border-gray-300 font-mono">h(z) = lim(n-&gt;inf) (1 + z/n)^n</td>
                  <td className="p-2.5 border-r border-gray-300">z = 2.0</td>
                  <td className="p-2.5 border-r border-gray-300 font-mono">7.3890 (e^2)</td>
                  <td className="p-2.5 text-green-600 font-semibold">SUCCESS</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-2.5 border-r border-gray-300 bg-gray-50 font-bold">4</td>
                  <td className="p-2.5 border-r border-gray-300 font-mono">m(k) = sum(1/k^2)</td>
                  <td className="p-2.5 border-r border-gray-300">k = [1..inf]</td>
                  <td className="p-2.5 border-r border-gray-300 font-mono">1.6449 (pi^2/6)</td>
                  <td className="p-2.5 text-yellow-600 font-semibold">PENDING</td>
                </tr>
              </tbody>
            </table>

            <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-xl p-4 text-xs leading-relaxed max-w-2xl">
              <strong>Fairy Study Tip:</strong> Please verify that all trigonometric functions are set to radian mode before running matrix operations. Double check your rounding constants on Column C to prevent precision floats errors.
            </div>
          </div>

          {/* Fully functional side calculator */}
          <div className="w-full md:w-80 bg-gray-200 border-t md:border-t-0 md:border-l border-gray-300 p-6 flex flex-col gap-4 select-none">
            <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide">Quick Calculator Tool</h3>
            
            {/* Display screen */}
            <div className="bg-white border border-gray-400 rounded-xl p-3 text-right shadow-inner min-h-[75px] flex flex-col justify-between">
              <div className="text-gray-400 text-xs font-mono break-all">{calcInput || '0'}</div>
              <div className="text-2xl font-bold text-gray-800 font-mono break-all">{calcResult || '0'}</div>
            </div>

            {/* Buttons grid */}
            <div className="grid grid-cols-4 gap-2">
              {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', 'C', '0', '=', '+'].map(btn => (
                <button
                  key={btn}
                  onClick={() => handleCalcClick(btn)}
                  className={`py-3.5 rounded-xl font-mono text-sm font-bold shadow-sm transition-all active:scale-95 ${
                    btn === 'C'
                      ? 'bg-red-100 text-red-600 hover:bg-red-200'
                      : btn === '='
                        ? 'bg-blue-600 text-white hover:bg-blue-700 col-span-1'
                        : 'bg-white hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Secret exit trigger at bottom */}
        <div className="bg-gray-100 border-t border-gray-300 py-3 px-6 text-center text-[10px] text-gray-400 flex items-center justify-between">
          <span>Excel Workspace v4.11</span>
          
          {/* Secret lock button overlay (exits disguise) */}
          <button
            onClick={handleExitDisguise}
            className="text-gray-400 hover:text-pink-400 transition-colors flex items-center gap-1 font-semibold outline-none focus:outline-none"
            title="Unlock secrets 🔐"
          >
            <span>🤍</span> Exit Workbook
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8 select-none">
      
      {/* Decoy Banner Indicator */}
      {isFakeMode && (
        <div className="w-full py-2 px-6 mb-6 rounded-2xl bg-amber-500/25 border border-amber-600/30 text-amber-600 text-xs font-bold text-center animate-pulse">
          ⚠️ DECOY MODE ACTIVE: Nosey-friend protection is enabled. Displaying false journal records.
        </div>
      )}

      {/* SEARCH BAR & VIEW TOGGLES */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        
        {/* Search Bar Input */}
        <div className="w-full md:w-80 relative">
          <input
            type="text"
            placeholder="Search private memory... 🔍"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-full border text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all ${
              themeMode === 'pastel'
                ? 'bg-white/80 border-pink-100/60 text-gray-700'
                : 'bg-[#1b1226] border-pink-900/50 text-gray-200 focus:ring-pink-800'
            }`}
          />
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">🔍</span>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')} 
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-pink-500 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Section View Tabs Toggle */}
        <div className={`p-1 rounded-full border flex gap-1 ${
          themeMode === 'pastel' ? 'bg-pink-50/60 border-pink-100' : 'bg-[#1b1226] border-pink-900/40'
        }`}>
          <button
            onClick={() => { setActiveTab('secrets'); setFavoriteFilter(false); }}
            className={`py-1.5 px-6 rounded-full text-xs font-bold transition-all duration-300 ${
              activeTab === 'secrets' && !favoriteFilter
                ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-sm'
                : 'text-gray-400 hover:text-pink-400'
            }`}
          >
            Memories Grid 🎀
          </button>
          <button
            onClick={() => { setActiveTab('calendar'); setFavoriteFilter(false); }}
            className={`py-1.5 px-6 rounded-full text-xs font-bold transition-all duration-300 ${
              activeTab === 'calendar'
                ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-sm'
                : 'text-gray-400 hover:text-pink-400'
            }`}
          >
            Calendar view 📅
          </button>
          <button
            onClick={() => { setFavoriteFilter(true); setActiveTab('secrets'); }}
            className={`py-1.5 px-6 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-1 ${
              favoriteFilter
                ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-sm'
                : 'text-gray-400 hover:text-rose-400'
            }`}
          >
            <span>💖</span> Favorites
          </button>
        </div>
      </div>

      {/* MAIN VIEW CONTROLLER */}
      {activeTab === 'calendar' ? (
        /* TAB 2: Calendar memories */
        <div className="max-w-3xl mx-auto animate-fade-in">
          <CalendarView onOpenEntry={handleOpenEdit} />
        </div>
      ) : (
        /* TAB 1: Pinterest Secrets masonry columns */
        <div className="animate-fade-in">
          
          {/* Category Tag Filters */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`py-1.5 px-4 rounded-full text-xs font-semibold transition-all duration-300 hover:scale-105 active:scale-95 border ${
                  selectedCategory === cat
                    ? 'bg-pink-500 border-pink-500 text-white shadow-md'
                    : themeMode === 'pastel'
                      ? 'bg-white border-pink-100 hover:border-pink-300 text-gray-500'
                      : 'bg-[#1b1226] border-pink-900/30 hover:border-pink-800 text-gray-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid display */}
          {filteredEntries.length === 0 ? (
            <div className="text-center py-20">
              <span className="text-5xl block mb-4">🧸</span>
              <h3 className={`font-serif text-xl font-bold mb-2 ${
                themeMode === 'pastel' ? 'text-purple-950' : 'text-pink-300'
              }`}>
                No locked memories found...
              </h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                No secrets matching your filter. Write down a new memory to fill your private princess diary!
              </p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {filteredEntries.map(entry => (
                <div key={entry.id} className="break-inside-avoid">
                  <DiaryCard
                    entry={entry}
                    onOpen={handleOpenEdit}
                    onEdit={handleOpenEdit}
                    onDelete={deleteEntry}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FLOATING ACTION ADD-ENTRY BUTTON */}
      <button
        onClick={handleOpenCreate}
        className="fixed bottom-6 left-6 z-50 p-4 rounded-full shadow-lg bg-gradient-to-r from-pink-500 via-rose-400 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 transition-all duration-300 hover:scale-110 active:scale-95 group"
        title="Write down a new secret ✍️"
      >
        <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-300 -z-10" />
        <span className="text-xl flex items-center justify-center">✍️</span>
        {/* Hover Label */}
        <span className="absolute left-full ml-3 bg-white/90 text-pink-500 text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-pink-100 shadow-sm whitespace-nowrap font-medium font-sans">
          Write New Secret ✨
        </span>
      </button>

      {/* DIARY WRITER EDITOR MODAL */}
      {isEditorOpen && (
        <DiaryEditor
          entry={editingEntry}
          onClose={() => {
            setIsEditorOpen(false);
            setEditingEntry(null);
          }}
        />
      )}

    </div>
  );
}

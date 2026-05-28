import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService, databaseService } from '../services/firebaseService';

const DiaryContext = createContext();

export const useDiary = () => useContext(DiaryContext);

export const DiaryProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isFakeMode, setIsFakeMode] = useState(false);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Customization states
  const [themeMode, setThemeMode] = useState('pastel'); // 'pastel' or 'dark'
  const [secretHiddenMode, setSecretHiddenMode] = useState(false); // calculator disguise
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favoriteFilter, setFavoriteFilter] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Sync session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('diary_session_user');
    const savedFake = localStorage.getItem('diary_session_fake') === 'true';
    const savedTheme = localStorage.getItem('diary_theme') || 'pastel';
    
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setCurrentUser(parsedUser);
      setIsFakeMode(savedFake);
      loadEntries(parsedUser.email, savedFake);
    }
    setThemeMode(savedTheme);
  }, []);

  // Theme effect
  useEffect(() => {
    localStorage.setItem('diary_theme', themeMode);
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  // Load entries
  const loadEntries = async (email, fakeFlag) => {
    setLoading(true);
    try {
      const data = await databaseService.getEntries(email, fakeFlag);
      setEntries(data);
      setError(null);
    } catch (err) {
      setError('Could not retrieve secrets from database. 🔐');
    } finally {
      setLoading(false);
    }
  };

  // Auth Operations
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const user = await authService.login(email, password);
      setCurrentUser(user);
      setIsFakeMode(user.isFakeMode);
      
      localStorage.setItem('diary_session_user', JSON.stringify(user));
      localStorage.setItem('diary_session_fake', user.isFakeMode ? 'true' : 'false');
      
      await loadEntries(user.email, user.isFakeMode);
      return user;
    } catch (err) {
      setError(err.message || 'Login failed.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password, displayName, fakePassword) => {
    setLoading(true);
    setError(null);
    try {
      const user = await authService.signUp(email, password, displayName, fakePassword);
      setCurrentUser(user);
      setIsFakeMode(false);
      
      localStorage.setItem('diary_session_user', JSON.stringify(user));
      localStorage.setItem('diary_session_fake', 'false');
      
      setEntries([]);
      return user;
    } catch (err) {
      setError(err.message || 'Signup failed.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsFakeMode(false);
    setEntries([]);
    localStorage.removeItem('diary_session_user');
    localStorage.removeItem('diary_session_fake');
  };

  // Entry CRUD Operations
  const addEntry = async (entryData) => {
    if (!currentUser) return;
    setError(null);
    try {
      const newEntry = await databaseService.saveEntry(currentUser.email, entryData, isFakeMode);
      setEntries(prev => [newEntry, ...prev]);
      return newEntry;
    } catch (err) {
      setError('Failed to record your memory. 🌧️');
      throw err;
    }
  };

  const updateEntry = async (updatedData) => {
    if (!currentUser) return;
    setError(null);
    try {
      const result = await databaseService.updateEntry(currentUser.email, updatedData, isFakeMode);
      setEntries(prev => prev.map(e => e.id === updatedData.id ? result : e));
      return result;
    } catch (err) {
      setError('Failed to update your diary. 🌸');
      throw err;
    }
  };

  const deleteEntry = async (entryId) => {
    if (!currentUser) return;
    setError(null);
    try {
      await databaseService.deleteEntry(currentUser.email, entryId, isFakeMode);
      setEntries(prev => prev.filter(e => e.id !== entryId));
    } catch (err) {
      setError('Could not delete memory. 🔐');
      throw err;
    }
  };

  // Best Friend AI Mood Analysis
  const analyzeMoodSentiment = (title = '', content = '') => {
    const text = (title + ' ' + content).toLowerCase();
    
    const sadKeywords = ['sad', 'cry', 'lonely', 'hurt', 'bad', 'scared', 'rain', 'grey', 'tears', 'upset', 'hate', 'broke', 'pain'];
    const loveKeywords = ['love', 'crush', 'cute', 'boy', 'heart', 'smiled', 'blush', 'kiss', 'date', 'romantic', 'handsome'];
    const happyKeywords = ['happy', 'fun', 'excited', 'picnic', 'bestie', 'laugh', 'cupcake', 'wonderful', 'joy', 'smile', 'dance', 'cake'];
    const dreamKeywords = ['dream', 'fly', 'future', 'stars', 'cloud', 'clouds', 'magical', 'wish', 'rainbow', 'moon'];
    const secretKeywords = ['secret', 'vault', 'shh', 'hide', 'hidden', 'private', 'nobody'];

    const countMatches = (list) => list.reduce((acc, word) => acc + (text.split(word).length - 1), 0);

    const scores = {
      sad: countMatches(sadKeywords),
      love: countMatches(loveKeywords),
      happy: countMatches(happyKeywords),
      dream: countMatches(dreamKeywords),
      secret: countMatches(secretKeywords)
    };

    let dominantMood = 'default';
    let maxScore = 0;
    
    Object.entries(scores).forEach(([mood, score]) => {
      if (score > maxScore) {
        maxScore = score;
        dominantMood = mood;
      }
    });

    switch (dominantMood) {
      case 'sad':
        return {
          sentiment: 'Sad Days 🌧️',
          response: "Oh, sweetie... I feel you. 🌧️ It's completely okay to have soft, grey days and let your heart rest. Remember that flowers need rain to grow. Wrap yourself in a warm blanket, eat something sweet, and take it slow today. You are so strong and so loved. 💖"
        };
      case 'love':
        return {
          sentiment: 'Love 💕',
          response: "Oh my goodness! My heart is doing little flips just reading this! 💕 Love is such a beautiful, fluttery adventure. Whether it's a sweet smile or a quiet heart-flutter, you deserve all the butterflies and sparkles in the universe! Keep glowing, princess! 🦋✨"
        };
      case 'happy':
        return {
          sentiment: 'Happy Moments 🌈',
          response: "Yay! This is absolute magic! 🌈 Your happiness literally shines through the screen. Reading this makes me smile so wide. Treasure these beautiful memories—they are like sunshine stored in jars for rainy days! Keep laughing! 🌸🍰"
        };
      case 'dream':
        return {
          sentiment: 'Dreams ✨',
          response: "Wow, what a spectacular, magical dream! 🌠 Never stop dreaming big, lovely. The universe is quietly plotting to make your wishes bloom, and your imagination is a superpower. Keep flying high! ☁️✨"
        };
      case 'secret':
        return {
          sentiment: 'Secrets 🔐',
          response: "Shh... your secret is absolutely safe in our magical vault. 🔐 It's so special to have a private world that belongs completely to you. I'm holding this secret tight so you can breathe easily and be yourself! 🤫💖"
        };
      default:
        return {
          sentiment: 'Thoughtful 🌸',
          response: "Thank you for sharing your thoughts with me, darling. Writing things down is like giving your heart a soft, warm hug. Whatever you're feeling, you are doing amazing, and I am always here to listen to your secrets. 🌸🔐"
        };
    }
  };

  // Filtered entries helper
  const getFilteredEntries = () => {
    return entries.filter(entry => {
      const matchSearch = 
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchCategory = selectedCategory === 'All' || entry.category === selectedCategory;
      const matchFavorite = !favoriteFilter || entry.isFavorite;

      return matchSearch && matchCategory && matchFavorite;
    });
  };

  return (
    <DiaryContext.Provider
      value={{
        currentUser,
        isFakeMode,
        entries,
        loading,
        error,
        themeMode,
        setThemeMode,
        secretHiddenMode,
        setSecretHiddenMode,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        favoriteFilter,
        setFavoriteFilter,
        isAudioPlaying,
        setIsAudioPlaying,
        login,
        signup,
        logout,
        addEntry,
        updateEntry,
        deleteEntry,
        analyzeMoodSentiment,
        filteredEntries: getFilteredEntries()
      }}
    >
      {children}
    </DiaryContext.Provider>
  );
};

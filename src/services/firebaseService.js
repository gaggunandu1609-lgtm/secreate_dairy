import { firebaseConfig, USE_FIREBASE } from '../config/firebaseConfig';

// A mock service that falls back to LocalStorage, offering an out-of-the-box working experience.
// It emulates Firebase auth and firestore API methods with simulated network delay.

const delay = (ms = 600) => new Promise(resolve => setTimeout(resolve, ms));

const DEFAULT_USERS = {
  'princess@secret.com': {
    email: 'princess@secret.com',
    password: 'secret',
    displayName: 'Princess Lily 👑',
    fakePassword: 'fake123' // Fake password mode unlocks decoy entries!
  }
};

const DEFAULT_ENTRIES = [
  {
    id: 'entry-1',
    title: 'First time we met in the cherry garden 🌸',
    content: `Today was absolutely magical. The cherry blossoms were falling like pink snow, and he looked at me and smiled. My heart did a little double bounce! 

We talked for hours about everything and nothing. I hope this feeling never fades... I am writing this here because it's a secret I want to keep locked in my heart forever. 💕`,
    mood: '🥰',
    moodName: 'In Love',
    category: 'Love 💕',
    date: '2026-05-28',
    createdAt: new Date('2026-05-28T10:00:00Z').toISOString(),
    isFavorite: true,
    sticker: 'ribbon',
    selfDestruct: null,
    imageUrl: null
  },
  {
    id: 'entry-2',
    title: 'Flying over pastel clouds ☁️',
    content: `Last night I had the most wonderful dream. I was floating on lavender-colored clouds, and the sky was filled with glowing butterflies and gold stardust. 

I was wearing a dress made of rose petals, and I could fly just by thinking about it! I woke up feeling so warm and inspired. I want to draw the sky exactly how I saw it. ✨`,
    mood: '✨',
    moodName: 'Dreamy',
    category: 'Dreams ✨',
    date: '2026-05-27',
    createdAt: new Date('2026-05-27T08:30:00Z').toISOString(),
    isFavorite: false,
    sticker: 'star',
    selfDestruct: null,
    imageUrl: null
  },
  {
    id: 'entry-3',
    title: 'Strawberry picnic with Lily and Chloe 🍓',
    content: `We spent the whole afternoon at the park! We sat under the big oak tree, ate homemade strawberry cupcakes (Chloe made them, they were a bit burnt but sweet!), and listened to soft acoustic music. 

We made daisy chains and laughed until our tummies hurt. These girls make my world so bright. I'm so lucky to have them. 🌸`,
    mood: '🌸',
    moodName: 'Happy',
    category: 'Friends 🌸',
    date: '2026-05-26',
    createdAt: new Date('2026-05-26T16:15:00Z').toISOString(),
    isFavorite: true,
    sticker: 'flower',
    selfDestruct: null,
    imageUrl: null
  },
  {
    id: 'entry-4',
    title: 'Sometimes it\'s okay to cry 🌧️',
    content: `Today was a bit of a grey day. I felt overwhelmed with school and felt like crying for no reason. 

But I wrapped myself in my softest blanket, made hot cocoa, and wrote this. My diary is my safe space where I don't have to pretend to be strong. Tomorrow will be a brighter day. 💖`,
    mood: '🌧️',
    moodName: 'Sad',
    category: 'Sad Days 🌧️',
    date: '2026-05-25',
    createdAt: new Date('2026-05-25T21:40:00Z').toISOString(),
    isFavorite: false,
    sticker: 'cloud',
    selfDestruct: null,
    imageUrl: null
  }
];

const DEFAULT_DECOY_ENTRIES = [
  {
    id: 'decoy-1',
    title: 'Math homework is so long 📝',
    content: 'Did 20 math equations today. They were extremely boring. Must study harder for the test on Friday. Also need to buy a new blue pen.',
    mood: '😐',
    moodName: 'Bored',
    category: 'Secrets 🔐',
    date: '2026-05-28',
    createdAt: new Date('2026-05-28T09:00:00Z').toISOString(),
    isFavorite: false,
    sticker: 'star',
    selfDestruct: null,
    imageUrl: null
  },
  {
    id: 'decoy-2',
    title: 'Cleaned my room 🧹',
    content: 'Folded my clothes and organized my bookshelf. Put my textbooks in order. Cleaned the window. Looks neat.',
    mood: '🌸',
    moodName: 'Peaceful',
    category: 'Happy Moments 🌈',
    date: '2026-05-27',
    createdAt: new Date('2026-05-27T14:00:00Z').toISOString(),
    isFavorite: false,
    sticker: 'flower',
    selfDestruct: null,
    imageUrl: null
  }
];

// Helper to initialize local storage
const initStorage = () => {
  if (!localStorage.getItem('diary_users')) {
    localStorage.setItem('diary_users', JSON.stringify(DEFAULT_USERS));
  }
  if (!localStorage.getItem('diary_entries_princess@secret.com')) {
    localStorage.setItem('diary_entries_princess@secret.com', JSON.stringify(DEFAULT_ENTRIES));
  }
  if (!localStorage.getItem('diary_decoy_entries_princess@secret.com')) {
    localStorage.setItem('diary_decoy_entries_princess@secret.com', JSON.stringify(DEFAULT_DECOY_ENTRIES));
  }
};

initStorage();

export const authService = {
  login: async (email, password) => {
    await delay(800);
    const users = JSON.parse(localStorage.getItem('diary_users') || '{}');
    const user = users[email.toLowerCase().trim()];
    
    if (!user) {
      throw new Error('Key not found... Is the spelling correct? 🗝️');
    }

    if (password === user.password) {
      return {
        email: user.email,
        displayName: user.displayName,
        isFakeMode: false
      };
    } else if (password === user.fakePassword) {
      // Fake password triggers decoy database mode
      return {
        email: user.email,
        displayName: user.displayName + " (Decoy)",
        isFakeMode: true
      };
    } else {
      throw new Error('The magic password didn\'t match the lock! 🔐');
    }
  },

  signUp: async (email, password, displayName, fakePassword = 'fake123') => {
    await delay(1000);
    const users = JSON.parse(localStorage.getItem('diary_users') || '{}');
    const cleanEmail = email.toLowerCase().trim();

    if (users[cleanEmail]) {
      throw new Error('This diary is already registered in our magical realm! ✨');
    }

    const newUser = {
      email: cleanEmail,
      password,
      displayName: displayName || 'Lovely Princess 🌸',
      fakePassword
    };

    users[cleanEmail] = newUser;
    localStorage.setItem('diary_users', JSON.stringify(users));
    
    // Initialize empty collections
    localStorage.setItem(`diary_entries_${cleanEmail}`, JSON.stringify([]));
    localStorage.setItem(`diary_decoy_entries_${cleanEmail}`, JSON.stringify([]));

    return {
      email: newUser.email,
      displayName: newUser.displayName,
      isFakeMode: false
    };
  }
};

export const databaseService = {
  getEntries: async (email, isFakeMode = false) => {
    await delay(500);
    const storageKey = isFakeMode 
      ? `diary_decoy_entries_${email.toLowerCase().trim()}`
      : `diary_entries_${email.toLowerCase().trim()}`;
    return JSON.parse(localStorage.getItem(storageKey) || '[]');
  },

  saveEntry: async (email, entry, isFakeMode = false) => {
    await delay(400);
    const storageKey = isFakeMode 
      ? `diary_decoy_entries_${email.toLowerCase().trim()}`
      : `diary_entries_${email.toLowerCase().trim()}`;
    const entries = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    const newEntry = {
      ...entry,
      id: entry.id || 'entry-' + Math.random().toString(36).substr(2, 9),
      createdAt: entry.createdAt || new Date().toISOString()
    };

    entries.unshift(newEntry); // newest first
    localStorage.setItem(storageKey, JSON.stringify(entries));
    return newEntry;
  },

  updateEntry: async (email, updatedEntry, isFakeMode = false) => {
    await delay(400);
    const storageKey = isFakeMode 
      ? `diary_decoy_entries_${email.toLowerCase().trim()}`
      : `diary_entries_${email.toLowerCase().trim()}`;
    let entries = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    entries = entries.map(e => e.id === updatedEntry.id ? updatedEntry : e);
    localStorage.setItem(storageKey, JSON.stringify(entries));
    return updatedEntry;
  },

  deleteEntry: async (email, entryId, isFakeMode = false) => {
    await delay(400);
    const storageKey = isFakeMode 
      ? `diary_decoy_entries_${email.toLowerCase().trim()}`
      : `diary_entries_${email.toLowerCase().trim()}`;
    let entries = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    entries = entries.filter(e => e.id !== entryId);
    localStorage.setItem(storageKey, JSON.stringify(entries));
    return entryId;
  }
};

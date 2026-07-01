import { firebaseConfig, USE_FIREBASE } from '../config/firebaseConfig';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, collection, query, getDocs, deleteDoc } from 'firebase/firestore';

// Initialize Firebase conditionally
let app;
let db;
if (USE_FIREBASE) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  } catch (err) {
    console.error("Firebase initialization error:", err);
  }
}

const delay = (ms = 600) => new Promise(resolve => setTimeout(resolve, ms));

const DEFAULT_USERS = {
  'princess@secret.com': {
    email: 'princess@secret.com',
    password: 'secret',
    displayName: 'Princess Lily 👑',
    fakePassword: 'fake123'
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
  }
];

// Helper to initialize local storage for offline mode
const initStorage = () => {
  if (USE_FIREBASE) return;
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
    const cleanEmail = email.toLowerCase().trim();
    let user;

    if (USE_FIREBASE) {
      const userDoc = await getDoc(doc(db, "users", cleanEmail));
      if (userDoc.exists()) {
        user = userDoc.data();
      }
    } else {
      const users = JSON.parse(localStorage.getItem('diary_users') || '{}');
      user = users[cleanEmail];
    }
    
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
    const cleanEmail = email.toLowerCase().trim();

    if (USE_FIREBASE) {
      const userDoc = await getDoc(doc(db, "users", cleanEmail));
      if (userDoc.exists()) {
        throw new Error('This diary is already registered in our magical realm! ✨');
      }
    } else {
      const users = JSON.parse(localStorage.getItem('diary_users') || '{}');
      if (users[cleanEmail]) {
        throw new Error('This diary is already registered in our magical realm! ✨');
      }
    }

    const newUser = {
      email: cleanEmail,
      password,
      displayName: displayName || 'Lovely Princess 🌸',
      fakePassword
    };

    if (USE_FIREBASE) {
      await setDoc(doc(db, "users", cleanEmail), newUser);
    } else {
      const users = JSON.parse(localStorage.getItem('diary_users') || '{}');
      users[cleanEmail] = newUser;
      localStorage.setItem('diary_users', JSON.stringify(users));
      localStorage.setItem(`diary_entries_${cleanEmail}`, JSON.stringify([]));
      localStorage.setItem(`diary_decoy_entries_${cleanEmail}`, JSON.stringify([]));
    }

    return {
      email: newUser.email,
      displayName: newUser.displayName,
      isFakeMode: false
    };
  },

  updateCredentials: async (oldEmail, oldPassword, newEmail, newPassword) => {
    await delay(1000);
    const cleanOldEmail = oldEmail.toLowerCase().trim();
    const cleanNewEmail = newEmail.toLowerCase().trim();
    let user;

    if (USE_FIREBASE) {
      const userDoc = await getDoc(doc(db, "users", cleanOldEmail));
      if (userDoc.exists()) {
        user = userDoc.data();
      }
    } else {
      const users = JSON.parse(localStorage.getItem('diary_users') || '{}');
      user = users[cleanOldEmail];
    }
    
    if (!user) {
      throw new Error('Could not find that diary in our magical realm! ✨');
    }

    if (oldPassword !== user.password) {
      throw new Error('The old magical password didn\'t match! 🔐');
    }

    if (cleanOldEmail !== cleanNewEmail) {
      if (USE_FIREBASE) {
        const newDoc = await getDoc(doc(db, "users", cleanNewEmail));
        if (newDoc.exists()) {
          throw new Error('The new email is already linked to another diary! 🌸');
        }
      } else {
        const users = JSON.parse(localStorage.getItem('diary_users') || '{}');
        if (users[cleanNewEmail]) {
          throw new Error('The new email is already linked to another diary! 🌸');
        }
      }
    }

    const updatedUser = {
      ...user,
      email: cleanNewEmail,
      password: newPassword
    };

    if (USE_FIREBASE) {
      // 1. Create new user doc
      await setDoc(doc(db, "users", cleanNewEmail), updatedUser);
      
      // 2. Migrate entries if email changed
      if (cleanOldEmail !== cleanNewEmail) {
        const entriesSnap = await getDocs(collection(db, `users/${cleanOldEmail}/entries`));
        for (const docSnap of entriesSnap.docs) {
          await setDoc(doc(db, `users/${cleanNewEmail}/entries`, docSnap.id), docSnap.data());
          await deleteDoc(doc(db, `users/${cleanOldEmail}/entries`, docSnap.id));
        }

        const decoySnap = await getDocs(collection(db, `users/${cleanOldEmail}/decoy_entries`));
        for (const docSnap of decoySnap.docs) {
          await setDoc(doc(db, `users/${cleanNewEmail}/decoy_entries`, docSnap.id), docSnap.data());
          await deleteDoc(doc(db, `users/${cleanOldEmail}/decoy_entries`, docSnap.id));
        }
        
        // 3. Delete old user doc
        await deleteDoc(doc(db, "users", cleanOldEmail));
      }
    } else {
      const users = JSON.parse(localStorage.getItem('diary_users') || '{}');
      if (cleanOldEmail !== cleanNewEmail) {
        delete users[cleanOldEmail];
      }
      users[cleanNewEmail] = updatedUser;
      localStorage.setItem('diary_users', JSON.stringify(users));

      if (cleanOldEmail !== cleanNewEmail) {
        const entries = localStorage.getItem(`diary_entries_${cleanOldEmail}`);
        const decoyEntries = localStorage.getItem(`diary_decoy_entries_${cleanOldEmail}`);
        
        if (entries) {
          localStorage.setItem(`diary_entries_${cleanNewEmail}`, entries);
          localStorage.removeItem(`diary_entries_${cleanOldEmail}`);
        }
        if (decoyEntries) {
          localStorage.setItem(`diary_decoy_entries_${cleanNewEmail}`, decoyEntries);
          localStorage.removeItem(`diary_decoy_entries_${cleanOldEmail}`);
        }
      }
    }

    return {
      email: updatedUser.email,
      displayName: updatedUser.displayName,
      isFakeMode: false
    };
  }
};

export const databaseService = {
  getEntries: async (email, isFakeMode = false) => {
    await delay(500);
    const cleanEmail = email.toLowerCase().trim();
    const colName = isFakeMode ? 'decoy_entries' : 'entries';

    if (USE_FIREBASE) {
      const snapshot = await getDocs(collection(db, `users/${cleanEmail}/${colName}`));
      let entries = [];
      snapshot.forEach(doc => {
        entries.push(doc.data());
      });
      // Sort newest first by createdAt string
      return entries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      const storageKey = isFakeMode ? `diary_decoy_entries_${cleanEmail}` : `diary_entries_${cleanEmail}`;
      return JSON.parse(localStorage.getItem(storageKey) || '[]');
    }
  },

  saveEntry: async (email, entry, isFakeMode = false) => {
    await delay(400);
    const cleanEmail = email.toLowerCase().trim();
    const colName = isFakeMode ? 'decoy_entries' : 'entries';

    const newEntry = {
      ...entry,
      id: entry.id || 'entry-' + Math.random().toString(36).substr(2, 9),
      createdAt: entry.createdAt || new Date().toISOString()
    };

    if (USE_FIREBASE) {
      await setDoc(doc(db, `users/${cleanEmail}/${colName}`, newEntry.id), newEntry);
    } else {
      const storageKey = isFakeMode ? `diary_decoy_entries_${cleanEmail}` : `diary_entries_${cleanEmail}`;
      const entries = JSON.parse(localStorage.getItem(storageKey) || '[]');
      entries.unshift(newEntry);
      localStorage.setItem(storageKey, JSON.stringify(entries));
    }
    return newEntry;
  },

  updateEntry: async (email, updatedEntry, isFakeMode = false) => {
    await delay(400);
    const cleanEmail = email.toLowerCase().trim();
    const colName = isFakeMode ? 'decoy_entries' : 'entries';

    if (USE_FIREBASE) {
      await setDoc(doc(db, `users/${cleanEmail}/${colName}`, updatedEntry.id), updatedEntry);
    } else {
      const storageKey = isFakeMode ? `diary_decoy_entries_${cleanEmail}` : `diary_entries_${cleanEmail}`;
      let entries = JSON.parse(localStorage.getItem(storageKey) || '[]');
      entries = entries.map(e => e.id === updatedEntry.id ? updatedEntry : e);
      localStorage.setItem(storageKey, JSON.stringify(entries));
    }
    return updatedEntry;
  },

  deleteEntry: async (email, entryId, isFakeMode = false) => {
    await delay(400);
    const cleanEmail = email.toLowerCase().trim();
    const colName = isFakeMode ? 'decoy_entries' : 'entries';

    if (USE_FIREBASE) {
      await deleteDoc(doc(db, `users/${cleanEmail}/${colName}`, entryId));
    } else {
      const storageKey = isFakeMode ? `diary_decoy_entries_${cleanEmail}` : `diary_entries_${cleanEmail}`;
      let entries = JSON.parse(localStorage.getItem(storageKey) || '[]');
      entries = entries.filter(e => e.id !== entryId);
      localStorage.setItem(storageKey, JSON.stringify(entries));
    }
    return entryId;
  }
};

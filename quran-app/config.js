// config.js - Configuration file for Al-Quran Digital App

/**
 * App Configuration
 * Customize these settings to personalize your Al-Quran app
 */

const CONFIG = {
  // Application Info
  APP_NAME: 'Al-Quran Digital',
  APP_VERSION: '1.0.0',
  
  // API Configuration
  API: {
    BASE_URL: 'https://api.alquran.cloud/v1',
    AUDIO_BASE_URL: 'https://cdn.islamic.network/quran/audio-surah/',
    TIMEOUT: 30000 // 30 seconds
  },

  // Default Settings
  DEFAULTS: {
    RECITER: 'ar.abdulbasit', // Default reciter
    THEME: 'light', // 'light' or 'dark'
    LANGUAGE: 'id', // 'id' for Indonesian, 'en' for English
    AUTO_PLAY: false // Auto play next verse
  },

  // Available Reciters
  RECITERS: [
    {
      code: 'ar.abdulbasit',
      name: 'Abdul Basit',
      country: 'Egypt'
    },
    {
      code: 'ar.alafasy',
      name: 'Mishari Al-Afasy',
      country: 'Kuwait'
    },
    {
      code: 'ar.maher',
      name: 'Maher Al-Muaiqly',
      country: 'Saudi Arabia'
    },
    {
      code: 'ar.minshawi',
      name: 'Muhammad Siddiq Al-Minshawi',
      country: 'Egypt'
    }
  ],

  // Translation Languages Available
  TRANSLATIONS: [
    {
      code: 'id.indonesian',
      name: 'Indonesian',
      flag: '🇮🇩'
    },
    {
      code: 'en.sahih',
      name: 'English (Sahih)',
      flag: '🇬🇧'
    },
    {
      code: 'fr.hamidullah',
      name: 'French',
      flag: '🇫🇷'
    }
  ],

  // Color Scheme (can be overridden)
  COLORS: {
    PRIMARY: '#2d5016',
    PRIMARY_LIGHT: '#4caf50',
    PRIMARY_DARK: '#1b3a0c',
    ACCENT: '#ffc107',
    TEXT_DARK: '#1a1a2e',
    TEXT_LIGHT: '#f5f5f5',
    GRAY: '#e0e0e0',
    ERROR: '#dc3545',
    SUCCESS: '#28a745',
    WARNING: '#ffc107'
  },

  // Feature Flags
  FEATURES: {
    DARK_MODE_ENABLED: true,
    OFFLINE_MODE_ENABLED: true,
    SEARCH_ENABLED: true,
    SHARING_ENABLED: true,
    KEYBOARD_SHORTCUTS_ENABLED: true,
    SERVICE_WORKER_ENABLED: true
  },

  // Cache Settings
  CACHE: {
    ENABLED: true,
    CACHE_NAME: 'quran-app-v1',
    CACHE_DURATION: 7 * 24 * 60 * 60 * 1000 // 7 days
  },

  // Audio Settings
  AUDIO: {
    DEFAULT_VOLUME: 100,
    MIN_VOLUME: 0,
    MAX_VOLUME: 100,
    AUTO_LOOP: false,
    QUALITY: 'high' // 'low', 'medium', 'high'
  },

  // UI Settings
  UI: {
    SIDEBAR_WIDTH: '300px',
    ANIMATION_SPEED: 300, // milliseconds
    ITEMS_PER_PAGE: 20,
    ENABLE_ANIMATIONS: true,
    ENABLE_NOTIFICATIONS: true
  },

  // Storage Settings
  STORAGE: {
    LOCAL_STORAGE_ENABLED: true,
    STORAGE_KEY_PREFIX: 'quran_app_',
    AUTO_SAVE_ENABLED: true,
    AUTO_SAVE_INTERVAL: 5000 // 5 seconds
  }
};

// ========== Local Storage Keys ==========
const STORAGE_KEYS = {
  THEME: 'quran_app_theme',
  RECITER: 'quran_app_reciter',
  VOLUME: 'quran_app_volume',
  LAST_SURAH: 'quran_app_last_surah',
  BOOKMARKS: 'quran_app_bookmarks',
  READING_PROGRESS: 'quran_app_reading_progress'
};

// ========== Helper Functions ==========

function setSetting(key, value) {
  if (CONFIG.STORAGE.LOCAL_STORAGE_ENABLED) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

function getSetting(key, defaultValue = null) {
  if (CONFIG.STORAGE.LOCAL_STORAGE_ENABLED) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  }
  return defaultValue;
}

function clearSetting(key) {
  if (CONFIG.STORAGE.LOCAL_STORAGE_ENABLED) {
    localStorage.removeItem(key);
  }
}

function clearAllSettings() {
  if (CONFIG.STORAGE.LOCAL_STORAGE_ENABLED) {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(CONFIG.STORAGE.STORAGE_KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }
}

function getReciterByCode(code) {
  return CONFIG.RECITERS.find(r => r.code === code) || CONFIG.RECITERS[0];
}

function getReciterName(code) {
  const reciter = getReciterByCode(code);
  return reciter ? reciter.name : 'Unknown';
}

// ========== API Helpers ==========

function getApiUrl(endpoint) {
  return `${CONFIG.API.BASE_URL}${endpoint}`;
}

function getAudioUrl(surahNumber, reciter) {
  const surahNum = surahNumber.toString().padStart(3, '0');
  return `${CONFIG.API.AUDIO_BASE_URL}${surahNum}/${reciter}.mp3`;
}

// ========== Validation ==========

function isValidSurahNumber(number) {
  return number >= 1 && number <= 114;
}

function isValidReciter(code) {
  return CONFIG.RECITERS.some(r => r.code === code);
}

function isValidTheme(theme) {
  return ['light', 'dark'].includes(theme);
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CONFIG, STORAGE_KEYS };
}

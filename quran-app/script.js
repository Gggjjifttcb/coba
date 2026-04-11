// ========== API Configuration ==========
// Primary: https://api.quran.gading.dev - Faster, includes audio, Indonesian translation
// Has built-in fallback audio URLs (primary + secondary sources)
const API_BASE = 'https://api.quran.gading.dev';

let currentSurah = null;
let currentReciter = 'ar.alafasy'; // Mishari Al-Afasy - pembaca pilihan
let surahList = [];
let allVerses = [];
let isPlaying = false;
let currentAudioIndex = 0;

// ========== DOM Elements ==========
const surahListContainer = document.getElementById('surahList');
const versesContent = document.getElementById('versesContent');
const surahHeader = document.getElementById('surahHeader');
const audioPlayer = document.getElementById('audioPlayer');
const audioElement = document.getElementById('audioElement');
const playBtn = document.getElementById('playBtn');
const progressBar = document.getElementById('progressBar');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const volumeSlider = document.getElementById('volumeSlider');
const reciterSelect = document.getElementById('reciterSelect');
const themeBtn = document.getElementById('themeBtn');
const loadingOverlay = document.getElementById('loadingOverlay');
const searchInput = document.getElementById('searchInput');
const verseModal = document.getElementById('verseModal');

// ========== Initialize App ==========
document.addEventListener('DOMContentLoaded', () => {
  initializeTheme();
  loadSurahList();
  setupEventListeners();
});

// ========== Theme Management ==========
function initializeTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    updateThemeIcon();
  }
}

function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateThemeIcon();
}

function updateThemeIcon() {
  const icon = themeBtn.querySelector('i');
  if (document.body.classList.contains('dark-mode')) {
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
  } else {
    icon.classList.remove('fa-sun');
    icon.classList.add('fa-moon');
  }
}

// ========== Event Listeners ==========
function setupEventListeners() {
  themeBtn.addEventListener('click', toggleTheme);
  searchInput.addEventListener('input', filterSurah);
  audioElement.addEventListener('timeupdate', updateProgress);
  audioElement.addEventListener('loadedmetadata', updateDuration);
  audioElement.addEventListener('ended', nextVerse);
  
  // Close modal when clicking outside
  verseModal.addEventListener('click', (e) => {
    if (e.target === verseModal) {
      closeModal();
    }
  });
}

// ========== API Functions ==========
async function loadSurahList() {
  try {
    showLoading(true);
    const response = await fetch(`${API_BASE}/surah`);
    const data = await response.json();
    
    // API Gading format
    if (data.code === 200) {
      surahList = data.data;
      displaySurahList(surahList);
      console.log('📚 Loaded', surahList.length, 'surahs from API Gading');
    }
  } catch (error) {
    console.error('❌ Error loading surah list:', error);
    showError('Gagal memuat daftar surah. Cek koneksi internet.');
  } finally {
    showLoading(false);
  }
}

async function loadSurahContent(surahNumber) {
  try {
    showLoading(true);
    
    // API Gading returns all data in single request: Arabic, translation, tafsir, AND audio URLs
    const response = await fetch(`${API_BASE}/surah/${surahNumber}`);
    const data = await response.json();
    
    if (data.code === 200) {
      currentSurah = data.data;
      allVerses = data.data.verses || [];
      
      console.log('✅ Loaded Surah', surahNumber, 'with', allVerses.length, 'verses and audio URLs');
      
      displaySurahHeader(currentSurah);
      displayVerses(currentSurah);
      showAudioPlayer();
    }
  } catch (error) {
    console.error('❌ Error loading surah content:', error);
    showError('Gagal memuat konten surah');
  } finally {
    showLoading(false);
  }
}

// ========== Display Functions ==========
function displaySurahList(surahs) {
  surahListContainer.innerHTML = '';
  
  surahs.forEach(surah => {
    const title = surah.name?.transliteration?.en || surah.name?.translation?.en || surah.name?.short || 'Surah';
    const arabName = surah.name?.short || '';
    const count = surah.numberOfVerses || surah.numberOfAyahs || 0;

    const surahDiv = document.createElement('div');
    surahDiv.className = 'surah-item';
    surahDiv.innerHTML = `
      <div class="surah-item-title">${surah.number}. ${title}</div>
      <div class="surah-item-info">${arabName} • ${count} ayat</div>
    `;
    
    surahDiv.addEventListener('click', () => {
      selectSurah(surah.number, surahDiv);
    });
    
    surahListContainer.appendChild(surahDiv);
  });
}

function filterSurah() {
  const searchTerm = searchInput.value.toLowerCase();
  const filteredSurahs = surahList.filter(surah => {
    const title = (surah.name?.transliteration?.en || surah.name?.translation?.en || '').toLowerCase();
    const arabName = (surah.name?.short || '').toLowerCase();
    return title.includes(searchTerm) || arabName.includes(searchTerm) || surah.number.toString().includes(searchTerm);
  });
  
  displaySurahList(filteredSurahs);
}

function selectSurah(surahNumber, element) {
  document.querySelectorAll('.surah-item').forEach(item => {
    item.classList.remove('active');
  });
  
  element.classList.add('active');
  loadSurahContent(surahNumber);
  
  // Scroll to top
  versesContent.scrollTop = 0;
}

function displaySurahHeader(surah) {
  const title = surah.name?.transliteration?.en || surah.name?.translation?.en || '';
  const arabName = surah.name?.short || '';
  const revel = surah.revelation?.en || surah.revelation?.id || '';
  const count = surah.numberOfVerses || surah.numberOfAyahs || 0;

  surahHeader.innerHTML = `
    <div>
      <div class="surah-name">${arabName}</div>
      <div>${title}</div>
      <div class="surah-meta">
        <div class="surah-meta-item">
          <span>${count}</span>
          <span>Ayat</span>
        </div>
        <div class="surah-meta-item">
          <span>${revel === 'Meccan' ? 'Makkiyah' : revel === 'Medinan' ? 'Madaniyah' : revel}</span>
          <span>Jenis</span>
        </div>
        <div class="surah-meta-item">
          <span>${surah.number}</span>
          <span>No</span>
        </div>
      </div>
    </div>
  `;
}

function displayVerses(surah) {
  versesContent.innerHTML = '';
  
  surah.verses.forEach((ayah, index) => {
    // API Gading structure:
    // ayah.text.arab - Teks Arab
    // ayah.text.transliteration.en - Transliterasi (opsional)
    // ayah.translation.id - Terjemahan Indonesia
    
    const arabText = ayah.text?.arab || '';
    const transliterasi = ayah.text?.transliteration?.en || '';
    const indonesia = ayah.translation?.id || '';
    
    const verseDiv = document.createElement('div');
    verseDiv.className = 'verse';
    verseDiv.innerHTML = `
      <div class="verse-number">${ayah.number.inSurah}</div>
      <div class="verse-text-arabic">${arabText}</div>
      <div class="verse-text-latin">${transliterasi}</div>
      <div class="verse-text-indo">${indonesia}</div>
      <div class="verse-actions">
        <button class="verse-btn" onclick="playVerse(${index})">
          <i class="fas fa-play"></i> Putar
        </button>
        <button class="verse-btn" onclick="copyToClipboard('${arabText}')">
          <i class="fas fa-copy"></i> Salin
        </button>
        <button class="verse-btn" onclick="shareVerse(${surah.number}, ${ayah.number.inSurah})">
          <i class="fas fa-share"></i> Bagikan
        </button>
      </div>
    `;
    
    versesContent.appendChild(verseDiv);
  });
}

// ========== Audio Player Functions ==========
function showAudioPlayer() {
  audioPlayer.style.display = 'block';
  updatePlayerHeader();
  loadAudio(0);
}

function closeAudioPlayer() {
  audioPlayer.style.display = 'none';
  audioElement.pause();
  isPlaying = false;
  updatePlayButton();
}

function updatePlayerHeader() {
  const playerSurahName = document.getElementById('playerSurahName');
  if (currentSurah) {
    const title = currentSurah.name?.transliteration?.en || currentSurah.name?.translation?.en || currentSurah.name?.short || '';
    playerSurahName.textContent = `📖 ${currentSurah.number}. ${title}`;
  }
}

async function loadAudio(verseIndex) {
  try {
    if (!currentSurah || !allVerses.length) {
      showError('Surah belum dimuat, silakan pilih surah terlebih dahulu');
      return;
    }
    
    currentAudioIndex = verseIndex;
    const verse = allVerses[verseIndex];
    
    // Extract audio URL from API response
    // API Gading provides: audio.primary (Mishari Al-Afasy) and audio.secondary (fallback URLs)
    let audioUrl = null;
    
    if (verse && verse.audio) {
      // Prefer direct mp3 sources from secondary list
      if (verse.audio.secondary && verse.audio.secondary.length > 0) {
        audioUrl = verse.audio.secondary[0];
        console.log('🎵 Using direct mp3 audio source:', audioUrl);
      } else if (verse.audio.primary) {
        audioUrl = verse.audio.primary;
        console.log('🎵 Using primary audio source:', audioUrl);
      }
    }
    
    if (!audioUrl) {
      showError('Audio tidak tersedia untuk ayat ini');
      return;
    }
    
    audioElement.src = audioUrl;
    audioElement.removeAttribute('crossorigin');
    
    // Error handling dengan fallback
    audioElement.onerror = () => {
      console.error('❌ Failed to load audio from:', audioUrl);
      
      if (verse && verse.audio && verse.audio.secondary && verse.audio.secondary.length > 1) {
        const fallbackUrl = verse.audio.secondary[1];
        console.log('🔄 Trying secondary audio:', fallbackUrl);
        audioElement.src = fallbackUrl;
        audioElement.removeAttribute('crossorigin');
        audioElement.load();
      } else if (verse && verse.audio && verse.audio.primary && audioUrl !== verse.audio.primary) {
        console.log('🔄 Trying primary audio as fallback:', verse.audio.primary);
        audioElement.src = verse.audio.primary;
        audioElement.removeAttribute('crossorigin');
        audioElement.load();
      } else {
        showError('Gagal memuat audio. Cek koneksi internet atau coba ayat lain.');
        isPlaying = false;
        updatePlayButton();
      }
    };
    
    audioElement.load();
  } catch (error) {
    console.error('❌ Error loading audio:', error);
    showError('Error: ' + error.message);
  }
}

function toggleAudio() {
  if (!audioElement.src) {
    showError('Pilih surah dan ayat terlebih dahulu');
    return;
  }
  
  if (isPlaying) {
    audioElement.pause();
    isPlaying = false;
  } else {
    audioElement.play().catch(err => {
      console.error('Play error:', err);
      showError('Tidak bisa memainkan audio');
    });
    isPlaying = true;
  }
  updatePlayButton();
}

function updatePlayButton() {
  if (isPlaying) {
    playBtn.classList.add('playing');
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
  } else {
    playBtn.classList.remove('playing');
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
  }
}

function updateProgress() {
  if (audioElement.duration) {
    progressBar.value = (audioElement.currentTime / audioElement.duration) * 100;
    currentTimeEl.textContent = formatTime(audioElement.currentTime);
  }
}

function updateDuration() {
  durationEl.textContent = formatTime(audioElement.duration);
}

function setAudio(value) {
  if (audioElement.duration) {
    audioElement.currentTime = (value / 100) * audioElement.duration;
  }
}

function setVolume(value) {
  audioElement.volume = value / 100;
}

function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function playVerse(index) {
  loadAudio(index);
  
  // Delay play to ensure audio is loaded
  setTimeout(() => {
    audioElement.play().then(() => {
      isPlaying = true;
      updatePlayButton();
      showNotification('🎵 Memainkan Audio...');
    }).catch(err => {
      console.error('Play error:', err);
      showError('Tidak bisa memainkan audio: ' + err.message);
      isPlaying = false;
      updatePlayButton();
    });
  }, 100);
}

function nextVerse() {
  if (currentAudioIndex < allVerses.length - 1) {
    playVerse(currentAudioIndex + 1);
  } else {
    isPlaying = false;
    updatePlayButton();
  }
}

function changeReciter() {
  // Hanya Mishari Al-Afasy - tidak ada perubahan
  console.log('📻 Menggunakan: Mishari Al-Afasy');
  showNotification('🎙️ Audio: Mishari Al-Afasy (Pembaca Pilihan)');
}

// ========== Utility Functions ==========
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showNotification('Teks disalin ke clipboard');
  }).catch(err => {
    console.error('Error copying text:', err);
  });
}

function shareVerse(surahNum, ayahNum) {
  const text = `Quran ${surahNum}:${ayahNum}`;
  const url = window.location.href;
  
  if (navigator.share) {
    navigator.share({
      title: 'Al-Quran',
      text: text,
      url: url
    });
  } else {
    copyToClipboard(`${text} - ${url}`);
    showNotification('Link dibagikan (disalin ke clipboard)');
  }
}

function showLoading(show) {
  if (show) {
    loadingOverlay.classList.add('active');
  } else {
    loadingOverlay.classList.remove('active');
  }
}

function showError(message) {
  showNotification(message);
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--primary);
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

function closeModal() {
  verseModal.classList.remove('active');
}

// ========== Keyboard Shortcuts ==========
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && audioPlayer.style.display !== 'none') {
    e.preventDefault();
    toggleAudio();
  }
  if (e.code === 'ArrowRight') {
    nextVerse();
  }
  if (e.code === 'Escape') {
    closeModal();
  }
});

// ========== CSS Animations - Add if not in CSS ==========
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// ========== Service Worker for Offline Support ==========
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(err => {
    console.log('Service Worker registration failed:', err);
  });
}

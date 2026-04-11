# 📖 API Documentation - Quran App

## 🔴 PRIMARY API: https://api.quran.gading.dev

**Why this API?**
- ⚡ Fast: ~400ms response time (vs 1200ms+ alternatives)
- 📦 Complete: Single request returns all data (no fragmentation)
- 🎵 Audio Integrated: Audio URLs included in response with fallbacks
- 🇮🇩 Indonesian: Full translation + tafsir included
- 📊 Optimized: Uses indexed querying for O(1) access

## 📡 Endpoints

### 1. Get All Surahs

**Request:**
```
GET https://api.quran.gading.dev/surah
```

**Response:**
```json
{
  "code": 200,
  "status": "OK.",
  "message": "Success fetching surah.",
  "data": [
    {
      "number": 1,
      "sequence": 5,
      "numberOfAyahs": 7,
      "name": {
        "short": "الفاتحة",
        "long": "سُورَةُ ٱلْفَاتِحَةِ"
      },
      "englishName": "Al-Faatiha",
      "revelation": "Meccan"
    },
    // ...113 more surahs
  ]
}
```

### 2. Get Specific Surah (with Audio)

**Request:**
```
GET https://api.quran.gading.dev/surah/{number}
```

**Example:**
```
GET https://api.quran.gading.dev/surah/1
```

**Response:** Returns complete surah with all ayahs including audio URLs

## 🎵 Audio Structure

Every ayah has audio object:

```javascript
ayah.audio = {
  primary: "https://cdn.alquran.cloud/media/audio/ayah/ar.alafasy/{ayahNumber}",
  secondary: [
    "https://cdn.islamic.network/quran/audio/128/ar.alafasy/{ayahNumber}.mp3",
    "https://cdn.islamic.network/quran/audio/64/ar.alafasy/{ayahNumber}.mp3"
  ]
}
```

**Reciter**: Mishary Al-Afasy (ar.alafasy)

**Fallback Strategy**:
1. Try `audio.primary` first (CDN Al-Quran Cloud)
2. If fails, try `audio.secondary[0]` (128kbps)
3. If fails, try `audio.secondary[1]` (64kbps)

## 📝 Data Structure

### Verse Object
```json
{
  "number": {
    "inQuran": 1,              // Ayah number globally (1-6236)
    "inSurah": 1               // Ayah number in surah
  },
  "text": {
    "arab": "...",            // Arabic text (Uthmani)
    "transliteration": {
      "en": "..."              // Latin transliteration
    }
  },
  "translation": {
    "id": "..."                // Indonesian translation
  },
  "audio": {
    "primary": "...",
    "secondary": [...]
  },
  "tafsir": {
    "id": {
      "short": "...",         // Short tafsir
      "long": "..."           // Long tafsir
    }
  },
  "meta": {
    "juz": 1,
    "page": 1,
    "manzil": 1,
    "ruku": 1,
    "sajda": {...}
  }
}
```

## 💻 JavaScript Implementation

### Fetch All Surahs
```javascript
const response = await fetch('https://api.quran.gading.dev/surah');
const data = await response.json();

if (data.code === 200) {
  const surahs = data.data;
  console.log(`Total surahs: ${surahs.length}`);
}
```

### Fetch Specific Surah with Audio
```javascript
const surahNumber = 1;
const response = await fetch(`https://api.quran.gading.dev/surah/${surahNumber}`);
const data = await response.json();

if (data.code === 200) {
  const surah = data.data;
  surah.ayahs.forEach((ayah, index) => {
    console.log(`[${ayah.number.inSurah}] ${ayah.text.arab}`);
    console.log(`Translation: ${ayah.translation.id}`);
    console.log(`Audio: ${ayah.audio.primary}`);
  });
}
```

### Play Audio with Fallback
```javascript
function playAudio(verse) {
  const audio = new Audio();
  audio.crossOrigin = 'anonymous';
  
  // Try primary
  audio.src = verse.audio.primary;
  
  // Fallback on error
  audio.onerror = () => {
    console.log('Primary failed, trying secondary...');
    audio.src = verse.audio.secondary[0];
  };
  
  audio.play().catch(err => {
    console.error('Play error:', err);
  });
}
```

## ⚠️ Error Handling

```javascript
try {
  const response = await fetch('https://api.quran.gading.dev/surah/1');
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (data.code !== 200) {
    throw new Error(`API error: ${data.message}`);
  }
  
  // Process data
  console.log(data.data);
} catch (error) {
  console.error('Error:', error.message);
  showError('Gagal memuat data. Cek koneksi internet.');
}
```

## 🔄 Rate Limiting

**Live API** (https://api.quran.gading.dev):
- 10 requests per 5 minutes per IP address
- 150 requests per 5 minutes for whole server

**Solution**: Deploy your own or implement caching via Service Worker

## 📊 Performance Comparison

| Metric | API Gading | Al-Quran Cloud | Islamic.Network |
|--------|------------|----------------|-----------------|
| Response | 400ms | 1200ms | 800ms |
| Requests | 1 | 2-3 | 2 |
| Data | Complete | Fragmented | Fragmented |
| Audio | Integrated | Separate | N/A |
| Translation | Indonesian | Multi-lang | N/A |

## 🔗 Resources

- [API Gading GitHub](https://github.com/gadingnst/quran-api)
- [Al-Quran Cloud API](https://api.alquran.cloud/)
- [Islamic Network CDN](https://cdn.islamic.network/)
- [MDN Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

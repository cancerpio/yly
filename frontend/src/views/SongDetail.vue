<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import type { Song } from '../types';
import { Sparkles, BookOpen, X, Star } from 'lucide-vue-next';
import { usePlaylistStore } from '../stores/playlist';
import { useHistoryStore } from '../stores/history';

const store = usePlaylistStore();
const historyStore = useHistoryStore();
const song = ref<Song | null>(null);
const lyricsInput = ref('');
const isAnalyzing = ref(false);
const showLyrics = ref(false);

interface Line {
  jp: string;
  kana: string;
  romaji: string;
  zh: string;
}

const analyzedLines = ref<Line[]>([]);
const focusedLine = ref<Line | null>(null);

// Check if song is saved
const isSongSaved = computed(() => {
  return song.value ? store.isSaved(song.value.trackId.toString()) : false;
});

const toggleSaveSong = () => {
  if (!song.value) return;
  store.toggleSave({
    id: song.value.trackId.toString(),
    type: 'song',
    content: song.value,
    title: song.value.trackName,
    createdAt: Date.now()
  });
};

onMounted(() => {
  const stateSong = history.state?.songData;
  if (stateSong) {
    try {
      if (typeof stateSong === 'string') {
        const parsed = JSON.parse(stateSong);
        song.value = parsed;
        historyStore.addSong(parsed);
      } else {
        song.value = stateSong;
        if (stateSong) historyStore.addSong(stateSong);
      }
    } catch (e) {
      console.error(e);
    }
  }
});

const handleAnalyze = () => {
  if (!lyricsInput.value.trim()) return;
  
  isAnalyzing.value = true;
  
  // Mock Analysis Delay
  setTimeout(() => {
    // Mock Data Logic
    const rawLines = lyricsInput.value.split('\n').filter(l => l.trim());
    analyzedLines.value = rawLines.map((line, index) => ({
      jp: line,
      kana: 'テスト・カナ', // Mock
      romaji: 'tesuto romaji', // Mock
      zh: '這是測試翻譯 ' + (index + 1) // Mock
    }));
    
    isAnalyzing.value = false;
    showLyrics.value = true;
  }, 1500);
};

const handleFocus = (line: Line) => {
  focusedLine.value = line;
};
</script>

<template>
  <div class="page-container glass-panel">
    <!-- Header -->
    <div v-if="song" class="song-header">
      <img :src="song.artworkUrl100" class="artwork" />
      <div class="info">
        <h3>{{ song.trackName }}</h3>
        <p>{{ song.artistName }}</p>
      </div>
      <button class="icon-btn" @click="toggleSaveSong">
        <Star :size="24" :fill="isSongSaved ? '#f5a623' : 'none'" :color="isSongSaved ? '#f5a623' : '#666'" />
      </button>
    </div>
    <div v-else class="song-header">
      <h3>未知歌曲</h3>
    </div>

    <!-- Input Section -->
    <div v-if="!showLyrics" class="input-section">
      <textarea 
        v-model="lyricsInput" 
        placeholder="請貼上日文歌詞..."
        class="lyrics-input"
      ></textarea>
      
      <button 
        class="analyze-btn" 
        @click="handleAnalyze"
        :disabled="isAnalyzing"
      >
        <Sparkles v-if="!isAnalyzing" :size="20" />
        <span v-if="isAnalyzing">分析中...</span>
        <span v-else>開始分析</span>
      </button>
    </div>

    <!-- Lyrics Viewer -->
    <div v-else class="lyrics-viewer">
      <div 
        v-for="(line, idx) in analyzedLines" 
        :key="idx" 
        class="lyrics-line glass-card"
        @click="handleFocus(line)"
      >
        <div class="line-jp">{{ line.jp }}</div>
        <div class="line-meta">
          <span class="kana">{{ line.kana }}</span>
          <span class="romaji">{{ line.romaji }}</span>
        </div>
        <div class="line-zh">{{ line.zh }}</div>
        
        <div class="actions">
           <Star :size="16" class="action-icon" />
           <BookOpen :size="16" class="action-icon" />
        </div>
      </div>
      
      <button class="glass-btn secondary" @click="showLyrics = false">
        重新編輯
      </button>
    </div>

    <!-- Focus Modal -->
    <Teleport to="body">
      <div v-if="focusedLine" class="modal-overlay" @click="focusedLine = null">
        <div class="modal-content glass-panel" @click.stop>
          <div class="modal-header">
            <h4>Focus Mode</h4>
            <X :size="24" @click="focusedLine = null" class="close-icon" />
          </div>
          
          <div class="focus-body">
            <h2 class="focus-jp">{{ focusedLine.jp }}</h2>
            <div class="focus-meta">
              <p class="focus-kana">{{ focusedLine.kana }}</p>
              <p class="focus-romaji">{{ focusedLine.romaji }}</p>
            </div>
            
            <div class="divisor"></div>
            
            <div class="focus-zh">
              <p class="label">翻譯</p>
              <p>{{ focusedLine.zh }}</p>
            </div>
            
            <div class="focus-ai">
              <p class="label">AI 語法提示</p>
              <div class="ai-box">
                (Mock AI Response) 這裡使用了 N3 文法...
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.page-container {
  padding: 0;
  min-height: 80vh;
  padding-bottom: 100px;
}

.song-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: rgba(255,255,255,0.4);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 10;
}

.icon-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  transition: background 0.2s;
}

.icon-btn:active {
  background: rgba(0,0,0,0.05);
  transform: scale(0.95);
}

.artwork {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.info h3 {
  margin: 0;
  font-size: 1.1rem;
}

.info p {
  margin: 4px 0 0;
  font-size: 0.9rem;
  color: var(--color-text-sub);
}

.input-section {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.lyrics-input {
  width: 100%;
  height: 300px;
  padding: 16px;
  border-radius: 16px;
  border: 1px solid rgba(0,0,0,0.1);
  background: rgba(255,255,255,0.6);
  font-family: inherit;
  resize: none;
  font-size: 1rem;
  line-height: 1.6;
}

.analyze-btn {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 16px;
  border-radius: 30px;
  font-weight: bold;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(6, 199, 85, 0.4);
  transition: transform 0.2s;
}

.analyze-btn:active {
  transform: scale(0.98);
}

.analyze-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.lyrics-viewer {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.lyrics-line {
  padding: 16px;
  background: rgba(255,255,255,0.5);
  border-radius: 12px;
  position: relative;
  transition: all 0.2s;
  cursor: pointer;
}

.lyrics-line:hover {
  background: rgba(255,255,255,0.9);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.line-jp {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 4px;
}

.line-meta {
  display: flex;
  gap: 8px;
  font-size: 0.8rem;
  color: var(--color-text-sub);
  margin-bottom: 4px;
}

.line-zh {
  font-size: 0.95rem;
  color: #555;
  border-top: 1px dashed rgba(0,0,0,0.1);
  padding-top: 4px;
  margin-top: 4px;
}

.actions {
  position: absolute;
  right: 12px;
  top: 12px;
  display: flex;
  gap: 8px;
  opacity: 0.3;
}

.lyrics-line:hover .actions {
  opacity: 1;
}

.secondary {
  margin-top: 24px;
  color: var(--color-text-sub);
  border-color: rgba(0,0,0,0.1);
  background: transparent;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-end; /* Bottom sheet on mobile */
  z-index: 1000;
}

.modal-content {
  width: 100%;
  background: #fff;
  border-radius: 24px 24px 0 0;
  padding: 24px;
  max-height: 80vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.focus-jp {
  font-size: 1.5rem;
  margin: 0 0 16px;
}

.focus-meta {
  color: var(--color-text-sub);
}

.divisor {
  height: 1px;
  background: #eee;
  margin: 24px 0;
}

.label {
  font-size: 0.8rem;
  color: var(--color-text-sub);
  text-transform: uppercase;
  margin-bottom: 4px;
}

.ai-box {
  background: #f0f7ff;
  color: #0066cc;
  padding: 16px;
  border-radius: 12px;
  font-size: 0.95rem;
  line-height: 1.5;
}
</style>

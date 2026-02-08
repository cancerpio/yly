<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Search, History, ChevronRight } from 'lucide-vue-next';
import { useHistoryStore } from '../stores/history';
import type { Song } from '../types';

const router = useRouter();
const historyStore = useHistoryStore();
const searchQuery = ref('');

const handleSearch = () => {
  if (!searchQuery.value.trim()) return;
  router.push({ 
    name: 'Search', 
    query: { q: searchQuery.value } 
  });
};

const goToSong = (song: Song) => {
  router.push({
    name: 'SongDetail',
    params: { id: song.trackId.toString() },
    state: { songData: JSON.stringify(song) }
  });
};
</script>

<template>
  <div class="home-container">
    <div class="glass-panel hero-section">
      <h1 class="title-lg">Lyrics Yomi</h1>
      <p>日文歌詞發音助手</p>
      
      <div class="search-box">
        <div class="input-wrapper">
          <Search class="search-icon" :size="20" />
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="輸入歌名或歌手..." 
            @keyup.enter="handleSearch"
          />
        </div>
      </div>
    </div>

    <div class="recent-list">
      <h3>
        <History :size="18" style="vertical-align: middle; margin-right: 6px"/>
        最近瀏覽
      </h3>
      
      <div v-if="historyStore.recentSongs.length === 0" class="empty-state">
        尚無紀錄
      </div>
      
      <div v-else class="history-grid">
         <div 
          v-for="song in historyStore.recentSongs" 
          :key="song.trackId"
          class="history-item glass-card"
          @click="goToSong(song)"
        >
          <img :src="song.artworkUrl100" class="thumb" />
          <div class="history-info">
            <div class="h-title">{{ song.trackName }}</div>
            <div class="h-artist">{{ song.artistName }}</div>
          </div>
          <ChevronRight :size="16" class="arrow" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.hero-section {
  padding: 32px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.hero-section p {
  color: var(--color-text-sub);
  margin-top: -8px;
}

.search-box {
  margin-top: 16px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: var(--color-text-sub);
}

.input-wrapper input {
  padding-left: 40px;
}

.recent-list h3 {
  font-size: var(--font-size-lg);
  color: var(--color-text-main);
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}

.empty-state {
  text-align: center;
  color: var(--color-text-sub);
  padding: 24px;
  background: rgba(255,255,255,0.3);
  border-radius: 12px;
}

.history-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255,255,255,0.5);
  border-radius: 12px;
  cursor: pointer;
}

.history-item:hover {
  background: rgba(255,255,255,0.8);
}

.thumb {
  width: 40px;
  height: 40px;
  border-radius: 6px;
}

.history-info {
  flex: 1;
  min-width: 0;
}

.h-title {
  font-weight: 600;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.h-artist {
  font-size: 0.8rem;
  color: var(--color-text-sub);
}

.arrow {
  opacity: 0.4;
}
</style>

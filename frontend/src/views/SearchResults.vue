<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { Song } from '../types';
import { Loader2, Music, ChevronRight } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const query = ref(route.query.q as string || '');
const songs = ref<Song[]>([]);
const loading = ref(false);
const error = ref('');

const searchSongs = async (keyword: string) => {
  if (!keyword) return;
  loading.value = true;
  error.value = '';
  songs.value = [];
  
  try {
    const encoded = encodeURIComponent(keyword);
    // Use iTunes Search API
    const response = await fetch(`https://itunes.apple.com/search?term=${encoded}&entity=song&limit=20&country=JP`);
    if (!response.ok) throw new Error('API Error');
    const data = await response.json();
    songs.value = data.results;
  } catch (err) {
    console.error(err);
    error.value = '無法載入歌曲，請稍後再試。';
    // Fallback Mock Data for demo if API limits/fails
    songs.value = [
      { trackId: 1, trackName: 'Lemon', artistName: 'Kenshi Yonezu', collectionName: 'Lemon - Single', artworkUrl100: 'https://via.placeholder.com/100', previewUrl: '' },
      { trackId: 2, trackName: 'Pretender', artistName: 'Official HIGE DANdism', collectionName: 'Traveler', artworkUrl100: 'https://via.placeholder.com/100', previewUrl: '' }
    ];
  } finally {
    loading.value = false;
  }
};

const goToSong = (song: Song) => {
  router.push({
    name: 'SongDetail',
    params: { id: song.trackId.toString() },
    state: { songData: JSON.stringify(song) } // Pass data to avoid re-fetch
  });
};

watch(() => route.query.q, (newQ) => {
  if (newQ) {
    query.value = newQ as string;
    searchSongs(newQ as string);
  }
});

onMounted(() => {
  if (query.value) {
    searchSongs(query.value);
  }
});
</script>

<template>
  <div class="page-container glass-panel">
    <div class="header">
      <h2 class="title-lg">搜尋: {{ query }}</h2>
    </div>

    <div v-if="loading" class="loading-state">
      <Loader2 :size="32" class="spin" />
      <p>搜尋中...</p>
    </div>

    <div v-else-if="songs.length > 0" class="results-list">
      <div 
        v-for="song in songs" 
        :key="song.trackId" 
        class="song-item"
        @click="goToSong(song)"
      >
        <img :src="song.artworkUrl100" class="artwork" alt="cover" />
        <div class="song-info">
          <div class="song-title">{{ song.trackName }}</div>
          <div class="song-artist">{{ song.artistName }}</div>
        </div>
        <ChevronRight :size="20" class="arrow" />
      </div>
    </div>

    <div v-else class="empty-state">
      <Music :size="48" class="icon-faded" />
      <p>找不到相關歌曲</p>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  padding: 0;
  min-height: 70vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.header {
  padding: 24px;
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

.loading-state, .empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  color: var(--color-text-sub);
  gap: 16px;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.results-list {
  padding: 0;
  display: flex;
  flex-direction: column;
}

.song-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  gap: 12px;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  cursor: pointer;
  transition: background 0.2s;
}

.song-item:hover {
  background: rgba(255,255,255,0.4);
}

.artwork {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
  background: #eee;
}

.song-info {
  flex: 1;
  min-width: 0;
}

.song-title {
  font-weight: 600;
  color: var(--color-text-main);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-artist {
  font-size: var(--font-size-sm);
  color: var(--color-text-sub);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.arrow {
  color: var(--color-text-sub);
  opacity: 0.5;
}

.icon-faded {
  opacity: 0.2;
}
</style>

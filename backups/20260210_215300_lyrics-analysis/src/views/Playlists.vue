<script setup lang="ts">
import { usePlaylistStore } from '../stores/playlist';
import { useRouter } from 'vue-router';
import { Music, Star, ChevronRight } from 'lucide-vue-next';

const store = usePlaylistStore();
const router = useRouter();

const goToItem = (item: any) => {
  if (item.type === 'song') {
    router.push({
      name: 'SongDetail',
      params: { id: item.content.trackId },
      state: { songData: JSON.stringify(item.content) }
    });
  }
};
</script>

<template>
  <div class="page-container glass-panel">
    <h2 class="title-lg">收藏清單</h2>
    
    <div v-if="store.items.length === 0" class="empty-state">
      <Star :size="48" class="icon-faded" />
      <p>還沒有收藏任何歌曲或句子</p>
    </div>

    <div v-else class="list">
       <div 
        v-for="item in store.items" 
        :key="item.id" 
        class="list-item"
        @click="goToItem(item)"
      >
        <div class="icon-box">
          <Music v-if="item.type === 'song'" />
          <Star v-else />
        </div>
        <div class="info">
          <div class="title">{{ item.title }}</div>
          <div class="sub">{{ new Date(item.createdAt).toLocaleDateString() }}</div>
        </div>
        <ChevronRight :size="16" class="arrow" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  padding: 24px;
}

.empty-state {
  text-align: center;
  margin-top: 48px;
  color: var(--color-text-sub);
}

.icon-faded {
  opacity: 0.2;
  margin-bottom: 16px;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
}

.list-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: rgba(255,255,255,0.4);
  border-radius: 12px;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.list-item:hover {
  background: rgba(255,255,255,0.7);
}

.icon-box {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(6, 199, 85, 0.1);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.info {
  flex: 1;
}

.title {
  font-weight: 600;
}

.sub {
  font-size: 0.8rem;
  color: var(--color-text-sub);
}

.arrow {
  opacity: 0.4;
}
</style>

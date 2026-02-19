<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeft, Trash2 } from 'lucide-vue-next';
import { useContentStore } from '../stores/content';

const route = useRoute();
const router = useRouter();
const contentStore = useContentStore();

const playlistName = computed(() => route.params.id as string);
const items = computed(() => contentStore.playlists[playlistName.value] || []);

onMounted(() => {
  contentStore.init();
  if (!items.value) {
    // If playlist doesn't exist, go back
    router.replace('/playlists');
  }
});

const goBack = () => {
  // Always go back to the full list view (Hierarchical navigation)
  router.push({ name: 'Playlists' });
};

const removeItem = (index: number) => {
  contentStore.removeSegment(playlistName.value, index);
};
</script>

<template>
  <div class="playlist-detail-page">
    <header class="page-header glass-panel">
      <button class="icon-btn" @click="goBack">
        <ArrowLeft :size="24" />
      </button>
      <div class="header-content">
        <h2>{{ playlistName }}</h2>
        <span class="count">{{ items.length }} items</span>
      </div>
    </header>

    <div v-if="items.length === 0" class="empty-state glass-card">
      <p>此清單為空</p>
    </div>

    <div v-else class="list-container">
      <div 
        v-for="(item, index) in items" 
        :key="index" 
        class="list-item glass-card"
      >
        <div class="item-content">
          <div class="original">{{ item.original }}</div>
          <div class="pronunciation">{{ item.pronunciation }}</div>
          <div class="translation">{{ item.translation }}</div>
        </div>
        
        <button class="delete-btn" @click="removeItem(index)">
          <Trash2 :size="18" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.playlist-detail-page {
  padding: 24px 20px 100px;
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
}

.header-content {
  display: flex;
  flex-direction: column;
}

.header-content h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: var(--color-text-main);
}

.count {
  font-size: 0.85rem;
  color: var(--color-text-sub);
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-main);
  padding: 8px;
  border-radius: 50%;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn:hover {
  background: rgba(0,0,0,0.05);
}

.list-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.list-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16px;
  background: rgba(255, 255, 255, 0.6);
  transition: all 0.2s ease;
  gap: 16px; 
}

.list-item:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateX(4px);
}

.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.original {
  font-weight: 600;
  font-size: 1.05rem;
  color: var(--color-text-main);
  line-height: 1.4;
}

.pronunciation {
  font-family: monospace;
  font-size: 0.9rem;
  color: #666;
}

.translation {
  font-size: 0.95rem;
  color: var(--color-text-sub);
}

.delete-btn {
  background: none;
  border: none;
  color: #ff4d4f;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  opacity: 0.6;
  transition: all 0.2s;
  align-self: center;
}

.delete-btn:hover {
  background: rgba(255, 77, 79, 0.1);
  opacity: 1;
}

.empty-state {
  text-align: center;
  padding: 32px;
  color: var(--color-text-sub);
}
</style>

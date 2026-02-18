<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ListMusic, Trash2, ArrowRight, Folder } from 'lucide-vue-next';
import { useContentStore } from '../stores/content';

const router = useRouter();
const contentStore = useContentStore();

onMounted(() => {
  contentStore.init();
});

const removePlaylist = (name: string) => {
  if (confirm(`確定要刪除清單 "${name}" 嗎?`)) {
    delete contentStore.playlists[name];
    localStorage.setItem('playlists', JSON.stringify(contentStore.playlists));
  }
};

const openPlaylist = (name: string) => {
  router.push({ name: 'PlaylistDetail', params: { id: name } });
};
</script>

<template>
  <div class="playlists-container">
    <div class="glass-panel header">
      <h1 class="title-lg">
        <ListMusic :size="24" style="margin-right: 12px; vertical-align: bottom" />
        Saved Card Lists
      </h1>
      <p>已儲存的字卡列表</p>
    </div>

    <div v-if="Object.keys(contentStore.playlists).length === 0" class="empty-state glass-card">
      <p>尚未建立任何清單</p>
      <router-link to="/" class="cta-link">
        去分析文章 <ArrowRight :size="16" />
      </router-link>
    </div>

    <div v-else class="list-container">
      <div 
        v-for="(items, name) in contentStore.playlists" 
        :key="name" 
        class="list-item glass-card"
        @click="openPlaylist(name as string)"
      >
        <div class="item-content">
          <div class="playlist-name">
            <Folder :size="20" class="icon" />
            <span>{{ name }}</span>
          </div>
          <div class="item-count">{{ items.length }} items</div>
        </div>
        
        <button class="delete-btn" @click.stop="removePlaylist(name as string)">
          <Trash2 :size="18" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.playlists-container {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 600px;
  margin: 0 auto;
}

.header {
  padding: 24px;
  text-align: center;
}

.header h1 {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.header p {
  color: var(--color-text-sub);
  font-size: 0.9rem;
}

.empty-state {
  text-align: center;
  padding: 48px;
  color: var(--color-text-sub);
}

.cta-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
}

.list-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background: rgba(255, 255, 255, 0.6);
  transition: all 0.2s ease;
  cursor: pointer;
  gap: 16px; 
}

.list-item:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateX(4px);
}

.item-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 16px;
}

.playlist-name {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--color-text-main);
}

.icon {
  color: var(--color-text-sub);
}

.item-count {
  font-size: 0.9rem;
  color: var(--color-text-sub);
  background: rgba(0,0,0,0.05);
  padding: 4px 10px;
  border-radius: 20px;
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
  display: flex;
  align-items: center;
}

.delete-btn:hover {
  background: rgba(255, 77, 79, 0.1);
  opacity: 1;
}
</style>

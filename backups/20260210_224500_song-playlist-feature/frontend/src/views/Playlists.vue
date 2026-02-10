<script setup lang="ts">
import { onMounted } from 'vue';
import { ListMusic, Trash2, ArrowRight } from 'lucide-vue-next';
import { useContentStore } from '../stores/content';

const contentStore = useContentStore();

onMounted(() => {
  contentStore.init();
});

const removeItem = (original: string) => {
  contentStore.removeSegment(original);
};
</script>

<template>
  <div class="playlists-container">
    <div class="glass-panel header">
      <h1 class="title-lg">
        <ListMusic :size="24" style="margin-right: 12px; vertical-align: bottom" />
        Saved List
      </h1>
      <p>已儲存的單字與句子</p>
    </div>

    <div v-if="contentStore.savedSegments.length === 0" class="empty-state glass-card">
      <p>尚未儲存任何內容</p>
      <router-link to="/" class="cta-link">
        去分析文章 <ArrowRight :size="16" />
      </router-link>
    </div>

    <div v-else class="list-container">
      <div 
        v-for="(item, index) in contentStore.savedSegments" 
        :key="index" 
        class="list-item glass-card"
      >
        <div class="item-content">
          <div class="original">{{ item.original }}</div>
          <div class="pronunciation">{{ item.pronunciation }}</div>
          <div class="translation">{{ item.translation }}</div>
        </div>
        
        <button class="delete-btn" @click="removeItem(item.original)">
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
  align-items: flex-start; /* Changed to start for multi-line content */
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
  min-width: 0; /* Ensures truncation works if needed */
}

.original {
  font-weight: 600;
  font-size: 1.05rem;
  color: var(--color-text-main);
  line-height: 1.4;
}

.pronunciation {
  font-family: monospace; /* Or a serif font for IPA */
  font-size: 0.9rem;
  color: #666; /* Slightly darker than sub text */
}

.translation {
  font-size: 0.95rem;
  color: var(--color-text-sub);
}

.delete-btn {
  background: none;
  border: none;
  color: #ff4d4f; /* Alert color */
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  opacity: 0.6;
  transition: all 0.2s;
  align-self: center; /* Center vertically relative to the item height */
}

.delete-btn:hover {
  background: rgba(255, 77, 79, 0.1);
  opacity: 1;
}
</style>

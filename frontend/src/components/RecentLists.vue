<script setup lang="ts">
import { useContentStore } from '../stores/content';
import { storeToRefs } from 'pinia';
import { List } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const contentStore = useContentStore();
// Access the getter we just created
const { recentLists } = storeToRefs(contentStore);
const router = useRouter();

const handleSelect = (item: any) => {
  // Navigate to playlist detail
  router.push({ name: 'PlaylistDetail', params: { id: item.title } });
};
</script>

<template>
  <div v-if="recentLists && recentLists.length > 0" class="recent-list-container">
    <div class="list-header">
      <span class="title">最近新增字卡列表</span>
    </div>
    
    <div class="list-cards">
      <div 
        v-for="list in recentLists" 
        :key="list.title" 
        class="list-card glass-panel"
        @click="handleSelect(list)"
      >
        <div class="card-top">
            <div class="icon-box">
                <List :size="18" />
            </div>
            <div class="list-info">
                <div class="list-name">{{ list.title }}</div>
                <div class="list-meta">{{ list.count }} 則紀錄</div>
            </div>
        </div>
        
        <div class="latest-preview" v-if="list.latestSegment">
            <div class="preview-text">{{ list.latestSegment.original }}</div>
            <div class="preview-sub">{{ list.latestSegment.translation || list.latestSegment.pronunciation }}</div>
        </div>
        <div class="empty-preview" v-else>
            尚無內容
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.recent-list-container {
  margin-top: 24px;
  width: 100%;
  max-width: 600px;
}

.list-header {
  margin-bottom: 12px;
  padding-left: 4px;
}

.title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.list-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.list-card {
  padding: 16px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.list-card:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.list-card:active {
  transform: scale(0.98);
}

.card-top {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
}

.icon-box {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: rgba(var(--primary-rgb), 0.1); /* fallback needed if variable not defined, using slight grey */
    background: rgba(0,0,0,0.05);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    color: var(--color-text-sub);
}

.list-info {
    flex: 1;
    overflow: hidden;
}

.list-name {
    font-weight: 700;
    font-size: 1rem;
    color: var(--color-text-main);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.list-meta {
    font-size: 0.8rem;
    color: var(--color-text-sub);
}

.latest-preview {
    background: rgba(255,255,255,0.5);
    padding: 10px;
    border-radius: 8px;
    font-size: 0.9rem;
}

.preview-text {
    font-weight: 500;
    color: var(--color-text-main);
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.preview-sub {
    font-size: 0.8rem;
    color: var(--color-text-sub);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.empty-preview {
    font-size: 0.85rem;
    color: var(--color-text-sub);
    font-style: italic;
    padding: 8px;
}
</style>

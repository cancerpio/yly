<script setup lang="ts">
import { usePreferenceStore } from '../stores/preferences';
import { Eye } from 'lucide-vue-next';

const store = usePreferenceStore();
</script>

<template>
  <div class="page-container glass-panel">
    <h2 class="title-lg">設定</h2>
    
    <div class="settings-list">
      <div class="setting-item">
        <div class="setting-label">
          <Eye :size="20" />
          <span>高對比 / 護眼模式</span>
        </div>
        <button 
          class="toggle-btn" 
          :class="{ active: store.highContrast }"
          @click="store.toggleHighContrast()"
        >
          <div class="knob"></div>
        </button>
      </div>
      <p class="desc">降低玻璃透明度，提高文字可讀性。</p>
    </div>
    
    <div class="footer">
      <p>Lyrics Yomi v0.1.0</p>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  padding: 24px;
}

.settings-list {
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: rgba(255,255,255,0.5);
  border-radius: 12px;
}

.setting-label {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
}

.toggle-btn {
  width: 48px;
  height: 28px;
  background: #ccc;
  border-radius: 14px;
  border: none;
  position: relative;
  cursor: pointer;
  transition: background 0.3s;
}

.toggle-btn.active {
  background: var(--color-primary);
}

.knob {
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 4px;
  left: 4px;
  transition: transform 0.3s cubic-bezier(0.2, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.toggle-btn.active .knob {
  transform: translateX(20px);
}

.desc {
  font-size: 0.8rem;
  color: var(--color-text-sub);
  padding: 0 16px;
  margin: 0;
}

.footer {
  margin-top: 64px;
  text-align: center;
  color: var(--color-text-sub);
  font-size: 0.8rem;
  opacity: 0.5;
}
</style>

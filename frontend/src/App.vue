<script setup lang="ts">
import { Home, ListMusic, Settings } from 'lucide-vue-next';
import { useContentStore } from '@/stores/content';

const contentStore = useContentStore();
contentStore.init();
</script>

<template>
  <div class="app-layout">
    <main class="content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <nav class="bottom-nav glass-panel">
      <router-link to="/" class="nav-item">
        <Home :size="24" />
        <span>Home</span>
      </router-link>
      <router-link to="/playlists" class="nav-item">
        <ListMusic :size="24" />
        <span>Card Lists</span>
      </router-link>
      <router-link to="/settings" class="nav-item">
        <Settings :size="24" />
        <span>Settings</span>
      </router-link>
    </nav>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  padding-bottom: 80px; /* Space for bottom nav */
}

.bottom-nav {
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  max-width: 560px; /* Match #app max-width - padding */
  margin: 0 auto;
  
  display: flex;
  justify-content: space-around;
  padding: 12px;
  z-index: 100;
  
  /* Override glass panel for nav specific look */
  background: rgba(255, 255, 255, 0.85);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-decoration: none;
  color: var(--color-text-sub);
  font-size: 0.75rem;
  transition: all 0.3s ease;
  padding: 4px 12px;
  border-radius: 12px;
}

.nav-item.router-link-active {
  color: var(--color-primary);
  background: rgba(6, 199, 85, 0.1);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

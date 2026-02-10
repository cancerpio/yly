<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowLeft, Save, X, Info } from 'lucide-vue-next';
import { useContentStore } from '../stores/content';
import type { AnalyzedSegment } from '../data/mockData';

const router = useRouter();
const contentStore = useContentStore();

const containerRef = ref<HTMLElement | null>(null);
const lines = ref<string[]>([]);
const mockArtwork = 'https://placehold.co/400x400/06c755/ffffff?text=AIZO'; // Reliable placeholder
const songTitle = 'AIZO';
const artistName = 'REOL';


// Selection State
const showTooltip = ref(false);
const tooltipPosition = ref({ x: 0, y: 0 });
const currentSelection = ref<AnalyzedSegment | null>(null);

onMounted(() => {
  if (!contentStore.rawText) {
    router.replace('/');
    return;
  }
  lines.value = contentStore.rawText.split('\n');
  document.addEventListener('mouseup', handleSelection);
});

onUnmounted(() => {
  document.removeEventListener('mouseup', handleSelection);
});

const handleSelection = (event: MouseEvent) => {
  const selection = window.getSelection();
  if (!containerRef.value || !selection || selection.isCollapsed) {
    const target = event.target as HTMLElement;
    if (!target.closest('.selection-tooltip')) {
        showTooltip.value = false;
    }
    return;
  }

  // Check if selection is within our container
  if (!containerRef.value.contains(selection.anchorNode)) {
    return;
  }

  const selectedText = selection.toString().trim();
  if (!selectedText) return;

  // Analyze content
  currentSelection.value = contentStore.analyzeSelection(selectedText);

  // Calculate position
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  
  // Position tooltip above the selection
  tooltipPosition.value = {
    x: rect.left + (rect.width / 2),
    y: rect.top - 10
  };
  
  showTooltip.value = true;
};

const saveCurrentSelection = () => {
  if (currentSelection.value) {
    contentStore.saveSegment(currentSelection.value);
    showTooltip.value = false;
    window.getSelection()?.removeAllRanges();
  }
};

const goBack = () => {
  router.back();
};
</script>

<template>
  <div class="analysis-page">
    <header class="page-header glass-panel">
      <button class="icon-btn" @click="goBack">
        <ArrowLeft :size="24" />
      </button>
      <h2>Lyrics Analysis</h2>
    </header>

    <!-- Song Info Display (Mock) -->
    <div class="song-info glass-panel">
        <div class="artwork-wrapper">
             <img :src="mockArtwork" alt="Album Art" class="artwork" />
        </div>
        <div class="info-text">
            <h3 class="song-title">{{ songTitle }}</h3>
            <p class="song-artist">{{ artistName }}</p>
        </div>
    </div>

    <!-- Tip Message -->
    <div class="tip-message">
        <Info :size="16" />
        <span>提示: 圈選下方歌詞可查看翻譯與發音</span>
    </div>

    <div class="content-container glass-panel" ref="containerRef">
      <div v-for="(line, index) in lines" :key="index" class="lyric-line">
        {{ line }}
      </div>
    </div>

    <!-- Floating Tooltip -->
    <div 
      v-if="showTooltip && currentSelection"
      class="selection-tooltip glass-card"
      :style="{ top: `${tooltipPosition.y}px`, left: `${tooltipPosition.x}px` }"
    >
      <div class="tooltip-header">
        <span class="label">Original</span>
        <button class="close-btn" @click="showTooltip = false">
             <X :size="14" />
        </button>
      </div>
      <div class="text-original">{{ currentSelection.original }}</div>
      
      <div class="meta-row">
        <div class="meta-item">
            <span class="label">Pronunciation</span>
            <div class="text-val">{{ currentSelection.pronunciation }}</div>
        </div>
      </div>
      
      <div class="meta-row">
        <div class="meta-item">
            <span class="label">Translation</span>
            <div class="text-val">{{ currentSelection.translation }}</div>
        </div>
      </div>

      <button class="save-btn" @click="saveCurrentSelection">
        <Save :size="16" />
        Add to List
      </button>
    </div>
  </div>
</template>

<style scoped>
.analysis-page {
  padding: 24px 20px 100px;
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  margin-bottom: 8px;
}

.page-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-main);
  padding: 4px;
  display: flex;
  align-items: center;
  border-radius: 50%;
  transition: background 0.2s;
}

.icon-btn:hover {
  background: rgba(0,0,0,0.05);
}

.song-info {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
}

.artwork-wrapper {
    width: 100px;
    height: 100px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.artwork {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.info-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.song-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 4px;
    color: var(--color-text-main);
}

.song-artist {
    font-size: 0.9rem;
    color: var(--color-text-sub);
}

.tip-message {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    background: rgba(255,255,255,0.4);
    border-radius: 12px;
    color: var(--color-text-sub);
    font-size: 0.9rem;
}

.content-container {
  padding: 32px;
  min-height: 50vh;
  font-size: 1.1rem;
  line-height: 2;
  color: var(--color-text-main);
  user-select: text;
  white-space: pre-wrap;
}

.lyric-line {
    margin-bottom: 8px;
}

/* Tooltip Styles */
.selection-tooltip {
  position: fixed;
  transform: translate(-50%, -100%);
  z-index: 1000;
  width: 280px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  animation: popIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes popIn {
  from { opacity: 0; transform: translate(-50%, -90%) scale(0.95); }
  to { opacity: 1; transform: translate(-50%, -100%) scale(1); }
}

.tooltip-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.close-btn {
    background: none;
    border: none;
    padding: 4px;
    cursor: pointer;
    opacity: 0.5;
}
.close-btn:hover {
    opacity: 1;
}

.label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-sub);
  display: block;
  margin-bottom: 4px;
}

.text-original {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text-main);
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

.meta-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.text-val {
  font-size: 0.95rem;
  color: var(--color-text-main);
}

.save-btn {
  margin-top: 8px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px;
  background: var(--color-text-main);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.save-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.save-btn:active {
  transform: translateY(0);
}
</style>

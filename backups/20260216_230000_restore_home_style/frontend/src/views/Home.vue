<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { Save, X, Info, Search, Loader2, Edit3, Trash2 } from 'lucide-vue-next';
import { useContentStore } from '../stores/content';
import { SONG_METADATA, type AnalyzedSegment } from '../data/mockData';

const router = useRouter();
const contentStore = useContentStore();
const editorRef = ref<HTMLElement | null>(null);
const isIndentifying = ref(false);

// ---- Auto Identify Logic ----
const debounce = (fn: Function, delay: number) => {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
};

const identifySource = async () => {
    if (!contentStore.rawText.trim()) return;
    isIndentifying.value = true;
    try {
        const query = contentStore.rawText.slice(0, 100);
        const foundName = await contentStore.identifySource(query);
         if (foundName) {
            contentStore.currentTitle = foundName;
        } else if (!contentStore.currentTitle) {
             const now = new Date();
             const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
             contentStore.currentTitle = `隨機收藏 ${dateStr}`;
        }
    } catch (e) {
        console.error("Auto-identify failed", e);
    } finally {
        isIndentifying.value = false;
        contentStore.lastAnalyzedText = contentStore.rawText;
    }
};

const debouncedIdentify = debounce(() => {
    if (contentStore.rawText !== contentStore.lastAnalyzedText) {
        identifySource();
    }
}, 1500);

// ---- Contenteditable Logic ----
const updateContent = (event: Event) => {
    const target = event.target as HTMLElement;
    // We update the store with innerText to keep it clean (no HTML tags)
    // But for display we let browser handle it
    contentStore.rawText = target.innerText;
    debouncedIdentify();
};

const handlePaste = (event: ClipboardEvent) => {
    event.preventDefault();
    const text = event.clipboardData?.getData('text/plain') || '';
    document.execCommand('insertText', false, text);
};


// ---- Selection & Tooltip Logic ----
const showTooltip = ref(false);
const tooltipPosition = ref({ x: 0, y: 0 });
const currentSelection = ref<AnalyzedSegment | null>(null);
const hasSelection = ref(false);
const cachedText = ref("");

onMounted(() => {
    if (editorRef.value) {
        // Sync initial content
        editorRef.value.innerText = contentStore.rawText;
    }
    
    document.addEventListener('selectionchange', handleSelectionChange);
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);

    // Initial check
    if (contentStore.rawText && (!contentStore.currentTitle || contentStore.rawText !== contentStore.lastAnalyzedText)) {
        identifySource();
    }
});

onUnmounted(() => {
    document.removeEventListener('selectionchange', handleSelectionChange);
    document.removeEventListener('mousedown', handleOutsideClick);
    document.removeEventListener('touchstart', handleOutsideClick);
});

const handleSelectionChange = () => {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
        const text = selection.toString().trim();
        if (text && editorRef.value?.contains(selection.anchorNode)) {
             hasSelection.value = true;
             cachedText.value = text;
             return;
        }
    }
    hasSelection.value = false;
};

const handleOutsideClick = (event: Event) => {
    const target = event.target as HTMLElement;
    // If click outside tooltip AND outside selection fab
    if (!target.closest('.selection-tooltip') && !target.closest('.fab-btn') && showTooltip.value) {
         showTooltip.value = false;
    }
};

const performAnalysis = async () => {
    try {
        const text = cachedText.value || window.getSelection()?.toString().trim();
        
        if (text) {
            contentStore.isTranslating = true;
            
            // Calculate Position
            let rect: DOMRect | undefined;
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                 rect = selection.getRangeAt(0).getBoundingClientRect();
            }

            // Mobile check
            const isMobile = window.innerWidth < 768;
            
            if (!isMobile && rect && rect.width > 0) {
                 tooltipPosition.value = {
                    x: rect.left + (rect.width / 2),
                    y: rect.top - 10
                };
            } else {
                 tooltipPosition.value = {
                    x: window.innerWidth / 2,
                    y: window.innerHeight / 2
                 };
            }

            hasSelection.value = false; // Hide FAB
            
            // Do Analysis
            currentSelection.value = await contentStore.analyzeSelection(text);
            showTooltip.value = true;
            
            // Clear selection but keep focus? Usually good to verify
            // window.getSelection()?.removeAllRanges();
            cachedText.value = ""; 
        }
    } catch (e: any) {
        alert("分析發生錯誤: " + (e.message || e));
    } finally {
        contentStore.isTranslating = false;
    }
};

const saveCurrentSelection = async () => {
  if (currentSelection.value) {
    await contentStore.saveSegment(currentSelection.value);
    showTooltip.value = false;
    window.getSelection()?.removeAllRanges();
  }
};

const clearContent = () => {
    if(confirm('確定要清空內容嗎?')) {
        contentStore.rawText = "";
        contentStore.currentTitle = "";
        contentStore.lastAnalyzedText = "";
        if (editorRef.value) editorRef.value.innerText = "";
    }
}
</script>

<template>
  <div class="home-container">
    <div class="glass-panel main-panel">
        
        <!-- Header / Title -->
        <div class="header-section">
            <h1 class="appName">Lyrics Yomi</h1>
            <div class="title-wrapper">
                 <input 
                    v-model="contentStore.currentTitle" 
                    type="text" 
                    class="title-input" 
                    placeholder="Song Title..." 
                />
                <Loader2 v-if="isIndentifying" :size="16" class="spin-icon status-icon" />
                <Edit3 v-else :size="16" class="edit-icon status-icon" />
            </div>
             <button class="clear-btn" @click="clearContent" title="Clear All">
                <Trash2 :size="18" />
            </button>
        </div>

        <!-- The Single Contenteditable Area -->
        <div 
            ref="editorRef"
            class="editor-area glass-input"
            contenteditable="true"
            @input="updateContent"
            @paste="handlePaste"
            spellcheck="false"
            data-placeholder="請在此貼上歌詞，選取文字即可翻譯..."
        ></div>
        
    </div>

    <!-- Floating Action Button for Analysis -->
    <div v-if="hasSelection" class="fab-container">
        <button class="fab-btn" @click="performAnalysis">
            <Search :size="20" />
            <span>翻譯這段</span>
        </button>
    </div>

    <!-- Loading Overlay -->
    <div v-if="contentStore.isTranslating" class="loading-overlay">
        <div class="glass-card loading-card">
            <div class="spinner"></div>
            <p>正在分析翻譯...</p>
        </div>
    </div>

    <!-- Analysis Result Tooltip -->
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

      <button class="save-btn" @click="saveCurrentSelection" :disabled="contentStore.isNaming">
        <Loader2 v-if="contentStore.isNaming" :size="16" class="spin-icon" />
        <Save v-else :size="16" />
        {{ contentStore.isNaming ? 'Saving...' : 'Add to List' }}
      </button>
    </div>

  </div>
</template>

<style scoped>
.home-container {
    padding: 24px;
    max-width: 600px;
    margin: 0 auto;
    min-height: 100vh;
}

.main-panel {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 24px;
    background: rgba(255, 255, 255, 0.65);
    border-radius: 24px;
    min-height: 80vh; 
}

/* Header */
.header-section {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 8px;
}

.appName {
    font-size: 1rem;
    font-weight: 800;
    color: var(--color-primary, #007aff);
    opacity: 0.8;
}

.title-wrapper {
    flex: 1;
    position: relative;
    display: flex;
    align-items: center;
}

.title-input {
    width: 100%;
    background: transparent;
    border: none;
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--color-text-main);
    padding: 4px 0;
    padding-right: 24px;
    border-bottom: 2px solid transparent; /* Hide border until focus/hover */
    transition: all 0.2s;
}

.title-input:hover, .title-input:focus {
    border-bottom-color: rgba(0,0,0,0.1);
    outline: none;
}

.status-icon {
    position: absolute;
    right: 0;
    color: var(--color-text-sub);
    pointer-events: none;
    opacity: 0.5;
}

.clear-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--color-text-sub);
    padding: 8px;
    border-radius: 50%;
    transition: background 0.2s;
}
.clear-btn:hover {
    background: rgba(0,0,0,0.05);
    color: var(--color-error, #ff4d4f);
}

/* Editor Area - ContentEditable */
.editor-area {
    flex: 1;
    width: 100%;
    min-height: 400px;
    padding: 20px;
    font-size: 1.1rem;
    line-height: 1.8;
    color: var(--color-text-main);
    white-space: pre-wrap;
    word-wrap: break-word;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.5);
    border: 1px solid rgba(255,255,255,0.4);
    outline: none;
    overflow-y: auto;
    transition: all 0.3s ease;
}

.editor-area:focus {
    background: rgba(255, 255, 255, 0.85);
    box-shadow: 0 4px 24px rgba(0,0,0,0.06);
}

/* Placeholder for ContentEditable */
.editor-area:empty:before {
  content: attr(data-placeholder);
  color: var(--color-text-sub);
  opacity: 0.6;
  pointer-events: none;
}

/* Tooltip & FAB (Copied from Analysis.vue) */
.fab-container {
    position: fixed;
    bottom: 32px;
    right: 32px;
    z-index: 900;
    animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.fab-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    background: var(--color-text-main);
    color: white;
    border: none;
    border-radius: 30px;
    font-size: 1rem;
    font-weight: 600;
    box-shadow: 0 4px 16px rgba(0,0,0,0.2);
    cursor: pointer;
    transition: all 0.2s;
}

.fab-btn:active {
    transform: scale(0.95);
}

.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255,255,255,0.5);
    backdrop-filter: blur(2px);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
}

.loading-card {
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    background: rgba(255,255,255,0.9);
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

.spinner {
    width: 32px;
    height: 32px;
    border: 3px solid rgba(0,0,0,0.1);
    border-top-color: var(--color-text-main);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.spin-icon {
    animation: spin 1s linear infinite;
}

/* Tooltip Box */
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

.label {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: var(--color-text-sub);
  margin-bottom: 4px;
  display: block;
}

.text-original {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text-main);
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0,0,0,0.05);
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
}
</style>

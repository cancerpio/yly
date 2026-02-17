<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Play } from 'lucide-vue-next';
import { useContentStore } from '../stores/content';

const router = useRouter();
const contentStore = useContentStore();

const startAnalysis = () => {
  if (!contentStore.rawText.trim()) return;
  router.push({ name: 'Analysis' });
};

</script>

<template>
  <div class="home-container">
    <div class="glass-panel hero-section">
      <h1 class="title-lg">Lyrics Yomi</h1>
      <p>日文歌詞 / 文章發音助手</p>
      
       <!-- Tip Message -->
      <div class="tip-message">
          <span>💡 提示: 點擊「開始分析」後，圈選任一段歌詞即可查看翻譯！</span>
      </div>

      <div class="input-area">
        <div class="title-input-wrapper">
          <label class="input-label">Title / Song Name</label>
          <input 
            v-model="contentStore.currentTitle"
            type="text" 
            placeholder="請輸入文章名稱 / 歌名 (Optional)"
            class="title-input glass-input"
          />
        </div>

        <textarea 
          v-model="contentStore.rawText"
          placeholder="請輸入歌詞或文章段落 (必填)"
          class="lyrics-input glass-input"
          spellcheck="false"
        ></textarea>
        
        <button class="analyze-btn" @click="startAnalysis">
          <Play :size="20" fill="currentColor" />
          <span>開始分析</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 600px;
  margin: 0 auto;
}

.hero-section {
  padding: 32px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: rgba(255, 255, 255, 0.65);
}

.hero-section p {
  color: var(--color-text-sub);
  margin-top: -8px;
  margin-bottom: 16px;
}

.input-area {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.lyrics-input {
  width: 100%;
  min-height: 300px;
  padding: 16px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.5);
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.6;
  resize: vertical;
  transition: all 0.3s ease;
  white-space: pre-wrap;
  word-wrap: break-word;
  color: var(--color-text-main);
}

.lyrics-input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.1);
}

.tip-message {
    text-align: center;
    color: var(--color-primary);
    background: rgba(var(--color-primary-rgb), 0.1);
    font-size: 0.95rem;
    font-weight: 500;
    padding: 12px 16px;
    margin-bottom: 20px;
    border-radius: 12px;
    border: 1px solid rgba(var(--color-primary-rgb), 0.2);
}

.analyze-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  background: var(--color-text-main);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.analyze-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  background: black; /* slightly darker or same since var is likely black */
}

.analyze-btn:active {
  transform: translateY(0);
}

.title-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
}

.input-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text-sub);
  margin-left: 4px;
}

.title-input {
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.5);
  font-family: inherit;
  font-size: 1rem;
  color: var(--color-text-main);
  transition: all 0.3s ease;
}

.title-input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.1);
}
</style>

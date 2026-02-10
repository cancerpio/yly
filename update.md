# Update Log

## 實際修改的檔案清單

### 1. Store & Data
- `frontend/src/stores/content.ts`: 
  - 重構資料結構，從單一 `savedSegments` 改為 `playlists` (Map<string, Segment[]>)。
  - 新增 `currentTitle` 狀態，用於儲存當前分析的文章/歌曲標題。
  - 修改 `saveSegment` 以支援將段落儲存到對應標題的清單中。
- `frontend/src/data/mockData.ts`: 
  - 新增 `SONG_METADATA` 常數，定義歌曲標題對應的 Meta 資料 (如 "AIZO" -> 封面圖, 歌手)。

### 2. Views (頁面)
- `frontend/src/views/Home.vue`: 
  - 新增標題輸入欄位 (Title / Song Name)，綁定 `contentStore.currentTitle`。
  - 調整輸入區域樣式。
- `frontend/src/views/Analysis.vue`: 
  - 使用 `computed` 屬性根據標題動態載入 Meta 資料。
  - 僅在偵測到是歌曲 (isSong) 時顯示專輯封面與歌名。
- `frontend/src/views/Playlists.vue`: 
  - 重寫為「清單列表」模式，顯示所有已儲存的標題資料夾 (Playlists)。
  - 點擊清單可進入詳情頁。
  - 支援刪除整份清單。
- `frontend/src/views/PlaylistDetail.vue` (新增):
  - 顯示特定清單內的儲存段落。
  - 支援單筆刪除。
- `frontend/src/views/SavedList.vue`: 
  - (已棄用) 修改為自動轉導至 `Playlists`，以解決舊程式碼相容性問題。

### 3. Router
- `frontend/src/router/index.ts`: 
  - 新增 `/playlist/:id` 路由，對應 `PlaylistDetail` 元件。

## 驗收指令與預期結果

### 測試環境
啟動開發伺服器：
```bash
cd frontend && npm run dev
```

### 驗收步驟

1. **基本分析與收藏 (歌曲模式)**
   - **指令**: 在首頁標題輸入 "AIZO"，內容保持預設，點擊「開始分析」。
   - **預期**: 
     - 進入分析頁面，上方顯示 "AIZO" 標題、歌手 "REOL" 及專輯封面。
     - 圈選任一段歌詞並儲存。
     - 進入 "Saved Playlists" 頁面，應看到 "AIZO" 資料夾。

2. **文章分析與收藏 (文章模式)**
   - **指令**: 在首頁標題輸入 "My Article"，內容輸入任意日文文章，點擊「開始分析」。
   - **預期**: 
     - 進入分析頁面，上方**不顯示**專輯封面或歌手資訊 (僅顯示標題)。
     - 圈選文字並儲存。
     - 進入 "Saved Playlists" 頁面，應看到 "My Article" 資料夾。

3. **清單瀏覽與管理**
   - **指令**: 在 "Saved Playlists" 頁面點擊資料夾 (如 "AIZO")。
   - **預期**: 
     - 進入詳情頁，顯示剛才儲存的段落。
     - 越新加入的段落排在越上面。
     - 點擊刪除按鈕可移除單筆資料。
     - 回到列表頁，點擊資料夾旁的垃圾桶可刪除整個清單。

## 失敗排除
- 如果舊資料導致錯誤，嘗試清除瀏覽器 `localStorage` (Key: `playlists`)。
- 如果 "SavedList" 相關路由報錯，確認是否已清除舊的 `SavedList.vue` 引用 (目前已做相容處理)。

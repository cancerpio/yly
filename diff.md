# Feature song-playlist-feature 變更記錄

執行時間：2026-02-10 22:45:00
Feature Name：song-playlist-feature
調整類型：調整功能
備份目錄：./backups/20260210_224500_song-playlist-feature/

## 變更摘要

### 新增的檔案
- frontend/src/views/PlaylistDetail.vue
  - 說明：顯示單一清單的詳細內容 (原 saved list 功能)
  - 備份位置：無 (實作中新增)

### 修改的檔案
- frontend/src/data/mockData.ts
  - 變更類型：新增常數
  - 變更說明：新增 SONG_METADATA 用於儲存歌曲 Meta
  - 主要變更：
    - 新增 `SONG_METADATA`
  - 備份位置：`./backups/20260210_224500_song-playlist-feature/frontend/src/data/mockData.ts`

- frontend/src/stores/content.ts
  - 變更類型：修改結構
  - 變更說明：支援 Playlists 的 Map 結構
  - 主要變更：
    - state: `savedSegments` -> `playlists`
    - action: `saveSegment` -> 依 `currentTitle` 儲存
  - 備份位置：`./backups/20260210_224500_song-playlist-feature/frontend/src/stores/content.ts`

- frontend/src/views/Home.vue
  - 變更類型：修改 UI
  - 變更說明：新增標題輸入欄位
  - 主要變更：
    - `<input class="title-input">`
  - 備份位置：`./backups/20260210_224500_song-playlist-feature/frontend/src/views/Home.vue`

- frontend/src/views/Analysis.vue
  - 變更類型：修改 UI
  - 變更說明：根據標題顯示 Meta 資料
  - 主要變更：
    - `computed` 屬性 (artwork, isSong)
  - 備份位置：`./backups/20260210_224500_song-playlist-feature/frontend/src/views/Analysis.vue`

- frontend/src/views/Playlists.vue
  - 變更類型：重構
  - 變更說明：顯示清單列表而非單一段落列表
  - 主要變更：
    - `contentStore.playlists` V-for
  - 備份位置：`./backups/20260210_224500_song-playlist-feature/frontend/src/views/Playlists.vue`

- frontend/src/views/SavedList.vue
  - 變更類型：棄用 (Refactor)
  - 變更說明：為了避免 Build Error，將其內容清空並轉導，作為過渡處理 (雖然不在原備份清單中，但在專案內存在)
  - 備份位置：無 (未事先備份，但為無用檔案)

- frontend/src/router/index.ts
  - 變更類型：新增路由
  - 變更說明：新增 `/playlist/:id` 路由
  - 備份位置：`./backups/20260210_224500_song-playlist-feature/frontend/src/router/index.ts`

## 還原方式

### 步驟 1: 刪除新增檔案
```bash
rm frontend/src/views/PlaylistDetail.vue
```

### 步驟 2: 恢復備份檔案
```bash
cp ./backups/20260210_224500_song-playlist-feature/frontend/src/data/mockData.ts frontend/src/data/mockData.ts
cp ./backups/20260210_224500_song-playlist-feature/frontend/src/stores/content.ts frontend/src/stores/content.ts
cp ./backups/20260210_224500_song-playlist-feature/frontend/src/views/Home.vue frontend/src/views/Home.vue
cp ./backups/20260210_224500_song-playlist-feature/frontend/src/views/Analysis.vue frontend/src/views/Analysis.vue
cp ./backups/20260210_224500_song-playlist-feature/frontend/src/views/Playlists.vue frontend/src/views/Playlists.vue
cp ./backups/20260210_224500_song-playlist-feature/frontend/src/router/index.ts frontend/src/router/index.ts
```

### 步驟 3: 還原 SavedList.vue (如果需要)
由於 SavedList.vue 原本功能與 Playlists.vue 重疊或被取代，若還原 Playlists.vue 後仍需 SavedList.vue，請手動確認 git 歷程或專案狀態。
(此次更動將其清空以配合新架構)

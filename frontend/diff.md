# Feature ui-recent-list 變更記錄

執行時間：Wed Feb 18 16:39:31 CST 2026
Feature Name：ui-recent-list
調整類型：新增功能
備份目錄：.backups/ui-recent-list/

## 變更摘要

### 新增的檔案
- src/stores/history.ts
  - 說明：管理最近學習紀錄 (localStorage)
- src/components/RecentList.vue
  - 說明：首頁顯示最近 3 筆紀錄的卡片列表

### 修改的檔案
- src/views/Home.vue
  - 變更類型：修改
  - 變更說明：整合 RecentList 元件，新增 handleRecentSelect 邏輯，修正 HTML 結構
  - 備份位置：

- src/stores/content.ts
  - 變更類型：修改
  - 變更說明：Expose isAnalyzing, analysisResult 等狀態供 Home 使用，修正重複 export
  - 備份位置：無 (本次僅備份 Home.vue)

- vite.config.ts & tsconfig.app.json
  - 變更類型：修改
  - 變更說明：新增 @ alias 指向 src 目錄

## 還原方式

### 步驟 1：刪除新增的檔案
```bash
rm src/stores/history.ts src/components/RecentList.vue
```

### 步驟 2：恢復備份檔案
```bash
cp .backups/ui-recent-list/Home.vue src/views/Home.vue
# 注意：content.ts, vite.config.ts, tsconfig.app.json 需手動還原或參考 git 紀錄
```

# Feature ui-recent-list-v2 變更記錄

執行時間：Wed Feb 18 16:59:48 CST 2026
Feature Name：ui-recent-list-v2
調整類型：新增功能
備份目錄：.backups/ui-recent-list-v2/

## 變更摘要

### 新增的檔案
- src/components/RecentLists.vue
  - 說明：首頁顯示最近新增/修改的清單列表 (取代舊版的 RecentList)

### 修改的檔案
- src/views/Home.vue
  - 變更類型：修改
  - 變更說明：移除 RecentList，改用 RecentLists，實作「點擊載入最新片段」邏輯
  - 備份位置：

- src/stores/content.ts
  - 變更類型：修改
  - 變更說明：新增 playlistTimestamps 記錄修改時間，新增 recentLists getter (Top 3)
  - 備份位置：

- vite.config.ts & tsconfig.app.json
  - 變更類型：修改
  - 變更說明：(重做) 新增 @ alias 指向 src 目錄

## 還原方式

### 步驟 1：刪除新增的檔案
```bash
rm src/components/RecentLists.vue
```

### 步驟 2：恢復備份檔案
```bash
cp .backups/ui-recent-list-v2/Home.vue src/views/Home.vue
cp .backups/ui-recent-list-v2/content.ts src/stores/content.ts
```


### Bug Fix (App.vue)
- src/App.vue
  - 變更類型：修改
  - 變更說明：新增 contentStore.init() 全域初始化，解決 Home 頁面無資料問題


### Bug Fix (Home.vue)
- src/views/Home.vue
  - 變更類型：修改
  - 變更說明：手動更新 editor DOM 的 innerText，修復點擊 Recent List 無反應的問題


### Bug Fix (RecentLists.vue, Home.vue)
變更說明：修正 Recent List 點擊行為
從「載入內容到編輯器」改為「導航至清單詳細頁面 (/playlist/:id)」。
回復了 content.ts, vite.config.ts, tsconfig.app.json, App.vue 的必要設定。


### UX Refactor (Home.vue)
- src/views/Home.vue
  - 變更類型：修改 (UX 調整)
  - 變更說明：將 RecentLists 移至 Title Input 上方，強化「接續學習」的體驗。


### UX Refactor (PlaylistDetail.vue)
- src/views/PlaylistDetail.vue
  - 變更類型：修改 (Navigation)
  - 變更說明：將 Back 按鈕行為改為 `router.push({ name: 'Playlists' })`，確保回到清單列表。


### UI Terminology Update
- src/App.vue
  - 變更類型：修改 (Terminology)
  - 變更說明：Bottom Nav 更名 (Lists -> Card Lists)
- src/views/Playlists.vue
  - 變更類型：修改 (Terminology)
  - 變更說明：Header 更名 (Saved Playlists -> Saved Card Lists)
- src/components/RecentLists.vue
  - 變更類型：修改 (Terminology)
  - 變更說明：Header 更名 (最近新增清單 -> 最近新增字卡列表)


### App Branding Update
- src/index.html: Title -> Yomi Cards
- src/views/Home.vue: Header -> Yomi Cards / 把日文化為可回顧的卡片


### UX Refactor (Home.vue)
- src/views/Home.vue
  - 變更類型：修改 (Placeholders)
  - 變更說明：更新 Title Input 與 Editor 的 placeholder，使用具體範例以引導使用者建立字卡。


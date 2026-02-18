# Product Update (ui-recent-list-v2)

## 變更摘要
實作了首頁的 **Recent Lists (最近清單 V2)**，根據使用者的回饋，調整為顯示「最近新增/修改的 3 個清單」。

### 主要功能
1.  **最近清單顯示**: 
    - 顯示最近有變動的 3 個清單 (標題、文章數)。
    - **時間排序**: 透過  記錄清單最後修改時間，確保最新操作的清單排在最前。
2.  **內容預覽**:
    - 每個清單卡片下方，顯示該清單中**最新一筆片段**的原文與翻譯/發音。
3.  **點擊載入**:
    - 點擊清單卡片，會自動載入該清單的所有內容 (join) 到編輯區，方便繼續編輯或閱讀。

## 驗收指令
1.  啟動專案: `npm run dev`
2.  進入首頁，若無資料請先隨意貼上文字並翻譯、儲存到不同清單。
3.  確認首頁下方出現「最近新增清單」區塊。
4.  確認清單順序是否依照最後修改時間排序。
5.  點擊任一清單，確認編輯區載入該清單的完整內容。


### Bug Fix (App.vue)
修正 Home 頁面初始載入無資料的問題。原因為  未被初始化，導致 localStorage 資料未讀入。已在  加入全域初始化邏輯。


### Bug Fix (Home.vue)
修復點擊 Recent List 後，編輯器內容沒有更新的問題。這是因為 `contenteditable` 元素需要手動更新 DOM，已加入相關邏輯。
現在點擊清單，文字會正確載入編輯區。


### Bug Fix (Recent List Navigation)

依據您的需求調整了 **Recent List** 點擊後的行為。

### 變更內容
- **點擊行為**: 現在點擊 Recent List 項目，會**跳轉 (Navigate)** 至該清單的詳細頁面 ()，而非將內容載入首頁編輯器。
- **配置還原**: 重新套用了 `vite.config.ts`, `tsconfig.app.json`, `App.vue` 的必要修正 (Path Alias, Store Init)，解決了 Build Error 與初始載入問題。

### 驗收方式
1.  點擊首頁下方的 Recent List。
2.  確認頁面跳轉至該清單的詳細頁面。


### UX Refactor (Home.vue)
- 調整 Recent List 位置：已將其移至 Song Title (輸入框) 上方，透過 UI 強調這是一個「學習/複習」優先的工具。


### UX Refactor (PlaylistDetail.vue)
- 修改 Back Button 行為：點擊後不再只是 `router.back()`, 而是強制導航至清單列表頁 (`/playlists`)，符合階層式導航需求。


### UI Terminology Update
- 將介面中的 "Lists" / "Playlists" 統一更名為 **"Card Lists" (字卡列表)**，以符合使用情境。
  - App.vue: Bottom Nav (Lists -> Card Lists)
  - Playlists.vue: Header (Saved Playlists -> Saved Card Lists)
  - RecentLists.vue: Header (最近新增清單 -> 最近新增字卡列表)


### App Branding Update
- **App Name**: 正式更名為 **Yomi Cards**。
- **App Description**: 副標題更新為 "把日文化為可回顧的卡片"。
- **Index Title**: 瀏覽器分頁標題已更新。


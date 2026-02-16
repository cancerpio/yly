# Feature smart-collection-naming 變更記錄

執行時間：2026-02-16 13:00:50
Feature Name：smart-collection-naming
調整類型：新增功能
備份目錄：./backups/20260216_130000_smart-collection-naming/

## 變更摘要

### 修改的檔案
- `frontend/src/stores/content.ts`
  - 變更類型：修改
  - 變更說明：實作 `identifySource` 與異步 `saveSegment` 邏輯。
  - 主要變更：
    - 新增 `isNaming` state
    - 整合 iTunes Search API
    - 實作無標題時的自動命名與隨機命名邏輯
  - 備份位置：`./backups/20260216_130000_smart-collection-naming/frontend/src/stores/content.ts`

- `frontend/src/views/Analysis.vue`
  - 變更類型：修改
  - 變更說明：支援異步儲存操作與 UI Loading 回饋。
  - 主要變更：
    - `saveCurrentSelection` 改為 async/await
    - 儲存按鈕加入 `Loader2` 與 Loading 文字狀態
  - 備份位置：`./backups/20260216_130000_smart-collection-naming/frontend/src/views/Analysis.vue`

## 還原方式

### 步驟 1：恢復備份檔案

```bash
# 恢復 store 設定
cp ./backups/20260216_130000_smart-collection-naming/frontend/src/stores/content.ts frontend/src/stores/content.ts

# 恢復 view 設定
cp ./backups/20260216_130000_smart-collection-naming/frontend/src/views/Analysis.vue frontend/src/views/Analysis.vue
```

### 步驟 2：清理備份（還原後選用）

```bash
rm -rf ./backups/20260216_130000_smart-collection-naming/
```

# Feature adjust-itunes-search-lang 變更記錄

執行時間：2026-02-16 14:09:29
Feature Name：adjust-itunes-search-lang
調整類型：調整功能
備份目錄：./backups/20260216_140900_adjust-itunes-search-lang/

## 變更摘要

### 修改的檔案
- `frontend/src/stores/content.ts`
  - 變更類型：修改
  - 變更說明：新增 iTunes API 地區與語言參數。
  - 主要變更：
    - 加入 `country=JP`
    - 加入 `lang=ja_jp`
  - 備份位置：`./backups/20260216_140900_adjust-itunes-search-lang/frontend/src/stores/content.ts`

## 還原方式

### 步驟 1：恢復備份檔案

```bash
# 恢復 store 設定
cp ./backups/20260216_140900_adjust-itunes-search-lang/frontend/src/stores/content.ts frontend/src/stores/content.ts
```

### 步驟 2：清理備份（還原後選用）

```bash
rm -rf ./backups/20260216_140900_adjust-itunes-search-lang/
```

# Feature improve-search-precision 變更記錄

執行時間：2026-02-16 21:15:29
Feature Name：improve-search-precision
調整類型：調整功能
備份目錄：./backups/20260216_211500_improve-search-precision/

## 變更摘要

### 修改的檔案
- `frontend/src/stores/content.ts`
  - 變更類型：修改
  - 變更說明：實作多步驟 iTunes 搜尋邏輯以提升命中率。
  - 主要變更：
    - 將 `fetchItunes` 抽離為共用函數
    - 增加「清理字串 (Cleaned Query)」搜尋策略
    - 增加「最長行 (Longest Line)」搜尋策略
  - 備份位置：`./backups/20260216_211500_improve-search-precision/frontend/src/stores/content.ts`

## 還原方式

### 步驟 1：恢復備份檔案

```bash
# 恢復 store 設定
cp ./backups/20260216_211500_improve-search-precision/frontend/src/stores/content.ts frontend/src/stores/content.ts
```

### 步驟 2：清理備份（還原後選用）

```bash
rm -rf ./backups/20260216_211500_improve-search-precision/
```

# Feature analysis-title-feedback 變更記錄

執行時間：2026-02-16 21:24:52
Feature Name：analysis-title-feedback
調整類型：調整功能
備份目錄：./backups/20260216_212400_analysis-title-feedback/

## 變更摘要

### 修改的檔案
- `frontend/src/views/Analysis.vue`
  - 變更類型：修改
  - 變更說明：實作可編輯的標題欄位與自動辨識邏輯。
  - 主要變更：
    - 新增 `.title-edit-container`
    - 新增 `onMounted` 自動呼叫 `identifySource`
    - 新增 `isIdentifying` Loading 狀態
  - 備份位置：`./backups/20260216_212400_analysis-title-feedback/frontend/src/views/Analysis.vue`

- `frontend/src/stores/content.ts`
  - 變更類型：修改
  - 變更說明：公開 `identifySource` 供外部存取。
  - 主要變更：
    - 將 `identifySource` 加入 return 物件
  - 備份位置：`./backups/20260216_211500_improve-search-precision/frontend/src/stores/content.ts` (使用上一個備份點或不需要備份此次小改動)

## 還原方式

### 步驟 1：恢復備份檔案

```bash
# 恢復 view 設定
cp ./backups/20260216_212400_analysis-title-feedback/frontend/src/views/Analysis.vue frontend/src/views/Analysis.vue
```

### 步驟 2：清理備份（還原後選用）

```bash
rm -rf ./backups/20260216_212400_analysis-title-feedback/
```

# Feature fix-analysis-auto-refresh 變更記錄

執行時間：2026-02-16 21:40:55
Feature Name：fix-analysis-auto-refresh
調整類型：修復錯誤
備份目錄：./backups/20260216_214000_fix-analysis-auto-refresh/

## 變更摘要

### 修改的檔案
- `frontend/src/stores/content.ts`
  - 變更類型：修改
  - 變更說明：新增 `lastAnalyzedText` 狀態。
  - 主要變更：
    - 新增 `lastAnalyzedText` state
    - 更新 return 物件
  - 備份位置：`./backups/20260216_214000_fix-analysis-auto-refresh/frontend/src/stores/content.ts`

- `frontend/src/views/Analysis.vue`
  - 變更類型：修改
  - 變更說明：修復再次分析時標題不更新的 Bug。
  - 主要變更：
    - 在 `onMounted` 新增變更檢測邏輯
  - 備份位置：`./backups/20260216_214000_fix-analysis-auto-refresh/frontend/src/views/Analysis.vue`

## 還原方式

### 步驟 1：恢復備份檔案

```bash
# 恢復 store 設定
cp ./backups/20260216_214000_fix-analysis-auto-refresh/frontend/src/stores/content.ts frontend/src/stores/content.ts

# 恢復 view 設定
cp ./backups/20260216_214000_fix-analysis-auto-refresh/frontend/src/views/Analysis.vue frontend/src/views/Analysis.vue
```

### 步驟 2：清理備份（還原後選用）

```bash
rm -rf ./backups/20260216_214000_fix-analysis-auto-refresh/
```

# Feature single-page-ui-integration 變更記錄

執行時間：2026-02-16 22:29:17
Feature Name：single-page-ui-integration
調整類型：新增功能/UI優化
備份目錄：./backups/20260216_222900_single_page_ui/

## 變更摘要

### 修改的檔案
- `frontend/src/views/Home.vue`
  - 變更類型：大規模重構
  - 變更說明：將 Analysis 頁面的所有功能 (圈選翻譯、收藏、自動辨識) 整合至 Home 頁面。
  - 主要變更：
    - 移除跳轉邏輯
    - 新增 `.content-container` (預覽區)
    - 實作 Debounce 自動辨識 (`identifySource`)
    - 實作圈選翻譯相關邏輯 (`performAnalysis`)
    - 整合 `.title-section` (含 Loading 狀態)
  - 備份位置：`./backups/20260216_222900_single_page_ui/frontend/src/views/Home.vue`

### 相關文件
- 新增 `ui_improve_single_page.md` (詳細測試案例與邏輯說明)

## 還原方式

### 步驟 1：恢復備份檔案

```bash
# 恢復 Home.vue
cp ./backups/20260216_222900_single_page_ui/frontend/src/views/Home.vue frontend/src/views/Home.vue

# (選用) 恢復 Analysis.vue (此次變更未實際修改它，只是不再用到)
# cp ./backups/20260216_222900_single_page_ui/frontend/src/views/Analysis.vue frontend/src/views/Analysis.vue
```

### 步驟 2：恢復路由設定 (若有修改)
本次實作暫時保留了 `/analyze` 路由以相容舊有邏輯，但使用者操作流程改為全在首頁完成。

# Feature single-input-analysis-integration 變更記錄

執行時間：2026-02-16 22:48:31
Feature Name：single-input-analysis-integration
調整類型：新增功能/UI優化
備份目錄：./backups/20260216_224800_single_input_analysis/

## 變更摘要

### 修改的檔案
- `frontend/src/views/Home.vue`
  - 變更類型：大規模重構
  - 變更說明：實作單一輸入框 `contenteditable` 取代原本的 `textarea` + `preview`。
  - 主要變更：
    - 移除 `.input-area` `<textarea>` 與 `.content-container`
    - 新增 `.editor-area` (`div contenteditable`)
    - 透過 `innerText` 同步 `rawText` 至 store
    - 直接在編輯器內監聽 `selectionchange` 並觸發翻譯
  - 備份位置：`./backups/20260216_224800_single_input_analysis/frontend/src/views/Home.vue`

## 還原方式

### 步驟 1：恢復備份檔案

```bash
# 恢復 Home.vue
cp ./backups/20260216_224800_single_input_analysis/frontend/src/views/Home.vue frontend/src/views/Home.vue
```

### 步驟 2：清理備份 (選用)

```bash
rm -rf ./backups/20260216_224800_single_input_analysis/
```

# Feature restore-home-style 變更記錄

執行時間：2026-02-16 23:00:24
Feature Name：restore-home-style
調整類型：UI優化
備份目錄：./backups/20260216_230000_restore_home_style/

## 變更摘要

### 修改的檔案
- `frontend/src/views/Home.vue`
  - 變更類型：修改
  - 變更說明：恢復提示訊息，調整首頁整體樣式以符合原案。
  - 主要變更：
    - 插回 `.tip-message`
    - 修改 `.header-section` 為垂直佈局 (flex-col)
    - 調整 `.title-input` 與 `.editor-area` 的 CSS (Color, Radius, Padding)
  - 備份位置：`./backups/20260216_230000_restore_home_style/frontend/src/views/Home.vue`

## 還原方式

### 步驟 1：恢復備份檔案

```bash
# 恢復 Home.vue
cp ./backups/20260216_230000_restore_home_style/frontend/src/views/Home.vue frontend/src/views/Home.vue
```

### 步驟 2：清理備份 (選用)

```bash
rm -rf ./backups/20260216_230000_restore_home_style/
```

# Feature refine-home-style 變更記錄

執行時間：2026-02-16 23:07:00
Feature Name：refine-home-style
調整類型：UI優化
備份目錄：./backups/20260216_230000_restore_home_style/ (使用同一備份，小幅樣式修改)

## 變更摘要

### 修改的檔案
- `frontend/src/views/Home.vue`
  - 變更類型：修改
  - 變更說明：恢復標題為綠色小字體，修復編輯區寬度溢出。
  - 主要變更：
    - `.appName`: `font-size: 1.2rem`, `color: var(--color-primary)`
    - `.editor-area`: `box-sizing: border-box`, `text-align: left`
  - 備份位置：(無，使用前一次備份)

# Feature refine-home-style-details 變更記錄

執行時間：2026-02-16 23:15:46
Feature Name：refine-home-style-details
調整類型：UI優化
備份目錄：./backups/20260216_230000_restore_home_style/ (使用同一還原點)

## 變更摘要

### 修改的檔案
- `frontend/src/views/Home.vue`
  - 變更類型：微調
  - 變更說明：最佳化輸入框的 Padding 與 Focus 樣式。
  - 主要變更：
    - `.title-input`: 增加 `padding`，圓角 `8px`。
    - `.title-input:hover/focus`: 移除底線，改為 `background: rgba(0,0,0,0.03)`。
    - `.status-icon`: `right: 12px`。
  - 備份位置：(無，使用前一次備份)

# Feature update-title-format-with-artist 變更記錄

執行時間：2026-02-16 23:20:00
Feature Name：update-title-format-with-artist
調整類型：新增功能
備份目錄：./backups/20260216_232000_update_title_format/

## 變更摘要

### 修改的檔案
- `frontend/src/stores/content.ts`
  - 變更類型：修改
  - 變更說明：自動辨識歌名時，現在會一併顯示作者名稱。
  - 主要變更：
    - return format: `${track.trackName} (${track.artistName})`
  - 備份位置：`./backups/20260216_232000_update_title_format/frontend/src/stores/content.ts`

## 還原方式

### 步驟 1：恢復備份檔案

```bash
# 恢復 content.ts
cp ./backups/20260216_232000_update_title_format/frontend/src/stores/content.ts frontend/src/stores/content.ts
```

### 步驟 2：清理備份 (選用)

```bash
rm -rf ./backups/20260216_232000_update_title_format/
```

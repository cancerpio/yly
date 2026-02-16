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

# Feature offline-dictionary-support 變更記錄

執行時間：2026-02-15 23:30:00
Feature Name：offline-dictionary-support
調整類型：新增功能 / 調整功能
備份目錄：./backups/20260215_231500_offline-dictionary-support/

## 變更摘要

### 新增的檔案
- frontend/public/dict/*
  - 說明：Kuromoji 字典檔 (17MB)，用於離線斷詞。
- frontend/vite.config.ts (若為新增) 或修改
  - 說明：增加 middleware 與 polyfill 支援。

### 修改的檔案
- frontend/src/stores/content.ts
  - 變更類型：修改
  - 變更說明：整合 Kuroshiro，移除預設歌詞與 Mock DB 依賴。
  - 主要變更：
    - 新增 `initKuroshiro` 與 `kuroshiro.convert` 呼叫 (Target: Romaji)。
    - 將 `rawText` 與 `currentTitle` 預設值設為空字串。
  - 備份位置：`./backups/20260215_231500_offline-dictionary-support/frontend/src/stores/content.ts`

- frontend/src/views/Home.vue
  - 變更類型：修改
  - 變更說明：更新輸入框 placeholder。
  - 主要變更：
    - 增加 "請輸入..." 的提示文字。
  - 備份位置：(未備份，此為 UI 微調)

- frontend/package.json
  - 變更類型：修改
  - 變更說明：新增 `vite-plugin-node-polyfills` 依賴。

- frontend/vite.config.ts
  - 變更類型：修改
  - 變更說明：解決 `path` 模組缺失與 `.dat.gz` 讀取錯誤。
  - 主要變更：
    - 引入 `vite-plugin-node-polyfills`。
    - 新增 `serve-dictionary-files` middleware。

## 還原方式

### 步驟 1：刪除新增的檔案

```bash
rm -rf frontend/public/dict
# 如有需要，移除 npm 套件
cd frontend && npm uninstall vite-plugin-node-polyfills
```

### 步驟 2：恢復備份檔案

```bash
# 恢復 content.ts
cp ./backups/20260215_231500_offline-dictionary-support/frontend/src/stores/content.ts frontend/src/stores/content.ts

# 若需恢復 vite.config.ts (假設原本無複雜設定)
# 請參考 git 歷史或自行重置
```

## 還原點資訊

還原點檔案：`./implement-revert-point.txt`
- 備份目錄：`./backups/20260215_231500_offline-dictionary-support/`
 

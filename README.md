# Lyrics Yomi (日文歌詞發音助手)

這是一個基於 Vue 3 + Vite 開發的 LINE Mini App，提供日文歌詞的離線斷詞、發音標註 (Romaji) 與線上翻譯功能。

## 專案設置

### 1. 安裝與開發
```bash
cd frontend
npm install
npm run dev
```

### 2. GitHub Pages 部署設定 (Deployment Protection Rules)
若要在非 `main` / `master` 分支 (Feature Branch) 進行部署測試，必須調整 GitHub Repository 的環境設定：

1. **進入 Repo 設定**：前往 `Settings` -> 左側選單 `Environments`。
2. **選擇環境**：點擊 `github-pages` (若無此環境，請先執行一次 Action 或手動建立)。
3. **修改保護規則 (Deployment branches)**：
   - 預設通常僅允許 `main` 或 `master`。
   - 點擊 `Select branches` -> `Add deployment branch rule`。
   - 加入您的 Feature Branch 名稱 (例如 `feat/*` 或特定分支名)。
   - 或者暫時改為 `No restriction` (允許所有分支部署)。
4. **重新執行 Action**：回到 `Actions` 頁籤，找到失敗的 Workflow，點擊 `Re-run all jobs`。

## 功能特色
- **離線斷詞**：整合 `kuroshiro` 與 `kuromoji` 字典檔 (~17MB)，無需後端即可進行日文斷詞與發音標註。
- **即時翻譯**：整合 MyMemory API 提供中文翻譯。
- **播放清單**：支援將分析結果儲存為播放清單，方便複習。

## 技術棧
- Vue 3 + TypeScript
- Pinia (State Management)
- Vite + vite-plugin-node-polyfills
- Kuroshiro (Japanese Tokenizer)

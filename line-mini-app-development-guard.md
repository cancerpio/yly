# LINE Mini App 開發重點指南 (Development Guard)

本文件整合了開發 LINE Mini App 時，針對 **合規性**、**使用者驗證與資料**、以及 **外部 API 安全性** 三大關鍵主題的實務重點。旨在讓開發者能快速理解並遵循最佳實踐。

---

## 1. Mini App 修改與合規 (UI/UX Compliance)
> **目標**：讓現有的 Web App 符合 LINE Mini App 的審核規範，並提供原生般的體驗。

### A. 程式碼層面
- **必備條件**：引入 `@line/liff` SDK。
- **初始化**：在 App 啟動時 (如 `main.ts` 或 `App.vue` 的 `onMounted`) 執行 `liff.init({ liffId: ... })`。
- **錯誤處理**：若初始化失敗，應提示「請在 LINE 中開啟」或降級為純網頁模式。

### B. UI 調整重點
1.  **移除自定義 Header**：
    - LINE App 會強制顯示原生 Header (含關閉鈕)。
    - **Action**：隱藏您網頁裡的 Navigation Bar，避免「雙子頭」佔用空間。
2.  **適配 Safe Area (iPhone X+)**：
    - 底部 Home Handle 會遮擋按鈕。
    - **Action**：對底部固定元素 (FAB, Tab Bar) 加入 CSS：`padding-bottom: env(safe-area-inset-bottom);`。
3.  **Loading 體驗**：
    - **Action**：在 LIFF 初始化完成前，顯示全螢幕 Loading (如 App Icon)，避免白屏。
4.  **連結開啟行為**：
    - **Action**：外部連結請用 `liff.openWindow({ url: ..., external: true })`，勿用 `<a target="_blank">`。

---

## 2. User Auth 與 資料儲存 (Auth & Storage)
> **目標**：利用 LINE 的免登入特性，結合 Serverless 方案，達成「無伺服器、自動登入、跨裝置同步」。

### A. 身分驗證 (Authentication)
- **機制**：依賴 LIFF 的自動登入。
- **唯一識別碼 (User ID)**：
    - 初始化後呼叫 `liff.getContext().userId` 或 `liff.getDecodedIDToken().sub`。
    - **userId** 是該 Provider 下使用者的永久唯一 ID (如 `U1234...`)。
    - **Action**：將此 ID 作為資料庫的主鍵 (Key)。

### B. 資料儲存建議 (Data Storage)
針對個人開發者或 MVP，推薦 **Serverless (無伺服器)** 方案：

| 方案 | 特性 | 適用場景 |
| :--- | :--- | :--- |
| **Firebase (Firestore)** | NoSQL, 即時同步, Google 生態系 | **最推薦** (簡單、免費額度高) |
| **Supabase** | SQL (Postgres), 開源替代品 | 需要關聯式資料庫時 |
| **LocalStorage** | 純前端, 無法跨裝置 | 僅單機使用 (加上匯出/匯入) |

- **實作流程**：
    1. App 啟動 -> 取得 `userId`。
    2. 用 `userId` 去 Firestore 查詢 User Document。
    3. 若有資料 -> 同步回前端；若無 -> 初始化。
    4. 使用者操作 -> 寫入 Firestore `users/{userId}/...`。

---

## 3. 使用 API Key 的安全性 (API Security)
> **目標**：當需要串接 OpenAI、Google Sheets 等**付費或敏感** API 時，如何確保 Key 不外流。

### 核心原則
**絕對禁止** 將 API Key 寫在前端程式碼中 (即使是 Mini App 也不行)。

### 推薦架構：Frontend-Only (Serverless 代理)
這是最輕量且安全的做法，無需維護伺服器。

1.  **中間層 (Cloud Function)**：
    - 使用 Firebase Functions 或 Vercel Functions。
    - 將 API Key 存在 **環境變數 (Environment Variables)** 中。
    - 程式碼負責：接收請求 -> 驗證身分 -> 加上 Key 呼叫外部 API -> 回傳結果。

2.  **前端 (Mini App)**：
    - **只呼叫** 您的 Cloud Function 網址 (如 `https://api.myapp.com/analyze`)。
    - **不碰** 任何 OpenAI/Google 的 Key。
    - Header 帶上 LIFF ID Token 供後端驗證。

3.  **優點**：
    - 安全 (Key 不外流)。
    - 省錢 (可實作 Rate Limiting 或 Cache)。
    - 簡單 (寫完 Function 部署上去就不用管了)。

---

### 速查清單 (Checklist)
- [ ] `liff.init()` 已實作且處理 Error。
- [ ] UI 已移除自定義 Header 並適配 Safe Area。
- [ ] 使用 `userId` 作為資料庫 Key。
- [ ] 敏感 API Key 已移至 Cloud Function 環境變數。

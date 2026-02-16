# 使用 API Key 的外部服務整合最佳實務

本文件說明在開發 LINE Mini App 等前端應用時，如何安全地整合需要 API Key 的外部服務 (如 OpenAI, Google Sheets, 翻譯 API)，並確保系統架構的安全性。

**核心原則**：絕對不可將 API Key 寫死在前端程式碼中。

---

## 場景一：純前端架構 (Frontend-Only Architecture)
**適用情境**：不想維護伺服器，但需要安全呼叫第三方 API (如 OpenAI) 的小型專案或 Prototype。

### 架構總覽
透過 **Serverless Cloud Functions** (如 Firebase Functions, Vercel Functions) 作為中間層代理。

1.  **前端 (Mini App)**：
    - 發送請求到您部署的 Cloud Function 網址。
    - 請求內容包含需要的資料 (payload) 與身分驗證資訊 (LINE `userId` 或 `accessToken`)。
2.  **Cloud Function (中間層)**：
    - 作為一個安全的代理伺服器。
    - API Key 儲存在 **環境變數 (Environment Variables)** 中，不會外流。
    - 驗證請求來源與使用者身分。
    - 使用儲存的 Key 呼叫外部服務 (OpenAI, Google Sheets)。
    - 將處理後的結果回傳給前端。

### 實作細節範例

#### 步驟 1：前端發送請求
```javascript
// Function Call
const callCloudFunction = async (text) => {
  const idToken = liff.getIDToken(); // 取得 JWT Token 供後端驗證
  const response = await fetch('https://YOUR_PROJECT_ID.cloudfunctions.net/analyzeLyrics', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}` // 傳送 Token 供驗證
    },
    body: JSON.stringify({ text })
  });
  return await response.json();
};
```

#### 步驟 2：Cloud Function (Node.js 範例)
```javascript
const functions = require('firebase-functions');
const fetch = require('node-fetch');

// 從環境變數安全取得 API Key
const OPENAI_API_KEY = functions.config().openai.key;

exports.analyzeLyrics = functions.https.onCall(async (data, context) => {
  // 1. 驗證身分 (使用 Firebase Auth 或手動驗證 Token)
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
  }

  // 2. 呼叫外部 API
  const response = await fetch('https://api.openai.com/v1/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt: data.text,
      max_tokens: 100
    })
  });

  const result = await response.json();
  return { analysis: result.choices[0].text };
});
```

### 安全措施
- **環境變數**：務必使用 `firebase functions:config:set` 或 Vercel 的 Environment Variables 設定 Key，切勿直接寫在程式碼中。
- **App Check**：啟用 Firebase App Check 或類似機制，確保流量來自您的真實應用程式。
- **來源驗證**：檢查 `Referer` 或使用 CORS 策略限制呼叫來源網域。

---

## 場景二：前後端分離架構 (Frontend + Backend Server)
**適用情境**：已有後端基礎設施，或需要複雜業務邏輯、資料庫操作的大型專案。

### 架構總覽
使用傳統後端伺服器 (如 Node.js, Python, Go) 來處理 API Key 與邏輯。

1.  **前端 (Mini App)**：
    - 透過 LINE Login (LIFF)驗證使用者。
    - 發送請求到您的後端 API (例如 `/api/translate`)。
    - Header 帶上 `Authorization: Bearer <ID_TOKEN>`。
2.  **後端伺服器 (Backend Server)**：
    - API Key 儲存在 `.env` 檔案中 (且不 commit 到 git)。
    - Middleware 驗證 LINE ID Token 的簽章。
    - 針對使用者進行 **速率限制 (Rate Limiting)** 以防濫用。
    - 呼叫外部服務並可進行快取 (Cache) 以節省成本。

### 實作細節範例

#### 步驟 1：後端設定 (Express.js 範例)
```javascript
require('dotenv').config(); // 載入 .env
const express = require('express');
const axios = require('axios');
const app = express();

// Middleware: 驗證 LINE ID Token
const verifyLineToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  try {
    const response = await axios.post('https://api.line.me/oauth2/v2.1/verify', {
      id_token: token,
      client_id: process.env.LINE_CHANNEL_ID
    });
    req.user = response.data; // 取得 sub (userId), name 等資訊
    next();
  } catch (error) {
    res.status(401).send('Invalid Token');
  }
};

app.post('/api/translate', verifyLineToken, async (req, res) => {
  // 使用環境變數中的 API Key
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  // 實作邏輯...
});
```

#### 步驟 2：速率限制 (Rate Limiting) - 控制成本關鍵
使用 API Key 的外部服務通常按次計費，必須在後端實作 Rate Limiting。

```javascript
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分鐘
  max: 100, //每個視窗限制 100 次請求
  keyGenerator: (req) => req.user.sub // 針對 User ID 進行限制 (而非 IP)
});

app.use('/api/', apiLimiter);
```

### 安全措施
- **Token 驗證**：後端必須驗證 ID Token 的簽章，**切勿信任** 前端 Body 傳來的 `userId`。
- **IP 白名單**：在 Google Cloud Console 或 OpenAI 後台，限制 API Key 僅能被您後端伺服器的 IP 使用。
- **成本監控**：在外部服務後台設定預算警報 (Budget Alerts)。

---

## 比較總結

| 特性 | 場景一：純前端 (Serverless) | 場景二：前後端分離 |
| :--- | :--- | :--- |
| **維運成本** | 低 (按次計費) | 中/高 (伺服器維護) |
| **實作複雜度** | 低 (專注於功能邏輯) | 中 (需處理路由、Middleware、部署) |
| **擴展性** | 自動擴展 (Auto-scaling) | 手動/設定擴展 |
| **安全性** | 平台代管 (Google/Vercel) | 自行管理 (OS, 防火牆等) |
| **適用對象** | Prototype, 小工具, MVP | 企業級應用, 複雜邏輯, 大流量 |

**針對 LINE Mini App 的推薦**：**場景一 (Serverless)**，因其簡單、成本低且易於與 LIFF 整合。

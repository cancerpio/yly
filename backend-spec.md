# Backend Specification: Architecture & Implementation Guide

本文檔整合了 Lyrics Yomi (yly) 專案的後端架構設計、身分驗證機制與實作指南。旨在協助開發者理解 LINE Mini App 的整合原理，並提供 AI Agent 明確的執行規格。

---

# Part 1: 原理與架構設計 (Theory & Architecture)

## 1. 雙模身分驗證機制 (Hybrid Authentication Strategy)
本專案需同時支援 **一般 Web 模式** (瀏覽器直接存取) 與 **LINE Mini App 模式** (在 LINE 內開啟)。為了讓後端資料庫 (Firestore) 能統一管理，我們採用 **Firebase Auth** 作為核心認證層。

### A. LINE Mini App 模式 (LIFF)
> **核心概念**：利用 LINE 的 `ID Token` 交換 Firebase 的 `Custom Token`。

根據 [LINE LIFF 文件 - ID Token](https://developers.line.biz/en/reference/liff/#get-id-token) 與 [整合後端驗證 (Verify API)](https://developers.line.biz/en/docs/line-login/verify-id-token/)：
1.  **Frontend**: 呼叫 `liff.getIDToken()` 取得 JWT 格式的 ID Token。
2.  **API**: 將 ID Token 傳送給我們的後端 API (`verify_line_token`)。
3.  **Backend**: 
    - 呼叫 LINE Verify API (`https://api.line.me/oauth2/v2.1/verify`) 驗證 Token 合法性。
    - 解析出 `sub` (即 User ID)。
    - 使用 Firebase Admin SDK 產生 **Custom Token** (`auth.createCustomToken(lineUserId)`).
4.  **Frontend**: 收到 Custom Token 後，呼叫 `firebase.auth().signInWithCustomToken()`。
    - **結果**：Firebase `currentUser.uid` = LINE User ID。

### B. 一般 Web 模式 (Browser)
> **核心概念**：針對未登入訪客，使用 **匿名登入 (Anonymous Auth)**。

根據 [Firebase Anonymous Auth](https://firebase.google.com/docs/auth/web/anonymous-auth)：
1.  **Frontend**: 初始化時偵測若無 LIFF 環境，直接呼叫 `signInAnonymously()`。
2.  **Backend**: Firebase 自動產生一組隨機 `uid`。
    - **結果**：Firebase `currentUser.uid` = 隨機 ID (如 `anon_xyz...`)。
### C. 雙模身分驗證流程圖 (Authentication Flowchart)

```text
[ Start App ]
      |
      +---- Is LIFF/LINE Context? ----+
      |                               |
      | YES                           | NO (Web Browser)
      v                               v
[ Get LIFF ID Token ]           [ Firebase Anonymous Auth ]
      |                         (signInAnonymously)
      v                               |
[ Call Backend API ]                  |
(/verify_line_token)                  |
      |                               |
      v                               |
[ Verify with LINE ]                  |
      |                               |
      v                               |
[ Create Custom Token ]               |
      |                               |
      v                               |
[ Frontend: SignInWithCustomToken ]   |
      |                               |
      +-------------> + <-------------+
                      |
            [ Firebase Auth State ]
             (currentUser.uid)
                      |
                      v
            [ Firestore Access ]
            (users/{uid}/...)
```

### D. Web 模式補充說明 (Anonymous Auth Details)
- **資料存續與儲存位置 (Storage Location)**：
    - **身分證 (Auth Token)**：存在瀏覽器的 **LocalStorage / IndexedDB**。只要不清除，瀏覽器會記得「我是誰 (UID)」。
    - **使用者資料 (User Data)**：全部存在雲端的 **Firebase Firestore**。瀏覽器不存資料，只存身分證。
    - **運作原理**：每次打開網頁，瀏覽器拿起身分證 (UID) 向雲端請求資料。
- **資料遺失風險**：
    - **清除快取**：若使用者執行「清除瀏覽器資料」，身分證 (UID) 遺失，雲端的資料雖然還在，但再也拿不到了 (因為變成孤兒資料)。
    - **無痕模式**：無痕視窗關閉後，身分證即刻銷毀。
    - **跨裝置**：電腦與手機的瀏覽器會被視為不同使用者 (不同身分證)。
- **未來升級路徑 (Account Linking)**：
    - 可實作將「匿名帳號」綁定到「Google/Email」帳號的功能 (Link with Credential)，讓使用者無痛升級為永久會員。


## 2. 資料庫設計 (Schema Design)
使用 **Cloud Firestore** (NoSQL)，結構以 `users` 為根節點，確保權限隔離。

### Collection: `users`
- **Document ID**: `uid` (LINE User ID 或 Anonymous ID)
- **Fields**:
  - `createdAt`: Timestamp
  - `lastLogin`: Timestamp
  - `platform`: 'line' | 'web'
  - `displayName`: String (Optional)
  - `pictureUrl`: String (Optional)

### Sub-collection: `users/{uid}/lyrics` (歌詞記錄)
- **Document ID**: Auto-generated
- **Fields**:
  - `title`: String (歌名，如 "Lemon (米津玄師)")
  - `content`: String (原始歌詞/文章內容)
  - `type`: 'text' | 'image_ocr' | 'youtube_transcript'
  - `sourceUrl`: String (若是 YouTube/圖片來源)
  - `createdAt`: Timestamp

### Sub-collection: `users/{uid}/favorites` (單字/金句收藏)
- **Document ID**: Auto-generated
- **Fields**:
  - `original`: String (原文)
  - `reading`: String (讀音/拼音)
  - `translation`: String (翻譯)
  - `sourceDocId`: String (關聯的歌詞 ID)
  - `createdAt`: Timestamp

---

# Part 2: 實作指南 (Implementation Guide)

## 1. Firebase 專案設定 (Console Setup)
*(由開發者手動執行)*

### A. 啟用 Authentication
1.  進入 Firebase Console > Authentication > Sign-in method。
2.  啟用 **Anonymous (匿名)** 提供者。
3.  (進階) 若未來要綁定，可啟用 Google/Email。

### B. 設定 Service Account (後端用)
1.  Project Settings > Service accounts。
2.  下載 `serviceAccountKey.json` (若在 Cloud Functions 環境則免，SDK 自動抓取)。
3.  **注意**：Cloud Functions 需有 `Cloud Vision API` 與 `Identity Platform Admin` 權限。

## 2. 後端 API 開發 (Cloud Functions - Python)

### API 1: `verify_line_token` (POST)
- **輸入**: `{ "idToken": "eyJ..." }`
- **邏輯**:
  ```python
  # 1. 驗證 LINE Token
  verify_url = 'https://api.line.me/oauth2/v2.1/verify'
  resp = requests.post(verify_url, data={'id_token': id_token, 'client_id': LIFF_CHANNEL_ID})
  if resp.status_code != 200: raise Error
  
  line_user_id = resp.json()['sub']
  
  # 2. 產生 Firebase Custom Token
  custom_token = auth.create_custom_token(line_user_id)
  return { "token": custom_token.decode('utf-8') }
  ```

### API 2: `analyze_image` (POST) - 已規劃
- **輸入**: Multipart Form Data (Image file)
- **邏輯**: 使用 Google Cloud Vision API 進行 OCR。
- **參考**: 詳見 [image-solution.md](./image-solution.md)。

### API 3: `get_youtube_transcript` (GET) - 已規劃
- **輸入**: `?video_id=...`
- **邏輯**: 使用 `youtube-transcript-api`。
- **參考**: 詳見 [firebase-python-api-guide.md](./firebase-python-api-guide.md)。

### API 4: `search_lyrics` (GET) - 新增
> **決策背景**：經評估 Musixmatch API 成本 ($29.5/月起) 與限制 (不可快取、強制商標)，本專案採用 **Genius API** 方案。

- **工具**: `lyricsgenius` (Python Library)。
- **輸入**: `?q=SongTitle ArtistName` (例如: `?q=Lemon 米津玄師`)
- **邏輯**:
  1.  搜尋 Genius 取得最佳匹配歌曲。
  2.  爬取該歌曲頁面的歌詞內文。
  3.  回傳純文字歌詞。
- **注意**: 需申請 Genius Client Access Token (免費)。

## 3. 資料庫安全規則 (Firestore Security Rules)
直接套用以下規則，確保使用者只能存取自己的資料。

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function
    function isOwner(userId) {
      return request.auth != null && request.auth.uid == userId;
    }

    // Users Collection
    match /users/{userId} {
      allow read, write: if isOwner(userId);
      
      // Sub-collections (Lyrics, Favorites)
      match /{document=**} {
        allow read, write: if isOwner(userId);
      }
    }
  }
}
```

## 4. 前端整合流程 (Frontend Integration)

### 核心原則 (UI/UX Principle)
> **多來源匯流 (Multi-Source Input)**：無論文字來源為何，最終都應匯入同一個 **編輯區 (ContentEditable)**，並保留使用者 **手動編輯** 的權利。

- **Primary Input**: 手動貼上/打字 (Fallback mechanism)。
- **Helpers (FAB/Toolbar)**:
  - **YouTube**: 呼叫 `/get_youtube_transcript` -> 填入編輯區。
  - **OCR**: 上傳至 `/analyze_image` -> 填入編輯區。
  - **Lyrics**: 呼叫 `/search_lyrics` -> 填入編輯區。

### Step 1: 初始化 Firebase
在 `src/firebase.ts` 中設定 `initializeApp` 與 `getAuth`, `getFirestore`。

### Step 2: 實作 Auth Store (`stores/auth.ts`)
```typescript
actions: {
  async initAuth() {
    // 1. 判斷環境
    if (liff.isInClient()) {
      // LINE 環境: 交換 Token
      const idToken = liff.getIDToken();
      const { token } = await api.post('/verify_line_token', { idToken });
      await signInWithCustomToken(auth, token);
    } else {
      // Web 環境: 匿名登入
      await signInAnonymously(auth);
    }
  }
}
```

### Step 3: 更新資料邏輯 (`stores/content.ts`)
- 將原本寫入 `localStorage` 的邏輯，改為呼叫 `addDoc(collection(db, 'users', uid, 'lyrics'), data)`。
- 讀取時使用 `onSnapshot` 監聽 Firestore，實現即時同步。

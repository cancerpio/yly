# LINE Mini App Specification & Implementation Guidelines

## 1. Mini App UI/UX Compliance & Code Adjustments
本章節說明在將現有 SPA (Single Page Application) 轉換為 LINE Mini App 時，必須遵守的 UI/UX 規範與程式碼修改建議，確保應用程式能順利通過審核並提供原生般的體驗。

### 1.1 LIFF SDK Integration (核心程式碼調整)
LINE Mini App 必須建立在 LIFF (LINE Front-end Framework) 之上。

#### 初始化流程 (Initialization)
- **相依套件**：必須引入 `@line/liff`。
- **Entry Point**：在應用程式掛載前 (如 Vue 的 `main.ts` 或 `App.vue` 的 `onMounted`) 執行初始化。
- **程式碼範例**：
  ```typescript
  import liff from '@line/liff';

  const initLiff = async () => {
    try {
      await liff.init({ liffId: import.meta.env.VITE_LIFF_ID });
      if (!liff.isLoggedIn()) {
        liff.login(); // 若需強制登入
      }
    } catch (err) {
      console.error('LIFF Init Failed', err);
      // Fallback: 顯示 "請在 LINE 中開啟" 或降級為純 Web Mode
    }
  };
  ```

### 1.2 Layout & UI Compliance (介面合規性)
LINE Mini App 運行於 LINE 內建瀏覽器中，需特別注意以下佈局限制：

#### A. Header (導覽列) 處理
- **Native Header**：LINE App 會強制顯示原生 Header (包含關閉按鈕與 Action Menu)。
- **Action**：**移除** 自定義的 App Header 或 Navigation Bar，避免「雙重 Header」佔用過多垂直空間。
- **Title**：頁面標題應透過 `document.title` 或 LIFF 設定，顯示於原生 Header 中。

#### B. Safe Area (安全區域) 
- **問題**：在全面屏手機 (iPhone X 以上)，底部 Home Indicator 會遮擋內容。
- **Action**：針對底部固定元素 (如 FAB, Tab Bar, Footer)，CSS 必須適配：
  ```css
  padding-bottom: env(safe-area-inset-bottom);
  margin-bottom: env(safe-area-inset-bottom);
  ```

#### C. Loading State (載入狀態)
- **規範**：Mini App 啟動速度需快，且不應顯示空白畫面。
- **Action**：
  - 在 LIFF `liff.init()` 完成前，顯示全螢幕 Loading (通常為 App Icon + Spinner)。
  - 初始化完成後再渲染主應用程式 (Vue/React App)。

#### D. Navigation (導覽行為)
- **內部跳轉**：使用前端路由 (Vue Router) 進行頁面切換。
- **外部連結**：若需開啟外部網站，**禁止** 使用 `<a target="_blank">`，必須使用：
  ```javascript
  liff.openWindow({
    url: 'https://external-site.com',
    external: true // true: 開啟系統瀏覽器; false: 開啟 LINE 內部瀏覽器
  });
  ```

---

## 2. User Authentication & Data Storage
本章節說明如何利用 LINE Mini App 的特性來處理使用者身分驗證，並結合 Serverless 方案進行資料儲存。

### 2.1 User Authentication (身分驗證)
LINE Mini App 的最大優勢在於 **免登入 (Silent Login)**。

#### Authentication Flow
1. **Auto Login**：`liff.init()` 成功後，使用者即視為已登入 (若在 LINE App 內)。
2. **Identity Retrieval**：
   - **User ID** (`userId`)：使用 `liff.getContext().userId` 或 `liff.getProfile()` 取得。
   - **特性**：此 ID 為該 Provider 下使用者的唯一識別碼 (Persistent ID)。
   - **用途**：作為資料庫的主鍵 (Primary Key) 或 Document ID。

#### Code Pattern (取得使用者資料)
```typescript
const getUserIdentity = async () => {
  await liff.ready;
  const context = liff.getContext();
  
  if (context && context.userId) {
    return {
      userId: context.userId,
      displayName: context.displayName, // 需 scope 權限
      statusMessage: context.statusMessage
    };
  }
  return null;
};
```

### 2.2 Data Storage Strategies (外部資料儲存方案)
基於 `userId` 作為唯一 Key，推薦以下幾種架構：

#### Strategy A: Firebase Firestore (Recommended for Prototype/MVP)
- **架構**：Client-Side SDK 直接存取 Firestore。
- **優勢**：無伺服器 (Serverless)、即時同步、離線支援。
- **資料結構設計**：
  ```
  collection: users
    document: {userId}
      field: profile (Object)
      collection: playlists
        document: {playlistId}
          field: songs (Array)
  ```
- **安全性**：設定 Firestore Security Rules，僅允許 `request.auth.uid == userId` (需整合 Firebase Custom Auth) 或簡易模式下依路徑驗證。

#### Strategy B: Supabase (PostgreSQL Alternative)
- **架構**：類似 Firebase，但使用關聯式資料庫。
- **優勢**：強大的 SQL 查詢能力，Row Level Security (RLS) 權限控管。
- **整合**：使用 `userId` 映射至 Supabase 的 `auth.users` 或自定義 User Table。

#### Strategy C: Google Sheets (Low-Code / Internal Tools Only)
- **架構**：透過 Apps Script 封裝 API。
- **適用性**：僅適合個人工具或內部使用，不建議公開產品 (因 API Quota 與併發限制)。

### 2.3 Implementation Best Practices
1. **Local First**：優先讀取 LocalStorage 快取，提升啟動速度。
2. **Background Sync**：LIFF 初始化取得 `userId` 後，默默在背景與雲端資料庫同步。
3. **Conflict Resolution**：簡單策略以「最後寫入為主 (Last Write Wins)」，或提示使用者選擇版本。

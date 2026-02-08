---
title: "LINE Mini App - 日文歌詞發音助手（MVP）"
slug: "line-miniapp-jp-lyrics-yomi"
status: "draft"
owner: "Henry Liu"
last_updated: "2026-02-08"
---

# 1. Summary
本專案是一個相容 LINE Mini App 的 Web App，讓使用者：
1) 搜尋歌曲 metadata（歌名/歌手/封面/外部連結）
2) 自行貼上歌詞全文（不提供自動抓歌詞）
3) 逐行顯示：日文原句、讀音（かな）、羅馬拼音（romaji）、中文翻譯
4) 點某一句進入「聚焦模式」(Focus)：由 AI 產出「教學用片語 chunking」+「直譯/意譯」+「一句語法提示」
5) 收藏整首或單句到個人清單（Playlists），方便複習

前端：靜態部署於 GitHub Pages  
後端：Firebase Cloud Functions (HTTP API) + Firestore (DB)  
AI：使用者自有 OpenAI API（預算目標 $20/月），只在 Focus 觸發，並做快取/限流。

---

# 2. Goals & Non-goals

## 2.1 Goals（MVP 必達）
- 在 LINE 內可用（LIFF / Mini App web）
- metadata 搜尋可用（至少一個 provider）
- 使用者貼上歌詞後可完成逐行分析與顯示（kana/romaji/zh）
- Focus 模式可輸出：
  - 教學用片語 chunks（AI）
  - 直譯/意譯（AI）
  - 一句語法提示（AI）
- 清單收藏（整首/單句）可用
- 成本護欄可用（快取、限流、降級）

## 2.2 Non-goals（MVP 不做）
- 不自動抓取/顯示完整歌詞（不做爬蟲/不做 YouTube 匯入）
- 不提供全站歌詞資料庫（不做 lyrics search）
- 不做音樂播放、逐字對時、KTV 跟唱
- 不做社群分享、排行、推薦系統（可在後續版本）

---

# 3. Primary User Stories（使用者故事）
1) 我可以用歌名/歌手搜尋到歌曲資訊（封面、歌名、歌手、外連）
2) 我可以把歌詞貼上，按「分析」後看到逐行的 kana/romaji/翻譯
3) 我點某句歌詞可以看到更好背的片語拆解（chunks）以及直譯/意譯與一句提示
4) 我可以收藏整首歌或某一句到我的清單
5) 我可以在清單中快速回看我收藏的句子並再次打開 Focus

---

# 4. UX & Interaction（Mobile-first；取代 hover）
## 4.1 核心互動原則
- 手機沒有 hover：所有「hover 高亮/拆解」改成「點擊/長按」流程
- 每行提供明確操作：
  - ⭐ 收藏
  - 🔍 Focus（教學模式）

## 4.2 Visual style（Liquid Glass 方向）
- 風格：極簡、舒服、易讀，帶「玻璃感」但以可讀性為優先
- 必做可讀性開關：
  - 「降低透明度 / 增加對比」切換（避免玻璃 UI 造成字難讀）

---

# 5. Frontend Spec（GitHub Pages）

## 5.1 Tech constraints
- 靜態部署（GitHub Pages）
- 不可在前端放任何 secret（OpenAI key、Firebase admin、翻譯 key 皆禁止）
- 所有敏感操作走後端 API

## 5.2 Pages
### (A) Home
- 狀態 1：新使用者/無清單
  - 搜尋列（歌名必填、歌手 optional）
  - 最近瀏覽（可選，local storage）
  - 引導：可搜尋歌曲、貼上歌詞開始

- 狀態 2：已有清單
  - 搜尋列
  - 清單快捷入口（前 3-5 個）

### (B) Search Results
- 顯示歌曲列表（封面/歌名/歌手/外連 icon）
- 點選一首進入 Song Detail

### (C) Song Detail + Lyrics Input
- 顯示 metadata 卡片
- 歌詞輸入區（textarea）
- Buttons：
  - [分析歌詞]
  - [儲存歌曲]（可選；或分析後自動存）

### (D) Lyrics Viewer（逐行）
- 每行顯示：
  - JP line（原句）
  - kanaLine / romajiLine / zhLine（都顯示在原句下方）
- 行操作：
  - ⭐ 收藏此句
  - 🔍 Focus
- 點行：高亮（視覺顯眼）

### (E) Focus Bottom Sheet / Modal
- 顯示（單句）：
  1) 原句大字
  2) chunks 卡片列表（chunkText/kana/romaji/zh）
  3) 直譯/意譯
  4) 一句語法提示
  5) 收藏按鈕（可選清單）

- Focus 失敗/額度用完 → 顯示 fallback（見後端降級策略）

### (F) Playlists
- 清單列表（新增/改名/刪除）
- 清單內 items（可移除）
- 點 item 打開 Focus（或定位到 Song Viewer）

## 5.3 Frontend API integration
- 所有 API 呼叫都帶：
  - `X-LINE-IDTOKEN: <idToken>`（推薦）
  - 或 `X-LINE-USERID: <userId>`（MVP 可暫用但正式版應驗 token）
- CORS 必須允許 GitHub Pages domain

## 5.4 Frontend local cache（可選）
- 最近搜尋關鍵字、最近看過歌曲：localStorage
- 不在前端存歌詞全文（除非使用者正在編輯；正式保存由後端負責）

---

# 6. Backend Spec（Firebase: Cloud Functions + Firestore）

## 6.1 Components
- Cloud Functions (HTTP APIs)
- Firestore (data storage)
- OpenAI API（Focus only）
- Metadata provider（MVP 使用 iTunes Search API 或任一免 key provider；後端代理呼叫）

## 6.2 Auth & Identity（MVP to production）
- MVP：可接受 `lineUserId` 直傳（快速）
- Production：必驗證 LINE idToken → 取得 subject（lineUserId）作為唯一 user key

> 本 spec 預設採「驗 idToken」路線，MVP 若要偷懶可以暫時降級，但 API 介面保持相同。

## 6.3 Firestore Collections
- users/{lineUserId}
  - createdAt
  - lastSeenAt

- songs/{songId}
  - ownerLineUserId
  - provider
  - providerId
  - title
  - artist
  - album
  - artworkUrl
  - externalUrl
  - rawLyrics
  - createdAt
  - updatedAt

- songLines/{songId}/lines/{lineIndex}
  - jp
  - kanaLine
  - romajiLine
  - zhLine
  - tokens (array)
  - analyzedAt

- playlists/{playlistId}
  - ownerLineUserId
  - name
  - createdAt
  - updatedAt

- playlists/{playlistId}/items/{itemId}
  - type: "SONG" | "LINE"
  - songId (optional)
  - lineIndex (optional)
  - jpLine (optional)
  - createdAt

- cache_analysis/{cacheKey}
  - jpText
  - analyzerVersion
  - resultJson
  - createdAt

- cache_focus/{cacheKey}
  - jpLine
  - targetLang
  - promptVersion
  - model
  - resultJson
  - createdAt

- quota/{lineUserId}/usage/{YYYYMM}
  - focusCount
  - updatedAt

## 6.4 API Endpoints（HTTP)

### (A) Search metadata
GET /v1/songs/search?q=<keyword>&artist=<optional>
Response:
{
  "items": [
    {
      "provider": "itunes",
      "providerId": "string",
      "title": "string",
      "artist": "string",
      "album": "string",
      "artworkUrl": "string",
      "externalUrl": "string"
    }
  ]
}

### (B) Create/Update song (metadata + raw lyrics)
POST /v1/songs

# 手機端 API 呼叫失敗分析與除錯指南

當網頁在電腦端正常運作，但在手機端呼叫 API（例如 `fetch`）卻失敗，且在 `catch(e)` 裡只得到籠統的 `"Load failed"` 或 `"Network Error"` 時，這份指南將協助釐清可能的原因並提供精確除錯的方法。

## 如何取得真實錯誤訊息 (Remote Debugging)

### 🍎 必看：iOS Safari + Mac (開發者必備)

要抓取 iPhone 的網路請求並觀看畫面，您必須要使用 **Mac 上的 Safari**。Mac 上的 Chrome 是「無法」原生地去看或除錯 iPhone 的畫面的（這是 Apple 的封閉生態系限制）。

#### ⚠️ 事前準備（首次操作必做）

如果您在 Mac Safari 找不到「開發」按鈕，這是因為 Apple 預設會隱藏它，且 iPhone 端也必須開啟檢閱權限：

1. **開啟 Mac Safari 的開發選單**：
   - 打開 Mac 版 Safari。
   - 點擊左上角蘋果圖標旁邊的 **「Safari」** > **「設定 (Settings / Preferences)」**。
   - 切換到 **「進階 (Advanced)」** 標籤。
   - 勾選最下方的 **「在選單列中顯示『開發』選單 (Show Develop menu in menu bar)」**。此時螢幕上方選單列就會出現「開發 (Develop)」。
2. **開啟 iPhone 的網頁檢閱器**：
   - 拿起您的 iPhone，進入 **「設定」 > 打開「Safari」**。
   - 滑到最下面，點選 **「進階 (Advanced)」**。
   - 開啟 **「網頁檢閱器 (Web Inspector)」** 的開關。

#### 🚀 開始除錯

1. **實體連接**：使用傳輸線將 iPhone 連接到您的 Mac（若手機詢問是否信任此部電腦，請選擇「信任」或輸入密碼）。
2. **手機準備**：在 iPhone 上打開 Safari，並進入您的網頁應用程式 (Yomi Cards)。
3. **電腦端檢查面板**：
   - 在 Mac 上點擊上方選單列剛剛出現的 **開發 (Develop)**。
   - 滑鼠移到您的 **[iPhone 設備名稱]** 列表上。
   - 點選目前正在執行的 **[網頁名稱]**，這會彈出一個全黑底的開發者工具視窗 **(Web Inspector / 網頁檢閱器)**。
4. **擷取網路請求**：
   - 在彈出的視窗中切換到 **網路 (Network)** 標籤。
   - 在手機上操作網頁，觸發失敗的 API 請求（例如貼上歌詞或輸入搜尋）。
5. **檢視死因**：
   - 在 Network 名單中找到紅色的 API 請求（例如 `search?term=...`）。
   - 點擊該請求，您可以檢視 **真正的 Status Code**、**Headers**，或是看到 Safari 直接註記的阻擋原因（例如：`Blocked by Content Blocker`、`Blocked owing to CORS policy`）。

---

### 🤖 Android Chrome + PC

Android 就單純很多，只要使用 Chrome 即可：

1. **開啟開發者模式**：進入 Android 手機的「設定」>「開發人員選項」，並啟用 **「USB 偵錯」**。
2. **實體連接**：使用傳輸線將手機連接到電腦。
3. **電腦端檢查面板**：
    - 在電腦的 Chrome 瀏覽器網址列輸入：`chrome://inspect/#devices`
    - 等待設備列表出現後，在您的網頁項目下方點擊 **Inspect** 連結。
    - **(進階技巧)**：在開發者工具最左上角（或上方工具列），會有一個**「Screencast (投射畫面)」**的圖示。點擊它之後，左半邊就會出現您 Android 手機的即時畫面，您可以直接用滑鼠操作手機！
4. **抓取問題**：
    - 切換到 **Network** 標籤。
    - 在手機上（或投射畫面上）重現 Bug。
    - 點擊失敗的請求查看真實死因。

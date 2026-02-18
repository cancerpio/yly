# Prioritized Todo Task List
*(Based on recent discussions & UX Pivots)*

此份清單整理了近期所有的功能提案與討論，並依據 **User Value (價值)** 與 **MVP Must-Have (必要性)** 進行推薦排序。供您消化與決策下一步。

## High Priority (MVP Must-Have)
這些是讓產品從「玩具」變成「工具」的基石。

1.  **Backend Auth & Storage (Firebase)**
    -   **Why**: 解決「資料無法跨裝置/跨模式存續」的致命傷。沒有這個，學習紀錄隨時會不見。
    -   **Status**: Spec 已完成 (`backend-spec.md`)，待實作。
2.  **Recent List (首頁最近清單)**
    -   **Why**: 解決首頁「空蕩蕩」的問題，讓使用者能快速回到上次學習狀態，增加黏著度。
    -   **Status**: 概念已確認，需加入 Frontend Spec。
3.  **Lyrics Search (Genius API)**
    -   **Why**: 解決「手動找歌詞太麻煩」的痛點。
    -   **Adjustment**: 
        -   定位為「輔助填入」而非全自動。
        -   支援「輸入一句話找歌名」的逆向搜尋場景。
    -   **Status**: API 方案已確認 (Genius)，UI 互動需細化。

## Medium Priority (Nice-to-Have for MVP)
這些能顯著提升體驗，但在資源有限時可稍後。

4.  **Reverse Lyrics Search UI (逆向搜尋引導)**
    -   **Propsoal**: 在首頁引導使用者「忘記歌名？輸入歌詞片段試試」。
    -   **Value**: 降低使用者「找不到歌」的挫折感，並將搜尋結果直接填入編輯區。
    -   **Status**: 待定案 UI 呈現方式。
5.  **YouTube Transcript (影片字幕)**
    -   **Why**: 針對「看影片學日文」的場景。
    -   **Status**: [Deferred] 已延後至 Phase 3。

## Low Priority (Post-MVP)
除非核心功能都完成了，否則暫不考慮。

6.  **OCR (圖片轉文字)**
    -   **Why**: 使用場景較少 (拍實體歌詞本)。實作成本高 (Google Vision API)。
    -   **Status**: [Deferred] 已延後至 Phase 4。

---

## Decision Required (待決策點)
1.  **首頁 UI 配置**: 是否同意將首頁改為「Hero 輸入框 + Recent List」的佈局？
2.  **搜尋互動**: 是否同意搜尋歌詞結果直接「填入」編輯區，並保留使用者手動修改的彈性？

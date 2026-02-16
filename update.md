
# Update: 2026-02-16 Smart Collection Naming

## 變更摘要

本次更新實作了「智慧收藏清單命名」功能，當使用者未輸入標題時，系統會自動嘗試辨識歌曲或產生預設名稱。

### 修改檔案

1.  `frontend/src/stores/content.ts`
    - 新增 `isNaming` 狀態：用於追蹤是否正在進行命名查詢。
    - 新增 `identifySource` 函數：使用 iTunes Search API 根據歌詞片段查詢歌名。
    - 修改 `saveSegment` 為異步函數：加入三階段命名邏輯（使用者輸入 -> API 辨識 -> 隨機預設）。

2.  `frontend/src/views/Analysis.vue`
    - 更新 `saveCurrentSelection` 為異步調用。
    - 在儲存按鈕上新增 Loading 狀態 (`isNaming` check) 與 `Loader2` icon。

## 驗收指令與預期結果

1.  **情境 A：使用者已輸入標題**
    - 在首頁輸入標題 "My Favorite Song"。
    - 進入分析頁面，選取一段歌詞後收藏。
    - **預期**：收藏清單名稱為 "My Favorite Song"。

2.  **情境 B：自動辨識 (iTunes Search)**
    - 在首頁**不輸入**標題，貼上知名歌曲的一句歌詞 (例如: "We will we will rock you")。
    - 進入分析頁面，選取該行歌詞並收藏。
    - **預期**：按鈕顯示 "Saving..."，隨後收藏成功，且清單名稱自動更新為 "We Will Rock You" (或其他搜尋結果)。

3.  **情境 C：辨識失敗/無結果**
    - 在首頁**不輸入**標題，貼上隨意文字。
    - 進入分析頁面，選取並收藏。
    - **預期**：按鈕顯示 "Saving..."，隨後收藏成功，清單名稱為 "隨機收藏 YYYY-MM-DD HH:mm"。

## 若失敗最可能的原因與修正方向

- **iTunes API 限制**：若 API 回應過慢或失敗，系統會回退到隨機命名，但 console 可能會顯示錯誤。
- **CORS 問題**：瀏覽器可能會阻擋對 iTunes API 的請求。若發生此情況，需考慮使用 Backend Proxy (如 Cloud Functions) 或 JSONP (若支援)。目前實作採用直接 fetch，若失敗則會 gracefully fail 落入預設命名。

# Update: 2026-02-16 Smart Collection Naming

## 變更摘要

本次更新實作了「智慧收藏清單命名」功能，當使用者未輸入標題時，系統會自動嘗試辨識歌曲或產生預設名稱。

### 修改檔案

1.  `frontend/src/stores/content.ts`
    - 新增 `isNaming` 狀態：用於追蹤是否正在進行命名查詢。
    - 新增 `identifySource` 函數：使用 iTunes Search API 根據歌詞片段查詢歌名。
    - 修改 `saveSegment` 為異步函數：加入三階段命名邏輯（使用者輸入 -> API 辨識 -> 隨機預設）。

2.  `frontend/src/views/Analysis.vue`
    - 更新 `saveCurrentSelection` 為異步調用。
    - 在儲存按鈕上新增 Loading 狀態 (`isNaming` check) 與 `Loader2` icon。

## 驗收指令與預期結果

1.  **情境 A：使用者已輸入標題**
    - 在首頁輸入標題 "My Favorite Song"。
    - 進入分析頁面，選取一段歌詞後收藏。
    - **預期**：收藏清單名稱為 "My Favorite Song"。

2.  **情境 B：自動辨識 (iTunes Search)**
    - 在首頁**不輸入**標題，貼上知名歌曲的一句歌詞 (例如: "We will we will rock you")。
    - 進入分析頁面，選取該行歌詞並收藏。
    - **預期**：按鈕顯示 "Saving..."，隨後收藏成功，且清單名稱自動更新為 "We Will Rock You" (或其他搜尋結果)。

3.  **情境 C：辨識失敗/無結果**
    - 在首頁**不輸入**標題，貼上隨意文字。
    - 進入分析頁面，選取並收藏。
    - **預期**：按鈕顯示 "Saving..."，隨後收藏成功，清單名稱為 "隨機收藏 YYYY-MM-DD HH:mm"。

## 若失敗最可能的原因與修正方向

- **iTunes API 限制**：若 API 回應過慢或失敗，系統會回退到隨機命名，但 console 可能會顯示錯誤。
- **CORS 問題**：瀏覽器可能會阻擋對 iTunes API 的請求。若發生此情況，需考慮使用 Backend Proxy (如 Cloud Functions) 或 JSONP (若支援)。目前實作採用直接 fetch，若失敗則會 gracefully fail 落入預設命名。

# Update: 2026-02-16 14:09 - Adjust iTunes Search Language

## 變更摘要

調整自動命名的 iTunes Search API 參數，強制使用日本地區 (`country=JP`) 與日語 (`lang=ja_jp`)，以確保回傳的歌名為原始日文名稱，而非英文翻譯。

### 修改檔案

1.  `frontend/src/stores/content.ts`
    - 修改 `identifySource` 函數中的 fetch URL。
    - 新增 `country=JP` 與 `lang=ja_jp` 參數。

## 驗收指令與預期結果

1.  **情境：自動辨識日文歌曲**
    - 在首頁不輸入標題。
    - 貼上一段日文歌詞 (例如 "残酷な天使のテーゼ" 的歌詞)。
    - 執行收藏。
    - **預期**：清單名稱應為日文原名 (例如 "残酷な天使のテーゼ")，而非英文譯名 (Cruel Angel's Thesis)。

## 若失敗最可能的原因與修正方向

- **參數無效**：若某些歌曲在 JP Store 沒有上架，可能會查無結果，此時會落回隨機命名。

# Update: 2026-02-16 Smart Collection Naming

## 變更摘要

本次更新實作了「智慧收藏清單命名」功能，當使用者未輸入標題時，系統會自動嘗試辨識歌曲或產生預設名稱。

### 修改檔案

1.  `frontend/src/stores/content.ts`
    - 新增 `isNaming` 狀態：用於追蹤是否正在進行命名查詢。
    - 新增 `identifySource` 函數：使用 iTunes Search API 根據歌詞片段查詢歌名。
    - 修改 `saveSegment` 為異步函數：加入三階段命名邏輯（使用者輸入 -> API 辨識 -> 隨機預設）。

2.  `frontend/src/views/Analysis.vue`
    - 更新 `saveCurrentSelection` 為異步調用。
    - 在儲存按鈕上新增 Loading 狀態 (`isNaming` check) 與 `Loader2` icon。

## 驗收指令與預期結果

1.  **情境 A：使用者已輸入標題**
    - 在首頁輸入標題 "My Favorite Song"。
    - 進入分析頁面，選取一段歌詞後收藏。
    - **預期**：收藏清單名稱為 "My Favorite Song"。

2.  **情境 B：自動辨識 (iTunes Search)**
    - 在首頁**不輸入**標題，貼上知名歌曲的一句歌詞 (例如: "We will we will rock you")。
    - 進入分析頁面，選取該行歌詞並收藏。
    - **預期**：按鈕顯示 "Saving..."，隨後收藏成功，且清單名稱自動更新為 "We Will Rock You" (或其他搜尋結果)。

3.  **情境 C：辨識失敗/無結果**
    - 在首頁**不輸入**標題，貼上隨意文字。
    - 進入分析頁面，選取並收藏。
    - **預期**：按鈕顯示 "Saving..."，隨後收藏成功，清單名稱為 "隨機收藏 YYYY-MM-DD HH:mm"。

## 若失敗最可能的原因與修正方向

- **iTunes API 限制**：若 API 回應過慢或失敗，系統會回退到隨機命名，但 console 可能會顯示錯誤。
- **CORS 問題**：瀏覽器可能會阻擋對 iTunes API 的請求。若發生此情況，需考慮使用 Backend Proxy (如 Cloud Functions) 或 JSONP (若支援)。目前實作採用直接 fetch，若失敗則會 gracefully fail 落入預設命名。

# Update: 2026-02-16 Smart Collection Naming

## 變更摘要

本次更新實作了「智慧收藏清單命名」功能，當使用者未輸入標題時，系統會自動嘗試辨識歌曲或產生預設名稱。

### 修改檔案

1.  `frontend/src/stores/content.ts`
    - 新增 `isNaming` 狀態：用於追蹤是否正在進行命名查詢。
    - 新增 `identifySource` 函數：使用 iTunes Search API 根據歌詞片段查詢歌名。
    - 修改 `saveSegment` 為異步函數：加入三階段命名邏輯（使用者輸入 -> API 辨識 -> 隨機預設）。

2.  `frontend/src/views/Analysis.vue`
    - 更新 `saveCurrentSelection` 為異步調用。
    - 在儲存按鈕上新增 Loading 狀態 (`isNaming` check) 與 `Loader2` icon。

## 驗收指令與預期結果

1.  **情境 A：使用者已輸入標題**
    - 在首頁輸入標題 "My Favorite Song"。
    - 進入分析頁面，選取一段歌詞後收藏。
    - **預期**：收藏清單名稱為 "My Favorite Song"。

2.  **情境 B：自動辨識 (iTunes Search)**
    - 在首頁**不輸入**標題，貼上知名歌曲的一句歌詞 (例如: "We will we will rock you")。
    - 進入分析頁面，選取該行歌詞並收藏。
    - **預期**：按鈕顯示 "Saving..."，隨後收藏成功，且清單名稱自動更新為 "We Will Rock You" (或其他搜尋結果)。

3.  **情境 C：辨識失敗/無結果**
    - 在首頁**不輸入**標題，貼上隨意文字。
    - 進入分析頁面，選取並收藏。
    - **預期**：按鈕顯示 "Saving..."，隨後收藏成功，清單名稱為 "隨機收藏 YYYY-MM-DD HH:mm"。

## 若失敗最可能的原因與修正方向

- **iTunes API 限制**：若 API 回應過慢或失敗，系統會回退到隨機命名，但 console 可能會顯示錯誤。
- **CORS 問題**：瀏覽器可能會阻擋對 iTunes API 的請求。若發生此情況，需考慮使用 Backend Proxy (如 Cloud Functions) 或 JSONP (若支援)。目前實作採用直接 fetch，若失敗則會 gracefully fail 落入預設命名。

# Update: 2026-02-16 14:09 - Adjust iTunes Search Language

## 變更摘要

調整自動命名的 iTunes Search API 參數，強制使用日本地區 (`country=JP`) 與日語 (`lang=ja_jp`)，以確保回傳的歌名為原始日文名稱，而非英文翻譯。

### 修改檔案

1.  `frontend/src/stores/content.ts`
    - 修改 `identifySource` 函數中的 fetch URL。
    - 新增 `country=JP` 與 `lang=ja_jp` 參數。

## 驗收指令與預期結果

1.  **情境：自動辨識日文歌曲**
    - 在首頁不輸入標題。
    - 貼上一段日文歌詞 (例如 "残酷な天使のテーゼ" 的歌詞)。
    - 執行收藏。
    - **預期**：清單名稱應為日文原名 (例如 "残酷な天使のテーゼ")，而非英文譯名 (Cruel Angel's Thesis)。

## 若失敗最可能的原因與修正方向

- **參數無效**：若某些歌曲在 JP Store 沒有上架，可能會查無結果，此時會落回隨機命名。

# Update: 2026-02-16 21:15 - Improve iTunes Search Precision

## 變更摘要

為了提升自動命名功能的精確度，優化了 `identifySource` 的搜尋邏輯。除了使用原始輸入進行搜尋外，現在會在失敗時嘗試使用「清理後的字串」或「最長單行」進行二次搜尋。

### 修改檔案

1.  `frontend/src/stores/content.ts`
    - 將 `fetchiTunes` 請求封裝為獨立函數。
    - 實作三階段搜尋策略：
        1.  使用原始字串搜尋 (Raw Query)。
        2.  若失敗，去除特殊符號與標點後再次搜尋 (Cleaned Query)。
        3.  若仍失敗且輸入為多行，取最長的一行再次搜尋 (Longest Line)。

## 驗收指令與預期結果

1.  **情境：包含特殊符號的歌詞**
    - 輸入一段包含複雜標點符號的歌詞。
    - 收藏。
    - **預期**：即使原始字串搜尋失敗，系統應能透過清理後的字串找到正確歌名。

2.  **情境：多行歌詞片段**
    - 輸入包含多行歌詞的段落，其中可能有一行是主要副歌。
    - 收藏。
    - **預期**：系統應能嘗試使用最長的一行（通常資訊量較足）找到正確歌名。

# Update: 2026-02-16 Smart Collection Naming

## 變更摘要

本次更新實作了「智慧收藏清單命名」功能，當使用者未輸入標題時，系統會自動嘗試辨識歌曲或產生預設名稱。

### 修改檔案

1.  `frontend/src/stores/content.ts`
    - 新增 `isNaming` 狀態：用於追蹤是否正在進行命名查詢。
    - 新增 `identifySource` 函數：使用 iTunes Search API 根據歌詞片段查詢歌名。
    - 修改 `saveSegment` 為異步函數：加入三階段命名邏輯（使用者輸入 -> API 辨識 -> 隨機預設）。

2.  `frontend/src/views/Analysis.vue`
    - 更新 `saveCurrentSelection` 為異步調用。
    - 在儲存按鈕上新增 Loading 狀態 (`isNaming` check) 與 `Loader2` icon。

## 驗收指令與預期結果

1.  **情境 A：使用者已輸入標題**
    - 在首頁輸入標題 "My Favorite Song"。
    - 進入分析頁面，選取一段歌詞後收藏。
    - **預期**：收藏清單名稱為 "My Favorite Song"。

2.  **情境 B：自動辨識 (iTunes Search)**
    - 在首頁**不輸入**標題，貼上知名歌曲的一句歌詞 (例如: "We will we will rock you")。
    - 進入分析頁面，選取該行歌詞並收藏。
    - **預期**：按鈕顯示 "Saving..."，隨後收藏成功，且清單名稱自動更新為 "We Will Rock You" (或其他搜尋結果)。

3.  **情境 C：辨識失敗/無結果**
    - 在首頁**不輸入**標題，貼上隨意文字。
    - 進入分析頁面，選取並收藏。
    - **預期**：按鈕顯示 "Saving..."，隨後收藏成功，清單名稱為 "隨機收藏 YYYY-MM-DD HH:mm"。

## 若失敗最可能的原因與修正方向

- **iTunes API 限制**：若 API 回應過慢或失敗，系統會回退到隨機命名，但 console 可能會顯示錯誤。
- **CORS 問題**：瀏覽器可能會阻擋對 iTunes API 的請求。若發生此情況，需考慮使用 Backend Proxy (如 Cloud Functions) 或 JSONP (若支援)。目前實作採用直接 fetch，若失敗則會 gracefully fail 落入預設命名。

# Update: 2026-02-16 Smart Collection Naming

## 變更摘要

本次更新實作了「智慧收藏清單命名」功能，當使用者未輸入標題時，系統會自動嘗試辨識歌曲或產生預設名稱。

### 修改檔案

1.  `frontend/src/stores/content.ts`
    - 新增 `isNaming` 狀態：用於追蹤是否正在進行命名查詢。
    - 新增 `identifySource` 函數：使用 iTunes Search API 根據歌詞片段查詢歌名。
    - 修改 `saveSegment` 為異步函數：加入三階段命名邏輯（使用者輸入 -> API 辨識 -> 隨機預設）。

2.  `frontend/src/views/Analysis.vue`
    - 更新 `saveCurrentSelection` 為異步調用。
    - 在儲存按鈕上新增 Loading 狀態 (`isNaming` check) 與 `Loader2` icon。

## 驗收指令與預期結果

1.  **情境 A：使用者已輸入標題**
    - 在首頁輸入標題 "My Favorite Song"。
    - 進入分析頁面，選取一段歌詞後收藏。
    - **預期**：收藏清單名稱為 "My Favorite Song"。

2.  **情境 B：自動辨識 (iTunes Search)**
    - 在首頁**不輸入**標題，貼上知名歌曲的一句歌詞 (例如: "We will we will rock you")。
    - 進入分析頁面，選取該行歌詞並收藏。
    - **預期**：按鈕顯示 "Saving..."，隨後收藏成功，且清單名稱自動更新為 "We Will Rock You" (或其他搜尋結果)。

3.  **情境 C：辨識失敗/無結果**
    - 在首頁**不輸入**標題，貼上隨意文字。
    - 進入分析頁面，選取並收藏。
    - **預期**：按鈕顯示 "Saving..."，隨後收藏成功，清單名稱為 "隨機收藏 YYYY-MM-DD HH:mm"。

## 若失敗最可能的原因與修正方向

- **iTunes API 限制**：若 API 回應過慢或失敗，系統會回退到隨機命名，但 console 可能會顯示錯誤。
- **CORS 問題**：瀏覽器可能會阻擋對 iTunes API 的請求。若發生此情況，需考慮使用 Backend Proxy (如 Cloud Functions) 或 JSONP (若支援)。目前實作採用直接 fetch，若失敗則會 gracefully fail 落入預設命名。

# Update: 2026-02-16 14:09 - Adjust iTunes Search Language

## 變更摘要

調整自動命名的 iTunes Search API 參數，強制使用日本地區 (`country=JP`) 與日語 (`lang=ja_jp`)，以確保回傳的歌名為原始日文名稱，而非英文翻譯。

### 修改檔案

1.  `frontend/src/stores/content.ts`
    - 修改 `identifySource` 函數中的 fetch URL。
    - 新增 `country=JP` 與 `lang=ja_jp` 參數。

## 驗收指令與預期結果

1.  **情境：自動辨識日文歌曲**
    - 在首頁不輸入標題。
    - 貼上一段日文歌詞 (例如 "残酷な天使のテーゼ" 的歌詞)。
    - 執行收藏。
    - **預期**：清單名稱應為日文原名 (例如 "残酷な天使のテーゼ")，而非英文譯名 (Cruel Angel's Thesis)。

## 若失敗最可能的原因與修正方向

- **參數無效**：若某些歌曲在 JP Store 沒有上架，可能會查無結果，此時會落回隨機命名。

# Update: 2026-02-16 Smart Collection Naming

## 變更摘要

本次更新實作了「智慧收藏清單命名」功能，當使用者未輸入標題時，系統會自動嘗試辨識歌曲或產生預設名稱。

### 修改檔案

1.  `frontend/src/stores/content.ts`
    - 新增 `isNaming` 狀態：用於追蹤是否正在進行命名查詢。
    - 新增 `identifySource` 函數：使用 iTunes Search API 根據歌詞片段查詢歌名。
    - 修改 `saveSegment` 為異步函數：加入三階段命名邏輯（使用者輸入 -> API 辨識 -> 隨機預設）。

2.  `frontend/src/views/Analysis.vue`
    - 更新 `saveCurrentSelection` 為異步調用。
    - 在儲存按鈕上新增 Loading 狀態 (`isNaming` check) 與 `Loader2` icon。

## 驗收指令與預期結果

1.  **情境 A：使用者已輸入標題**
    - 在首頁輸入標題 "My Favorite Song"。
    - 進入分析頁面，選取一段歌詞後收藏。
    - **預期**：收藏清單名稱為 "My Favorite Song"。

2.  **情境 B：自動辨識 (iTunes Search)**
    - 在首頁**不輸入**標題，貼上知名歌曲的一句歌詞 (例如: "We will we will rock you")。
    - 進入分析頁面，選取該行歌詞並收藏。
    - **預期**：按鈕顯示 "Saving..."，隨後收藏成功，且清單名稱自動更新為 "We Will Rock You" (或其他搜尋結果)。

3.  **情境 C：辨識失敗/無結果**
    - 在首頁**不輸入**標題，貼上隨意文字。
    - 進入分析頁面，選取並收藏。
    - **預期**：按鈕顯示 "Saving..."，隨後收藏成功，清單名稱為 "隨機收藏 YYYY-MM-DD HH:mm"。

## 若失敗最可能的原因與修正方向

- **iTunes API 限制**：若 API 回應過慢或失敗，系統會回退到隨機命名，但 console 可能會顯示錯誤。
- **CORS 問題**：瀏覽器可能會阻擋對 iTunes API 的請求。若發生此情況，需考慮使用 Backend Proxy (如 Cloud Functions) 或 JSONP (若支援)。目前實作採用直接 fetch，若失敗則會 gracefully fail 落入預設命名。

# Update: 2026-02-16 Smart Collection Naming

## 變更摘要

本次更新實作了「智慧收藏清單命名」功能，當使用者未輸入標題時，系統會自動嘗試辨識歌曲或產生預設名稱。

### 修改檔案

1.  `frontend/src/stores/content.ts`
    - 新增 `isNaming` 狀態：用於追蹤是否正在進行命名查詢。
    - 新增 `identifySource` 函數：使用 iTunes Search API 根據歌詞片段查詢歌名。
    - 修改 `saveSegment` 為異步函數：加入三階段命名邏輯（使用者輸入 -> API 辨識 -> 隨機預設）。

2.  `frontend/src/views/Analysis.vue`
    - 更新 `saveCurrentSelection` 為異步調用。
    - 在儲存按鈕上新增 Loading 狀態 (`isNaming` check) 與 `Loader2` icon。

## 驗收指令與預期結果

1.  **情境 A：使用者已輸入標題**
    - 在首頁輸入標題 "My Favorite Song"。
    - 進入分析頁面，選取一段歌詞後收藏。
    - **預期**：收藏清單名稱為 "My Favorite Song"。

2.  **情境 B：自動辨識 (iTunes Search)**
    - 在首頁**不輸入**標題，貼上知名歌曲的一句歌詞 (例如: "We will we will rock you")。
    - 進入分析頁面，選取該行歌詞並收藏。
    - **預期**：按鈕顯示 "Saving..."，隨後收藏成功，且清單名稱自動更新為 "We Will Rock You" (或其他搜尋結果)。

3.  **情境 C：辨識失敗/無結果**
    - 在首頁**不輸入**標題，貼上隨意文字。
    - 進入分析頁面，選取並收藏。
    - **預期**：按鈕顯示 "Saving..."，隨後收藏成功，清單名稱為 "隨機收藏 YYYY-MM-DD HH:mm"。

## 若失敗最可能的原因與修正方向

- **iTunes API 限制**：若 API 回應過慢或失敗，系統會回退到隨機命名，但 console 可能會顯示錯誤。
- **CORS 問題**：瀏覽器可能會阻擋對 iTunes API 的請求。若發生此情況，需考慮使用 Backend Proxy (如 Cloud Functions) 或 JSONP (若支援)。目前實作採用直接 fetch，若失敗則會 gracefully fail 落入預設命名。

# Update: 2026-02-16 14:09 - Adjust iTunes Search Language

## 變更摘要

調整自動命名的 iTunes Search API 參數，強制使用日本地區 (`country=JP`) 與日語 (`lang=ja_jp`)，以確保回傳的歌名為原始日文名稱，而非英文翻譯。

### 修改檔案

1.  `frontend/src/stores/content.ts`
    - 修改 `identifySource` 函數中的 fetch URL。
    - 新增 `country=JP` 與 `lang=ja_jp` 參數。

## 驗收指令與預期結果

1.  **情境：自動辨識日文歌曲**
    - 在首頁不輸入標題。
    - 貼上一段日文歌詞 (例如 "残酷な天使のテーゼ" 的歌詞)。
    - 執行收藏。
    - **預期**：清單名稱應為日文原名 (例如 "残酷な天使のテーゼ")，而非英文譯名 (Cruel Angel's Thesis)。

## 若失敗最可能的原因與修正方向

- **參數無效**：若某些歌曲在 JP Store 沒有上架，可能會查無結果，此時會落回隨機命名。

# Update: 2026-02-16 21:15 - Improve iTunes Search Precision

## 變更摘要

為了提升自動命名功能的精確度，優化了 `identifySource` 的搜尋邏輯。除了使用原始輸入進行搜尋外，現在會在失敗時嘗試使用「清理後的字串」或「最長單行」進行二次搜尋。

### 修改檔案

1.  `frontend/src/stores/content.ts`
    - 將 `fetchiTunes` 請求封裝為獨立函數。
    - 實作三階段搜尋策略：
        1.  使用原始字串搜尋 (Raw Query)。
        2.  若失敗，去除特殊符號與標點後再次搜尋 (Cleaned Query)。
        3.  若仍失敗且輸入為多行，取最長的一行再次搜尋 (Longest Line)。

## 驗收指令與預期結果

1.  **情境：包含特殊符號的歌詞**
    - 輸入一段包含複雜標點符號的歌詞。
    - 收藏。
    - **預期**：即使原始字串搜尋失敗，系統應能透過清理後的字串找到正確歌名。

2.  **情境：多行歌詞片段**
    - 輸入包含多行歌詞的段落，其中可能有一行是主要副歌。
    - 收藏。
    - **預期**：系統應能嘗試使用最長的一行（通常資訊量較足）找到正確歌名。

# Update: 2026-02-16 21:24 - Analysis Title Feedback & Edit

## 變更摘要

實作了分析結果頁面的標題即時回饋與編輯功能 (Feature: `analysis-title-feedback`)。現在使用者進入分析頁面時，系統會自動在背景辨識歌名並顯示在輸入框中，允許使用者隨時確認或修改。

### 修改檔案

1.  `frontend/src/views/Analysis.vue`
    - 新增 `identifySource` 邏輯：組件掛載 (`onMounted`) 時若無標題，自動取前 100 字進行辨識。
    - UI 調整：在 Header 下方新增可編輯的標題區域 (`.title-edit-container`)，包含 Loading 圖示與編輯圖示。
    - 狀態管理：新增 `isIdentifying` 用於控制 UI Loading 狀態。

2.  `frontend/src/stores/content.ts`
    - 公開 `identifySource` 方法：將原本僅內部使用的 `identifySource` 匯出，供 View 層呼叫。

## 驗收指令與預期結果

1.  **情境：自動辨識成功**
    - 在首頁不輸入標題，貼上歌詞，點擊分析。
    - **預期**：進入分析頁後，標題欄位顯示「正在辨識歌名...」，隨後自動更新為找到的歌名。

2.  **情境：手動修改標題**
    - 自動辨識出歌名後，點擊標題文字。
    - 修改為自訂名稱。
    - 選取歌詞並收藏。
    - **預期**：收藏清單名稱應為您手動修改後的名稱，而非自動辨識的結果。

# Update: 2026-02-16 21:40 - Fix Analysis Auto Refresh

## 變更摘要

修復了更換歌詞後，標題不會自動更新的 Bug。現在系統會記錄「上次分析的文本」，當使用者進入分析頁面時，若發現文本內容變更，將強制重新執行自動辨識並更新標題。

### 修改檔案

1.  `frontend/src/stores/content.ts`
    - 新增 `lastAnalyzedText` 狀態，用於追蹤上次分析內容的變更。

2.  `frontend/src/views/Analysis.vue`
    - 更新 `onMounted` 邏輯：檢查 `rawText` 是否與 `lastAnalyzedText` 不同。
    - 若不同，強制執行 `identifySource` 並更新 `lastAnalyzedText`。

## 驗收指令與預期結果

1.  **情境：更換歌詞**
    - 貼上歌詞 A，進入分析 -> 標題變成 A。
    - 返回首頁，清空輸入，貼上歌詞 B。
    - 再次點擊分析。
    - **預期**：進入分析頁後，標題應自動重新辨識並更新為 B 的歌名 (或顯示正在辨識)，而不是停留在 A。

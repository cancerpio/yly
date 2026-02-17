
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

# Update: 2026-02-16 22:29 - Single Page UI Integration

## 變更摘要

**核心變更** (`single-page-ui-integration`)：
- 將 `Home.vue` 與 `Analysis.vue` 頁面整合至單一頁面。
- 提供「即時雙向預覽」功能：上方輸入歌詞 (Textarea)，下方直接呈現可翻譯的預覽模式 (Content Container)。
- 全新「智慧自動辨識」功能：
  - 監聽歌詞輸入框變動 (`rawText`)。
  - 1.5 秒 Debounce 機制，防止頻繁調用 API。
  - 當歌詞發生變動時，自動觸發 iTunes Search API 進行背景辨識。

### 修改檔案
1. `frontend/src/views/Home.vue` (大幅改寫，整合 Analysis 邏輯)
2. 相關的 Router 與 Store 狀態邏輯 (保持兼容)

## 驗收與測試
(詳細測試案例請參閱 `ui_improve_single_page.md`)

- [x] Case 1: 全新輸入與自動辨識
- [x] Case 2: 手動修改標題後收藏
- [x] Case 3: 修改歌詞觸發重新辨識
- [x] Case 4: 圈選翻譯功能驗證

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

# Update: 2026-02-16 22:29 - Single Page UI Integration

## 變更摘要

**核心變更** (`single-page-ui-integration`)：
- 將 `Home.vue` 與 `Analysis.vue` 頁面整合至單一頁面。
- 提供「即時雙向預覽」功能：上方輸入歌詞 (Textarea)，下方直接呈現可翻譯的預覽模式 (Content Container)。
- 全新「智慧自動辨識」功能：
  - 監聽歌詞輸入框變動 (`rawText`)。
  - 1.5 秒 Debounce 機制，防止頻繁調用 API。
  - 當歌詞發生變動時，自動觸發 iTunes Search API 進行背景辨識。

### 修改檔案
1. `frontend/src/views/Home.vue` (大幅改寫，整合 Analysis 邏輯)
2. 相關的 Router 與 Store 狀態邏輯 (保持兼容)

## 驗收與測試
(詳細測試案例請參閱 `ui_improve_single_page.md`)

- [x] Case 1: 全新輸入與自動辨識
- [x] Case 2: 手動修改標題後收藏
- [x] Case 3: 修改歌詞觸發重新辨識
- [x] Case 4: 圈選翻譯功能驗證

# Update: 2026-02-16 22:48 - Single Input Analysis Integration

## 變更摘要

**核心變更** (`single-input-analysis-integration`)：
- 將首頁改為「單一個可編輯與圈選的輸入框」，取代原有的「TextBox + Preview」或「Home -> Analysis」流程。
- 移除「開始分析」按鈕，改為即時互動。
- 移除 `<textarea>`，改用 `div contenteditable="true"`，以支援同時進行「文字編輯」與「圈選取得座標」。

### 功能特點
1. **單一輸入區 (Single Editor)**：
   - 使用者可以像在記事本一樣貼上歌詞、修改文字。
   - 同時，選取文字後會直接彈出「翻譯這段」按鈕 (FAB)，點擊後顯示翻譯 Tooltip。
2. **自動背景辨識**：
   - 輸入文字時，自動 Debounce 觸發 iTunes API 辨識歌名。
3. **極簡化 UI**：
   - 移除不必要的跳轉與預覽區塊，達成最簡潔的操作體驗。

### 修改檔案
1. `frontend/src/views/Home.vue` (完全重寫)

## 驗收指令
- [x] 是否可以正常貼上純文字？ (Expected: 是，且格式保留)
- [x] 在輸入框內打字是否正常？ (Expected: 是)
- [x] 圈選輸入框內的文字，是否出現翻譯按鈕？ (Expected: 是)
- [x] 點擊翻譯後，是否正常顯示 Tooltip 並可收藏？ (Expected: 是)

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

# Update: 2026-02-16 22:29 - Single Page UI Integration

## 變更摘要

**核心變更** (`single-page-ui-integration`)：
- 將 `Home.vue` 與 `Analysis.vue` 頁面整合至單一頁面。
- 提供「即時雙向預覽」功能：上方輸入歌詞 (Textarea)，下方直接呈現可翻譯的預覽模式 (Content Container)。
- 全新「智慧自動辨識」功能：
  - 監聽歌詞輸入框變動 (`rawText`)。
  - 1.5 秒 Debounce 機制，防止頻繁調用 API。
  - 當歌詞發生變動時，自動觸發 iTunes Search API 進行背景辨識。

### 修改檔案
1. `frontend/src/views/Home.vue` (大幅改寫，整合 Analysis 邏輯)
2. 相關的 Router 與 Store 狀態邏輯 (保持兼容)

## 驗收與測試
(詳細測試案例請參閱 `ui_improve_single_page.md`)

- [x] Case 1: 全新輸入與自動辨識
- [x] Case 2: 手動修改標題後收藏
- [x] Case 3: 修改歌詞觸發重新辨識
- [x] Case 4: 圈選翻譯功能驗證

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

# Update: 2026-02-16 22:29 - Single Page UI Integration

## 變更摘要

**核心變更** (`single-page-ui-integration`)：
- 將 `Home.vue` 與 `Analysis.vue` 頁面整合至單一頁面。
- 提供「即時雙向預覽」功能：上方輸入歌詞 (Textarea)，下方直接呈現可翻譯的預覽模式 (Content Container)。
- 全新「智慧自動辨識」功能：
  - 監聽歌詞輸入框變動 (`rawText`)。
  - 1.5 秒 Debounce 機制，防止頻繁調用 API。
  - 當歌詞發生變動時，自動觸發 iTunes Search API 進行背景辨識。

### 修改檔案
1. `frontend/src/views/Home.vue` (大幅改寫，整合 Analysis 邏輯)
2. 相關的 Router 與 Store 狀態邏輯 (保持兼容)

## 驗收與測試
(詳細測試案例請參閱 `ui_improve_single_page.md`)

- [x] Case 1: 全新輸入與自動辨識
- [x] Case 2: 手動修改標題後收藏
- [x] Case 3: 修改歌詞觸發重新辨識
- [x] Case 4: 圈選翻譯功能驗證

# Update: 2026-02-16 22:48 - Single Input Analysis Integration

## 變更摘要

**核心變更** (`single-input-analysis-integration`)：
- 將首頁改為「單一個可編輯與圈選的輸入框」，取代原有的「TextBox + Preview」或「Home -> Analysis」流程。
- 移除「開始分析」按鈕，改為即時互動。
- 移除 `<textarea>`，改用 `div contenteditable="true"`，以支援同時進行「文字編輯」與「圈選取得座標」。

### 功能特點
1. **單一輸入區 (Single Editor)**：
   - 使用者可以像在記事本一樣貼上歌詞、修改文字。
   - 同時，選取文字後會直接彈出「翻譯這段」按鈕 (FAB)，點擊後顯示翻譯 Tooltip。
2. **自動背景辨識**：
   - 輸入文字時，自動 Debounce 觸發 iTunes API 辨識歌名。
3. **極簡化 UI**：
   - 移除不必要的跳轉與預覽區塊，達成最簡潔的操作體驗。

### 修改檔案
1. `frontend/src/views/Home.vue` (完全重寫)

## 驗收指令
- [x] 是否可以正常貼上純文字？ (Expected: 是，且格式保留)
- [x] 在輸入框內打字是否正常？ (Expected: 是)
- [x] 圈選輸入框內的文字，是否出現翻譯按鈕？ (Expected: 是)
- [x] 點擊翻譯後，是否正常顯示 Tooltip 並可收藏？ (Expected: 是)

# Update: 2026-02-16 23:00 - Restore Home Style

## 變更摘要

**核心變更** (`restore-home-style`):
- 修正 `Home.vue` 的 UI 樣式，使其與原本 Lyrics Yomi 的設計風格一致（字體、間距、圓角）。
- 恢復並調整「提示訊息 (Tip Message)」區塊，放置於標題與編輯區之間，明確引導使用者操作。
- 移除未使用的變數與 import，清理程式碼。

### Style 調整
- **標題區 (`.header-section`)**：改為垂直排列 (Title -> Desc -> Input)，字體加大。
- **輸入框 (`.title-input`)**：加上圓角、邊框與背景色，不再是純底線樣式。
- **編輯區 (`.editor-area`)**：調整 Padding 與背景色，確保可讀性。
- **提示區 (`.tip-message`)**：恢復綠色系提示框，並更新引導文字。

### 修改檔案
1. `frontend/src/views/Home.vue`

## 驗收指令
- [x] 首頁標題 "Lyrics Yomi" 是否變大且居中？
- [x] 是否出現「提示: 貼上歌詞後...」的綠色提示框？
- [x] 歌詞輸入區的樣式是否整潔且易讀？

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

# Update: 2026-02-16 22:29 - Single Page UI Integration

## 變更摘要

**核心變更** (`single-page-ui-integration`)：
- 將 `Home.vue` 與 `Analysis.vue` 頁面整合至單一頁面。
- 提供「即時雙向預覽」功能：上方輸入歌詞 (Textarea)，下方直接呈現可翻譯的預覽模式 (Content Container)。
- 全新「智慧自動辨識」功能：
  - 監聽歌詞輸入框變動 (`rawText`)。
  - 1.5 秒 Debounce 機制，防止頻繁調用 API。
  - 當歌詞發生變動時，自動觸發 iTunes Search API 進行背景辨識。

### 修改檔案
1. `frontend/src/views/Home.vue` (大幅改寫，整合 Analysis 邏輯)
2. 相關的 Router 與 Store 狀態邏輯 (保持兼容)

## 驗收與測試
(詳細測試案例請參閱 `ui_improve_single_page.md`)

- [x] Case 1: 全新輸入與自動辨識
- [x] Case 2: 手動修改標題後收藏
- [x] Case 3: 修改歌詞觸發重新辨識
- [x] Case 4: 圈選翻譯功能驗證

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

# Update: 2026-02-16 22:29 - Single Page UI Integration

## 變更摘要

**核心變更** (`single-page-ui-integration`)：
- 將 `Home.vue` 與 `Analysis.vue` 頁面整合至單一頁面。
- 提供「即時雙向預覽」功能：上方輸入歌詞 (Textarea)，下方直接呈現可翻譯的預覽模式 (Content Container)。
- 全新「智慧自動辨識」功能：
  - 監聽歌詞輸入框變動 (`rawText`)。
  - 1.5 秒 Debounce 機制，防止頻繁調用 API。
  - 當歌詞發生變動時，自動觸發 iTunes Search API 進行背景辨識。

### 修改檔案
1. `frontend/src/views/Home.vue` (大幅改寫，整合 Analysis 邏輯)
2. 相關的 Router 與 Store 狀態邏輯 (保持兼容)

## 驗收與測試
(詳細測試案例請參閱 `ui_improve_single_page.md`)

- [x] Case 1: 全新輸入與自動辨識
- [x] Case 2: 手動修改標題後收藏
- [x] Case 3: 修改歌詞觸發重新辨識
- [x] Case 4: 圈選翻譯功能驗證

# Update: 2026-02-16 22:48 - Single Input Analysis Integration

## 變更摘要

**核心變更** (`single-input-analysis-integration`)：
- 將首頁改為「單一個可編輯與圈選的輸入框」，取代原有的「TextBox + Preview」或「Home -> Analysis」流程。
- 移除「開始分析」按鈕，改為即時互動。
- 移除 `<textarea>`，改用 `div contenteditable="true"`，以支援同時進行「文字編輯」與「圈選取得座標」。

### 功能特點
1. **單一輸入區 (Single Editor)**：
   - 使用者可以像在記事本一樣貼上歌詞、修改文字。
   - 同時，選取文字後會直接彈出「翻譯這段」按鈕 (FAB)，點擊後顯示翻譯 Tooltip。
2. **自動背景辨識**：
   - 輸入文字時，自動 Debounce 觸發 iTunes API 辨識歌名。
3. **極簡化 UI**：
   - 移除不必要的跳轉與預覽區塊，達成最簡潔的操作體驗。

### 修改檔案
1. `frontend/src/views/Home.vue` (完全重寫)

## 驗收指令
- [x] 是否可以正常貼上純文字？ (Expected: 是，且格式保留)
- [x] 在輸入框內打字是否正常？ (Expected: 是)
- [x] 圈選輸入框內的文字，是否出現翻譯按鈕？ (Expected: 是)
- [x] 點擊翻譯後，是否正常顯示 Tooltip 並可收藏？ (Expected: 是)

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

# Update: 2026-02-16 22:29 - Single Page UI Integration

## 變更摘要

**核心變更** (`single-page-ui-integration`)：
- 將 `Home.vue` 與 `Analysis.vue` 頁面整合至單一頁面。
- 提供「即時雙向預覽」功能：上方輸入歌詞 (Textarea)，下方直接呈現可翻譯的預覽模式 (Content Container)。
- 全新「智慧自動辨識」功能：
  - 監聽歌詞輸入框變動 (`rawText`)。
  - 1.5 秒 Debounce 機制，防止頻繁調用 API。
  - 當歌詞發生變動時，自動觸發 iTunes Search API 進行背景辨識。

### 修改檔案
1. `frontend/src/views/Home.vue` (大幅改寫，整合 Analysis 邏輯)
2. 相關的 Router 與 Store 狀態邏輯 (保持兼容)

## 驗收與測試
(詳細測試案例請參閱 `ui_improve_single_page.md`)

- [x] Case 1: 全新輸入與自動辨識
- [x] Case 2: 手動修改標題後收藏
- [x] Case 3: 修改歌詞觸發重新辨識
- [x] Case 4: 圈選翻譯功能驗證

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

# Update: 2026-02-16 22:29 - Single Page UI Integration

## 變更摘要

**核心變更** (`single-page-ui-integration`)：
- 將 `Home.vue` 與 `Analysis.vue` 頁面整合至單一頁面。
- 提供「即時雙向預覽」功能：上方輸入歌詞 (Textarea)，下方直接呈現可翻譯的預覽模式 (Content Container)。
- 全新「智慧自動辨識」功能：
  - 監聽歌詞輸入框變動 (`rawText`)。
  - 1.5 秒 Debounce 機制，防止頻繁調用 API。
  - 當歌詞發生變動時，自動觸發 iTunes Search API 進行背景辨識。

### 修改檔案
1. `frontend/src/views/Home.vue` (大幅改寫，整合 Analysis 邏輯)
2. 相關的 Router 與 Store 狀態邏輯 (保持兼容)

## 驗收與測試
(詳細測試案例請參閱 `ui_improve_single_page.md`)

- [x] Case 1: 全新輸入與自動辨識
- [x] Case 2: 手動修改標題後收藏
- [x] Case 3: 修改歌詞觸發重新辨識
- [x] Case 4: 圈選翻譯功能驗證

# Update: 2026-02-16 22:48 - Single Input Analysis Integration

## 變更摘要

**核心變更** (`single-input-analysis-integration`)：
- 將首頁改為「單一個可編輯與圈選的輸入框」，取代原有的「TextBox + Preview」或「Home -> Analysis」流程。
- 移除「開始分析」按鈕，改為即時互動。
- 移除 `<textarea>`，改用 `div contenteditable="true"`，以支援同時進行「文字編輯」與「圈選取得座標」。

### 功能特點
1. **單一輸入區 (Single Editor)**：
   - 使用者可以像在記事本一樣貼上歌詞、修改文字。
   - 同時，選取文字後會直接彈出「翻譯這段」按鈕 (FAB)，點擊後顯示翻譯 Tooltip。
2. **自動背景辨識**：
   - 輸入文字時，自動 Debounce 觸發 iTunes API 辨識歌名。
3. **極簡化 UI**：
   - 移除不必要的跳轉與預覽區塊，達成最簡潔的操作體驗。

### 修改檔案
1. `frontend/src/views/Home.vue` (完全重寫)

## 驗收指令
- [x] 是否可以正常貼上純文字？ (Expected: 是，且格式保留)
- [x] 在輸入框內打字是否正常？ (Expected: 是)
- [x] 圈選輸入框內的文字，是否出現翻譯按鈕？ (Expected: 是)
- [x] 點擊翻譯後，是否正常顯示 Tooltip 並可收藏？ (Expected: 是)

# Update: 2026-02-16 23:00 - Restore Home Style

## 變更摘要

**核心變更** (`restore-home-style`):
- 修正 `Home.vue` 的 UI 樣式，使其與原本 Lyrics Yomi 的設計風格一致（字體、間距、圓角）。
- 恢復並調整「提示訊息 (Tip Message)」區塊，放置於標題與編輯區之間，明確引導使用者操作。
- 移除未使用的變數與 import，清理程式碼。

### Style 調整
- **標題區 (`.header-section`)**：改為垂直排列 (Title -> Desc -> Input)，字體加大。
- **輸入框 (`.title-input`)**：加上圓角、邊框與背景色，不再是純底線樣式。
- **編輯區 (`.editor-area`)**：調整 Padding 與背景色，確保可讀性。
- **提示區 (`.tip-message`)**：恢復綠色系提示框，並更新引導文字。

### 修改檔案
1. `frontend/src/views/Home.vue`

## 驗收指令
- [x] 首頁標題 "Lyrics Yomi" 是否變大且居中？
- [x] 是否出現「提示: 貼上歌詞後...」的綠色提示框？
- [x] 歌詞輸入區的樣式是否整潔且易讀？

# Update: 2026-02-16 23:07 - Refine Home Style

## 變更摘要

**核心變更** (`refine-home-style`):
- 將標題樣式調整回「第一版整合輸入框」的風格（綠色主色調、字體較小）。
- 修正歌詞編輯區 (`.editor-area`) 的排版問題（加入 `box-sizing: border-box` 防止溢出，移除右側異常空白）。
- 確保輸入框與編輯區的寬度正確填滿容器。

### Style 調整
- **標題區 (`.appName`)**：字體縮小至 `1.2rem`，權重 `800`，顏色使用 Primary Color（預設綠色系）。
- **編輯區 (`.editor-area`)**：
  - 新增 `box-sizing: border-box`：解決 padding 撐開寬度導致的破版。
  - 確保 `width: 100%`。
  - 調整 `padding` 為 `20px`。

### 修改檔案
1. `frontend/src/views/Home.vue`

## 驗收指令
- [x] 標題 "Lyrics Yomi" 是否變回較小的綠色字體？
- [x] 歌詞編輯區是否正確填滿寬度，且右側沒有多餘的留白區塊？

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

# Update: 2026-02-16 22:29 - Single Page UI Integration

## 變更摘要

**核心變更** (`single-page-ui-integration`)：
- 將 `Home.vue` 與 `Analysis.vue` 頁面整合至單一頁面。
- 提供「即時雙向預覽」功能：上方輸入歌詞 (Textarea)，下方直接呈現可翻譯的預覽模式 (Content Container)。
- 全新「智慧自動辨識」功能：
  - 監聽歌詞輸入框變動 (`rawText`)。
  - 1.5 秒 Debounce 機制，防止頻繁調用 API。
  - 當歌詞發生變動時，自動觸發 iTunes Search API 進行背景辨識。

### 修改檔案
1. `frontend/src/views/Home.vue` (大幅改寫，整合 Analysis 邏輯)
2. 相關的 Router 與 Store 狀態邏輯 (保持兼容)

## 驗收與測試
(詳細測試案例請參閱 `ui_improve_single_page.md`)

- [x] Case 1: 全新輸入與自動辨識
- [x] Case 2: 手動修改標題後收藏
- [x] Case 3: 修改歌詞觸發重新辨識
- [x] Case 4: 圈選翻譯功能驗證

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

# Update: 2026-02-16 22:29 - Single Page UI Integration

## 變更摘要

**核心變更** (`single-page-ui-integration`)：
- 將 `Home.vue` 與 `Analysis.vue` 頁面整合至單一頁面。
- 提供「即時雙向預覽」功能：上方輸入歌詞 (Textarea)，下方直接呈現可翻譯的預覽模式 (Content Container)。
- 全新「智慧自動辨識」功能：
  - 監聽歌詞輸入框變動 (`rawText`)。
  - 1.5 秒 Debounce 機制，防止頻繁調用 API。
  - 當歌詞發生變動時，自動觸發 iTunes Search API 進行背景辨識。

### 修改檔案
1. `frontend/src/views/Home.vue` (大幅改寫，整合 Analysis 邏輯)
2. 相關的 Router 與 Store 狀態邏輯 (保持兼容)

## 驗收與測試
(詳細測試案例請參閱 `ui_improve_single_page.md`)

- [x] Case 1: 全新輸入與自動辨識
- [x] Case 2: 手動修改標題後收藏
- [x] Case 3: 修改歌詞觸發重新辨識
- [x] Case 4: 圈選翻譯功能驗證

# Update: 2026-02-16 22:48 - Single Input Analysis Integration

## 變更摘要

**核心變更** (`single-input-analysis-integration`)：
- 將首頁改為「單一個可編輯與圈選的輸入框」，取代原有的「TextBox + Preview」或「Home -> Analysis」流程。
- 移除「開始分析」按鈕，改為即時互動。
- 移除 `<textarea>`，改用 `div contenteditable="true"`，以支援同時進行「文字編輯」與「圈選取得座標」。

### 功能特點
1. **單一輸入區 (Single Editor)**：
   - 使用者可以像在記事本一樣貼上歌詞、修改文字。
   - 同時，選取文字後會直接彈出「翻譯這段」按鈕 (FAB)，點擊後顯示翻譯 Tooltip。
2. **自動背景辨識**：
   - 輸入文字時，自動 Debounce 觸發 iTunes API 辨識歌名。
3. **極簡化 UI**：
   - 移除不必要的跳轉與預覽區塊，達成最簡潔的操作體驗。

### 修改檔案
1. `frontend/src/views/Home.vue` (完全重寫)

## 驗收指令
- [x] 是否可以正常貼上純文字？ (Expected: 是，且格式保留)
- [x] 在輸入框內打字是否正常？ (Expected: 是)
- [x] 圈選輸入框內的文字，是否出現翻譯按鈕？ (Expected: 是)
- [x] 點擊翻譯後，是否正常顯示 Tooltip 並可收藏？ (Expected: 是)

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

# Update: 2026-02-16 22:29 - Single Page UI Integration

## 變更摘要

**核心變更** (`single-page-ui-integration`)：
- 將 `Home.vue` 與 `Analysis.vue` 頁面整合至單一頁面。
- 提供「即時雙向預覽」功能：上方輸入歌詞 (Textarea)，下方直接呈現可翻譯的預覽模式 (Content Container)。
- 全新「智慧自動辨識」功能：
  - 監聽歌詞輸入框變動 (`rawText`)。
  - 1.5 秒 Debounce 機制，防止頻繁調用 API。
  - 當歌詞發生變動時，自動觸發 iTunes Search API 進行背景辨識。

### 修改檔案
1. `frontend/src/views/Home.vue` (大幅改寫，整合 Analysis 邏輯)
2. 相關的 Router 與 Store 狀態邏輯 (保持兼容)

## 驗收與測試
(詳細測試案例請參閱 `ui_improve_single_page.md`)

- [x] Case 1: 全新輸入與自動辨識
- [x] Case 2: 手動修改標題後收藏
- [x] Case 3: 修改歌詞觸發重新辨識
- [x] Case 4: 圈選翻譯功能驗證

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

# Update: 2026-02-16 22:29 - Single Page UI Integration

## 變更摘要

**核心變更** (`single-page-ui-integration`)：
- 將 `Home.vue` 與 `Analysis.vue` 頁面整合至單一頁面。
- 提供「即時雙向預覽」功能：上方輸入歌詞 (Textarea)，下方直接呈現可翻譯的預覽模式 (Content Container)。
- 全新「智慧自動辨識」功能：
  - 監聽歌詞輸入框變動 (`rawText`)。
  - 1.5 秒 Debounce 機制，防止頻繁調用 API。
  - 當歌詞發生變動時，自動觸發 iTunes Search API 進行背景辨識。

### 修改檔案
1. `frontend/src/views/Home.vue` (大幅改寫，整合 Analysis 邏輯)
2. 相關的 Router 與 Store 狀態邏輯 (保持兼容)

## 驗收與測試
(詳細測試案例請參閱 `ui_improve_single_page.md`)

- [x] Case 1: 全新輸入與自動辨識
- [x] Case 2: 手動修改標題後收藏
- [x] Case 3: 修改歌詞觸發重新辨識
- [x] Case 4: 圈選翻譯功能驗證

# Update: 2026-02-16 22:48 - Single Input Analysis Integration

## 變更摘要

**核心變更** (`single-input-analysis-integration`)：
- 將首頁改為「單一個可編輯與圈選的輸入框」，取代原有的「TextBox + Preview」或「Home -> Analysis」流程。
- 移除「開始分析」按鈕，改為即時互動。
- 移除 `<textarea>`，改用 `div contenteditable="true"`，以支援同時進行「文字編輯」與「圈選取得座標」。

### 功能特點
1. **單一輸入區 (Single Editor)**：
   - 使用者可以像在記事本一樣貼上歌詞、修改文字。
   - 同時，選取文字後會直接彈出「翻譯這段」按鈕 (FAB)，點擊後顯示翻譯 Tooltip。
2. **自動背景辨識**：
   - 輸入文字時，自動 Debounce 觸發 iTunes API 辨識歌名。
3. **極簡化 UI**：
   - 移除不必要的跳轉與預覽區塊，達成最簡潔的操作體驗。

### 修改檔案
1. `frontend/src/views/Home.vue` (完全重寫)

## 驗收指令
- [x] 是否可以正常貼上純文字？ (Expected: 是，且格式保留)
- [x] 在輸入框內打字是否正常？ (Expected: 是)
- [x] 圈選輸入框內的文字，是否出現翻譯按鈕？ (Expected: 是)
- [x] 點擊翻譯後，是否正常顯示 Tooltip 並可收藏？ (Expected: 是)

# Update: 2026-02-16 23:00 - Restore Home Style

## 變更摘要

**核心變更** (`restore-home-style`):
- 修正 `Home.vue` 的 UI 樣式，使其與原本 Lyrics Yomi 的設計風格一致（字體、間距、圓角）。
- 恢復並調整「提示訊息 (Tip Message)」區塊，放置於標題與編輯區之間，明確引導使用者操作。
- 移除未使用的變數與 import，清理程式碼。

### Style 調整
- **標題區 (`.header-section`)**：改為垂直排列 (Title -> Desc -> Input)，字體加大。
- **輸入框 (`.title-input`)**：加上圓角、邊框與背景色，不再是純底線樣式。
- **編輯區 (`.editor-area`)**：調整 Padding 與背景色，確保可讀性。
- **提示區 (`.tip-message`)**：恢復綠色系提示框，並更新引導文字。

### 修改檔案
1. `frontend/src/views/Home.vue`

## 驗收指令
- [x] 首頁標題 "Lyrics Yomi" 是否變大且居中？
- [x] 是否出現「提示: 貼上歌詞後...」的綠色提示框？
- [x] 歌詞輸入區的樣式是否整潔且易讀？

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

# Update: 2026-02-16 22:29 - Single Page UI Integration

## 變更摘要

**核心變更** (`single-page-ui-integration`)：
- 將 `Home.vue` 與 `Analysis.vue` 頁面整合至單一頁面。
- 提供「即時雙向預覽」功能：上方輸入歌詞 (Textarea)，下方直接呈現可翻譯的預覽模式 (Content Container)。
- 全新「智慧自動辨識」功能：
  - 監聽歌詞輸入框變動 (`rawText`)。
  - 1.5 秒 Debounce 機制，防止頻繁調用 API。
  - 當歌詞發生變動時，自動觸發 iTunes Search API 進行背景辨識。

### 修改檔案
1. `frontend/src/views/Home.vue` (大幅改寫，整合 Analysis 邏輯)
2. 相關的 Router 與 Store 狀態邏輯 (保持兼容)

## 驗收與測試
(詳細測試案例請參閱 `ui_improve_single_page.md`)

- [x] Case 1: 全新輸入與自動辨識
- [x] Case 2: 手動修改標題後收藏
- [x] Case 3: 修改歌詞觸發重新辨識
- [x] Case 4: 圈選翻譯功能驗證

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

# Update: 2026-02-16 22:29 - Single Page UI Integration

## 變更摘要

**核心變更** (`single-page-ui-integration`)：
- 將 `Home.vue` 與 `Analysis.vue` 頁面整合至單一頁面。
- 提供「即時雙向預覽」功能：上方輸入歌詞 (Textarea)，下方直接呈現可翻譯的預覽模式 (Content Container)。
- 全新「智慧自動辨識」功能：
  - 監聽歌詞輸入框變動 (`rawText`)。
  - 1.5 秒 Debounce 機制，防止頻繁調用 API。
  - 當歌詞發生變動時，自動觸發 iTunes Search API 進行背景辨識。

### 修改檔案
1. `frontend/src/views/Home.vue` (大幅改寫，整合 Analysis 邏輯)
2. 相關的 Router 與 Store 狀態邏輯 (保持兼容)

## 驗收與測試
(詳細測試案例請參閱 `ui_improve_single_page.md`)

- [x] Case 1: 全新輸入與自動辨識
- [x] Case 2: 手動修改標題後收藏
- [x] Case 3: 修改歌詞觸發重新辨識
- [x] Case 4: 圈選翻譯功能驗證

# Update: 2026-02-16 22:48 - Single Input Analysis Integration

## 變更摘要

**核心變更** (`single-input-analysis-integration`)：
- 將首頁改為「單一個可編輯與圈選的輸入框」，取代原有的「TextBox + Preview」或「Home -> Analysis」流程。
- 移除「開始分析」按鈕，改為即時互動。
- 移除 `<textarea>`，改用 `div contenteditable="true"`，以支援同時進行「文字編輯」與「圈選取得座標」。

### 功能特點
1. **單一輸入區 (Single Editor)**：
   - 使用者可以像在記事本一樣貼上歌詞、修改文字。
   - 同時，選取文字後會直接彈出「翻譯這段」按鈕 (FAB)，點擊後顯示翻譯 Tooltip。
2. **自動背景辨識**：
   - 輸入文字時，自動 Debounce 觸發 iTunes API 辨識歌名。
3. **極簡化 UI**：
   - 移除不必要的跳轉與預覽區塊，達成最簡潔的操作體驗。

### 修改檔案
1. `frontend/src/views/Home.vue` (完全重寫)

## 驗收指令
- [x] 是否可以正常貼上純文字？ (Expected: 是，且格式保留)
- [x] 在輸入框內打字是否正常？ (Expected: 是)
- [x] 圈選輸入框內的文字，是否出現翻譯按鈕？ (Expected: 是)
- [x] 點擊翻譯後，是否正常顯示 Tooltip 並可收藏？ (Expected: 是)

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

# Update: 2026-02-16 22:29 - Single Page UI Integration

## 變更摘要

**核心變更** (`single-page-ui-integration`)：
- 將 `Home.vue` 與 `Analysis.vue` 頁面整合至單一頁面。
- 提供「即時雙向預覽」功能：上方輸入歌詞 (Textarea)，下方直接呈現可翻譯的預覽模式 (Content Container)。
- 全新「智慧自動辨識」功能：
  - 監聽歌詞輸入框變動 (`rawText`)。
  - 1.5 秒 Debounce 機制，防止頻繁調用 API。
  - 當歌詞發生變動時，自動觸發 iTunes Search API 進行背景辨識。

### 修改檔案
1. `frontend/src/views/Home.vue` (大幅改寫，整合 Analysis 邏輯)
2. 相關的 Router 與 Store 狀態邏輯 (保持兼容)

## 驗收與測試
(詳細測試案例請參閱 `ui_improve_single_page.md`)

- [x] Case 1: 全新輸入與自動辨識
- [x] Case 2: 手動修改標題後收藏
- [x] Case 3: 修改歌詞觸發重新辨識
- [x] Case 4: 圈選翻譯功能驗證

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

# Update: 2026-02-16 22:29 - Single Page UI Integration

## 變更摘要

**核心變更** (`single-page-ui-integration`)：
- 將 `Home.vue` 與 `Analysis.vue` 頁面整合至單一頁面。
- 提供「即時雙向預覽」功能：上方輸入歌詞 (Textarea)，下方直接呈現可翻譯的預覽模式 (Content Container)。
- 全新「智慧自動辨識」功能：
  - 監聽歌詞輸入框變動 (`rawText`)。
  - 1.5 秒 Debounce 機制，防止頻繁調用 API。
  - 當歌詞發生變動時，自動觸發 iTunes Search API 進行背景辨識。

### 修改檔案
1. `frontend/src/views/Home.vue` (大幅改寫，整合 Analysis 邏輯)
2. 相關的 Router 與 Store 狀態邏輯 (保持兼容)

## 驗收與測試
(詳細測試案例請參閱 `ui_improve_single_page.md`)

- [x] Case 1: 全新輸入與自動辨識
- [x] Case 2: 手動修改標題後收藏
- [x] Case 3: 修改歌詞觸發重新辨識
- [x] Case 4: 圈選翻譯功能驗證

# Update: 2026-02-16 22:48 - Single Input Analysis Integration

## 變更摘要

**核心變更** (`single-input-analysis-integration`)：
- 將首頁改為「單一個可編輯與圈選的輸入框」，取代原有的「TextBox + Preview」或「Home -> Analysis」流程。
- 移除「開始分析」按鈕，改為即時互動。
- 移除 `<textarea>`，改用 `div contenteditable="true"`，以支援同時進行「文字編輯」與「圈選取得座標」。

### 功能特點
1. **單一輸入區 (Single Editor)**：
   - 使用者可以像在記事本一樣貼上歌詞、修改文字。
   - 同時，選取文字後會直接彈出「翻譯這段」按鈕 (FAB)，點擊後顯示翻譯 Tooltip。
2. **自動背景辨識**：
   - 輸入文字時，自動 Debounce 觸發 iTunes API 辨識歌名。
3. **極簡化 UI**：
   - 移除不必要的跳轉與預覽區塊，達成最簡潔的操作體驗。

### 修改檔案
1. `frontend/src/views/Home.vue` (完全重寫)

## 驗收指令
- [x] 是否可以正常貼上純文字？ (Expected: 是，且格式保留)
- [x] 在輸入框內打字是否正常？ (Expected: 是)
- [x] 圈選輸入框內的文字，是否出現翻譯按鈕？ (Expected: 是)
- [x] 點擊翻譯後，是否正常顯示 Tooltip 並可收藏？ (Expected: 是)

# Update: 2026-02-16 23:00 - Restore Home Style

## 變更摘要

**核心變更** (`restore-home-style`):
- 修正 `Home.vue` 的 UI 樣式，使其與原本 Lyrics Yomi 的設計風格一致（字體、間距、圓角）。
- 恢復並調整「提示訊息 (Tip Message)」區塊，放置於標題與編輯區之間，明確引導使用者操作。
- 移除未使用的變數與 import，清理程式碼。

### Style 調整
- **標題區 (`.header-section`)**：改為垂直排列 (Title -> Desc -> Input)，字體加大。
- **輸入框 (`.title-input`)**：加上圓角、邊框與背景色，不再是純底線樣式。
- **編輯區 (`.editor-area`)**：調整 Padding 與背景色，確保可讀性。
- **提示區 (`.tip-message`)**：恢復綠色系提示框，並更新引導文字。

### 修改檔案
1. `frontend/src/views/Home.vue`

## 驗收指令
- [x] 首頁標題 "Lyrics Yomi" 是否變大且居中？
- [x] 是否出現「提示: 貼上歌詞後...」的綠色提示框？
- [x] 歌詞輸入區的樣式是否整潔且易讀？

# Update: 2026-02-16 23:07 - Refine Home Style

## 變更摘要

**核心變更** (`refine-home-style`):
- 將標題樣式調整回「第一版整合輸入框」的風格（綠色主色調、字體較小）。
- 修正歌詞編輯區 (`.editor-area`) 的排版問題（加入 `box-sizing: border-box` 防止溢出，移除右側異常空白）。
- 確保輸入框與編輯區的寬度正確填滿容器。

### Style 調整
- **標題區 (`.appName`)**：字體縮小至 `1.2rem`，權重 `800`，顏色使用 Primary Color（預設綠色系）。
- **編輯區 (`.editor-area`)**：
  - 新增 `box-sizing: border-box`：解決 padding 撐開寬度導致的破版。
  - 確保 `width: 100%`。
  - 調整 `padding` 為 `20px`。

### 修改檔案
1. `frontend/src/views/Home.vue`

## 驗收指令
- [x] 標題 "Lyrics Yomi" 是否變回較小的綠色字體？
- [x] 歌詞編輯區是否正確填滿寬度，且右側沒有多餘的留白區塊？

# Update: 2026-02-16 23:15 - Fine-tune Home UI Style

## 變更摘要

**核心變更** (`refine-home-style-details`):
- 根據 Apple UI Best Practice 微調輸入框樣式細節。
- 調整標題輸入框 (Title Input) 的 Focus 狀態，移除強烈的黑色底線，改為柔和的背景色變化。
- 調整右側狀態圖示 (Status Icon) 的位置，增加右邊距 (padding-right)，避免貼齊邊緣。
- 為標題輸入框加入上下左右的 Padding 與圓角，使其看起來更像標準的輸入控制項。

### Style 調整
- **標題輸入框 (`.title-input`)**：
  - `padding`: `8px 32px 8px 12px` (右側預留給 icon)。
  - `radius`: `8px`.
  - Focus 狀態：`background: rgba(0,0,0,0.03)`，移除 `border-bottom-color`。
- **狀態圖示 (`.status-icon`)**：
  - `right`: `12px` (增加呼吸空間)。

### 修改檔案
1. `frontend/src/views/Home.vue`

## 驗收指令
- [x] 標題輸入框右側的編輯/Loading 圖示是否不再緊貼邊緣？
- [x] 點擊標題輸入框時，是否不再出現黑色的粗底線，而呈現柔和的背景色？

# Update: 2026-02-16 23:20 - Update Title Format with Artist

## 變更摘要

**核心變更** (`update-title-format-with-artist`):
- 修改 `content.ts` 中的 `identifySource` 函數。
- 當從 iTunes API 成功辨識歌曲時，將標題格式從原本的 `TrackName` 改為 `TrackName (ArtistName)`。
- 例如：`Lemon` -> `Lemon (米津玄師)`。

### 修改檔案
1. `frontend/src/stores/content.ts`

## 驗收指令
- [x] 當貼上新歌詞觸發自動辨識時，標題欄位是否顯示為「歌名 (歌手)」的格式？

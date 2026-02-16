import { defineStore } from 'pinia';
import { ref } from 'vue';
import { DEFAULT_LYRICS, LYRICS_DATABASE, type AnalyzedSegment } from '../data/mockData';

export const useContentStore = defineStore('content', () => {
    // State
    const rawText = ref(DEFAULT_LYRICS);
    const currentTitle = ref("AIZO");
    // Map of title -> list of segments
    const playlists = ref<Record<string, AnalyzedSegment[]>>({});
    const isTranslating = ref(false);

    // Initialize from localStorage
    const init = () => {
        const stored = localStorage.getItem('playlists');
        if (stored) {
            try {
                playlists.value = JSON.parse(stored);
            } catch (e) {
                console.error('Failed to parse playlists', e);
                playlists.value = {};
            }
        }
    };

    // Actions
    const setRawText = (text: string) => {
        rawText.value = text;
    };

    const setCurrentTitle = (title: string) => {
        currentTitle.value = title || "Untitled";
    };

    const analyzeSelection = async (text: string): Promise<AnalyzedSegment> => {
        const trimmed = text.trim();
        if (!trimmed) throw new Error("Empty selection");

        // 1. Check local cache (Mock Database) first
        if (LYRICS_DATABASE[trimmed]) {
            return LYRICS_DATABASE[trimmed];
        }

        // 2. Fetch from API
        isTranslating.value = true;
        try {
            // MyMemory API (Free, Anonymous)
            // Note: For production use, get an API key and pair.
            const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=ja|zh-TW`);
            const data = await response.json();

            if (data.responseStatus === 200) {
                return {
                    original: trimmed,
                    pronunciation: "Pending... (需要字典檔)", // Placeholder for now
                    translation: data.responseData.translatedText
                };
            } else {
                throw new Error(data.responseDetails || "Translation failed");
            }
        } catch (error) {
            console.error("Translation error:", error);
            return {
                original: trimmed,
                pronunciation: "Error",
                translation: "翻譯失敗，請檢查網路連線"
            };
        } finally {
            isTranslating.value = false;
        }
    };

    const saveSegment = (segment: AnalyzedSegment) => {
        const listName = currentTitle.value;
        if (!playlists.value[listName]) {
            playlists.value[listName] = [];
        }

        const list = playlists.value[listName];
        // Avoid duplicates based on original text
        if (!list.some(s => s.original === segment.original)) {
            list.unshift(segment); // Add to top (newest first)
            playlists.value[listName] = [...list]; // Trigger reactivity if needed
            saveToStorage();
        }
    };

    const removeSegment = (listName: string, original: string) => {
        if (playlists.value[listName]) {
            playlists.value[listName] = playlists.value[listName].filter(s => s.original !== original);
            if (playlists.value[listName].length === 0) {
                delete playlists.value[listName];
            }
            saveToStorage();
        }
    };

    const saveToStorage = () => {
        localStorage.setItem('playlists', JSON.stringify(playlists.value));
    };

    return {
        rawText,
        currentTitle,
        playlists,
        isTranslating,
        init,
        setRawText,
        setCurrentTitle,
        analyzeSelection,
        saveSegment,
        removeSegment
    };
});

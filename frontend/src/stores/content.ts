import { defineStore } from 'pinia';
import { ref } from 'vue';
import { DEFAULT_LYRICS, LYRICS_DATABASE, type AnalyzedSegment } from '../data/mockData';
// @ts-ignore
import Kuroshiro from '@sglkc/kuroshiro';
// @ts-ignore
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji';

export const useContentStore = defineStore('content', () => {
    // State
    const rawText = ref("");
    const currentTitle = ref("");
    // Map of title -> list of segments
    const playlists = ref<Record<string, AnalyzedSegment[]>>({});
    const isTranslating = ref(false);

    // Kuroshiro instance
    const kuroshiro = new Kuroshiro();
    const isKuroshiroReady = ref(false);
    const kuroshiroInitPromise = ref<Promise<void> | null>(null);

    // Initialize Kuroshiro
    const initKuroshiro = async () => {
        if (isKuroshiroReady.value) return;
        if (kuroshiroInitPromise.value) return kuroshiroInitPromise.value;

        kuroshiroInitPromise.value = (async () => {
            try {
                await kuroshiro.init(new KuromojiAnalyzer({
                    dictPath: "/dict/"
                }));
                isKuroshiroReady.value = true;
                console.log("Kuroshiro initialized!");
            } catch (err) {
                console.error("Kuroshiro init failed:", err);
                kuroshiroInitPromise.value = null; // Allow retry
            }
        })();

        return kuroshiroInitPromise.value;
    };


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
        // Start init Kuroshiro in background
        initKuroshiro();
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

        // 2. Fetch from API & Kuroshiro
        isTranslating.value = true;
        try {
            // Ensure Kuroshiro is ready
            if (!isKuroshiroReady.value) {
                await initKuroshiro();
            }

            // Parallel execution: Translation + Pronunciation
            const [translationResp, pronunciation] = await Promise.all([
                fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=ja|zh-TW`)
                    .then(res => res.json())
                    .catch(err => ({ responseStatus: 500, responseDetails: err.message })),

                kuroshiro.convert(trimmed, { to: "romaji", mode: "spaced" })
                    .catch((err: any) => {
                        console.error("Kuroshiro convert failed:", err);
                        return "Pronunciation Error";
                    })
            ]);

            const translation = (translationResp.responseStatus === 200)
                ? translationResp.responseData.translatedText
                : "翻譯失敗";

            return {
                original: trimmed,
                pronunciation: pronunciation,
                translation: translation
            };

        } catch (error) {
            console.error("Analysis error:", error);
            return {
                original: trimmed,
                pronunciation: "Error",
                translation: "分析失敗，請檢查網路連線"
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

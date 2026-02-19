import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { type AnalyzedSegment } from '../data/mockData';
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
    // Store last modified timestamps for lists: Record<listName, timestamp>
    const playlistTimestamps = ref<Record<string, number>>({});

    const lastAnalyzedText = ref("");
    const isTranslating = ref(false);
    const isNaming = ref(false);

    // Kuroshiro instance
    const kuroshiro = new Kuroshiro();
    const isKuroshiroReady = ref(false);
    const kuroshiroInitPromise = ref<Promise<void> | null>(null);

    // Debug info
    const lastError = ref<string>("");
    const lastIdentifiedQuery = ref<string>("");

    // Initialize Kuroshiro
    const initKuroshiro = async () => {
        if (isKuroshiroReady.value) return;
        if (kuroshiroInitPromise.value) return kuroshiroInitPromise.value;

        kuroshiroInitPromise.value = (async () => {
            try {
                await kuroshiro.init(new KuromojiAnalyzer({
                    dictPath: import.meta.env.BASE_URL + "dict/"
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
        const storedTs = localStorage.getItem('playlistTimestamps');
        if (storedTs) {
            try {
                playlistTimestamps.value = JSON.parse(storedTs);
            } catch (e) {
                console.error('Failed to parse timestamps', e);
            }
        }

        // Start init Kuroshiro in background
        initKuroshiro();
    };

    // Getter for Recent Lists
    const recentLists = computed(() => {
        // getting entries of playlists
        const entries = Object.entries(playlists.value);
        if (entries.length === 0) return [];

        // Sort by timestamp desc
        return entries.sort((a, b) => {
            const timeA = playlistTimestamps.value[a[0]] || 0;
            const timeB = playlistTimestamps.value[b[0]] || 0;
            return timeB - timeA;
        }).slice(0, 3).map(([title, segments]) => ({
            title,
            latestSegment: segments.length > 0 ? segments[0] : null,
            count: segments.length
        }));
    });

    // Actions
    const setRawText = (text: string) => {
        rawText.value = text;
    };

    const setCurrentTitle = (title: string) => {
        currentTitle.value = title || "Untitled";
    };

    // Helper for JSONP to bypass CORS on mobile
    const jsonp = (url: string): Promise<any> => {
        return new Promise((resolve, reject) => {
            const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
            const script = document.createElement('script');
            const cleanup = () => {
                delete (window as any)[callbackName];
                document.body.removeChild(script);
            };

            (window as any)[callbackName] = (data: any) => {
                cleanup();
                resolve(data);
            };

            script.src = `${url}${url.includes('?') ? '&' : '?'}callback=${callbackName}`;
            script.onerror = (e) => {
                cleanup();
                reject(new Error('JSONP request failed'));
            };
            document.body.appendChild(script);
        });
    };

    const analyzeSelection = async (text: string): Promise<AnalyzedSegment> => {
        // ... (existing code, unchanged) this block is just a placeholder to locate fetchItunes below
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

    const fetchItunes = async (query: string) => {
        try {
            const term = encodeURIComponent(query.slice(0, 100));
            // Use JSONP to strictly bypass CORS issues on mobile browsers
            const data = await jsonp(`https://itunes.apple.com/search?term=${term}&limit=1&media=music&entity=song&country=JP&lang=ja_jp`);

            if (data.results && data.results.length > 0) {
                const track = data.results[0];
                return `${track.trackName} (${track.artistName})`;
            }
        } catch (e: any) {
            console.error("iTunes search failed:", e);
            lastError.value = `iTunes Error: ${e.message}`;
        }
        return null;
    };

    const identifySource = async (query: string): Promise<string | null> => {
        const raw = query.trim();
        if (!raw) return null;

        lastError.value = ""; // Clear
        lastIdentifiedQuery.value = query; // Record attempt

        // 1. Raw Query (Only if short enough to be a title)
        if (raw.length < 50) {
            let name = await fetchItunes(raw);
            if (name) return name;
        }

        // 2. Cleaned Query (Convert special punctuation to space, Keep CJK/Kana/En/Num)
        // \u3000-\u303f (CJK Symbols and Punctuation)
        // \u3040-\u309f (Hiragana)
        // \u30a0-\u30ff (Katakana)
        // \uff00-\uff9f (Fullwidth Forms - Latin, Numbers, Katakana)
        // \u4e00-\u9faf (CJK Unified Ideographs)
        const cleaned = raw.replace(/[^\w\s\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        if (cleaned && cleaned !== raw && cleaned.length < 50) {
            let name = await fetchItunes(cleaned);
            if (name) return name;
        }

        // 3. Longest Line Logic (Enhanced for Mobile)
        // Split by newline OR multiple spaces (common in mobile copy/paste)
        const lines = raw.split(/[\n\r]+|\s{2,}/).map(l => l.trim()).filter(l => l.length > 5 && l.length < 100);

        if (lines.length > 0) {
            // Sort by length desc
            lines.sort((a, b) => b.length - a.length);

            // Try top 3 longest lines
            for (const line of lines.slice(0, 3)) {
                const name = await fetchItunes(line);
                if (name) return name;
            }
        }

        return null;
    };

    const saveSegment = async (segment: AnalyzedSegment) => {
        isNaming.value = true;
        try {
            // 1. Determine List Name if empty
            if (!currentTitle.value) {
                // Try to identify from content
                const foundName = await identifySource(segment.original);

                if (foundName) {
                    currentTitle.value = foundName;
                } else {
                    // Default random name
                    const now = new Date();
                    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                    currentTitle.value = `隨機收藏 ${dateStr}`;
                }
            }

            const listName = currentTitle.value;
            if (!playlists.value[listName]) {
                playlists.value[listName] = [];
            }

            const list = playlists.value[listName];
            // Avoid duplicates based on original text
            if (!list.some(s => s.original === segment.original)) {
                list.unshift(segment); // Add to top (newest first)
                playlists.value[listName] = [...list]; // Trigger reactivity if needed

                // Update Timestamp
                playlistTimestamps.value[listName] = Date.now();

                saveToStorage();
            }
        } finally {
            isNaming.value = false;
        }
    };

    const removeSegment = (listName: string, original: string) => {
        if (playlists.value[listName]) {
            playlists.value[listName] = playlists.value[listName].filter(s => s.original !== original);
            if (playlists.value[listName].length === 0) {
                delete playlists.value[listName];
                delete playlistTimestamps.value[listName];
            } else {
                // Update timestamp on remove too? Maybe not necessary but keeps it active
                playlistTimestamps.value[listName] = Date.now();
            }
            saveToStorage();
        }
    };

    const saveToStorage = () => {
        localStorage.setItem('playlists', JSON.stringify(playlists.value));
        localStorage.setItem('playlistTimestamps', JSON.stringify(playlistTimestamps.value));
    };

    return {
        rawText,
        currentTitle,
        lastAnalyzedText,
        playlists,
        recentLists,
        isTranslating,
        isNaming,
        init,
        setRawText,
        setCurrentTitle,
        analyzeSelection,
        identifySource,
        saveSegment,
        removeSegment,
        lastError,
        lastIdentifiedQuery
    };
});

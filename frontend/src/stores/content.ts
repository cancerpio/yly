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

    // JSONP helper for Apple iTunes API to avoid CORS and Mobile Deep-Link Redirects (musics://)
    const jsonp = (url: string): Promise<any> => {
        return new Promise((resolve, reject) => {
            const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
            const script = document.createElement('script');

            const timeoutId = setTimeout(() => {
                cleanup();
                reject(new Error('JSONP Request Timeout'));
            }, 5000);

            const cleanup = () => {
                clearTimeout(timeoutId);
                delete (window as any)[callbackName];
                if (script.parentNode) script.parentNode.removeChild(script);
            };

            (window as any)[callbackName] = (data: any) => {
                cleanup();
                resolve(data);
            };

            script.src = `${url}${url.includes('?') ? '&' : '?'}callback=${callbackName}`;
            script.onerror = () => {
                cleanup();
                reject(new Error('JSONP Script Load Failed'));
            };

            document.head.appendChild(script);
        });
    };

    const fetchItunes = async (query: string) => {
        try {
            const term = encodeURIComponent(query.slice(0, 100));
            // Use JSONP instead of fetch. iTunes Search API explicitly supports JSONP to bypass CORS.
            // Furthermore, using JSONP (&callback=) prevents Apple from converting the response
            // into a 302 redirect to the Apple Music App (musics://) on iOS devices.
            const url = `https://itunes.apple.com/search?term=${term}&limit=1&media=music&entity=song&country=JP&lang=ja_jp`;

            const data = await jsonp(url);

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
            // Sort by presence of Japanese/Kanji characters first, then by length desc
            lines.sort((a, b) => {
                const hasJapanA = /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/.test(a) ? 1 : 0;
                const hasJapanB = /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/.test(b) ? 1 : 0;

                if (hasJapanA !== hasJapanB) {
                    return hasJapanB - hasJapanA; // Lines with JP characters get priority
                }
                // If both or neither have JP, sort by length
                return b.length - a.length;
            });

            // Try top 3 best matching lines
            for (const line of lines.slice(0, 3)) {
                const name = await fetchItunes(line);
                if (name) return name;
            }
        }

        return null;
    };

    const saveSegment = (segment: AnalyzedSegment, listName: string) => {
        if (!playlists.value[listName]) {
            playlists.value[listName] = [];
            playlistTimestamps.value[listName] = Date.now();
        }

        // Add at the beginning
        playlists.value[listName].unshift(segment);
        // Update timestamp
        playlistTimestamps.value[listName] = Date.now();

        saveToStorage();
    };

    const createBatchPlaylist = async (fullText: string, listName: string) => {
        // 1. Analyze full text (One API call)
        const analyzed = await analyzeSelection(fullText);

        // 2. Split by newlines
        const originals = analyzed.original.split('\n').map(s => s.trim()).filter(Boolean);
        const translations = analyzed.translation.split('\n').map(s => s.trim()).filter(Boolean);
        const pronunciations = analyzed.pronunciation.split('\n').map(s => s.trim()).filter(Boolean);

        const segments: AnalyzedSegment[] = [];

        // 3. Map to segments
        // Use originals length as base.
        // If translation/pronunciation lines mismatch, we fallback to empty or best effort.
        originals.forEach((orig, index) => {
            segments.push({
                original: orig,
                // If translation lines are fewer or more, try to match by index, else empty
                translation: translations[index] || "",
                // Same for pronunciation.
                pronunciation: pronunciations[index] || ""
            });
        });

        // 4. Create/Overwrite Playlist
        // Warning: This overwrites if exists with same name? Or appends?
        // User said "create a card list named by this lyrics (title)".
        // If list exists, maybe we append? Or overwrite? 
        // Let's Append to avoid data loss, or just Creating implies new check.
        // If `listName` exists, we add to it.

        if (!playlists.value[listName]) {
            playlists.value[listName] = [];
        }

        // Add all segments
        // Suggest adding to the END or BEGINNING? 
        // Usually lyrics are sequential, so ORDER matters.
        // Prepend logic in saveSegment reverses order if we loop.
        // We should Append them in order.
        // But `playlists` view might show latest first?
        // If we want reading order:
        // Item 0 (First line) should be at Top? Or Bottom?
        // If standard view is "Latest Card First", then we should push in Reverse Order?
        // Let's push normally and let UI decide. The `RecentLists` slices 0..3.
        // `PlaylistDetail` iterates `v-for="segment in playlist"`.
        // If we want Lyric Line 1 to flow to Line 2, they should be in array order [0, 1, 2].

        playlists.value[listName].push(...segments);
        playlistTimestamps.value[listName] = Date.now();
        saveToStorage();
    };

    const removeSegment = (listName: string, index: number) => {
        if (playlists.value[listName]) {
            playlists.value[listName].splice(index, 1); // Remove by index
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
        lastIdentifiedQuery,
        createBatchPlaylist
    };
});

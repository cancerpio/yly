import { defineStore } from 'pinia';
import { ref } from 'vue';
import { DEFAULT_LYRICS, LYRICS_DATABASE, type AnalyzedSegment } from '../data/mockData';

export const useContentStore = defineStore('content', () => {
    // State
    const rawText = ref(DEFAULT_LYRICS);
    const currentTitle = ref("AIZO");
    // Map of title -> list of segments
    const playlists = ref<Record<string, AnalyzedSegment[]>>({});

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

    const analyzeSelection = (text: string): AnalyzedSegment => {
        const trimmed = text.trim();

        // 1. Exact match
        if (LYRICS_DATABASE[trimmed]) {
            return LYRICS_DATABASE[trimmed];
        }

        // 2. Fuzzy match (Simple inclusion check)
        // Find if a key in database is contained in the selection OR selection contains the key
        const foundKey = Object.keys(LYRICS_DATABASE).find(key =>
            key.includes(trimmed) || trimmed.includes(key)
        );

        if (foundKey) {
            return LYRICS_DATABASE[foundKey]!;
        }

        // Fallback for unknown text
        return {
            original: trimmed,
            pronunciation: 'Unknown pronunciation',
            translation: '尚未收錄此翻譯'
        };
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
        init,
        setRawText,
        setCurrentTitle,
        analyzeSelection,
        saveSegment,
        removeSegment
    };
});

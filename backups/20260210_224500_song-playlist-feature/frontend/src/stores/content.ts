import { defineStore } from 'pinia';
import { ref } from 'vue';
import { DEFAULT_LYRICS, LYRICS_DATABASE, type AnalyzedSegment } from '../data/mockData';

export const useContentStore = defineStore('content', () => {
    // State
    const rawText = ref(DEFAULT_LYRICS);
    const savedSegments = ref<AnalyzedSegment[]>([]);

    // Initialize from localStorage
    const init = () => {
        const stored = localStorage.getItem('savedSegments');
        if (stored) {
            try {
                savedSegments.value = JSON.parse(stored);
            } catch (e) {
                console.error('Failed to parse saved segments', e);
            }
        }
    };

    // Actions
    const setRawText = (text: string) => {
        rawText.value = text;
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
            return LYRICS_DATABASE[foundKey];
        }

        // Fallback for unknown text
        return {
            original: trimmed,
            pronunciation: 'Unknown pronunciation',
            translation: '尚未收錄此翻譯'
        };
    };

    const saveSegment = (segment: AnalyzedSegment) => {
        // Avoid duplicates based on original text
        if (!savedSegments.value.some(s => s.original === segment.original)) {
            savedSegments.value.unshift(segment); // Add to top
            localStorage.setItem('savedSegments', JSON.stringify(savedSegments.value));
        }
    };

    const removeSegment = (original: string) => {
        savedSegments.value = savedSegments.value.filter(s => s.original !== original);
        localStorage.setItem('savedSegments', JSON.stringify(savedSegments.value));
    };

    return {
        rawText,
        savedSegments,
        init,
        setRawText,
        analyzeSelection,
        saveSegment,
        removeSegment
    };
});

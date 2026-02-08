import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Song } from '../types';

export const useHistoryStore = defineStore('history', () => {
    const recentSongs = ref<Song[]>([]);

    // Initialize from localStorage
    const init = () => {
        const stored = localStorage.getItem('ly_history');
        if (stored) {
            try {
                recentSongs.value = JSON.parse(stored);
            } catch (e) {
                console.error(e);
            }
        }
    };

    const addSong = (song: Song) => {
        // Remove if exists
        const idx = recentSongs.value.findIndex(s => s.trackId === song.trackId);
        if (idx > -1) {
            recentSongs.value.splice(idx, 1);
        }
        // Add to front
        recentSongs.value.unshift(song);
        // Limit to 10
        if (recentSongs.value.length > 10) {
            recentSongs.value.pop();
        }
        // Persist
        localStorage.setItem('ly_history', JSON.stringify(recentSongs.value));
    };

    init();

    return { recentSongs, addSong };
});

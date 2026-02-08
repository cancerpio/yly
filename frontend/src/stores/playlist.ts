import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Song } from '../types';

export interface SavedItem {
    id: string;
    type: 'song' | 'line';
    content: Song | any;
    title: string;
    createdAt: number;
}

export const usePlaylistStore = defineStore('playlist', () => {
    const items = ref<SavedItem[]>([]);

    const toggleSave = (item: SavedItem) => {
        const idx = items.value.findIndex(i => i.id === item.id);
        if (idx > -1) {
            items.value.splice(idx, 1);
        } else {
            items.value.push(item);
        }
    };

    const isSaved = (id: string) => items.value.some(i => i.id === id);

    return { items, toggleSave, isSaved };
});

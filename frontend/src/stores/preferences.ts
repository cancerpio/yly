import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePreferenceStore = defineStore('preferences', () => {
    const highContrast = ref(false);

    const toggleHighContrast = () => {
        highContrast.value = !highContrast.value;
        if (highContrast.value) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }
    };

    return { highContrast, toggleHighContrast };
});

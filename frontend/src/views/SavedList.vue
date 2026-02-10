<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  router.replace('/playlists');
});
</script>

<template>
  <div class="deprecated-container">
    <p>Redirecting to Playlists...</p>
  </div>
</template>

<style scoped>
.deprecated-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.2rem;
  color: var(--color-text-sub);
}
</style>

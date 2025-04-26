<template>
  <div
    class="w-full max-w-3xl mt-8 p-6 bg-gray-800 rounded-lg shadow-md transition-all duration-500"
  >
    <h2 class="text-xl font-bold mb-4">Summary</h2>
    <div v-if="loading" class="space-y-4 animate-pulse">
      <div class="h-4 bg-gray-600 rounded w-5/6"></div>
      <div class="h-4 bg-gray-600 rounded w-4/6"></div>
      <div class="h-4 bg-gray-600 rounded w-3/6"></div>
    </div>
    <p v-else class="text-gray-100 whitespace-pre-line">{{ summary }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  summary: string;
  loading: boolean;
}>();
</script>

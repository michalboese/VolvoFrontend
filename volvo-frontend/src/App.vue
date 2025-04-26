<template>
  <div class="w-screen min-h-screen flex flex-col bg-gray-900 text-white">
    <!-- Title at top -->
    <header class="w-full py-6 text-center bg-gray-800 shadow-md">
      <h1 class="text-4xl font-bold">📝 System Streszczania Volvo</h1>
    </header>

    <!-- Content centered below -->
    <main class="flex flex-1 flex-col items-center justify-center p-6">
      <TextUploader @summaryGenerated="handleSummary" :onLoading="setLoading" />
      <SummaryDisplay
        v-if="summary || loading"
        :summary="summary"
        :loading="loading"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { defineAsyncComponent } from "vue";

const TextUploader = defineAsyncComponent(
  () => import("./components/TextUploader.vue")
);
const SummaryDisplay = defineAsyncComponent(
  () => import("./components/SummaryDisplay.vue")
);

const summary = ref<string>("");
const loading = ref<boolean>(false);

function handleSummary(newSummary: string) {
  summary.value = newSummary;
  loading.value = false;
}

function setLoading(val: boolean) {
  loading.value = val;
}
</script>

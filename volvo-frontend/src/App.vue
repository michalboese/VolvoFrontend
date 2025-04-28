<template>
  <div class="w-screen min-h-screen flex flex-col bg-white text-white">

    <header class="w-full py-6 text-center bg-gray-200 shadow-md">
      <h1 class="text-4xl text-gray-800 font-bold">📝 System Streszczania</h1>
    </header>


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

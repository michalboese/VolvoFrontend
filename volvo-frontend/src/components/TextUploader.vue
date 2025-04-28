<template>
  <div
    class="w-full max-w-3xl bg-gray-200 p-8 rounded-2xl shadow-2xl flex flex-col space-y-8 transition-all duration-500"
  >
    <textarea
      ref="textareaRef"
      v-model="text"
      @input="autoResize"
      placeholder="Wklej tekst do streszczenia..."
      class="w-full p-4 border border-gray-300 rounded-lg min-h-[26rem] resize-none bg-white text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
    ></textarea>

    <div
      class="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-4 md:space-y-0"
    >
      <input
        type="file"
        @change="handleFileUpload"
        class="block w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:bg-gray-300 file:text-gray-700 hover:file:bg-gray-400 transition-all"
      />
      <button
        @click="sendForSummary"
        :disabled="loading"
        class="w-full md:w-auto bg-blue-500 hover:bg-blue-400 text-white font-bold py-3 px-8 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
      >
        <span
          v-if="loading"
          class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"
        ></span>
        <span>{{
          loading ? "Streszczanie..." : "Wygeneruj streszczenie"
        }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const emit = defineEmits<{
  (e: "summaryGenerated", summary: string): void;
  (e: "onLoading", loading: boolean): void;
}>();

const text = ref<string>("");
const loading = ref<boolean>(false);

// Refs
const textareaRef = ref<HTMLTextAreaElement | null>(null);

function autoResize() {
  if (textareaRef.value) {
    textareaRef.value.style.height = "auto"; // Reset height
    textareaRef.value.style.height = textareaRef.value.scrollHeight + "px"; // Set to scroll height
  }
}

onMounted(() => {
  autoResize(); // Make sure it resizes when component mounts
});

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      text.value = e.target?.result as string;
      autoResize(); // Resize after file loaded
    };
    reader.readAsText(file);
  }
}

async function sendForSummary() {
  if (!text.value.trim()) {
    alert("Wyślij plik lub wprowadź tekst.");
    return;
  }

  loading.value = true;
  emit("onLoading", true);
  try {
    const response = await fetch("backend end-point", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: text.value }),
    });

    const data = (await response.json()) as { summary: string };
    emit("summaryGenerated", data.summary);
  } catch (error) {
    console.error(error);
    alert("Coś poszło nie tak.");
  } finally {
    loading.value = false;
  }
}
</script>

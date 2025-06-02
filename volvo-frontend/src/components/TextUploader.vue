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
        accept=".pdf,.txt"
        ref="fileInput"
        class="block w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:bg-gray-300 file:text-gray-700 hover:file:bg-gray-400 transition-all"
      />
      <select
        v-model="language"
        class="block w-full p-2 md:w-auto text-sm text-gray-600 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      >
        <option value="polski">Polski</option>
        <option value="english">English</option>
        <option value="deutch">Deutsch</option>
        <option value="français">Français</option>
        <option value="español">Español</option>
        <option value="italiano">Italiano</option>
        <option value="pусский">Русский</option>
      </select>
      <select
        v-model="fileType"
        class="block w-full p-2 md:w-auto text-sm text-gray-600 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      >
        <option value="pdf">PDF</option>
        <option value="txt">TXT</option>
      </select>
      <button
        @click="sendForSummary"
        :disabled="loading"
        style="background-color: #1a1a1a"
        class="w-full md:w-auto text-white font-bold py-3 px-8 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
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
import { summarizeText, summarizePdf, summarizeTxt } from "../api";

const emit = defineEmits<{
  (e: "summaryGenerated", summary: string): void;
  (e: "onLoading", loading: boolean): void;
}>();

const text = ref<string>("");
const loading = ref<boolean>(false);

// Refs
const textareaRef = ref<HTMLTextAreaElement | null>(null);

const language = ref<string>("polski"); // Default language is Polish

const fileType = ref<string>("pdf"); // Default language is Polish

const fileInput = ref<HTMLInputElement | null>(null);

function autoResize() {
  if (textareaRef.value) {
    textareaRef.value.style.height = "auto";
    // Maksymalna wysokość to wysokość okna przeglądarki minus margines (np. 40px)
    const maxHeight = window.innerHeight - 320;
    const scrollHeight = textareaRef.value.scrollHeight;
    textareaRef.value.style.height = Math.min(scrollHeight, maxHeight) + "px";
  }
}

onMounted(() => {
  autoResize(); // Make sure it resizes when component mounts
});

async function sendForSummary() {
  loading.value = true;
  emit("onLoading", true);

  console.log("Sending for summary...");
  console.log("Text:", text.value);
  console.log("Language:", language.value);
  console.log("File Type:", fileType.value);
  console.log("Loading:", loading.value);
  console.log("File Input:", document.querySelector('input[type="file"]'));

  try {
    let result: Blob | undefined;

    // Jeśli użytkownik wprowadził tekst ręcznie
    if (text.value.trim()) {
      result = await summarizeText(text.value, {
        language: language.value,
        saveToPdf: fileType.value === "pdf",
        saveToTxt: fileType.value === "txt",
      });

      if (result instanceof Blob) {
        const fileName =
          fileType.value === "pdf" ? "summary.pdf" : "summary.txt";
        const url = URL.createObjectURL(result);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
      }

      return;
    }

    // Jeśli użytkownik wybrał plik (PDF lub TXT)
    if (fileType.value === "pdf" || fileType.value === "txt") {
      // Pobierz plik z inputa
      const file = fileInput.value?.files?.[0];

      if (!file) {
        alert("Wybierz plik do streszczenia.");
        return;
      }

      if (file.type === "application/pdf") {
        result = await summarizePdf(file, {
          language: language.value,
          saveToPdf: fileType.value === "pdf",
          saveToTxt: fileType.value === "txt",
        });
      } else if (file.type === "text/plain") {
        result = await summarizeTxt(file, {
          language: language.value,
          saveToPdf: fileType.value === "pdf",
          saveToTxt: fileType.value === "txt",
        });
      }

      if (result instanceof Blob) {
        // if fileType is pdf, download as pdf, else download as txt
        const fileName =
          fileType.value === "pdf" ? "summary.pdf" : "summary.txt";
        const url = URL.createObjectURL(result);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
      }
    }
  } catch (error) {
    console.error(error);
    alert("Coś poszło nie tak.");
  } finally {
    loading.value = false;
  }
}
</script>

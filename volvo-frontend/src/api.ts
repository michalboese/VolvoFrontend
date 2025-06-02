interface Options {
  language?: string;
  saveToTxt?: boolean;
  saveToPdf?: boolean;
}

export async function summarizeText(
  text: string,
  options: Options = {}
): Promise<Blob> {
  const formData = new FormData();
  formData.append("text", text);
  if (options.language) formData.append("language", options.language);
  if (options.saveToTxt)
    formData.append("saveToTxt", options.saveToTxt ? "true" : "false");
  if (options.saveToPdf)
    formData.append("saveToPdf", options.saveToPdf ? "true" : "false");

  const response = await fetch(
    "https://localhost:7209/api/Summarize/upload/txt/write",
    {
      method: "POST",
      body: formData,
    }
  );
  if (!response.ok) throw new Error("Błąd podczas podsumowywania PDF");

  return await response.blob();
}

export async function summarizePdf(
  file: File,
  options: Options = {}
): Promise<Blob> {
  const formData = new FormData();
  formData.append("file", file);
  if (options.language) formData.append("language", options.language);
  if (options.saveToTxt)
    formData.append("saveToTxt", options.saveToTxt ? "true" : "false");
  if (options.saveToPdf)
    formData.append("saveToPdf", options.saveToPdf ? "true" : "false");

  const response = await fetch(
    "https://localhost:7209/api/Summarize/upload/pdf/gpt4",
    {
      method: "POST",
      body: formData,
    }
  );
  if (!response.ok) throw new Error("Błąd podczas podsumowywania PDF");

  return await response.blob();
}

export async function summarizeTxt(
  file: File,
  options: Options = {}
): Promise<Blob> {
  const formData = new FormData();
  formData.append("file", file);
  if (options.language) formData.append("language", options.language);
  if (options.saveToTxt)
    formData.append("saveToTxt", options.saveToTxt ? "true" : "false");
  if (options.saveToPdf)
    formData.append("saveToPdf", options.saveToPdf ? "true" : "false");

  const response = await fetch(
    "https://localhost:7209/api/Summarize/upload/txt",
    {
      method: "POST",
      body: formData,
    }
  );
  if (!response.ok) throw new Error("Błąd podczas podsumowywania TXT");

  return await response.blob();
}

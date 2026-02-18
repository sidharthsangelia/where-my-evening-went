import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function transcribeAudio(audioUrl: string) {
  const response = await fetch(audioUrl);
  if (!response.ok) {
  throw new Error("Failed to fetch audio file ❌");
}

  const blob = await response.blob();

  const file = new File([blob], "audio.webm", {
    type: blob.type || "audio/webm",
  });

  const transcription = await openai.audio.transcriptions.create({
    file,
    model: "gpt-4o-transcribe",
  });

  return transcription.text;
}

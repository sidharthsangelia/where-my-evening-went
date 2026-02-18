import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function analyzeEntry(transcript: string) {
  const prompt = `
You are an emotional journaling assistant.

From the following journal transcript, return:

1. A short summary (4-5 lines)
2. A thoughtful reflection
3. Emotions (array of 3-6 emotions)
4. Tags (array of 3-6 short tags)

Return STRICT JSON in this format:

{
  "summary": "...",
  "reflection": "...",
  "emotions": ["...", "..."],
  "tags": ["...", "..."]
}

Transcript:
${transcript}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.7,
    messages: [
      { role: "system", content: "You are a helpful AI journaling analyst." },
      { role: "user", content: prompt },
    ],
  });

  const content = response.choices[0].message.content;

  if (!content) throw new Error("No AI response");

  const parsed = JSON.parse(content);

  return {
    ...parsed,
    tokensUsed: response.usage?.total_tokens ?? 0,
  };
}

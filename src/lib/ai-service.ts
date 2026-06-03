export async function callAI(messages: { role: string; content: string }[], systemPrompt?: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  const apiBase = process.env.OPENAI_API_BASE?.replace(/\/$/, ""); // Remove trailing slash

  if (!apiKey || !apiBase) {
    throw new Error("AI API credentials not configured");
  }

  const finalMessages = systemPrompt 
    ? [{ role: "system", content: systemPrompt }, ...messages]
    : messages;

  const response = await fetch(`${apiBase}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "deepseek-v4-flash-free", 
      messages: finalMessages,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    // Try to parse JSON error if possible
    try {
      const jsonError = JSON.parse(error);
      throw new Error(`AI API error: ${jsonError.error?.message || error}`);
    } catch {
      throw new Error(`AI API error: ${error}`);
    }
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export async function callAI(messages: { role: string; content: string }[], systemPrompt?: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  const apiBase = process.env.OPENAI_API_BASE?.replace(/\/$/, ""); // Remove trailing slash

  if (!apiKey || !apiBase) {
    console.error("AI Configuration Missing: OPENAI_API_KEY or OPENAI_API_BASE not found in environment variables.");

    // Return a professional message for the live site if not configured
    return `Welcome to LinkHive! 🐝

  I'm currently in high-performance mode. To enable my full AI capabilities on this live site, please ensure the owner has configured the API credentials in the deployment settings.

  I can still help you with general LinkedIn tips:
  1. Optimize your Headline with industry keywords.
  2. Tell a compelling story in your 'About' section.
  3. Share high-value content consistently.

  How else can I assist you today?`;
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

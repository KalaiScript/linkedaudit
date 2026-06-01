export async function callAI(prompt: string, systemPrompt: string = "You are a LinkedIn personal branding expert.") {
  const apiKey = process.env.OPENAI_API_KEY;
  const apiBase = process.env.OPENAI_API_BASE?.replace(/\/$/, ""); // Remove trailing slash

  if (!apiKey || !apiBase) {
    throw new Error("AI API credentials not configured");
  }

  const response = await fetch(`${apiBase}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-v4-flash-free", // Confirmed available free model
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
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

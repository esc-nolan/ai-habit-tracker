export async function getAISuggestions(prompt: string): Promise<string> {
    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
  
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768", // You can choose other models as needed
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
      }),
    });
  
    if (!response.ok) {
      console.error("Groq API error:", await response.text());
      throw new Error("Failed to fetch AI suggestion");
    }
  
    const data = await response.json();
    const aiMessage = data.choices[0]?.message?.content?.trim() || "No suggestion found.";
    return aiMessage;
  }
  
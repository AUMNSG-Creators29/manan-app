const functions = require("firebase-functions");
const fetch = require("node-fetch");

exports.manan = functions.https.onCall(async (data, context) => {
  const { text, metadata } = data;
  const apiKey = functions.config().deepseek.key;
  const url = "https://api.deepseek.com/v1/chat/completions";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You’re a reflective AI for business pros. Provide strategic insights." },
        { role: "user", content: `${text} (Industry: ${metadata.industry})` },
      ],
      max_tokens: 500,
    }),
  });

  const result = await response.json();
  return { reflection: result.choices[0].message.content };
});

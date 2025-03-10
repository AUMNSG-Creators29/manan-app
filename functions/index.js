const functions = require("firebase-functions");
const axios = require("axios");

exports.manan = functions.https.onCall(async (data, context) => {
  const { text, metadata } = data;
  const apiKey = "***REMOVED***"; // Replace with your real key
  try {
    const response = await axios.post(
      "https://api.deepseek.com/v1/chat/completions", // Check DeepSeek docs for exact endpoint
      {
        model: "deepseek-chat", // Adjust if needed
        messages: [{ role: "user", content: text }],
        max_tokens: 500,
      },
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );
    return { reflection: response.data.choices[0].message.content };
  } catch (error) {
    console.error("DeepSeek Error:", error);
    return { error: "Failed to generate reflection" };
  }
});


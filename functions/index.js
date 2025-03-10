const functions = require("firebase-functions");
const axios = require("axios");

exports.manan = functions.https.onRequest(async (req, res) => {
  const { text, metadata } = req.body;
  const apiKey = process.env.DEEPSEEK_API_KEY; // Use env var, set later in Firebase
  try {
    const response = await axios.post("https://api.deepseek.com/v1/chat/completions", {
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You’re a reflective AI for business pros. Provide strategic insights and a textual mind map." },
        { role: "user", content: `${text} (Industry: ${metadata.industry})` },
      ],
      max_tokens: 500,
    }, {
      headers: { "Authorization": `Bearer ${apiKey}` }
    });
    const reflection = response.data.choices[0].message.content;
    res.status(200).json({ reflection });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

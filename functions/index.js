const functions = require("firebase-functions");
const axios = require("axios");

exports.manan = functions.https.onRequest(async (req, res) => {
  const { text, metadata } = req.body;
  try {
    const response = await axios.post("https://api.deepseek.com/v1/chat/completions", {
      model: "deepseek-coder",
      messages: [
        { role: "system", content: "You’re a reflective AI for business pros. Provide strategic insights and a textual mind map." },
        { role: "user", content: `${text} (Industry: ${metadata.industry})` },
      ],
      max_tokens: 500,
    }, {
      headers: { "Authorization": "Bearer YOUR_DEEPSEEK_API_KEY" }
    });
    const reflection = response.data.choices[0].message.content;
    res.status(200).json({ reflection });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

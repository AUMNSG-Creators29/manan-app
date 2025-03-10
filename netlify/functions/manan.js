const axios = require("axios");

exports.handler = async (event, context) => {
  const { text, metadata } = JSON.parse(event.body || '{}');
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!text) return { statusCode: 400, body: JSON.stringify({ error: "No text provided" }) };

  try {
    const response = await axios.post("https://api.deepseek.com/v1/chat/completions", {
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You’re a reflective AI for business pros. Provide strategic insights." },
        { role: "user", content: `${text} (Industry: ${metadata?.industry || "tech"})` },
      ],
      max_tokens: 500,
    }, {
      headers: { Authorization: `Bearer ${apiKey}` }
    });
    return {
      statusCode: 200,
      body: JSON.stringify({ reflection: response.data.choices[0].message.content }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

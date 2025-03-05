const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.manan = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { input, role } = req.body;
  if (!input) return res.status(400).json({ error: 'Input required' });

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'user',
          content: `Write an 800-word reflective paragraph on '${input}' for a ${role} in 2025, focusing on strategic business implications, specific solutions (e.g., marketing, partnerships), and avoiding generic advice. Use a professional tone, include a Strategic Issue (100 words), Impact Analysis (200 words), and 3 Solutions with SAFE analysis (Strategic, Feasible, Actionable, Ethical) totaling 500 words.`
        }],
        max_tokens: 800
      })
    });

    const data = await response.json();
    const reflection = data.choices[0].message.content;

    // Parse reflection into themes, SWOT, and solutions (simplified)
    const themes = ['Client Loss', 'Market Opportunities']; // Replace with NLP parsing
    const swot = {
      strengths: ['Strong team skills'], weaknesses: ['Client dependency'],
      opportunities: ['New markets'], threats: ['Competition']
    };
    const solutions = [
      { text: 'Increase marketing spend', safe: { strategic: 'High', feasible: 'Medium', actionable: 'Yes', ethical: 'Yes' } },
      { text: 'Rethink team structure', safe: { strategic: 'Medium', feasible: 'Medium', actionable: 'Yes', ethical: 'Yes' } },
      { text: 'Explore partnerships', safe: { strategic: 'High', feasible: 'Low', actionable: 'Yes', ethical: 'Yes' } }
    ];

    res.status(200).json({ reflection, themes, swot, solutions });
  } catch (error) {
    res.status(500).json({ error: 'API error' });
  }
});

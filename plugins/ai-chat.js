const { cmd } = require('../command');
const axios = require('axios');

// Helper function: typing + loading message
async function sendTypingEffect(conn, from, loadingText) {
    await conn.sendPresenceUpdate('composing', from);
    const loadingMsg = await conn.sendMessage(from, { text: loadingText });
    return loadingMsg;
}

// ⚡ SINGLE AI COMMAND WITH AUTOMATIC FALLBACK
cmd({
    pattern: "ai",
    alias: ["bot", "gpt", "chat"],
    desc: "Chat with AI (GPT → OpenAI → DeepSeek)",
    category: "ai",
    react: "🤖",
    filename: __filename
},
async (conn, mek, m, { q, reply, react, from }) => {
    if (!q) return reply("Please provide a message for the AI.\nExample: `.ai Hello`");

    // Typing/loading
    const loadingMsg = await sendTypingEffect(conn, from, "🤖 AI is thinking... ⏳");

    const apis = [
        { name: "GPT", url: `https://lance-frank-asta.onrender.com/api/gpt?q=${encodeURIComponent(q)}`, field: "message" },
        { name: "OpenAI", url: `https://vapis.my.id/api/openai?q=${encodeURIComponent(q)}`, field: "result" },
        { name: "DeepSeek", url: `https://api.ryzendesu.vip/api/ai/deepseek?text=${encodeURIComponent(q)}`, field: "answer" }
    ];

    let success = false;
    for (const api of apis) {
        try {
            const { data } = await axios.get(api.url);
            if (data && data[api.field]) {
                await conn.sendMessage(
                    from,
                    { text: `🧠 *${api.name} AI Response:*\n\n${data[api.field]}` },
                    { quoted: loadingMsg }
                );
                await react("✅");
                success = true;
                break;
            }
        } catch (err) {
            console.warn(`${api.name} failed, trying next AI...`);
        }
    }

    if (!success) {
        await react("❌");
        await conn.sendMessage(
            from,
            { text: "❌ All AI APIs failed. Please try again later." },
            { quoted: loadingMsg }
        );
    }
});

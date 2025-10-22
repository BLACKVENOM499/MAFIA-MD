const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "tiktok",
    alias: ["ttdl", "tt", "tiktokdl"],
    desc: "Download TikTok video without watermark",
    category: "downloader",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply }) => {
    try {
        if (!q) return reply("Please provide a TikTok video link.");
        if (!q.includes("tiktok.com")) return reply("Invalid TikTok link.");

        // React while starting download
        await conn.sendMessage(from, { react: { text: "🎵", key: mek.key } });
        reply("⏳ Downloading your TikTok video, please wait...");

        const apiUrl = `https://delirius-apiofc.vercel.app/download/tiktok?url=${q}`;
        const { data } = await axios.get(apiUrl);

        if (!data || !data.data || !data.data.meta || !data.data.meta.media) {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return reply("Failed to fetch TikTok video. Try again later.");
        }

        const { title, like, comment, share, author, meta } = data.data;
        const videoItem = meta.media.find(v => v.type === "video");
        if (!videoItem || !videoItem.org) {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return reply("Couldn't find video in the response.");
        }

        const caption = `
📹 *TikTok Video Downloader* 📹

*☱ 👤 User :* ${author.nickname}

*☱ 📖 Title :* ${title}

*☱ 👍 Likes : ${like}*

*☱ 💬 Comments : ${comment}*

*☱ 🔁 Shares : ${share}*`;

        await conn.sendMessage(from, {
            video: { url: videoItem.org },
            caption,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: mek });

        // ✅ React when done
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error("Error in TikTok downloader command:", e);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });

        if (e.response) {
            reply(`API error: ${e.response.status} - ${e.response.statusText}`);
        } else if (e.request) {
            reply("No response from API. Please try again later.");
        } else {
            reply(`Unexpected error: ${e.message}`);
        }
    }
});

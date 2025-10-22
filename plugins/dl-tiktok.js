const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "tiktok",
    alias: ["ttdl", "tt", "tiktokdl"],
    desc: "Download TikTok video without watermark",
    category: "downloader",
    filename: __filename,
    use: "<TikTok URL>", // Example usage
}, async (conn, mek, m, { from, args, q, reply }) => {
    try {
        // 🧩 Validate input
        if (!q || !q.startsWith("http")) {
            return reply("*`Need a valid TikTok URL`*\n\nExample: `.tiktok https://www.tiktok.com/@username/video/1234567890`");
        }

        // ⏳ React while downloading
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        reply("⏳ Downloading your TikTok video, please wait...");

        // 🌐 Fetch video from API
        const apiUrl = `https://delirius-apiofc.vercel.app/download/tiktok?url=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data?.data?.meta?.media) {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return reply("❌ Failed to fetch TikTok video. Try again later.");
        }

        // 🎬 Extract video URL
        const videoItem = data.data.meta.media.find(v => v.type === "video");
        if (!videoItem?.org) {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return reply("⚠️ Couldn't find video in the response.");
        }

        // 📥 Send video (no caption)
        await conn.sendMessage(from, {
            video: { url: videoItem.org },
        }, { quoted: mek });

        // ✅ React when download completes
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error("Error in TikTok downloader command:", e);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });

        if (e.response) {
            reply(`API error: ${e.response.status} - ${e.response.statusText}`);
        } else if (e.request) {
            reply("🌐 No response from API. Please try again later.");
        } else {
            reply(`⚠️ Unexpected error: ${e.message}`);
        }
    }
});
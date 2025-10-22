const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "fb",
  alias: ["facebook", "fbdl"],
  desc: "Download Facebook videos",
  category: "download",
  filename: __filename,
  use: "<Facebook URL>", // Example usage
}, async (conn, m, store, { from, args, q, reply }) => {
  try {
    // ✅ Validate URL
    if (!q || !q.startsWith("http") || !q.includes("facebook.com")) {
      return reply("*`Need a valid Facebook URL`*\n\nExample: `.fb https://www.facebook.com/...`");
    }

    // ⏳ React while downloading
    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });
    reply("⏳ Downloading your Facebook video, please wait...");

    // 🌐 Fetch video from API
    const apiUrl = `https://delirius-apiofc.vercel.app/download/facebook?url=${encodeURIComponent(q)}`;
    const { data } = await axios.get(apiUrl);

    // ⚠️ Validate response
    if (!data || !data.status || !data.data) {
      await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
      return reply("❌ Failed to fetch the video. Please try again later.");
    }

    // 🎬 Pick best quality
    const videoUrl = data.data.url_hd || data.data.url_sd || data.data.url;
    if (!videoUrl) {
      await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
      return reply("❌ Couldn't find a downloadable video link.");
    }

    // 📥 Send video without caption
    await conn.sendMessage(from, {
      video: { url: videoUrl }
    }, { quoted: m });

    // ✅ React when done
    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

  } catch (error) {
    console.error("Error in Facebook Downloader:", error);

    // ❌ React on error
    await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    reply("❌ Error fetching the video. Please check the link or try again later.");
  }
});
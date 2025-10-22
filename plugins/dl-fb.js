const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "fb",
  alias: ["facebook", "fbdl"],
  desc: "Download Facebook videos with clean caption",
  category: "download",
  filename: __filename,
  use: "<Facebook URL>",
}, async (conn, m, store, { from, args, q, reply }) => {
  try {
    // ✅ Validate URL
    if (!q || !q.startsWith("http") || !q.includes("facebook.com")) {
      return reply("*Please provide a valid Facebook video link!*\n\nExample: `.fb https://www.facebook.com/...`");
    }

    // ⏳ React while processing
    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });
    reply("📥 Fetching your Facebook video, please wait...");

    // 🌐 Fetch video data from API
    const apiUrl = `https://delirius-apiofc.vercel.app/download/facebook?url=${encodeURIComponent(q)}`;
    const { data } = await axios.get(apiUrl);

    // ⚠️ Validate response
    if (!data || !data.status || !data.data) {
      await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
      return reply("❌ Failed to fetch the video. Please try again later.");
    }

    // 🎞 Pick best quality available
    const videoUrl = data.data.url_hd || data.data.url_sd || data.data.url;
    if (!videoUrl) {
      await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
      return reply("❌ Couldn't find a downloadable video link.");
    }

    // 📋 Extract metadata
    const title = data.data.title || "Untitled Video";
    const likes = data.data.like || 0;
    const comments = data.data.comment || 0;
    const duration = data.data.duration ? `${data.data.duration}s` : "N/A";

    // 📝 Clean caption (no branding)
    const caption = `
🎬 *Facebook Video Downloader*

📖 *Title:* ${title}
👍 *Likes:* ${likes}
💬 *Comments:* ${comments}
⏱ *Duration:* ${duration}

🔗 *Source:* ${q}
    `;

    // 📦 Send video with clean caption
    await conn.sendMessage(from, {
      video: { url: videoUrl },
      caption,
      contextInfo: { mentionedJid: [m.sender] }
    }, { quoted: m });

    // ✅ React success
    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

  } catch (error) {
    console.error("Error in Facebook Downloader:", error);

    // ❌ React failure
    await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    reply("❌ Error fetching the video. Please check the link or try again later.");
  }
});
  } catch (error) {
    console.error("Error:", error); // Log the error for debugging
    reply("❌ Error fetching the video. Please try again.");
  }
});

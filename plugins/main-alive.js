const { cmd } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');
const config = require('../config');

cmd({
    pattern: "alive",
    alias: ["status", "online", "a"],
    desc: "Check bot is alive or not",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        // 🕒 Sri Lanka date & time (UTC+5:30)
        const options = { timeZone: 'Asia/Colombo', hour12: true };
        const date = new Date().toLocaleDateString('en-LK', options);
        const time = new Date().toLocaleTimeString('en-LK', options);

        const status = `*☲ 𝐁𝐎𝐓 𝐒𝐓𝐀𝐓𝐔𝐒 ☲*
        
*│✨ Bot is Active & Online!*


*│🧠 Owner : Akindu Dimansha*

*│⚡ Version : 1.0.0*

*│💾 Ram : *${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB*

*│🖥️ Host : ${os.hostname()}*

*│⌛ Uptime : ${runtime(process.uptime())}*

*│📅 Date : ${date}*

*│⏰ Time : ${time}*`;

        await conn.sendMessage(from, {
            image: { url: config.MENU_IMAGE_URL },
            caption: status,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 0,
                isForwarded: false
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Alive Error:", e);
        reply(`❌ An error occurred: ${e.message}`);
    }
});                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363300351654980@newsletter',
                    newsletterName: 'MAFIA ADEEL',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Alive Error:", e);
        reply(`An error occurred: ${e.message}`);
    }
});

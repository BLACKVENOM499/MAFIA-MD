const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "owner",
    react: "👤",
    desc: "Get owner number",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const ownerNumber = config.OWNER_NUMBER;
        const ownerName = config.OWNER_NAME;

        // 📞 Create vCard
        const vcard = `BEGIN:VCARD\n` +
                      `VERSION:3.0\n` +
                      `FN:${ownerName}\n` +
                      `TEL;type=CELL;type=VOICE;waid=${ownerNumber.replace('+', '')}:${ownerNumber}\n` +
                      `END:VCARD`;

        // 📩 Send contact
        await conn.sendMessage(from, {
            contacts: {
                displayName: ownerName,
                contacts: [{ vcard }]
            }
        });

        // 🖼️ Send owner details with image
        await conn.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/fbpv5l.jpg' },
            caption: `*☲ 𝐁𝐎𝐓 𝐎𝐖𝐍𝐄𝐑 ☲*
            
*Here is the owner details*

*☲ Name - ${ownerName}*
*☲ Number - ${ownerNumber}*
*☲ Version - 1.0.0*`
        }, { quoted: mek });

    } catch (error) {
        console.error(error);
        reply(`❌ Error: ${error.message}`);
    }
});

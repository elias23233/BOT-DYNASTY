const isAdmin = require('../lib/isAdmin');

const NO_PERMISSION_MSG = 'Olá, você 🫵 não pode usar este comando 🥰';

function getTargetUser(message) {
    const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    if (mentioned.length > 0) return mentioned[0];

    const replied = message.message?.extendedTextMessage?.contextInfo?.participant;
    if (replied) return replied;

    return null;
}

async function promoverCommand(sock, chatId, message, senderId) {
    if (!chatId.endsWith('@g.us')) {
        await sock.sendMessage(chatId, { text: NO_PERMISSION_MSG }, { quoted: message });
        return;
    }

    const { isSenderAdmin } = await isAdmin(sock, chatId, senderId);
    if (!isSenderAdmin) {
        await sock.sendMessage(chatId, { text: NO_PERMISSION_MSG }, { quoted: message });
        return;
    }

    const target = getTargetUser(message);
    if (!target) {
        await sock.sendMessage(chatId, { text: 'Marque um membro para promover.' }, { quoted: message });
        return;
    }

    const { isBotAdmin } = await isAdmin(sock, chatId, senderId);
    if (!isBotAdmin) {
        await sock.sendMessage(chatId, { text: 'Eu preciso ser admin para promover membros.' }, { quoted: message });
        return;
    }

    await sock.groupParticipantsUpdate(chatId, [target], 'promote');

    const adminTag = `@${senderId.split('@')[0]}`;
    const targetTag = `@${target.split('@')[0]}`;

    const text = `
━━━━━━━━━━━━━━━━━━
🎖️ PROMOÇÃO

👮 ADM: ${adminTag}

ACABA DE PROMOVER O MEMBRO
👤 ${targetTag} A ADM

🍾🥂 PARABÉNS PELA PROMOÇÃO
━━━━━━━━━━━━━━━━━━
`.trim();

    await sock.sendMessage(
        chatId,
        {
            text,
            mentions: [senderId, target]
        },
        { quoted: message }
    );
}

module.exports = promoverCommand;


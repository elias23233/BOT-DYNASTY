const isAdmin = require('../lib/isAdmin');

const NO_PERMISSION_MSG = 'Olá, você 🫵 não pode usar este comando 🥰';

function getTargetUser(message) {
    const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    if (mentioned.length > 0) return mentioned[0];

    const replied = message.message?.extendedTextMessage?.contextInfo?.participant;
    if (replied) return replied;

    return null;
}

function getAdminName(sock, senderId) {
    if (typeof sock.getName === 'function') return sock.getName(senderId);
    return Promise.resolve(senderId.split('@')[0]);
}

async function banCommand(sock, chatId, message, senderId, rawText = '') {
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
    const motivo = rawText.replace(/^\.ban\s*/i, '').trim() || 'Não informado';
    const adminName = await getAdminName(sock, senderId);
    const membroLabel = target ? `@${target.split('@')[0]}` : 'Não informado';

    const panel = `
╔════════════════════
║ 🔨 PAINEL BAN
╠════════════════════
║ 👤 MEMBRO: ${membroLabel}
║ 📌 MOTIVO: ${motivo}
║ 👮 ADM: ${adminName}
╚════════════════════
`.trim();

    const mentions = [];
    if (target) mentions.push(target);

    await sock.sendMessage(chatId, { text: panel, mentions }, { quoted: message });
}

module.exports = banCommand;


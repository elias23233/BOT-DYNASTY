const isAdmin = require('../lib/isAdmin');
const { getResolvedTarget } = require('../lib/groupTarget');

const NO_PERMISSION_MSG = 'Olá, você 🫵 não pode usar este comando 🥰';

async function promoverCommand(sock, chatId, message, senderId) {
    if (!chatId.endsWith('@g.us')) {
        await sock.sendMessage(chatId, { text: NO_PERMISSION_MSG }, { quoted: message });
        return;
    }

    const { isSenderAdmin, isBotAdmin } = await isAdmin(sock, chatId, senderId);
    if (!isSenderAdmin) {
        await sock.sendMessage(chatId, { text: NO_PERMISSION_MSG }, { quoted: message });
        return;
    }

    if (!isBotAdmin) {
        await sock.sendMessage(chatId, { text: 'Eu preciso ser admin para promover membros.' }, { quoted: message });
        return;
    }

    const target = await getResolvedTarget(sock, chatId, message);
    if (!target) {
        await sock.sendMessage(chatId, { text: 'Marque um membro para promover.' }, { quoted: message });
        return;
    }

    try {
        const result = await sock.groupParticipantsUpdate(chatId, [target], 'promote');
        const failed = result?.find((entry) => String(entry.status) !== '200');
        if (failed) {
            await sock.sendMessage(chatId, {
                text: `Não foi possível promover o membro (erro ${failed.status}).`
            }, { quoted: message });
            return;
        }
    } catch (error) {
        console.error('Erro ao promover membro:', error);
        await sock.sendMessage(chatId, {
            text: 'Erro ao promover membro. Confirme se o bot é admin do grupo.'
        }, { quoted: message });
        return;
    }

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

const isAdmin = require('../lib/isAdmin');
const { getResolvedTarget } = require('../lib/groupTarget');

const NO_PERMISSION_MSG = 'Olá, você 🫵 não pode usar este comando 🥰';

function getAdminName(sock, senderId) {
    if (typeof sock.getName === 'function') return sock.getName(senderId);
    return Promise.resolve(senderId.split('@')[0]);
}

async function banCommand(sock, chatId, message, senderId, rawText = '') {
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
        await sock.sendMessage(chatId, { text: 'Eu preciso ser admin para remover membros.' }, { quoted: message });
        return;
    }

    const target = await getResolvedTarget(sock, chatId, message);
    if (!target) {
        await sock.sendMessage(chatId, { text: 'Marque um membro para banir.' }, { quoted: message });
        return;
    }

    try {
        const result = await sock.groupParticipantsUpdate(chatId, [target], 'remove');
        const failed = result?.find((entry) => String(entry.status) !== '200');
        if (failed) {
            await sock.sendMessage(chatId, {
                text: `Não foi possível remover o membro (erro ${failed.status}).`
            }, { quoted: message });
            return;
        }
    } catch (error) {
        console.error('Erro ao remover membro:', error);
        await sock.sendMessage(chatId, {
            text: 'Erro ao remover membro. Confirme se o bot é admin do grupo.'
        }, { quoted: message });
        return;
    }

    const motivo = rawText.replace(/^[./]ban\s*/i, '').replace(/@\d+/g, '').trim() || 'Não informado';
    const adminName = await getAdminName(sock, senderId);
    const membroLabel = `@${target.split('@')[0]}`;

    const panel = `
╔════════════════════
║ 🔨 PAINEL BAN
╠════════════════════
║ 👤 MEMBRO: ${membroLabel}
║ 📌 MOTIVO: ${motivo}
║ 👮 ADM: ${adminName}
╚════════════════════
`.trim();

    await sock.sendMessage(chatId, { text: panel, mentions: [target] }, { quoted: message });
}

module.exports = banCommand;

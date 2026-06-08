const isAdmin = require('../lib/isAdmin');
const isOwnerOrSudo = require('../lib/isOwner');
const { removeRival } = require('../lib/aliados_rivais');

async function isAuthorized(senderId, sock, chatId, fromMe) {
    if (fromMe) return true;
    if (await isOwnerOrSudo(senderId, sock, chatId)) return true;

    if (chatId && chatId.endsWith('@g.us')) {
        const { isSenderAdmin } = await isAdmin(sock, chatId, senderId);
        return isSenderAdmin;
    }

    return false;
}

async function removerRivalCommand(sock, chatId, message, senderId, rawText) {
    if (!await isAuthorized(senderId, sock, chatId, message.key.fromMe)) {
        await sock.sendMessage(chatId, { text: '❌ Apenas administradores autorizados podem usar este comando.' }, { quoted: message });
        return;
    }

    const name = rawText.split(' ').slice(1).join(' ').trim();
    if (!name) {
        await sock.sendMessage(chatId, { text: '❌ Uso correto: .removerrival [nome]' }, { quoted: message });
        return;
    }

    const result = removeRival(name);
    if (!result.success) {
        if (result.notFound) {
            await sock.sendMessage(chatId, { text: `❌ Este rival não foi encontrado.` }, { quoted: message });
            return;
        }
        await sock.sendMessage(chatId, { text: '❌ Não foi possível remover o rival.' }, { quoted: message });
        return;
    }

    await sock.sendMessage(chatId, { text: `✅ Rival "${result.name}" removido com sucesso.` }, { quoted: message });
}

module.exports = removerRivalCommand;

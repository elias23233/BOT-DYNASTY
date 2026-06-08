const isAdmin = require('../lib/isAdmin');
const isOwnerOrSudo = require('../lib/isOwner');
const { addAliado } = require('../lib/aliados_rivais');

async function isAuthorized(senderId, sock, chatId, fromMe) {
    if (fromMe) return true;
    if (await isOwnerOrSudo(senderId, sock, chatId)) return true;

    if (chatId && chatId.endsWith('@g.us')) {
        const { isSenderAdmin } = await isAdmin(sock, chatId, senderId);
        return isSenderAdmin;
    }

    return false;
}

async function novoAliadoCommand(sock, chatId, message, senderId, rawText) {
    if (!await isAuthorized(senderId, sock, chatId, message.key.fromMe)) {
        await sock.sendMessage(chatId, { text: '❌ Apenas administradores autorizados podem usar este comando.' }, { quoted: message });
        return;
    }

    const name = rawText.split(' ').slice(1).join(' ').trim();
    if (!name) {
        await sock.sendMessage(chatId, { text: '❌ Uso correto: .novoaliado [nome]' }, { quoted: message });
        return;
    }

    const result = addAliado(name);
    if (!result.success) {
        if (result.duplicate) {
            await sock.sendMessage(chatId, { text: `❌ Este aliado já está cadastrado.` }, { quoted: message });
            return;
        }
        await sock.sendMessage(chatId, { text: '❌ Não foi possível adicionar o aliado.' }, { quoted: message });
        return;
    }

    await sock.sendMessage(chatId, { text: `✅ Aliado "${result.name}" adicionado com sucesso.` }, { quoted: message });
}

module.exports = novoAliadoCommand;

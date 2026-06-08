// 🧹 Fix for ENOSPC / temp overflow in hosted panels
const fs = require('fs');
const path = require('path');

const customTemp = path.join(process.cwd(), 'temp');
if (!fs.existsSync(customTemp)) fs.mkdirSync(customTemp, { recursive: true });
process.env.TMPDIR = customTemp;
process.env.TEMP = customTemp;
process.env.TMP = customTemp;

setInterval(() => {
    fs.readdir(customTemp, (err, files) => {
        if (err) return;
        for (const file of files) {
            const filePath = path.join(customTemp, file);
            fs.stat(filePath, (err, stats) => {
                if (!err && Date.now() - stats.mtimeMs > 3 * 60 * 60 * 1000) {
                    fs.unlink(filePath, () => { });
                }
            });
        }
    });
    console.log('🧹 Pasta temp limpa automaticamente');
}, 3 * 60 * 60 * 1000);

const settings = require('./settings');
require('./config.js');
const { isBanned } = require('./lib/isBanned');
const isOwnerOrSudo = require('./lib/isOwner');

const regrasCommand = require('./commands/regras');
const lideresCommand = require('./commands/lideres');
const aliadosCommand = require('./commands/aliados');
const rivaisCommand = require('./commands/rivais');
const novoAliadoCommand = require('./commands/novoaliado');
const novoRivalCommand = require('./commands/novorival');
const removerAliadoCommand = require('./commands/removeraliado');
const removerRivalCommand = require('./commands/removerrival');
const comandosCommand = require('./commands/comandos');
const banCommand = require('./commands/ban');
const promoverCommand = require('./commands/promover');
const horapvpCommand = require('./commands/horapvp');

global.packname = settings.packname;
global.author = settings.author;
global.channelLink = 'https://whatsapp.com/channel/0029Va90zAnIHphOuO8Msp3A';
global.ytch = 'Mr Unique Hacker';

const channelInfo = {
    contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363161513685998@newsletter',
            newsletterName: 'KnightBot MD',
            serverMessageId: -1
        }
    }
};

function unwrapMessage(message) {
    if (!message?.message) return null;
    let content = message.message;
    if (content.ephemeralMessage?.message) content = content.ephemeralMessage.message;
    if (content.viewOnceMessage?.message) content = content.viewOnceMessage.message;
    if (content.viewOnceMessageV2?.message) content = content.viewOnceMessageV2.message;
    return content;
}

function getMessageText(message) {
    const content = unwrapMessage(message);
    if (!content) return '';

    return (
        content.conversation ||
        content.extendedTextMessage?.text ||
        content.imageMessage?.caption ||
        content.videoMessage?.caption ||
        content.buttonsResponseMessage?.selectedButtonId ||
        ''
    ).trim();
}

function normalizeText(text) {
    return text
        .replace(/[\u200B-\u200F\uFEFF\u00A0]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function getCommandToken(text) {
    const normalized = normalizeText(text).toLowerCase();
    if (!normalized.startsWith('.') && !normalized.startsWith('/')) return '';
    return normalized.split(' ')[0];
}

function readIsPublicMode() {
    if (settings.commandMode === 'private') return false;
    if (settings.commandMode === 'public') return true;

    try {
        const data = JSON.parse(fs.readFileSync('./data/messageCount.json'));
        if (typeof data.isPublic === 'boolean') return data.isPublic;
    } catch (error) {
        console.error('Erro ao verificar modo de acesso:', error);
    }

    return true;
}

async function handleMessages(sock, messageUpdate) {
    let chatId;
    try {
        const { messages, type } = messageUpdate;
        if (type === 'replace') return;

        const message = messages?.[0];
        if (!message?.message) return;

        chatId = message.key.remoteJid;
        const senderId = message.key.participant || message.key.remoteJid;

        const rawText = normalizeText(getMessageText(message));
        const commandToken = getCommandToken(rawText);
        if (!commandToken) return;

        console.log(`📝 Comando detectado: ${commandToken} (type=${type || 'unknown'})`);

        if (isBanned(senderId)) {
            if (Math.random() < 0.1) {
                await sock.sendMessage(chatId, {
                    text: '❌ Voce esta banido de usar o bot. Fale com um admin para remover o banimento.',
                    ...channelInfo
                });
            }
            return;
        }

        const isPublic = readIsPublicMode();
        if (!isPublic) {
            const isOwnerOrSudoCheck = message.key.fromMe || await isOwnerOrSudo(senderId, sock, chatId);
            if (!isOwnerOrSudoCheck) return;
        }

        switch (commandToken) {
            case '.regras':
            case '/regras':
                await regrasCommand(sock, chatId, message);
                break;
            case '.lideres':
            case '/lideres':
                await lideresCommand(sock, chatId, message);
                break;
            case '.aliados':
            case '/aliados':
                await aliadosCommand(sock, chatId, message);
                break;
            case '.rivais':
            case '/rivais':
                await rivaisCommand(sock, chatId, message);
                break;
            case '.novoaliado':
            case '/novoaliado':
                await novoAliadoCommand(sock, chatId, message, senderId, rawText);
                break;
            case '.novorival':
            case '/novorival':
                await novoRivalCommand(sock, chatId, message, senderId, rawText);
                break;
            case '.removeraliado':
            case '/removeraliado':
                await removerAliadoCommand(sock, chatId, message, senderId, rawText);
                break;
            case '.removerrival':
            case '/removerrival':
                await removerRivalCommand(sock, chatId, message, senderId, rawText);
                break;
            case '.comandos':
            case '/comandos':
                await comandosCommand(sock, chatId, message);
                break;
            case '.ban':
            case '/ban':
                await banCommand(sock, chatId, message, senderId, rawText);
                break;
            case '.promover':
            case '/promover':
                await promoverCommand(sock, chatId, message, senderId, rawText);
                break;
            case '.horapvp':
            case '/horapvp':
                await horapvpCommand(sock, chatId, message);
                break;
            default:
                break;
        }
    } catch (error) {
        console.error('❌ Erro no manipulador de mensagens:', error);
        if (chatId) {
            await sock.sendMessage(chatId, {
                text: '❌ Falha ao processar comando!',
                ...channelInfo
            });
        }
    }
}

async function handleGroupParticipantUpdate() {
    // Eventos de grupo desativados (welcome/goodbye/promote removidos)
}

module.exports = {
    handleMessages,
    handleGroupParticipantUpdate,
    handleStatus: async () => { }
};

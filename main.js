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

require('./settings');
require('./config.js');
const { isBanned } = require('./lib/isBanned');
const isOwnerOrSudo = require('./lib/isOwner');

const regrasCommand = require('./commands/regras');
const lideresCommand = require('./commands/lideres');
const aliadosCommand = require('./commands/aliados');
const rivaisCommand = require('./commands/rivais');
const comandosCommand = require('./commands/comandos');
const banCommand = require('./commands/ban');
const promoverCommand = require('./commands/promover');
const horapvpCommand = require('./commands/horapvp');

global.packname = require('./settings').packname;
global.author = require('./settings').author;
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

async function handleMessages(sock, messageUpdate) {
    let chatId;
    try {
        const { messages, type } = messageUpdate;
        if (type !== 'notify') return;

        const message = messages[0];
        if (!message?.message) return;

        chatId = message.key.remoteJid;
        const senderId = message.key.participant || message.key.remoteJid;
        const senderIsOwnerOrSudo = await isOwnerOrSudo(senderId, sock, chatId);

        const userMessage = (
            message.message?.conversation?.trim() ||
            message.message?.extendedTextMessage?.text?.trim() ||
            message.message?.imageMessage?.caption?.trim() ||
            message.message?.videoMessage?.caption?.trim() ||
            message.message?.buttonsResponseMessage?.selectedButtonId?.trim() ||
            ''
        ).toLowerCase().replace(/\.\s+/g, '.').trim();
        const rawText = (
            message.message?.conversation?.trim() ||
            message.message?.extendedTextMessage?.text?.trim() ||
            message.message?.imageMessage?.caption?.trim() ||
            message.message?.videoMessage?.caption?.trim() ||
            message.message?.buttonsResponseMessage?.selectedButtonId?.trim() ||
            ''
        ).replace(/\.\s+/g, '.').trim();

        if (userMessage.startsWith('.')) {
            console.log(`📝 Comando: ${userMessage}`);
        }

        let isPublic = true;
        try {
            const data = JSON.parse(fs.readFileSync('./data/messageCount.json'));
            if (typeof data.isPublic === 'boolean') isPublic = data.isPublic;
        } catch (error) {
            console.error('Erro ao verificar modo de acesso:', error);
        }

        const isOwnerOrSudoCheck = message.key.fromMe || senderIsOwnerOrSudo;

        if (isBanned(senderId)) {
            if (Math.random() < 0.1) {
                await sock.sendMessage(chatId, {
                    text: '❌ Voce esta banido de usar o bot. Fale com um admin para remover o banimento.',
                    ...channelInfo
                });
            }
            return;
        }

        if (!userMessage.startsWith('.')) return;

        if (!isPublic && !isOwnerOrSudoCheck) return;

        switch (true) {
            case userMessage === '.regras':
                await regrasCommand(sock, chatId, message);
                break;
            case userMessage === '.lideres':
                await lideresCommand(sock, chatId, message);
                break;
            case userMessage === '.aliados':
                await aliadosCommand(sock, chatId, message);
                break;
            case userMessage === '.rivais':
                await rivaisCommand(sock, chatId, message);
                break;
            case userMessage === '.comandos':
                await comandosCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.ban'):
                await banCommand(sock, chatId, message, senderId, rawText);
                break;
            case userMessage.startsWith('.promover'):
                await promoverCommand(sock, chatId, message, senderId, rawText);
                break;
            case userMessage === '.horapvp':
                await horapvpCommand(sock, chatId, message);
                break;
            default:
                break;
        }
    } catch (error) {
        console.error('❌ Erro no manipulador de mensagens:', error.message);
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

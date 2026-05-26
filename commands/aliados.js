async function aliadosCommand(sock, chatId, message) {
    const aliadosText = `
📄 *Aliados*

No momento, não possuímos alianças ativas.
    `.trim();

    await sock.sendMessage(chatId, { text: aliadosText }, { quoted: message });
}

module.exports = aliadosCommand;


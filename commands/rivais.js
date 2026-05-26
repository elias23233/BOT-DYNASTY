async function rivaisCommand(sock, chatId, message) {
    const rivaisText = `
📄 *Rivais*

No momento, sem informações de rivais.
    `.trim();

    await sock.sendMessage(chatId, { text: rivaisText }, { quoted: message });
}

module.exports = rivaisCommand;


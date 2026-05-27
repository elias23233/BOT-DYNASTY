async function comandosCommand(sock, chatId, message) {
    const comandosText = `
━━━━━━━━━━━━━━━━━━
📜 PAINEL DE COMANDOS

➤ .regras
➤ .lideres
➤ .aliados
➤ .rivais
➤ .ban
➤ .promover
➤ .horapvp

━━━━━━━━━━━━━━━━━━
    `.trim();

    await sock.sendMessage(chatId, { text: comandosText }, { quoted: message });
}

module.exports = comandosCommand;


async function comandosCommand(sock, chatId, message) {
    const comandosText = `
━━━━━━━━━━━━━━━━━━
📜 PAINEL DE COMANDOS

➤ .regras
➤ .lideres
➤ .aliados
➤ .rivais
➤ .novoaliado [nome]
➤ .novorival [nome]
➤ .removeraliado [nome]
➤ .removerrival [nome]
➤ .ban
➤ .promover
➤ .horapvp

━━━━━━━━━━━━━━━━━━
    `.trim();

    await sock.sendMessage(chatId, { text: comandosText }, { quoted: message });
}

module.exports = comandosCommand;


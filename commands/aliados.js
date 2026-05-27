async function aliadosCommand(sock, chatId, message) {
    const aliadosText = `
╔════════════════════
║ 🤝 PAINEL ALIADOS
╠════════════════════
║ ❌ Sem aliados no momento
║ 📌 Nenhuma informação
╚════════════════════
    `.trim();

    await sock.sendMessage(chatId, { text: aliadosText }, { quoted: message });
}

module.exports = aliadosCommand;


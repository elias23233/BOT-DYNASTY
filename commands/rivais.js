async function rivaisCommand(sock, chatId, message) {
    const rivaisText = `
╔════════════════════
║ ⚔️ PAINEL RIVAIS
╠════════════════════
║ ❌ Sem rivais no momento
║ 📌 Nenhuma informação
╚════════════════════
    `.trim();

    await sock.sendMessage(chatId, { text: rivaisText }, { quoted: message });
}

module.exports = rivaisCommand;


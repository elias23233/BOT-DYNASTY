async function horapvpCommand(sock, chatId, message) {
    const text = `
━━━━━━━━━━━━━━━━━━
⚔️ HORA PVP

📅 DOMINGO
🕗 HORÁRIO: 20:00

👮 ORGANIZADOR: WALLACEx03
━━━━━━━━━━━━━━━━━━
`.trim();

    await sock.sendMessage(chatId, { text }, { quoted: message });
}

module.exports = horapvpCommand;


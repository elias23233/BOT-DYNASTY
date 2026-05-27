async function lideresCommand(sock, chatId, message) {
    const lideresText = `
╔════════════════════
║ 👑 PAINEL LÍDERES [DNY]
╠════════════════════
║ 👑 LÍDER: [DNY] CHARADAx00
║ SUB: [DNY] PURURUCAx00
║ 01: [DNY] OMESTREEx01
║ 02: [DNY] SIDNEYx02
║ 03: [DNY] WALLACEx03
╚═══════════════════
    `.trim();

    await sock.sendMessage(chatId, { text: lideresText }, { quoted: message });
}

module.exports = lideresCommand;


async function comandosCommand(sock, chatId, message) {
    const comandosText = `
🧾 *Comandos do Bot*

.regras → Regras da FAC
.lideres → Painel de líderes
.aliados → Lista de aliados
.rivais → Lista de rivais
.comandos → Lista geral de comandos
    `.trim();

    await sock.sendMessage(chatId, { text: comandosText }, { quoted: message });
}

module.exports = comandosCommand;


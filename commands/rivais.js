const { getRivais } = require('../lib/aliados_rivais');

async function rivaisCommand(sock, chatId, message) {
    const rivais = getRivais();
    const rivaisText = rivais.length > 0
        ? `╭━━━━━━━━━━━━━━━━╮\n┃           🤝 LISTA DE RIVAIS 🤝          ┃\n╰━━━━━━━━━━━━━━━━╯\n\n${rivais.map((item, index) => `〔${String(index + 1).padStart(2, '0')}〕${item}`).join('\n')}\n\n━━━━━━━━━━━━━━━━━━\n📊 Total de Rivais: ${String(rivais.length).padStart(2, '0')}\n━━━━━━━━━━━━━━━━━━`
        : `╭━━━━━━━━━━━━━━━━╮\n┃           🤝 LISTA DE RIVAIS 🤝          ┃\n╰━━━━━━━━━━━━━━━━╯\n\nNenhum rival cadastrado.\n\n━━━━━━━━━━━━━━━━━━\n📊 Total de Rivais: 00\n━━━━━━━━━━━━━━━━━━`;

    await sock.sendMessage(chatId, { text: rivaisText }, { quoted: message });
}

module.exports = rivaisCommand;


const { getAliados } = require('../lib/aliados_rivais');

async function aliadosCommand(sock, chatId, message) {
    const aliados = getAliados();
    const aliadosText = aliados.length > 0
        ? `╭━━━━━━━━━━━━━━━━╮\n┃         🤝 LISTA DE ALIADOS 🤝        ┃\n╰━━━━━━━━━━━━━━━━╯\n\n${aliados.map((item, index) => `〔${String(index + 1).padStart(2, '0')}〕${item}`).join('\n')}\n\n━━━━━━━━━━━━━━━━━━\n📊 Total de Aliados: ${String(aliados.length).padStart(2, '0')}\n━━━━━━━━━━━━━━━━━━`
        : `╭━━━━━━━━━━━━━━━━╮\n┃         🤝 LISTA DE ALIADOS 🤝        ┃\n╰━━━━━━━━━━━━━━━━╯\n\nNenhum aliado cadastrado.\n\n━━━━━━━━━━━━━━━━━━\n📊 Total de Aliados: 00\n━━━━━━━━━━━━━━━━━━`;

    await sock.sendMessage(chatId, { text: aliadosText }, { quoted: message });
}

module.exports = aliadosCommand;


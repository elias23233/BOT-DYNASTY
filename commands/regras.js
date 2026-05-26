async function regrasCommand(sock, chatId, message) {
    const regrasText = `
📜 *REGRAS GERAIS DA FAC*

1️⃣ Sempre respeitar seus líderes.
2️⃣ Proibido ofender qualquer membro.
3️⃣ Proibido brigas entre membros.
4️⃣ Manter respeito dentro da FAC em todos os momentos.
5️⃣ Proibido causar confusão ou tumulto.
6️⃣ Ajudar os membros sempre que possível.
7️⃣ União e lealdade à FAC sempre em primeiro lugar.
8️⃣ Proibido divulgar outros grupos.
9️⃣ Manter atividade e participação na FAC.
🔟 Quem desrespeitar as regras estará sujeito a punição ou remoção.
🚫 Extremamente proibido o envio de figurinhas +18.
    `.trim();

    await sock.sendMessage(chatId, { text: regrasText }, { quoted: message });
}

module.exports = regrasCommand;


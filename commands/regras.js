async function regrasCommand(sock, chatId, message) {
    const regrasText = `
╔═════════════════
║ 📜 REGRAS DA FAC
╠═════════════════
║ 1️⃣ Respeitar líderes
║ 2️⃣ Sem ofensas
║ 3️⃣ Sem brigas
║ 4️⃣ Sem confusão
║ 5️⃣ União e lealdade
║ 6️⃣ Sem divulgar grupos
║ 7️⃣ Atividade ativa
║ 8️⃣ Ajudar membros
║ 9️⃣ Sem spam/flood
║ 🔟 Sem conteúdo +18
╚═════════════════
    `.trim();

    await sock.sendMessage(chatId, { text: regrasText }, { quoted: message });
}

module.exports = regrasCommand;


function unwrapContent(message) {
    if (!message?.message) return null;
    let content = message.message;
    if (content.ephemeralMessage?.message) content = content.ephemeralMessage.message;
    if (content.viewOnceMessage?.message) content = content.viewOnceMessage.message;
    if (content.viewOnceMessageV2?.message) content = content.viewOnceMessageV2.message;
    return content;
}

function getContextInfo(message) {
    const content = unwrapContent(message);
    if (!content) return null;

    return (
        content.extendedTextMessage?.contextInfo ||
        content.imageMessage?.contextInfo ||
        content.videoMessage?.contextInfo ||
        content.documentMessage?.contextInfo ||
        null
    );
}

function jidKey(jid = '') {
    return jid.split('@')[0].split(':')[0];
}

function participantMatches(participant, hint) {
    if (!hint || !participant) return false;

    const candidates = [participant.id, participant.lid, participant.phoneNumber].filter(Boolean);
    const hintKey = jidKey(hint);

    return candidates.some((candidate) => {
        if (candidate === hint) return true;
        return jidKey(candidate) === hintKey;
    });
}

async function resolveGroupParticipant(sock, groupId, targetHint) {
    if (!targetHint || !groupId.endsWith('@g.us')) return null;

    try {
        const metadata = await sock.groupMetadata(groupId);
        const participants = metadata.participants || [];
        const match = participants.find((p) => participantMatches(p, targetHint));
        if (match?.id) return match.id;
    } catch (error) {
        console.error('Erro ao resolver participante:', error);
    }

    return targetHint;
}

function getTargetFromMessage(message) {
    const contextInfo = getContextInfo(message);
    if (!contextInfo) return null;

    if (Array.isArray(contextInfo.mentionedJid) && contextInfo.mentionedJid.length > 0) {
        return contextInfo.mentionedJid[0];
    }

    if (contextInfo.participant) return contextInfo.participant;
    return null;
}

async function getResolvedTarget(sock, groupId, message) {
    const rawTarget = getTargetFromMessage(message);
    if (!rawTarget) return null;
    return resolveGroupParticipant(sock, groupId, rawTarget);
}

module.exports = {
    getResolvedTarget,
    resolveGroupParticipant,
    jidKey
};

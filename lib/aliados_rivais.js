const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data', 'aliados_rivais.json');
const defaultData = { aliados: [], rivais: [] };

function ensureDataFile() {
    if (!fs.existsSync(dataPath)) {
        fs.writeFileSync(dataPath, JSON.stringify(defaultData, null, 2), 'utf8');
    }
}

function readData() {
    ensureDataFile();
    try {
        return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    } catch (err) {
        fs.writeFileSync(dataPath, JSON.stringify(defaultData, null, 2), 'utf8');
        return defaultData;
    }
}

function saveData(data) {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
}

function normalizeName(name) {
    return name.replace(/\s+/g, ' ').trim();
}

function findIndex(list, name) {
    const normalizedName = normalizeName(name).toLowerCase();
    return list.findIndex(item => normalizeName(item).toLowerCase() === normalizedName);
}

function getAliados() {
    return readData().aliados || [];
}

function getRivais() {
    return readData().rivais || [];
}

function addAliado(name) {
    const normalized = normalizeName(name);
    if (!normalized) return { success: false, message: 'Nome inválido.' };

    const data = readData();
    if (findIndex(data.aliados, normalized) !== -1) {
        return { success: false, duplicate: true };
    }

    data.aliados.push(normalized);
    saveData(data);
    return { success: true, name: normalized };
}

function addRival(name) {
    const normalized = normalizeName(name);
    if (!normalized) return { success: false, message: 'Nome inválido.' };

    const data = readData();
    if (findIndex(data.rivais, normalized) !== -1) {
        return { success: false, duplicate: true };
    }

    data.rivais.push(normalized);
    saveData(data);
    return { success: true, name: normalized };
}

function removeAliado(name) {
    const normalized = normalizeName(name);
    const data = readData();
    const index = findIndex(data.aliados, normalized);
    if (index === -1) {
        return { success: false, notFound: true };
    }

    const removed = data.aliados.splice(index, 1)[0];
    saveData(data);
    return { success: true, name: removed };
}

function removeRival(name) {
    const normalized = normalizeName(name);
    const data = readData();
    const index = findIndex(data.rivais, normalized);
    if (index === -1) {
        return { success: false, notFound: true };
    }

    const removed = data.rivais.splice(index, 1)[0];
    saveData(data);
    return { success: true, name: removed };
}

module.exports = {
    getAliados,
    getRivais,
    addAliado,
    addRival,
    removeAliado,
    removeRival
};

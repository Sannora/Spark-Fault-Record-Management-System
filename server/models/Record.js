const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
    originalFileName: String,
    storedFilePath: String,
    uploadedAt: { type: Date, default: Date.now},
    jsonData: Object
});

module.exports = mongoose.model('Record', recordSchema);
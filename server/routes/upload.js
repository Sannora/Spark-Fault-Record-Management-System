const express = require('express');
const fs = require('fs');
const path = require('path');

const Record = require('../models/Record');  // Modeli import et

const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const parseCSV = require('../parser/parseCSV');

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path;

    // Dosyayı oku
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // .cfg dosyasını JSON'a çevir
    const jsonData = parseCSV(fileContent);

    // Yeni kayıt oluştur ve kaydet
    const newRecord = new Record({
      originalFileName: req.file.originalname,
      storedFilePath: filePath,
      jsonData: jsonData
    });
    await newRecord.save();

    console.log(`✅ Başarıyla kaydedildi: ${req.file.originalname} - ID: ${newRecord._id}`);

    // JSON veriyi yanıt olarak gönder
    res.json(jsonData);

    // Geçici dosyayı sistemden sil
    fs.unlinkSync(filePath);
  } catch (error) {
    console.error('Yükleme hatası:', error);
    res.status(500).json({ error: 'Dosya yükleme sırasında bir hata oluştu.' });
  }
});

module.exports = router;

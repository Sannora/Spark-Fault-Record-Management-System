const express = require('express');
const fs = require('fs');
const path = require('path');

const Record = require('../models/Record');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const parseCSV = require('../parser/parseCSV');

router.post('/', upload.array('file'), async (req, res) => {
  try {
    const results = [];

    for (const file of req.files) {
      const filePath = file.path;

      // Dosyayı oku
      const fileContent = fs.readFileSync(filePath, 'utf-8');

      // CSV'yi JSON'a çevir
      const jsonData = parseCSV(fileContent);

      // Veritabanına kaydet
      const newRecord = new Record({
        originalFileName: file.originalname,
        storedFilePath: filePath,
        jsonData: jsonData
      });
      await newRecord.save();

      console.log(`✅ Kaydedildi: ${file.originalname} - ID: ${newRecord._id}`);

      results.push({
        fileName: file.originalname,
        data: jsonData
      });

      // Geçici dosyayı sil
      fs.unlinkSync(filePath);
    }

    // Tüm sonuçları gönder
    res.json(results);
  } catch (error) {
    console.error('Yükleme hatası:', error);
    res.status(500).json({ error: 'Dosya(lar) yüklenirken bir hata oluştu.' });
  }
});

module.exports = router;

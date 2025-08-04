const express = require('express');
const router = express.Router();
const analyzeDigitalSignal = require('../analyzer/digitalAnalyzer');
const Record = require('../models/Record');

// POST /analyze/digital
router.post('/digital', (req, res) => {
  const recordData = req.body;

  if (!recordData.Time) {
    return res.status(400).json({ error: 'Time array missing' });
  }

  const timestamps = recordData.Time;
  const results = {};

  Object.keys(recordData).forEach(key => {
    if (key === 'Time') return;

    const signal = recordData[key];
    results[key] = analyzeDigitalSignal(timestamps, signal);
  });

  return res.json(results);
});

// GET /analyze/digital/:id
router.get('/digital/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const record = await Record.findById(id);

    if (!record) {
      return res.status(404).json({ error: 'Kayıt bulunamadı' });
    }

    const dataArray = record.jsonData; // <<--- doğru alan burası

    if (!Array.isArray(dataArray) || dataArray.length === 0) {
      console.error('❌ jsonData eksik veya boş:', dataArray);
      return res.status(400).json({ error: 'jsonData eksik veya boş' });
    }

    const timestamps = Array.from({ length: dataArray.length }, (_, i) => i); // örnek zaman dizisi

    const results = {};

    // İlk dijital anahtarları al (örnek: "KESICI ACIK", "KESICI KAPALI", vs.)
    const keys = Object.keys(dataArray[0]).filter(key => key !== 'Time');

    for (const key of keys) {
      const signal = dataArray.map(entry => Number(entry[key]));
      results[key] = analyzeDigitalSignal(timestamps, signal);
    }

    return res.json(results);
  } catch (error) {
    console.error('🔥 Analyze route hatası:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

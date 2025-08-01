const express = require('express');
const router = express.Router();
const Record = require('../models/Record');

// Kayıtları çekecek bir GET isteği
router.get('/', async (req, res) => {
    try {
        // Tüm kayıtları en son eklenen en üstte olacak şekilde çek
        const records = await Record.find().sort({_id: -1});
        res.json(records);
    } catch (error) {
        res.status(500).json( 'Veri çekme hatası:', error );
        res.status(500).send({ error: 'Veri alınamadı.' });
    }
});

// Belirli bir kaydı ID ile çekecek bir GET isteği
router.get('/:id', async (req, res) => {
    try {
        const record = await Record.findById(req.params.id);
        if (!record) return res.status(404).json({message: 'Kayıt bulunamadı.'});
        res.json(record);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

// Belirli kaydı silmek için DELETE isteği
router.delete('/:id', async (req, res) => {
    try {
        const record = await Record.findByIdAndDelete(req.params.id);
        if (!record) return res.status(404).json({message: 'Kayıt bulunamadı.'});
        res.json({message: 'Kayıt silindi.'});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

module.exports = router;
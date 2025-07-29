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

module.exports = router;
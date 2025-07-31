require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const uploadRoute = require('./routes/upload');
const recordsRoute = require('./routes/records');

const MONGO_URI = process.env.MONGO_URI;

const PORT = 5000;
const app = express();

// Middleware bağlantısı
app.use(cors());
app.use(express.json());

// Route bağlantısı
app.use('/upload', uploadRoute);
app.use('/records', recordsRoute);

// MongoDB Bağlantısı
mongoose.connect(MONGO_URI)
.then(() => {
  console.log('✅ MongoDB bağlantısı başarılı');
  app.listen(PORT, () => console.log(`🚀 Server http://localhost:${PORT} portunda çalışıyor`))
})
.catch(err => {
  console.error('❌ MongoDB bağlantı hatası:', err);
});
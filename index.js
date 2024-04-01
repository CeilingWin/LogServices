const http = require('http');
const fs = require('fs');
const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');

// Khởi tạo bot Telegram
const telegramToken = process.env['TELEGRAM_TOKEN'];
const chatId = process.env['CHAT_ID']; // ID của cuộc trò chuyện mà bạn muốn gửi tin nhắn đến
const bot = new TelegramBot(telegramToken);

// Tạo server
const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    let body = '';

    // Nhận dữ liệu từ yêu cầu POST
    req.on('data', chunk => {
      body += chunk.toString();
    });

    // Khi kết thúc yêu cầu POST, lưu nội dung vào file văn bản và gửi đến Telegram
    req.on('end', () => {
      // Tạo tên file ngẫu nhiên
      const fileName = `request_${Date.now()}.txt`;

      // Lưu nội dung vào file văn bản
      fs.writeFile(fileName, body, err => {
        if (err) {
          console.error(err);
          res.statusCode = 500;
          res.end('Internal Server Error');
        } else {
          console.log(`Saved request body to ${fileName}`);

          // Đường dẫn của file văn bản để gửi đến Telegram
          const filePath = `./${fileName}`;

          // Gửi file văn bản đến Telegram
          bot.sendDocument(chatId, filePath)
            .then(() => {
              console.log('File sent to Telegram');
              res.statusCode = 200;
              res.end('Request body saved and sent to Telegram');
            })
            .catch(error => {
              console.error('Error sending file to Telegram:', error);
              res.statusCode = 500;
              res.end('Error sending file to Telegram');
            });
        }
      });
    });
  } else {
    res.statusCode = 405; // Method Not Allowed
    res.end('Only POST requests are allowed');
  }
});

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// Lắng nghe trên cổng và host được chỉ định
server.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}/`);
});

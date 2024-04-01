const http = require('http');
const fs = require('fs');

// Tạo server
const server = http.createServer((req, res) => {

console.log("Request received");
if (req.method === 'GET' && req.url === '/') {
    // Đọc nội dung của tệp index.html
    fs.readFile('intro.html', (err, data) => {
      if (err) {
        // Trường hợp có lỗi khi đọc tệp
        console.error(err);
        res.statusCode = 500;
        res.end('Internal Server Error');
      } else {
        // Trường hợp không có lỗi, trả về nội dung HTML
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  }
  else if (req.method === 'POST') {
    let body = '';

    // Nhận dữ liệu từ yêu cầu POST
    req.on('data', chunk => {
      body += chunk.toString();
    });

    // Khi kết thúc yêu cầu POST, lưu nội dung vào file văn bản
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
          res.statusCode = 200;
          res.end('Request body saved successfully');
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

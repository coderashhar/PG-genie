const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/users/profile',
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Response:', res.statusCode, data));
});

req.write(JSON.stringify({ name: 'Test' }));
req.end();

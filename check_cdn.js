const https = require('https');

const url = 'https://cdn.jsdelivr.net/gh/haikal-devtech/Goorita@main/public/hero-video.mp4';

https.get(url, (response) => {
  console.log('Status code:', response.statusCode);
  console.log('Content-Type:', response.headers['content-type']);
  console.log('Content-Length:', response.headers['content-length']);
});

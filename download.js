const fs = require('fs');
const https = require('https');

fs.mkdirSync('./public', { recursive: true });
const file = fs.createWriteStream('./public/hero-video.mp4');

const url = 'https://raw.githubusercontent.com/haikal-devtech/Goorita/main/public/hero-video.mp4';

https.get(url, (response) => {
  if (response.statusCode === 200) {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log('Download completed.');
    });
  } else if (response.statusCode === 301 || response.statusCode === 302) {
    https.get(response.headers.location, (redirectResponse) => {
      redirectResponse.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('Download completed after redirect.');
      });
    });
  } else {
    console.error(`Failed to download, status code: ${response.statusCode}`);
  }
}).on('error', (err) => {
  console.error('Error downloading:', err.message);
});

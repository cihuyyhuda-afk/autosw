const fetch = require('node-fetch');
const cron = require('node-cron');

// Fungsi untuk mendapatkan waktu WIB
function getWIBTime() {
  const date = new Date();
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
}

// Fungsi untuk mengirim request fetch
function sendFetchRequest() {
  const caption = `Waktu sekarang: ${getWIBTime()} WIB`;

  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: 'Bearer xsldBjRsZpLbLzJgFBt6hi3h801fmOUr',
    },
    body: JSON.stringify({
      background_color: '#00000000',
      caption_color: '#FFFFFFFF',
      caption: caption,
    }),
  };

  fetch('https://gate.whapi.cloud/stories/send/text', options)
    .then((res) => res.json())
    .then((res) => console.log('Success:', res))
    .catch((err) => console.error('Error:', err));
}

// Menjadwalkan fetch untuk dijalankan setiap jam pada menit 00
cron.schedule('0 * * * *', () => {
  console.log('Fetching at:', new Date().toLocaleString());
  sendFetchRequest();
});

// File: index.js
const logs = []; // Untuk menyimpan log

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
async function sendFetchRequest() {
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

  try {
    const res = await fetch('https://gate.whapi.cloud/stories/send/text', options);
    const data = await res.json();
    logToPage(`Success: ${JSON.stringify(data)}`);
  } catch (err) {
    logToPage(`Error: ${err}`);
  }
}

// Fungsi untuk menambahkan log ke array logs
function logToPage(message) {
  logs.push(`${new Date().toLocaleString()}: ${message}`);
  if (logs.length > 10) {
    logs.shift(); // Hanya simpan 10 log terbaru
  }
}

// Cron Trigger - setiap jam pada menit 00
addEventListener('scheduled', event => {
  event.waitUntil(sendFetchRequest());
});

// Menampilkan log ketika ada permintaan HTTP
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  return new Response(`
    <html>
      <head>
        <title>Log Fetch API</title>
        <style>
          body { font-family: Arial, sans-serif; background: #2c3e50; color: #fff; padding: 20px; }
          #log { background: #34495e; padding: 10px; border-radius: 5px; height: 300px; overflow-y: scroll; }
        </style>
      </head>
      <body>
        <h1>Log Fetch API</h1>
        <div id="log">
          ${logs.map(log => `<p>${log}</p>`).join('')}
        </div>
      </body>
    </html>
  `, {
    headers: { 'Content-Type': 'text/html' },
  });
}

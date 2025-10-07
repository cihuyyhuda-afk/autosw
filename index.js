import express from "express";
import fetch from "node-fetch"; // jika pakai Node <18
import cron from "node-cron";

const app = express();
const logs = [];

// Fungsi untuk mendapatkan waktu WIB
function getWIBTime() {
  const date = new Date();
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

// Fungsi log
function logToPage(message) {
  const log = `${new Date().toLocaleString("en-GB", {
    timeZone: "Asia/Jakarta",
  })}: ${message}`;
  logs.push(log);
  if (logs.length > 50) logs.shift(); // simpan 50 log terakhir
  console.log(log);
}

// Fungsi untuk kirim fetch ke Whapi
async function sendFetchRequest() {
  const caption = `Waktu sekarang: ${getWIBTime()} WIB`;

  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: "Bearer xsldBjRsZpLbLzJgFBt6hi3h801fmOUr",
    },
    body: JSON.stringify({
      background_color: "#00000000",
      caption_color: "#FFFFFFFF",
      caption,
    }),
  };

  try {
    const res = await fetch("https://gate.whapi.cloud/stories/send/text", options);
    const data = await res.json();
    logToPage(`Success: ${JSON.stringify(data)}`);
  } catch (err) {
    logToPage(`Error: ${err.message}`);
  }
}

// Jalankan setiap jam pada menit 00
cron.schedule("0,10,20,30,40,50 * * * *", () => {
  sendFetchRequest();
});

// Endpoint web untuk melihat log
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Log Fetch API</title>
        <style>
          body { font-family: Arial; background: #1e1e2f; color: #fff; padding: 20px; }
          h1 { color: #00d1b2; }
          #log { background: #2b2b3c; padding: 15px; border-radius: 8px; height: 400px; overflow-y: auto; }
          p { margin: 0 0 6px; font-size: 14px; }
        </style>
      </head>
      <body>
        <h1>Log Fetch API</h1>
        <div id="log">
          ${logs.map((log) => `<p>${log}</p>`).join("")}
        </div>
      </body>
    </html>
  `);
});

// Jalankan server
const PORT = process.env.PORT || 8787;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
  logToPage("Server dimulai.");
});
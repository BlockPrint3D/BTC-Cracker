"use strict";

process.title = "BTC Wallet Scanner - Educational Only";

const CoinKey = require('coinkey');
const fs = require('fs');

let addresses = new Map();
let counter = 0;

// טוען כתובות מ-riches.txt
const data = fs.readFileSync('./riches.txt');
data.toString().split("\n").forEach(address => {
    const trimmed = address.trim();
    if (trimmed) addresses.set(trimmed, true);
});

function generate() {
    const privateKeyHex = r(64);
    const ck = new CoinKey(Buffer.from(privateKeyHex, 'hex'));
    ck.compressed = false;

    if (addresses.has(ck.publicAddress)) {
        console.log("\x07"); // beep
        console.log("\x1b[32m%s\x1b[0m", ">> MATCH FOUND: " + ck.publicAddress);
        const success = `Wallet: ${ck.publicAddress}\nSeed: ${ck.privateWif}\n`;
        fs.appendFileSync('./Success.txt', success);
        process.exit();
    }

    // הצגת מונה כל X כתובות
    counter++;
    if (counter % 1000 === 0) {
        console.clear();
        console.log(`🔄 Checked: ${counter} addresses`);
        console.log("📦 Heap Used:", (process.memoryUsage().heapUsed / 1000000).toFixed(2), "MB");
    }
}

// מחולל HEX אקראי
function r(len) {
    const chars = 'ABCDEF0123456789';
    let str = '';
    for (let i = 0; i < len; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}

console.log("\x1b[32m%s\x1b[0m", ">> Educational BTC Key Scanner Started");

setInterval(() => {
    generate();
    if (process.memoryUsage().heapUsed / 1000000 > 500 && global.gc) {
        global.gc();
    }
}, 1);

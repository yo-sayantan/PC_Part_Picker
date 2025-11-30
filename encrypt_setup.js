const crypto = require('crypto');
const key = crypto.randomBytes(32).toString('hex');
console.log('KEY:' + key);

const IV_LENGTH = 16;
const ALGORITHM = 'aes-256-cbc';

function encrypt(text, keyHex) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const key = Buffer.from(keyHex, 'hex');
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

const password = 'ynpu opxc iztq iqlr';
const encrypted = encrypt(password, key);
const fs = require('fs');
const output = `KEY=${key}\nENCRYPTED=${encrypted}`;
fs.writeFileSync('encryption_result.txt', output);
console.log('Done writing to encryption_result.txt');

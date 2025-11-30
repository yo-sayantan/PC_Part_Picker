const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

// Manual .env parser to avoid dotenv dependency
function parseEnv(filePath) {
    if (!fs.existsSync(filePath)) return {};
    const content = fs.readFileSync(filePath, 'utf8');
    const env = {};
    content.split('\n').forEach(line => {
        const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)?\s*$/);
        if (match) {
            let value = match[2] || '';
            // Remove quotes if present
            if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
                value = value.substring(1, value.length - 1);
            }
            env[match[1]] = value;
        }
    });
    return env;
}

// Load environment variables
const envLocalPath = path.join(__dirname, '../../.env.local');
const envPath = path.join(__dirname, '../../.env');

const envLocal = parseEnv(envLocalPath);
const env = parseEnv(envPath);

// Merge envs (local takes precedence)
const config = { ...env, ...envLocal };

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;

function getKey() {
    const key = config.ENCRYPTION_KEY;
    if (!key) {
        throw new Error('ENCRYPTION_KEY is not defined in environment variables');
    }
    return Buffer.from(key, 'hex');
}

function encrypt(text) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const key = getKey();
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

const password = process.argv[2];

if (!password) {
    console.error('Please provide a password to encrypt.');
    console.error('Usage: node src/scripts/encrypt.js <password>');
    process.exit(1);
}

try {
    const encrypted = encrypt(password);
    console.log('\nEncrypted Password:');
    console.log(encrypted);
    console.log('\nAdd this to your .env file as SMTP_PASS');
} catch (error) {
    console.error('Encryption failed:', error.message);
}

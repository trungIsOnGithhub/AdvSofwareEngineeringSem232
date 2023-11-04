import dotenv from 'dotenv';
import fs from 'fs';
import crypto from 'node:crypto';

dotenv.config();

const privateKey = crypto.createPrivateKey({key: fs.readFileSync("./privateKey.pem", {encoding: "utf-8"}), passphrase: String(process.env.KEY_PASS)});
const publicKey = crypto.createPublicKey(fs.readFileSync("./publicKey.pem", {encoding: "utf-8"}))

export {privateKey, publicKey};
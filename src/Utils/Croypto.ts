import CryptoJS from 'crypto-js';

export class Croypto {
    aesDecrypt(key: string, ciphertext: string) {
        const parsedKey = CryptoJS.enc.Base64.parse(key);
        const decrypted = CryptoJS.AES.decrypt(ciphertext, parsedKey, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
    }
    aesEncrypt(key: string, plaintext: string) {
        const parsedKey = CryptoJS.enc.Base64.parse(key);
        const encrypted = CryptoJS.AES.encrypt(plaintext, parsedKey, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.toString();
    }
    desEncrypt(keyBase64: string, data: string): string {
        const keyBytes = CryptoJS.enc.Base64.parse(keyBase64).toString(CryptoJS.enc.Hex);
        const key = CryptoJS.enc.Hex.parse(keyBytes);
        const utf8Data = CryptoJS.enc.Utf8.parse(data);
        const encrypted = CryptoJS.DES.encrypt(utf8Data, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
    }
}
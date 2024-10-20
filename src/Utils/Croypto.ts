import CryptoJS from 'crypto-js';

export class Croypto {
    desEncrypt(keyBase64: string, data: string): string {
        const keyBytes = CryptoJS.enc.Base64.parse(keyBase64);
        const dataBytes = CryptoJS.enc.Utf8.parse(data);
        const encrypted = CryptoJS.DES.encrypt(dataBytes, keyBytes, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.toString();
    }

}
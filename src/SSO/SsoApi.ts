import { WebClient } from "../Utils/WebClient";
import { Croypto } from "../Utils/Croypto";
import { IUrlBase } from "../Url/IUrlBase";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
export class SsoLoginData {
    crypto!: string;
    execution!: string;
    cookies?: string[];
    toString(): string {
        return `Crypto: ${this.crypto}, Execution: ${this.execution}`;
    }
}

export class SsoApi {
    async getSsoLoginData(url: IUrlBase): Promise<SsoLoginData> {
        const response = await WebClient.get(url.sso);
        const cookies = response.headers['set-cookie'];
        const content = await response.data; // 等待文本内容加载完成
        const cryptoRegex = /<p id="login-croypto">(.+?)<\/p>/;
        const executionRegex = /<p id="login-page-flowkey">([^<]+)<\/p>/;
        const cryptoMatch = cryptoRegex.exec(content);
        const executionMatch = executionRegex.exec(content);
        const sessionId = cookies?.map((cookie: string) => cookie.split(";")[0].split("=")[1]);
        return {
            crypto: cryptoMatch ? cryptoMatch[1].toString() : '',
            execution: executionMatch ? executionMatch[1].toString() : '',
            cookies: sessionId ?? []
        };
    }

    async login(url: IUrlBase, username: string, password: string, loginData: SsoLoginData, userCrypto: string): Promise<any> {
        let headers = {};
        if (loginData.cookies != null) {
            headers = {
                'Cookie': `SESSION=${loginData.cookies[0]}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            };
        }
        let encryptedPassword;
        let croyptoCode;
        if (userCrypto != '' && userCrypto != null) {
            encryptedPassword = password;
            croyptoCode = userCrypto;
        }
        else {
            encryptedPassword = new Croypto().aesEncrypt(loginData.crypto || '', password);
            croyptoCode = loginData.crypto;
        }


        const data = {
            username: username,
            croypto: croyptoCode,
            password: encryptedPassword,
            type: "UsernamePassword",
            _eventId: "submit",
            geolocation: "",
            execution: loginData.execution,
            captcha_code: ""
        };
        return await WebClient.post(url.sso, data, headers);
    }

    async getCookie(url: IUrlBase, username: string): Promise<{ [p: string]: string }> {
        console.log(`[${username}] Obtaining cookies part[1]`);
        const cookiesFirst = await WebClient.getHeadersCookie(url.firstCookie);
        console.log(`[${username}] Successfully obtained cookies part[1]`);
        console.log(`[${username}] Obtaining cookies part[2]`);
        const cookiesSecond = await WebClient.getJarCookie(url.secondCookie);
        console.log(`[${username}] Successfully obtained cookies part[2]`);

        let cookieDict: { [key: string]: string } = {};
        cookiesFirst.forEach(cookie => {
            let cookieSplit = cookie.split(';')[0].split('=');
            cookieDict[cookieSplit[0]] = cookieSplit[1];
        });
        cookiesSecond.forEach((value, key) => {
            let cookieSplit = value.split('=')
            cookieDict[cookieSplit[0]] = cookieSplit[1];
        });
        return cookieDict;
    }

}
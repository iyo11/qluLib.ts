import axios from "axios";
import {wrapper} from "axios-cookiejar-support";
import {CookieJar} from "tough-cookie";

export class WebClient{

    private static cookieJar = new CookieJar();
    static axiosInstance = wrapper(axios.create({
        timeout: 10000,
        jar: this.cookieJar,
    }));

    static initAxiosInstance(): void {
        this.cookieJar = new CookieJar();
        this.axiosInstance = wrapper(axios.create({
            timeout: 10000,
            jar: this.cookieJar,
        }));
    }

    static async post(url: string, data?: any, headers?: any): Promise<any> {
        let response = await this.axiosInstance.post(url, data, {
            headers: headers,
        });
        if (response.status != 200){
            console.error(`HTTP error > post url > ${url} > data ${data}`, response.status)
        }
        return response;
    }

    static async get(url: string, params?: Map<string, string> | null, headers?: any): Promise<any> {
        let paramString;
        if (params != undefined){
            paramString = this.buildParam(params);
        }
        let response = await this.axiosInstance.get(url, {
            params: paramString,
            headers: headers,
        });
        if (response.status != 200){
            console.error(`HTTP error > get url > ${url}`, response.status)
        }
        return response;
    }

    static async getHeadersCookie(url: string, params?: Map<string, string>, headers?: any): Promise<string[]> {
        let paramString;
        if (params != undefined){
            paramString = this.buildParam(params);
        }
        let response = await this.axiosInstance.get(url, {
            params: paramString,
            headers: headers,
        });
        if (response.status != 200){
            console.error(`HTTP error > get url > ${url}`, response.status)
        }
        return response.headers['set-cookie'] ?? [];
    }

    static async getJarCookie(url: string, params?: Map<string, string>, headers?: any): Promise<string[]> {
        let paramString;
        if (params != undefined){
            paramString = this.buildParam(params);
        }
        let response = await this.axiosInstance.get(url, {
            params: paramString,
            headers: headers,
        });
        if (response.status != 200){
            console.error(`HTTP error > get url > ${url}`, response.status)
        }
        const cookies = await this.cookieJar.getCookies(url);
        return cookies.map(cookie => cookie.cookieString());
    }




    static buildUrl(url: string, params: Map<string, string>): string {
        let paramString = this.buildParam(params);
        return `${url}?${paramString}`;
    }
    private static buildParam(params: Map<string, string>): string {
        let parts: string[] = [];
        params.forEach((value, key) => {
            parts.push(`${key}=${encodeURIComponent(value)}`);
        });
        return parts.join('&');
    }

}

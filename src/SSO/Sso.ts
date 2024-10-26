import { SsoApi } from "./SsoApi";
import { IUrlBase } from "../Url/IUrlBase";
import { WebClient } from "../Utils/WebClient";
import {UserProfiles} from "../UserProfiles";
import {SsoUserProfile} from "./SsoUserProfile";

export class Sso {
    async login(user: SsoUserProfile, url: IUrlBase): Promise<{ [p: string]: string }> {
        try {
            const username = user.username;
            const password = user.password;

            WebClient.initAxiosInstance();
            const ssoApi = new SsoApi();
            let loginData = await ssoApi.getSsoLoginData(url);
            console.log(`[${username}] Successfully obtained SsoLoginData`);
            const response = await ssoApi.login(url, username, password, loginData, user.crypto || '');
            if (response == null || response.status != 200) return {};
            console.log(`[${username}] Unified pass login successful`);
            console.log(`[${username}] Obtaining Cookies`);
            const cookies = await ssoApi.getCookie(url, username);
            if (cookies != null) {
                const cookie = Object.entries(cookies)
                    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
                    .join(';');
                console.log(`[${username}] Cookies=${cookie}`);
            }

            return cookies;
        } catch (e) {
            console.error(e);
        }
        return {};
    }
}
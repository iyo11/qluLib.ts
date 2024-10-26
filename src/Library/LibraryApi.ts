import { WebClient } from "../Utils/WebClient";
import { IUrlBase } from "../Url/IUrlBase";
import { Area } from "../Enum/Area";

export class LibraryApi {
    headers = {}
    constructor(cookie: string) {
        this.headers = {
            "Accept": "application/json",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "Connection": "keep-alive",
            "Cookie": cookie,
            "Host": "yuyue.lib.qlu.edu.cn",
            "Referer": "https://yuyue.lib.qlu.edu.cn/home/web/seat/area/1",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0",
            "X-Requested-With": "XMLHttpRequest",
            "sec-ch-ua": "\"Chromium\";v=\"128\", \"Not;A=Brand\";v=\"24\", \"Microsoft Edge\";v=\"128\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\""
        };
    }

    async getTimeInfo(url: IUrlBase): Promise<string[]> {
        const response = await WebClient.get(url.timeInfo, null, this.headers);
        if (response == null || response.status !== 200) return [];
        const data = await response.data;
        return data["data"]["list"]
    }

    async getAreaDays(url: IUrlBase, areaId: Area): Promise<any> {
        let areaDays: { [key: string]: string } = {};
        const response = await WebClient.get(url.areaDaysSegInfo.replace('{0}', areaId.toString()), null, this.headers);
        if (response == null || response.status !== 200) return areaDays;
        const data = await response.data;
        const list = data["data"]["list"];
        list.forEach((item: any) => {
            areaDays[item["day"]] = item["id"];
        })
        return areaDays;
    }


}
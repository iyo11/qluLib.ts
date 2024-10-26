import { IUrlBase } from "../Url/IUrlBase";
import { Area } from "../Enum/Area";
import { SeatId } from "../Enum/SeatId";
import { LibraryApi } from "./LibraryApi";
import { AreaTime } from "../Enum/AreaTime";
import { WebClient } from "../Utils/WebClient";

export class Library {

    verifyAreaSeat(area: Area, seatId: SeatId): boolean {
        return (seatId.toString().indexOf(area.toString()) != -1);
    }
    async reserve(url: IUrlBase, cookies: {
        [p: string]: string
    } | undefined, areaTime: AreaTime, area: Area, seatId: SeatId, retryTimes: number = 5): Promise<[string[], boolean]> {
        try {
            if (cookies == undefined)
                return [[], false];
            const cookie = Object.entries(cookies)
                .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
                .join(';');
            const userid = cookies['userid'];
            const accessToken = cookies['access_token'];
            const libraryApi = new LibraryApi(cookie);
            const username = cookies['user_name'];

            console.log(`[${userid}] 开始预约`);
            const times: any = await libraryApi.getTimeInfo(url);
            let day = areaTime == AreaTime.Today ? times[0]['day']['date'] : times[1]['day']['date'];
            day = day.split(' ')[0];
            console.log(`[${userid}] 预约时间 > ` + day);
            let segment = (await libraryApi.getAreaDays(url, area));
            segment = segment[day];
            const postUrl = WebClient.buildUrl(
                url.reserve.replace('{0}', seatId.toString()),
                new Map([
                    ['access_token', accessToken],
                    ['segment', segment],
                    ['userid', userid],
                    ['type', "1"]
                ])
            );

            let postHeaders: any = libraryApi.headers;
            const uri = new URL(url.reserve);
            postHeaders["Origin"] = `${uri.protocol}//${uri.hostname}`
            postHeaders['Referer'] = url.refer.replace('{0}', `${area}`).replace('{1}', segment).replace('{2}', day);

            let tryCount = 0;
            let returnArgs: string[] = [];
            let message;
            while (tryCount < retryTimes) {
                const response = await WebClient.post(postUrl, null, postHeaders);
                if (response == null || response.status != 200)
                    continue;
                const data = await response.data;
                const status = data["status"] ?? "0";
                message = data["msg"] ?? "";
                returnArgs = [userid, areaTime.toString(), area.toString(), seatId.toString(), message.toString().replace("<br/>", "\n")];
                if (status.toString() == "1") {
                    console.log(`[${userid}] ${message.toString().replace("<br/>", "\n")}`);
                    return [returnArgs, true];
                }
                console.log(`[${userid}] 预约中 重试次数[${tryCount}]\n${message}`);
                tryCount++;
            }
            console.log(`[${userid}] 预约失败\n${message}`);
            return [returnArgs, false];
        } catch (e) {
            console.error(`[ReserveException] ${e}`);
            return [[], false];
        }
    }

}
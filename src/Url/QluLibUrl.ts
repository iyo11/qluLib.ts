import { WebClient } from "../Utils/WebClient";
import { IUrlBase } from "./IUrlBase";

export class QluLibUrl implements IUrlBase {
    sso = "https://sso.qlu.edu.cn/login";
    service = "https://yuyue.lib.qlu.edu.cn/cas/index.php?callback=https://yuyue.lib.qlu.edu.cn/home/web/seat/area/1";
    secondCookie = "https://yuyue.lib.qlu.edu.cn/home/web/seat/area/1";
    timeInfo = "https://yuyue.lib.qlu.edu.cn/api.php/areadays/1";
    areaDaysSegInfo = "https://yuyue.lib.qlu.edu.cn/api.php/areadays/{0}";
    areaReservationInfo = "https://yuyue.lib.qlu.edu.cn/api.php/spaces_old";
    reserve = "https://yuyue.lib.qlu.edu.cn/api.php/spaces/{0}/book";
    refer = "https://yuyue.lib.qlu.edu.cn/web/seat3?area={0}&segment={1}&day={2}&startTime=08:30&endTime=22:00";
    firstCookie = WebClient.buildUrl(this.sso, new Map<string, string>([
        ['service', this.service],
    ]));
}

import { AreaTime } from "./Enum/AreaTime";
import { Area } from "./Enum/Area";
import { SeatId } from "./Enum/SeatId";
import { SsoUserProfile } from "./SSO/SsoUserProfile";

export class UserProfiles {
    users: SsoUserProfile[] = [
        {
            username: "",
            password: "",
            areaTime: AreaTime.Tomorrow,
            area: Area.六楼东,
            seatId: SeatId.六楼东002,
        },
        {
            username: "",
            password: "",
            areaTime: AreaTime.Tomorrow,
            area: Area.六楼东,
            seatId: SeatId.六楼东001,
        }
    ]
}
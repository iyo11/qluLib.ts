import { Area } from "../Enum/Area";
import { AreaTime } from "../Enum/AreaTime";
import { SeatId } from "../Enum/SeatId";

export class SsoUserProfile {
    username!: string;
    password!: string;
    area!: Area;
    areaTime!: AreaTime;
    seatId!: SeatId;
    cookies?: { [p: string]: string };
    verified?: boolean;
    crypto?: string;
}
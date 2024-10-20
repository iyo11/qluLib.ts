import {SsoUserProfile} from "./SSO/SsoUserProfile";
import fs from "fs";
import {Library} from "./Library/Library";
import {QluLibUrl} from "./Url/QluLibUrl";

const library = new Library();
const url = new QluLibUrl();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
fs.readFile('Data/cache',"utf-8",
    (async (err, data) => {
        if (err)
            console.log(err);
        else {
            const users: SsoUserProfile[] = JSON.parse(data.trim());
            for (const user of users) {
                const result = await library.reserve(url, user.cookies, user.areaTime, user.area, user.seatId);
            }
            if (!fs.existsSync('Data/cache')){
                fs.writeFile('Data/cache', '',
                    (err => {
                        if (err)
                            console.log(err);
                    }))
            }
        }
    }));
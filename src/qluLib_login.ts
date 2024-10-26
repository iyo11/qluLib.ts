import { Sso } from "./SSO/Sso";
import { QluLibUrl } from "./Url/QluLibUrl";
import { SsoUserProfile } from "./SSO/SsoUserProfile";
import fs from "fs";
import { UserProfiles1 } from "./UserProfiles1";

const sso = new Sso();
const url = new QluLibUrl();
const userProfiles = new UserProfiles1();

let users: SsoUserProfile[] = userProfiles.users;

const p = new Promise(async resolve => {
    for (let i = 0; i < users.length; i++) {
        users[i].cookies = await sso.login(users[i], url);
    }
    resolve(true);
})

p.then(() => {
    if (!fs.existsSync('Data/'))
        fs.mkdirSync('Data/');
    fs.writeFile('Data/cache', JSON.stringify(users),
        (err => {
            if (err)
                console.log(err);
        }))
})





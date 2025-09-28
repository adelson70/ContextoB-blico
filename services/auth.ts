import { expireInMs } from "@/util/jwt.util"

export function teste() {
    console.log('teste', process.env.JAT_EXPIRE)
    // expireInMs(process.env.JAT_EXPIRE || '')
}

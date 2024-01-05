import { Redis } from "@upstash/redis";

export function getRedisCred(){
    const URL = process.env.UPSTASH_REDIS_REST_URL
    const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

    if(!URL || URL.length == 0) throw new Error("Redis url not specified")
    if(!TOKEN || TOKEN.length == 0) throw new Error("Redis url not specified")

    return {URL,TOKEN}
}

const {URL,TOKEN} = getRedisCred()

export const redis = new Redis({
    url:URL,
    token:TOKEN
})

export async function getUserbyEmail(email:string){
    const id = await redis.get(`user:email:${email}`)
    if(id){
        return await redis.get(`user:${id}`)
    }

}
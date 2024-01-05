import { authOptions } from "@/lib/authOptions";
import { redis } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request){
    const session = await getServerSession(authOptions);
    if(!session) return NextResponse.json({error:"Unauthorized"},{status: 401});

    const {id} = await req.json();
    if(!id) return NextResponse.json({error:"Invalid id"},{status:400});

    //check if user exists and  has friend request
    if(await redis.get(`user:${id}`) && await redis.sismember(`user:${session.user.id}:incommingFriendRequests`,id) ){
        //add friend request
        await redis.sadd(`user:${session.user.id}:Friends`,id)
        await redis.sadd(`user:${id}:Friends`,session.user.id)
        //remove friend request 
        await redis.srem(`user:${session.user.id}:incommingFriendRequests`,id)

        await redis.publish('Friends',`${session.user.id}:accepted:${id}`)

        return NextResponse.json({success:'success'},{status:200});

    }
    return NextResponse.json({error:"Invalid"},{status:400})
}
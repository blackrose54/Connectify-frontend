import { authOptions } from "@/lib/authOptions";
import { getUserbyEmail, redis } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    const session = await getServerSession(authOptions);
    if(!session) return NextResponse.json({error: "Invalid session"},{status:401});
    const {email} = await req.json();
    //check if sending to itself
    if(email === session.user.email) return NextResponse.json({error:"Cannot send to yourself"},{status:400});
    //check if the email exists
    if(!await redis.get(`user:email:${email}`)) return NextResponse.json({error: "Invalid user"},{status:404})
    //check if already friends
    const {id}= await getUserbyEmail(email) as {id:string} 
    const friends = await redis.sismember(`user:${id}:Friends`,session.user.id)
    if(friends) return NextResponse.json({error: "Already friends"},{status:404})
    //check if already sent friend request
    const request = await redis.sismember(`user:${id}:incommingFriendRequests`,session.user.id)
    if(request) return NextResponse.json({error: "Friend Request Already sent"},{status:404})

    //add to the list of friend requests
    redis.sadd(`user:${id}:incommingFriendRequests`,session.user.id).then((res)=>{
        if(res){
            redis.publish("FriendRequests",JSON.stringify({from:session.user.id,to:id}))
        }
    });
    
    return NextResponse.json({success: "ok"},{status:200})
}
import { authOptions } from "@/lib/authOptions";
import { redis } from "@/lib/db";
import { User, getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import  genQueryString  from "@/lib/utils";

export async function POST(req:Request){
    const session = await getServerSession(authOptions);
    if(!session) return NextResponse.json({err:"Invaid session"},{status:401})

    const body = await req.json();
    if(!body || !body?.current) return NextResponse.json({err:"Invalid body"},{status:400})

    const current = body.current as User;
   
    //remove Friends;
    const res = await redis.srem(`user:${session.user.id}:Friends`,current.id)
    const res1 = await redis.srem(`user:${current.id}:Friends`,session.user.id)
    const reschat = await redis.del(genQueryString(session.user.id,current.id))
    if((res && res1) || reschat)  return NextResponse.json({success:'ok'});
    return NextResponse.json({err:"Something went wrong!"},{status:500})
}
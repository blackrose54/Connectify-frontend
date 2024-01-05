import { authOptions } from "@/lib/authOptions";
import { redis } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import  genQueryString  from "@/lib/utils";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ err: "invalid session" }, { status: 401 });
  try {
    const body:Record<string,number>|null = await req.json();
  
    if (!body)
      return NextResponse.json({ err: "invalid data" }, { status: 400 });

    for(let key in body) {
      redis.zadd(genQueryString(key, session.user.id), {
        score: body[key],
        member: "unread",
      }).catch(err=>console.log(err));
    };
    return NextResponse.json({success:'ok'});

  } catch (error) {
    console.log(error);
    return NextResponse.json({ err: "Something went wrong" }, { status: 500 });
  }
}

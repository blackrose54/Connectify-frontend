import { Message } from "@/context/SocketProvider";
import { authOptions } from "@/lib/authOptions";
import { redis } from "@/lib/db";
import  genQueryString  from "@/lib/utils";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ err: "Invalid session" }, { status: 401 });

  const data = await req.json();
  if (!data || !data.page || !data.friendID)
    return NextResponse.json({error:"Invalid request"}, { status: 400 });

  try {
    const pageParam = data.page as number;
    const noOfMessage = 5;
    const chats = (await redis.zrange(genQueryString(session.user.id, data.friendID),
      (pageParam - 1) * noOfMessage,
      pageParam * noOfMessage - 1,
      {
        rev: true,
      }
    )) as Message[];

    return NextResponse.json(JSON.stringify(chats.reverse()));
  } catch (error) {
    console.log(error);
    return NextResponse.json({ err: "Something went wrong" }, { status: 400 });
  }
}


import SocketProvider, { Message } from "@/context/SocketProvider";
import { authOptions } from "@/lib/authOptions";
import { redis } from "@/lib/db";
import { getServerSession, User } from "next-auth";
import { redirect } from "next/navigation";
import React, { FC } from "react";
import  genQueryString from "@/lib/utils";

interface layoutProps {
  children: React.ReactNode;
}

const layout: FC<layoutProps> = async ({ children }) => {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/login");

  //fetch all friend requests
  const friendRequestIDs = await redis.smembers(
    `user:${session.user.id}:incommingFriendRequests`
  );
  //convert id to user
  let friendRequests: User[] = await Promise.all(
    friendRequestIDs.map(async (req, key): Promise<User> => {
      return (await redis.get(`user:${req}`)) as User;
    })
  );
  //fetch all friends
  const friendIDs = await redis.smembers(`user:${session.user.id}:Friends`);
  let friends: User[] = await Promise.all(
    friendIDs.map(async (friend): Promise<User> => {
      return (await redis.get(`user:${friend}`)) as User;
    })
  );

  //fetch initial messages
  const pageParam = 1;
  const ChatMap = new Map<string, Message[]>();
  const noOfMessages = 20;
  let unread = new Map<string,number>();
  await Promise.all(
    friendIDs.map(async (id) => {
      const chats = (await redis.zrange(        
        genQueryString(session.user.id, id),
        (pageParam - 1) * noOfMessages,
        pageParam * noOfMessages - 1,{
          rev:true
        }
      )) as Message[];
      ChatMap.set(id, chats.reverse());

      unread.set(id,Number(await redis.zscore(genQueryString(session.user.id,id),'unread')))
    })
  );

  let Recents = new Map<string,number>();;
    ChatMap.forEach((messages,userid)=>{
        const recent = messages.at(-1);
        if(recent && recent.timestamp) Recents.set(userid,recent.timestamp);
        else Recents.set(userid,0); 
    })
// Sort by values
    const sortedEntries = Array.from(Recents.entries()).sort((a,b)=>b[1]-a[1]);

  return (
    <>

      <SocketProvider
        session={session}
        friendRequests={friendRequests}
        friends={friends}
        chat={ChatMap}
        unread={unread}
        recents={Recents}
      >
        {children}
      </SocketProvider>
    </>
  );
};

export default layout;

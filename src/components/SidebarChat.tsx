"use client";

import { useSocket } from "@/context/SocketProvider";
import Image from "next/image";
import React, { FC, useEffect } from "react";

interface ChatProps {}

const Chat: FC<ChatProps> = ({}) => {
  const {
    Friends,
    current,
    setCurrent,
    chats,
    Unread,
    setUnread,
    online,
    Recents,
  } = useSocket();
  const sortedEntries = Array.from(Recents.entries()).sort(
    (a, b) => b[1] - a[1]
  );
  
    useEffect(()=>{
      fetch("/api/chats/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.fromEntries(Unread.entries())),
      });
    },[Unread])

  return (
    <div className="containerCustom grow">
      <p className="text-lg border-b-2 p-2">Chats</p>

      {sortedEntries.map((entry, key) => {
        const friend = Friends.find((friend) => friend.id === entry[0]);
        if (!friend) return <></>;
        return (
          <div
            key={key}
            className={`${
              current === friend ? "bg-slate-200" : ""
            } flex space-x-4 items-center cursor-pointer hover:bg-slate-200 p-4 border-b-2`}
            onClick={async () => {
              if (current) {
                console.log('current')
                setUnread((prev: Map<string, number>) => {
                  const newMap = new Map(prev);
                  newMap.set(current.id, 0);
                  return newMap;
                });
              } else {
                setUnread((prev: Map<string, number>) => {
                  const newMap = new Map(prev);
                  newMap.set(friend.id, 0);
                  return newMap;
                });
              }
              setCurrent(friend);

              
            }}
          >
            <div
            key={friend.id}
              className={`${
                online && online.has(friend.id) && online.get(friend.id) == true
                  ? "image-container-online"
                  : "image-container-offline"
              }  h-10 w-10`}
            >
              <Image
                src={friend.image!}
                alt="avatar"
                fill
                className={`rounded-full after:bg-white ring-2 ${
                  online &&
                  online.has(friend.id) &&
                  online.get(friend.id) == true
                    ? "ring-green-400"
                    : "ring-slate-300"
                }`}
              />
            </div>
            <div key={friend.id + key}>
              <p>{friend.name}</p>
              <p className="text-xs text-slate-400">
                {chats.get(friend.id)?.at(-1) ? (
                  <>{chats.get(friend.id)?.at(-1)?.message}</>
                ) : (
                  <></>
                )}
              </p>
            </div>

            <p>
              {current &&
              chats.get(friend.id)?.at(-1)?.userID === friend.id &&
              friend.id != current.id ? (
                Unread.get(friend.id) === 0 ? (
                  <></>
                ) : (
                  <p className="bg-indigo-400 text-white h-6 w-6 text-center rounded-full">
                    {Unread.get(friend.id)}
                  </p>
                )
              ) : (
                <></>
              )}
            </p>

            {!current && chats.get(friend.id)?.at(-1)?.userID === friend.id ? (
              Unread.get(friend.id) === 0 ? (
                <></>
              ) : (
                <p className="bg-indigo-400 text-white h-6 w-6 text-center rounded-full">
                  {Unread.get(friend.id)}
                </p>
              )
            ) : (
              <></>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Chat;

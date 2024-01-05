"use client";
import { Message, useSocket } from "@/context/SocketProvider";
import { Session, User } from "next-auth";
import React, { FC, useCallback, useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import spinner from "@/assets/icons/spinner.svg";
import { Skeleton } from "@/components/ui/Skeleton";

import Image from "next/image";

interface MessageProps {
  session: Session;
  msg: boolean;
}

function formatTimestamp(timestamp: number) {
  if(!timestamp) return "";

  const date = new Date(timestamp);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const amPm = hours >= 12 ? "PM" : "AM";

  // Convert hours to 12-hour format
  hours = hours % 12 || 12;

  // Add leading zero to minutes if necessary
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  // Construct the formatted timestamp
  const formattedTimestamp = `${hours}:${formattedMinutes} ${amPm}`;

  return formattedTimestamp;
}

function formatTimestampToddmmyy(timestamp:number):string {
  const date = new Date(timestamp);
  
  // Format day with leading zero if necessary
  const day = ("0" + date.getDate()).slice(-2);
  
  // Get the month name
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const month = monthNames[date.getMonth()];

  // Get the year
  const year = date.getFullYear();

  // Construct the formatted timestamp
  const formattedTimestamp = `${day} ${month} ${year}`;

  return formattedTimestamp;
}

const Messages: FC<MessageProps> = ({ session, msg: message }) => {
  const { chats, current, setChats } = useSocket();
  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  const fetchMessages = async ({
    pageParam,
    current,
  }: {
    pageParam: number;
    current: User;
  }): Promise<Message[]> => {
    const response = await fetch("/api/chats", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        page: pageParam,
        friendID: current.id,
      }),
    });
    if (response.ok) {
      return JSON.parse(await response.json());
    } else throw new Error("Invalid");
  };

  const {
    data,
    status,
    fetchNextPage,
    isFetchingNextPage,
    error,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["query"],
    queryFn: ({ pageParam }) => fetchMessages({ pageParam, current: current! }),
    getNextPageParam: (hi, pages) => {
      return pages.length + 1;
    },
    initialPageParam: 2,
  });

  const loadMore = useCallback(() => {
    if (hasNextPage)
      fetchNextPage().then((res) => {
        setChats((prev: Map<string, Message[]>) => {
          const newMap = new Map(prev);
          if (newMap.has(current!.id)) {
            const prevMessages = newMap.get(current!.id)!;
            res.data!.pages.forEach((page) => {
              newMap.set(current!.id, [...page, ...prevMessages]);
            });
          }
          return newMap;
        });
      });
    else console.log("No messages");
  }, [current, fetchNextPage, hasNextPage, setChats]);

  useEffect(() => {
    if (inView) {
      loadMore();
    }
  }, [inView, loadMore]);

  useEffect(() => {
    if (lastRef.current)
      lastRef.current.scrollIntoView({ behavior: "instant" });
  }, [current, status, message]);

  const lastRef = useRef<HTMLDivElement>(null);

  if (!current) return <></>;
  if (status === "pending")
    return (
      <>
        <Skeleton
          id="left"
          className="w-[10rem] h-10  rounded-lg rounded-tl-none mt-2"
        />
        <Skeleton
          id="right"
          className="w-[10rem] self-end h-10  rounded-lg rounded-tr-none mt-2"
        />
        <Skeleton
          id="left"
          className="w-[10rem] h-10  rounded-lg rounded-tl-none mt-2"
        />
        <Skeleton
          id="left"
          className="w-[16rem] h-10  rounded-lg rounded-tl-none mt-2"
        />
        <Skeleton
          id="right"
          className="w-[10rem] self-end h-10  rounded-lg rounded-tr-none mt-2"
        />
        <Skeleton
          id="right"
          className="w-[16rem] self-end h-10  rounded-lg rounded-tr-none mt-2"
        />
        <Skeleton
          id="right"
          className="w-[5rem] self-end h-10  rounded-lg rounded-tr-none mt-2"
        />
        <Skeleton
          id="left"
          className="w-[16rem] h-10  rounded-lg rounded-tl-none mt-2"
        />
        <Skeleton
          id="right"
          className="w-[5rem] self-end h-10  rounded-lg rounded-tr-none mt-2"
        />
      </>
    );
  if (status === "error") return <>{error.message}</>;

  return (
    <>
      <div ref={ref}></div>

      {isFetchingNextPage && (
        <div className=" self-center">
          <Image
            src={spinner}
            alt="Loading Previous Chats...."
            width={40}
            height={40}
          />
        </div>
      )}
      {Array.from(chats).map(([partnerID, value], key1) => {
        if (partnerID === current!.id) {
          let prev:number|null = null
          const res =  value.map((msg, key) => {
            if(!(msg instanceof Object)) return <></>
             const currentDate = (new Date(msg.timestamp)).getDate();
            const ele = (
              <>
              {prev && prev !== currentDate ? (<div className="self-center my-2 border-2 py-1 px-6 rounded-md bg-orange-100">{formatTimestampToddmmyy(msg.timestamp)}</div>):(<></>) }
              {!prev?<div className="self-center my-2 border-2 py-1 px-6 rounded-md bg-orange-100">{formatTimestampToddmmyy(msg.timestamp)}</div>:<></>}
              <div
                className={`border-2 w-fit p-2 mb-1 rounded-md flex ${
                  msg.userID === session.user.id
                    ? "self-end rounded-tr-none bg-indigo-400 text-white border-none"
                    : "rounded-tl-none "
                }`}
                key={key1 + key}
              >
                <p className="pr-10">{msg.message}</p>
                <p
                  className={`text-xs text-slate-300 self-end`}
                >
                  {formatTimestamp(msg.timestamp)}
                </p>
              </div>
              </>
            );
                prev = currentDate
                return ele;
          });
          return res;
        } else return <></>;
      })}

      <div ref={lastRef}></div>
    </>
  );
};

export default Messages;

"use client";

import { useSocket } from "@/context/SocketProvider";
import * as Accordion from "@radix-ui/react-accordion";
import { Check, ChevronUp, X } from "lucide-react";
import React, { FC, ReactElement, useState } from "react";
import toast from "react-hot-toast";

interface FriendRequestsProps {}

const FriendRequests: FC<FriendRequestsProps> = ({}): ReactElement => {
  const { FriendRequests,setFriendRequests ,setRecents} =    useSocket();
  const [up, setup] = useState<boolean>(true);
  
  async function handleAdd(id:string){
    const res = await fetch('/api/friends/accept',{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id})
    })
    if(res.ok){
        toast.success("Added friend")
        setFriendRequests(FriendRequests.filter((req)=>req.id !== id))
        setRecents((prev:Map<string,number>)=>{
          const newMap = new Map(prev);
          newMap.set(id,10**15);
          return newMap;
        })
        
    }else{
        console.log((await res.json()).error)
        toast.error("Something went wrong!")
    }
  }
  async function handleDelete(id:string){
    const res = await fetch('/api/friends/deny',{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id})
    })
    if(res.ok){
        toast.success("Denied Friend Request")
        setFriendRequests(FriendRequests.filter((req)=>req.id !== id))
    }else{
        toast.error("Something went wrong!")
    }
  }
  return (
    <Accordion.Root type="single" collapsible className="">
      <Accordion.Item value="firend" className="">
        <Accordion.Trigger
          className="w-full flex justify-between items-center p-2 border-b-2"
          onClick={() => setup(!up)}
        >
          <p>Friend Requests</p>
          <span className="ml-auto rounded-full w-6 bg-indigo-400 text-white">
            {FriendRequests.length}
          </span>
          <ChevronUp
            className={`ml-4 ease-in-out transition-transform duration-300 ${
              up ? "" : "rotate-180"
            }`}
          />
        </Accordion.Trigger>
        <Accordion.Content className="  ">
          {FriendRequests.map((request, key) => {
            return (
              <div
                key={key}
                className=" border-b-2 py-2 px-4 flex justify-between items-center"
              >
                <div>
                  <p>{request?.name || request.email?.split("@")[0]}</p>
                  <p className="text-[12px] text-slate-400"> {request.email}</p>
                </div>
                <div className="flex space-x-4">
                  <Check
                    className="cursor-pointer hover:bg-slate-200 rounded-full p-1 active:scale-95 text-green-500"
                    width={35}
                    height={35}
                    onClick={()=>handleAdd(request.id)}
                  />
                  <X
                    className="cursor-pointer hover:bg-slate-200 rounded-full p-1 active:scale-95 text-red-500"
                    width={35}
                    height={35}
                    onClick={()=>handleDelete(request.id)}
                  />
                </div>
              </div>
            );
          })}
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
};

export default FriendRequests;

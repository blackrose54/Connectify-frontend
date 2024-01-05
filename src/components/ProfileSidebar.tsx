"use client";
import { Loader2, MoreVertical, ToggleLeft, ToggleRight, Trash2,UserMinus, X } from "lucide-react";
import { Session, User } from "next-auth";
import Image from "next/image";
import React, { FC, ReactElement, useState } from "react";
import { space_Grotesk } from "@/lib/fonts";
import avatar from "@/assets/icons/avatar.svg";
import { Message, useSocket } from "@/context/SocketProvider";
import toast from "react-hot-toast";
import { Router } from "next/router";

interface ProfileSidebarProps {
  sidePanel: boolean;
  setsidePanel: Function;
}

const ProfileSidebar: FC<ProfileSidebarProps> = ({
  sidePanel,
  setsidePanel,
}): ReactElement => {
  const [Notifications, setNotifications] = useState<boolean>(true);
  const [DeleteLoading,setDeleteLoading] = useState<boolean>(false);
  const [RemoveLoading,setRemoveLoading] = useState<boolean>(false);
  const { current, online,setCurrent,setRecents,setChats } = useSocket();
  if (!current) return <></>;
  return (
    <div className={`h-full border-l-2 w-[25%] z-50 ${sidePanel ? "" : "hidden"}`}>
      <nav className="flex items-center h-20 p-4 border-b-2">
        <button
          className="active:scale-95 hover:bg-slate-200  p-1 rounded-full me-4 "
          onClick={() => setsidePanel(false)}
        >
          <X className=" text-indigo-400 " />
        </button>
        <div>
          <h1 className="font-semibold text-center">Contact Information</h1>
          <p className="text-[10px] text-slate-400">{`${
            current.name?.split(" ")[0]
          }'s Contact Information`}</p>
        </div>
        
      </nav>
      <div className="p-8 text-center border-b-2 ">
        <Image
          src={current.image || avatar}
          alt="avatar"
          width={100}
          height={100}
          className={`m-auto rounded-full ring-8 ${
            online && online.has(current.id) && online.get(current.id) == true
              ? "ring-green-400"
              : "ring-slate-300"
          }`}
        />
        <p className={"font-bold text-xl mt-2 " + space_Grotesk.className}>
          {current.name}
        </p>
        <p className={"text-sm text-slate-400 " + space_Grotesk.className}>
          {current.email}
        </p>
      </div>

     
      <div className="flex space-x-4 border-b-2 hover:bg-slate-200 hover:cursor-pointer text-red-700 text-xl p-4"
      onClick={async ()=>{
        setRemoveLoading(true);
        const res= await fetch('/api/friends/remove',{
          method: 'POST',
          headers:{
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({current})
        })
        setRemoveLoading(false);
        if(res.ok) {
          toast.success(`Removed ${current.name}`)
          setRecents((prev:Map<string,number>)=>{
            const newMap = new Map(prev);
            newMap.delete(current.id)
            return newMap;
          })
          setChats((prev:Map<string,Message[]>)=>{
            const newMap = new Map(prev);
            newMap.delete(current.id)
            return newMap;
          })
          setCurrent(null);


          
        }

      }
    }
      >
      {RemoveLoading?<Loader2 className="animate-spin"/>:<UserMinus />}
        <p>Remove Friend</p>
      </div>
     
    </div>
  );
};

export default ProfileSidebar;

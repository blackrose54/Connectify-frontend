import { Session, User } from "next-auth";
import { MoreVertical, LogOut, Search } from "lucide-react";
import Image from "next/image";
import React, { FC, ReactElement } from "react";
import { space_Grotesk } from "@/lib/fonts";
import AddFriendSearchBar from "./AddFriendSearchBar";
import LogOutButton from "./LogOutButton";
import FriendRequests from "./FriendRequests";
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/Dropdown";
import Chat from "./SidebarChat";

interface SideBarProps {
  session: Session;
  setsidePanel: (a: boolean) => any;
  
}

const SideBar: FC<SideBarProps> = ({ session, setsidePanel }): ReactElement => {
  return (
    <div className="h-full w-[25vw] border-r-2 flex flex-col ">
      <nav className="flex items-center justify-between border-b-2 p-4 h-20">
        <Image
          src={session.user.image!}
          alt="avatar"
          width={40}
          height={40}
          className="me-3 rounded-full overflow-clip cursor-pointer"
        />
        <h1
          className={
            "me-auto font-semibold text-2xl " + space_Grotesk.className
          }
        >
          {session.user.name}
        </h1>
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full border-0 p-1 hover:bg-slate-200 outline-none  ">
            <MoreVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white space-y-2 ">
            <DropdownMenuLabel >Settings</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-400" />
            
            <DropdownMenuItem className="h-8 cursor-pointer flex justify-between items-center px-2">
              <LogOutButton />
            </DropdownMenuItem>
           
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
      <section className="grow flex flex-col">
        <div className="p-6 border-b-2">
          <AddFriendSearchBar />
        </div>
        <FriendRequests />
        <Chat />
      </section>
      
    </div>
  );
};

export default SideBar;

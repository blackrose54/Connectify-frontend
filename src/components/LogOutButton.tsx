"use client";

import { Loader2, LogOut } from "lucide-react";
import React, { FC, ReactElement, useState } from "react";
import Button from "./ui/Button";
import { signOut } from "next-auth/react";

interface LogOutButtonProps {

}

const LogOutButton: FC<LogOutButtonProps> = ({}): ReactElement => {
    const [loading, setLoading] = useState<boolean>(false)
  return (
    <Button className="p-1 w-full bg-transparent flex justify-between items-center text-slate-800 hover:bg-inherit" onClick={async ()=>{
        setLoading(true);
        await signOut();
        
    }}>
      {loading?<Loader2 className="animate-spin" />:<><p className="text-sm">Sign Out</p> <LogOut width={20} height={20} /></>}
    </Button>
  );
};

export default LogOutButton;

"use client";

import { Loader2, Search } from "lucide-react";
import React, { FC, ReactElement, FormEvent, useState } from "react";
import toast from "react-hot-toast";

interface AddFriendSearchBarProps {}

const AddFriendSearchBar: FC<AddFriendSearchBarProps> = ({}): ReactElement => {
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setemail] = useState<string>("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    
    e.preventDefault();
    if (!email) return toast.error("Email is required");
    setLoading(true);
    const response = await fetch("/api/friends/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    if(response.ok){
        toast.success('Sent friend request successfully')
    }else{
        toast.error((await response.json()).error)
    }
    setLoading(false);

  }
  return (
    <form
      className="border-2 flex items-center px-4 rounded-md "
      onSubmit={handleSubmit}
    >
      {loading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <Search className="hover:cursor-pointer hover:scale-110 active:scale-95 text-slate-500" />
      )}
      <input
        type="email"
        name="search"
        id="search"
        placeholder="Add friends"
        className="w-full focus:outline-none p-2 bg-transparent"
        value={email}
        onChange={(e) => setemail(e.target.value)}
      />
    </form>
  );
};

export default AddFriendSearchBar;

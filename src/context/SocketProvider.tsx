"use client";

import { Session, User } from "next-auth";
import React, {
  FC,
  ReactElement,
  useEffect,
  useContext,
  useCallback,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Check, X } from "lucide-react";
import { redirect } from "next/navigation";

interface SocketProviderProps {
  children: React.ReactNode;
  session: Session;
  friendRequests: User[];
  friends: User[];
  chat: Map<string, Message[]>;
  unread: Map<string, number>;
  recents: Map<string, number>;
}

interface SocketContext {
  FriendRequests: User[];
  Friends: User[];
  current: User | null;
  chats: Map<string, Message[]>;
  Unread: Map<string, number>;
  online: Map<string, boolean> | undefined;
  Recents: Map<string, number>;
  setRecents: Function;
  setOnline: Function;
  setUnread: Function;
  setChats: Function;
  setCurrent: Function;
  sendMessage: (message: Message) => any;
  setFriendRequests: (request: any) => any;
  setFriends: (request: any) => any;
}

export interface Message {
  message: string;
  partnerID: string;
  userID: string;
  timestamp: number;
}

const SocketContext = React.createContext<SocketContext | null>(null);

export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) throw new Error(`state is undefined`);

  return state;
};

const SocketProvider: FC<SocketProviderProps> = ({
  children,
  session,
  friendRequests,
  friends,
  chat,
  unread,
  recents,
}): ReactElement => {
  const [FriendRequests, setFriendRequests] = useState<User[]>(friendRequests);
  const [Friends, setFriends] = useState<User[]>(friends);
  const [socket, setSocket] = useState<Socket>();
  const [current, setCurrent] = useState<User | null>(null);
  const [chats, setChats] = useState<Map<string, Message[]>>(chat);
  const [Unread, setUnread] = useState<Map<string, number>>(unread);
  const [online, setOnline] = useState<Map<string, boolean>>();
  const [Recents, setRecents] = useState<Map<string, number>>(recents);

  async function handleAdd(id: string) {
    const res = await fetch("/api/friends/accept", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      toast.success("Added friend");
      setFriendRequests(FriendRequests.filter((req) => req.id !== id));
      setRecents((prev: Map<string, number>) => {
        const newMap = new Map(prev);
        newMap.set(id, 10 ** 15);
        return newMap;
      });
    } else {
      console.log((await res.json()).error);
      toast.error("Something went wrong!");
    }
  }
  async function handleDelete(id: string) {
    const res = await fetch("/api/friends/deny", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      toast.success("Denied Friend Request");
      setFriendRequests(FriendRequests.filter((req) => req.id !== id));
    } else {
      toast.error("Something went wrong!");
    }
  }

  const sendMessage = useCallback(
    (message: Message) => {
      if (socket) {
        socket.emit("event:Message", message);
        setChats((prev) => {
          const newMap = new Map(prev);
          const prevMessages = newMap.get(message.partnerID)!;
          if (!prevMessages) newMap.set(message.partnerID, [message]);
          else newMap.set(message.partnerID, [...prevMessages, message]);
          return newMap;
        });
        setRecents((prev) => {
          const newMap = new Map(prev);
          newMap.set(message.partnerID, message.timestamp);
          return newMap;
        });
        // Unread.set(message.partnerID,0)
      }
    },
    [socket]
  );

  const onMessageRec = useCallback((message: Message) => {
    setChats((prev) => {
      const newMap = new Map(prev);
      const prevMessages = newMap.get(message.userID)!;
      if(!prevMessages) newMap.set(message.userID,[message]);
      else newMap.set(message.userID, [...prevMessages, message]);
      return newMap;
    });
    setUnread((prev: Map<string, number>) => {
      const newUnread = new Map<string, number>(prev);
      const u = newUnread.get(message.userID)!;
      if(!u) newUnread.set(message.userID,1);
      else newUnread.set(message.userID, u + 1);
      return newUnread;
    });
    setRecents((prev) => {
      const newMap = new Map(prev);
      newMap.set(message.userID, message.timestamp);
      return newMap;
    });
  }, []);

  const onFriendRequestRec = useCallback((msg: string) => {
    const data = JSON.parse(msg) as User;
    setFriendRequests((prev) => [...prev, data]);
    toast.custom(
      <div className="shadow-lg bg-white rounded-lg border-2 py-2 px-4 space-y-4">
        <h1 className="text-4xl text-center font-bold">Friend Request From</h1>
        <div className=" flex justify-between items-center">
          <div>
            <p>{data.name || data.email?.split("@")[0]}</p>
            <p className="text-[12px] text-slate-400"> {data.email}</p>
          </div>
          <div className="flex space-x-4">
            <Check
              className="cursor-pointer hover:bg-slate-200 rounded-full p-1 active:scale-95 text-green-500"
              width={35}
              height={35}
              onClick={() => handleAdd(data.id)}
            />
            <X
              className="cursor-pointer hover:bg-slate-200 rounded-full p-1 active:scale-95 text-red-500"
              width={35}
              height={35}
              onClick={() => handleDelete(data.id)}
            />
          </div>
        </div>
      </div>
    );
  }, []);

  const onFriendAddRec = useCallback((msg: string) => {
    const data = JSON.parse(msg) as User;
    setFriends((prev) => [...prev, data]);
    setRecents((prev: Map<string, number>) => {
      const newMap = new Map(prev);
      newMap.set(data.id, 10 ** 15);
      return newMap;
    });
  }, []);

  const onOnlineRec = useCallback((msg: string) => {
    setOnline((prev) => {
      const newRec = new Map(prev);
      if (newRec) {
        newRec.set(msg, true);
      }
      console.log(newRec);
      return newRec;
    });
  }, []);
  const onOfflineRec = useCallback((msg: string) => {
    setOnline((prev) => {
      const newRec = new Map(prev);
      if (newRec) {
        newRec.set(msg, false);
      }
      console.log(newRec);
      return newRec;
    });
  }, []);

  useEffect(() => {
    const _socket = io("https://connectify-backend-4xiz.onrender.com", {
      auth: {
        token: session.user.id,
      },
    });
    _socket.on("message", onMessageRec);
    _socket.on("friendRequest", onFriendRequestRec);
    _socket.on("friendAdd", onFriendAddRec);
    _socket.on("online", onOnlineRec);
    _socket.on("offline", onOfflineRec);

    // _socket.emit("event:online", Friends);

    // _socket.on("disconnect",()=>alert('disconencted'))

    setSocket(_socket);

    //fetch all initial messages

    return () => {
      _socket.off("message", onMessageRec);
      _socket.off("friendRequest", onFriendRequestRec);
      _socket.off("friendAdd", onFriendAddRec);
      _socket.disconnect();
      setSocket(undefined);
    };
  }, []);

  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <SocketContext.Provider
        value={{
          chats,
          setChats,
          sendMessage,
          FriendRequests,
          setFriendRequests,
          Friends,
          setFriends,
          current,
          setCurrent,
          Unread,
          setUnread,
          online,
          setOnline,
          Recents,
          setRecents,
        }}
      >
        {children}
      </SocketContext.Provider>
    </QueryClientProvider>
  );
};

export default SocketProvider;

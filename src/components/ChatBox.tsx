"use client";

import { Session, User } from "next-auth";
import Image from "next/image";
import { Message, useSocket } from "@/context/SocketProvider";
import React, {
  FC,
  FormEvent,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";
import TextareaAutosize from "react-textarea-autosize";
import EmojiPicker, { EmojiClickData, EmojiStyle } from "emoji-picker-react";
import send from "@/assets/icons/send.svg";
import avatar from "@/assets/icons/avatar.svg";
import { Smile } from "lucide-react";
import { space_Grotesk } from "@/lib/fonts";
import Messages from "./Messages";
import useOutsideClick from "@/hooks/outsideClick";

interface ChatBoxProps {
  chatPartner: Session;
  session: Session;
  setsidePanel: (a: boolean) => any;
}

const ChatBox: FC<ChatBoxProps> = ({
  chatPartner,
  session,
  setsidePanel,
}): ReactElement => {
  const { sendMessage, current,online} = useSocket();
  const [message, setMessage] = useState("");
  const [rows, setRows] = useState<number>(1);
  const [submit, setsubmit] = useState<boolean>(false);
  const box = useRef<HTMLDivElement>(null)
  const [isClicked,setisClicked]= useOutsideClick(box)

  const formRef = useRef<HTMLFormElement | null>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!message || !current) return;
    const msg: Message = {
      message: message,
      partnerID: current.id,
      userID: session.user.id,
      timestamp: Date.now(),
    };
  
    sendMessage(msg);
    setMessage("");
    setRows(1);
    setsubmit(!submit);
  }

  if (!current) return <></>;
  return (
    <div className="h-full grow flex flex-col relative">
      <nav className="flex fixed w-full h-20 border-b-2 items-center p-4 space-x-4 bg-white/0 backdrop-blur-s">
        <Image
          src={current.image || avatar}
          alt="avatar"
          width={40}
          height={40}
          className="rounded-full overflow-clip cursor-pointer"
          onClick={() => {
            setsidePanel(true);
          }}
        />
        <div className={space_Grotesk.className}> 
        <p className="text-xl ">{current.name}</p>
          <p className="text-sm">{online && online.has(current.id) && online.get(current.id) === true?"online":"offline"}</p>
        </div>
      </nav>
      <div className="grow p-4 flex flex-col containerCustom mt-20 ">
        <Messages session={session} msg={submit} />
      </div>

      <footer className="border-t-2 p-4 bg-slate-200 relative">
        <form
          className=" flex items-center w-full bg-white rounded-full py-1 px-4 overflow-clip"
          onSubmit={handleSubmit}
          ref={formRef}
        >
          {isClicked ? (
            <div className="absolute bottom-[90%] left-0 max-sm:hidden" ref={box}>
              <EmojiPicker
                lazyLoadEmojis={true}
                previewConfig={{
                  showPreview: false,
                }}
                skinTonesDisabled={true}
                emojiStyle={EmojiStyle.TWITTER}
                onEmojiClick={(emojiData: EmojiClickData) => {
                  setMessage((msg) => msg + emojiData.emoji);
                }}
              />
            </div>
          ) : null}
          <button
            type="button"
            className="text-indigo-400 max-sm:hidden"
            onClick={()=>setisClicked(!isClicked)}
          >
            <Smile />
          </button>

          <TextareaAutosize
            rows={rows}
            maxRows={2}
            className="px-4 py-2 focus:outline-none rounded-md resize-none w-full bg-transparent"
            placeholder="Type a Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (formRef.current) {
                  formRef.current.requestSubmit();
                }
                // handleSubmit(e);
              }
            }}
          />
          <button
            type="submit"
            className="rounded-full py-1 ps-1 pe-2 active:scale-95 hover:bg-slate-200"
          >
            <Image src={send} alt="send" width={30} height={40} />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatBox;

"use client";

import { signIn } from "next-auth/react";
import React, { FC, FormEvent, useState } from "react";
import styles from "./page.module.css";
import Button from "@/components/ui/Button";
import Image from "next/image";
import google from "@/assets/icons/google.svg";
import Discord from "@/assets/icons/Discord.svg";
import github from "@/assets/icons/github.svg";
import mail from "@/assets/icons/email.svg";
import toast from "react-hot-toast";
import { useSearchParams } from 'next/navigation'
import { space_Grotesk } from "@/lib/fonts";

interface LoginProps {}

const Login: FC<LoginProps> = ({}) => {
  

  const [loadingGoogle, setLoadingGoogle] = useState<boolean>(false);
  const [loadingDiscord, setLoadingDiscord] = useState<boolean>(false);
  const [loadingGithub, setLoadingGithub] = useState<boolean>(false);
  const [loadingEmail, setLoadingEmail] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const [email, setEmail] = useState<string>("");
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nativeEle = e.nativeEvent as SubmitEvent;
    const id = nativeEle.submitter?.id;

    switch (id) {
      case "google":
        setLoadingGoogle(true);
        await signIn("google");
        setLoadingGoogle(false);

        break;

      case "Discord":
        setLoadingDiscord(true);
        await signIn("discord");
        setLoadingDiscord(false);

        break;

      case "github":
        setLoadingGithub(true);
        await signIn("github");
        setLoadingGithub(false);

        break;

      case "email":
        if (!email) return toast.error("Please enter a valid email");
        setLoadingEmail(true);

        const res = await signIn("email", {
          email: email,
        });
        if(res?.error) toast.error("Something went wrong")
        setLoadingEmail(false);

        break;

      default:
        break;
    }

    if(error === 'OAuthAccountNotLinked'){
      toast.error('Account already linked with this email address')
    }
  
  }
  return (
    <div className={styles.bgGradient+" "+space_Grotesk.className}>
      <section className="h-[80vh] w-[70vw] rounded-lg backdrop-blur-sm bg-transparent/10 flex flex-col items-center p-6 space-y-8 max-md:w-[90vw] max-sm:h-[95vh] text-white ">
        <h1 className=" text-6xl font-bold ">Login</h1>
        <form
          className="space-y-2 w-[60%] max-md:w-full"
          onSubmit={handleSubmit}
        >
          <input
            className="w-full rounded-md py-2 px-4 my-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none focus:ring-offset-2 text-slate-800"
            placeholder="Enter your email address"
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            isLoading={loadingEmail}
            type="submit"
            className="w-full flex items-center justify-center space-x-6 max-sm:space-x-2"
            id="email"
          >
            <Image src={mail} alt="logo" width={35} height={35} />
            <p>Continue With E-Mail</p>
          </Button>
          <div className="flex justify-evenly items-center">
            <div className="h-[2px] w-full bg-slate-400 my-2 rounded-full"></div>
            <p className="mx-3 font-semibold text-lg">OR</p>
            <div className="h-[2px] w-full bg-slate-400 my-2 rounded-full"></div>
          </div>
          <Button
            isLoading={loadingGoogle}
            type="submit"
            className="w-full flex items-center justify-center space-x-6 max-sm:space-x-2"
            id="google"
          >
            <Image src={google} alt="logo" width={35} height={35} />
            <p>Continue With Google</p>
          </Button>
          <Button
            isLoading={loadingDiscord}
            type="submit"
            className="w-full flex items-center justify-center space-x-6 max-sm:space-x-2"
            id="Discord"
          >
            <Image src={Discord} alt="logo" width={35} height={35} />
            <p>Continue With Discord</p>
          </Button>
          <Button
            isLoading={loadingGithub}
            type="submit"
            className="w-full flex items-center justify-center space-x-6 max-sm:space-x-2"
            id="github"
          >
            <Image src={github} alt="logo" width={35} height={35} />
            <p>Continue With Github</p>
          </Button>
        </form>
      </section>
    </div>
  );
};

export default Login;

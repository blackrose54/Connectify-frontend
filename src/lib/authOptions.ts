import { NextAuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import DiscordProvider from "next-auth/providers/discord";
import EmailProvider from "next-auth/providers/email";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { redis } from "./db";
import {
  getAvatarURLbyInitials,
  getDiscordCred,
  getGithubCred,
  getGoogleCred,
} from "./utils";

export const authOptions: NextAuthOptions = {
  adapter: UpstashRedisAdapter(redis),
  providers: [
    GoogleProvider({
      clientId: getGoogleCred().clientId,
      clientSecret: getGoogleCred().clientSecret,
    }),
    GitHubProvider({
      clientId: getGithubCred().clientId,
      clientSecret: getGithubCred().clientSecret,
    }),
    DiscordProvider({
      clientId: getDiscordCred().clientId,
      clientSecret: getDiscordCred().clientSecret,
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login/error",
  },
  callbacks: {
    async jwt({ token, account }) {
      const id = (await redis.get(`user:email:${token.email}`)) as string;
      if (id && id.length > 0) token.id = id;

      if (account?.provider === "email") {
        const user: User | null = await redis.get(`user:${id}`);
        if (user && !user?.name) {
          const imgUrl = getAvatarURLbyInitials(user.email!.split("@")[0])
          await redis.set(`user:${id}`, {
            ...user,
            name: user.email!.split("@")[0],
            image:imgUrl ,
          });
          token.name = user.email!.split("@")[0],
          token.picture = imgUrl;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) session.user.id = token.id;
      return session;
    },
    redirect() {
      return "/dashboard";
    },
  },
};

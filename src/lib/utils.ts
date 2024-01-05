import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getGoogleCred() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || clientId.length == 0)
    throw new Error("Google client ID is required");
  if (!clientSecret || clientSecret.length == 0)
    throw new Error("Google client secret is required");

  return { clientId, clientSecret };
}

export function getGithubCred() {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || clientId.length == 0)
    throw new Error("Github client ID is required");
  if (!clientSecret || clientSecret.length == 0)
    throw new Error("Github client secret is required");

  return { clientId, clientSecret };
}

export function getDiscordCred() {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;

  if (!clientId || clientId.length == 0)
    throw new Error("Discord client ID is required");
  if (!clientSecret || clientSecret.length == 0)
    throw new Error("Discord client secret is required");

  return { clientId, clientSecret };
}

export function getAvatarURLbyInitials(initials: string | undefined) {
  if (!initials) return null;
  const data = new URLSearchParams({
    name: initials,
    background: "random",
  });

  return "https://ui-avatars.com/api/?" + data;
}

const genQueryString = (id1: string, id2: string)=> {
  if (id1 > id2) {
    return `user:messages:${id1}--${id2}`;
  }
  return `user:messages:${id2}--${id1}`;
}
export default genQueryString;

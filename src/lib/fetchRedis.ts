"use server";

import { getRedisCred } from "./db";

export async function fetchRedis(
  command: string,
  ...args: (string | number)[]
) {
  try {
    const response = await fetch(
      `https://apn1-modern-caiman-35056.upstash.io/${command}/${args.join('/')}`,
      {
        headers: {
          Authorization: "Bearer " + getRedisCred().TOKEN,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`Error executing Redis command: ${response.statusText}`);
    }

    const body = await response.json();
    return body;
    
  } catch (error) {
    console.log(error);
  }
}

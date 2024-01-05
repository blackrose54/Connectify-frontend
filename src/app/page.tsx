import Image from 'next/image'
import { Skeleton } from "@/components/ui/Skeleton"

export default function Home() {
  return (
    <main >
      <Skeleton className="w-[10rem] h-10  rounded-lg rounded-tr-none m-4" />
      <Skeleton className="w-[10rem] h-10  rounded-lg rounded-tl-none m-4" />


    </main>
  )
}

import React,{ FC } from 'react'
import { getServerSession } from "next-auth"
import { authOptions } from '@/lib/authOptions'
import { redirect } from 'next/navigation'
import Dashboard from '@/components/Dashboard'

interface pageProps {
  
}

const page: FC<pageProps> = async ({}) => {
    const session = await getServerSession(authOptions);
    if(!session?.user) return redirect('/login')
    
  return (
    <div className='flex justify-between h-screen items-center'>
        <Dashboard session={session} chatPartner={session} />
    </div>
  )
}

export default page
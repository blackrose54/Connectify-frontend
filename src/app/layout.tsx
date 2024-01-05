import type { Metadata } from 'next'
import { Poppins, } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const poppins = Poppins({
  weight:['400','700'],
  subsets:['latin']
})



export const metadata: Metadata = {
  title: 'Connectify',
  description: 'A Chat Application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={poppins.className}>
        <Toaster />
        {children}
      </body>
    </html>
  )
}

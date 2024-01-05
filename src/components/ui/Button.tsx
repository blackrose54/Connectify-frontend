import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import React,{ FC,ReactElement,ButtonHTMLAttributes } from 'react'


const buttonVariants = cva(
    "bg-slate-800 text-slate-300 text-xl p-3 rounded-lg hover:bg-slate-300 hover:text-slate-900 active:scale-[.99] transition-colors",
)

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
  isLoading?:boolean
}


const Button: FC<ButtonProps> = ({children,className,isLoading,...props}):ReactElement => {
  return (
    <button className={cn(buttonVariants({className}))} {...props}>
      {isLoading?(<Loader2 className=' animate-spin' />):children}
    </button>
  )
}

export default Button
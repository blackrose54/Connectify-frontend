import { withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server";

export default withAuth(
    async function middleware(req) {
        const pathname = req.nextUrl.pathname;
        const isAuthenticated = await getToken({req})
        const sensitiveRoutes = ['/dashboard']
        const isAccessingSensitiveRoutes = sensitiveRoutes.some((route)=>pathname.startsWith(route))
        
        if(pathname === '/') return NextResponse.redirect(new URL('/login',req.url))
        if(isAuthenticated && pathname.startsWith('/login')) return NextResponse.redirect(new URL('/dashboard',req.url))
        if(!isAuthenticated && isAccessingSensitiveRoutes) return NextResponse.redirect(new URL('/login',req.url))

        return NextResponse.next();
        
    },{
    callbacks:{
        async authorized({req,token}){
            return true
        }
    }}
)

export const config = {
    matcher:['/login','/dashboard/:path*','/']
}
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  
  // Get all cookies
  const allCookies = cookieStore.getAll()
  
  // Get specific cookies we're interested in
  const adminSession = cookieStore.get('admin_session')
  const nextAuthSession = cookieStore.get('next-auth.session-token')
  const secureNextAuthSession = cookieStore.get('__Secure-next-auth.session-token')
  
  return NextResponse.json({
    env: {
      NODE_ENV: process.env.NODE_ENV,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ? 'SET' : 'NOT SET',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT SET',
    },
    cookies: {
      all: allCookies.map(c => ({ name: c.name, valueLength: c.value?.length || 0 })),
      adminSession: adminSession ? { exists: true, valueLength: adminSession.value?.length } : { exists: false },
      nextAuthSession: nextAuthSession ? { exists: true, valueLength: nextAuthSession.value?.length } : { exists: false },
      secureNextAuthSession: secureNextAuthSession ? { exists: true, valueLength: secureNextAuthSession.value?.length } : { exists: false },
    },
    authResult: {
      hasAdminSession: !!adminSession?.value && adminSession.value.length > 5,
      hasNextAuthSession: !!(nextAuthSession?.value || secureNextAuthSession?.value),
      isAuthenticated: !!(adminSession?.value && adminSession.value.length > 5) || !!(nextAuthSession?.value || secureNextAuthSession?.value)
    }
  })
}

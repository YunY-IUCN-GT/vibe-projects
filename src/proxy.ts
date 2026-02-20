import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  // Supabase JS SDK는 localStorage에 세션을 저장하므로
  // 서버 미들웨어에서는 쿠키 기반 인증 체크를 하지 않음.
  // 클라이언트 사이드에서 인증 상태를 확인하고 리다이렉트 처리.
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}

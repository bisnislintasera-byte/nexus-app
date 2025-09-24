import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware yang tidak melakukan proxying
export default async function middleware(request: NextRequest) {
  // Lanjutkan dengan request normal
  return NextResponse.next()
}

// Konfigurasi middleware untuk mencocokkan semua request
export const config = {
  matcher: [
    '/api/:path*'
  ]
}
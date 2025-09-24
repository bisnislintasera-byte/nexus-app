import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'

// Import focus-visible polyfill
import 'focus-visible/dist/focus-visible.js'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: '%s | Nexus',
    default: 'Nexus - Sistem Verifikasi Aset Enterprise',
  },
  description: 'Sistem Verifikasi Aset Enterprise dengan Workflow Approval Terintegrasi',
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      }
    ],
    apple: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      }
    ],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Nexus',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
  themeColor: '#4F46E5'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster 
          position="top-right" 
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#333',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
            },
            success: {
              style: {
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
              },
              iconTheme: {
                primary: '#16a34a',
                secondary: '#fff',
              },
            },
            error: {
              style: {
                background: '#fef2f2',
                border: '1px solid #fecaca',
              },
              iconTheme: {
                primary: '#dc2626',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
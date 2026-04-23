import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/AuthContext'

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  title: 'CardioSense — Heart Attack Risk Prediction',
  description: 'Early detection saves lives. Know your heart before it\'s too late.',
  keywords: ['heart disease', 'risk prediction', 'cardiology', 'health'],
  authors: [{ name: 'CardioSense' }],
  openGraph: {
    title: 'CardioSense',
    description: 'Predict your heart attack risk with machine learning analysis',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-inter bg-bg-main text-text-main">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}

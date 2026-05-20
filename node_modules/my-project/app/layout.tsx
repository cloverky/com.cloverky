import type { Metadata } from 'next'
import { Jua, Noto_Sans_KR } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AppShell } from '@/components/app-shell'
import { Providers } from '@/components/providers'
import './globals.css'

/** 본문 — 깔끔한 고딕 */
const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-noto-sans-kr',
})

/** 히어로 등 강조 — 동글동글 두꺼운 느낌 */
const jua = Jua({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-jua',
})

export const metadata: Metadata = {
  title: 'FridgeAI - AI 냉장고 관리·맞춤 레시피',
  description: 'AI가 재고를 챙기고 취향에 맞는 레시피를 추천하는 냉장고 관리 서비스',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${notoSansKr.variable} ${jua.variable} font-sans antialiased bg-background`}
      >
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

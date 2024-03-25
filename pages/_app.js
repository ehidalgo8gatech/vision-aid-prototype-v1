import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.css'
import {SessionProvider} from "next-auth/react"
import { Inter } from '@next/font/google'
import { useEffect } from "react";

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export default function MyApp({ Component, pageProps }) {
  // load bootstrap js on useEffect
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);
  return (
      <SessionProvider session={pageProps.session}>
    <main className={`${inter.variable} font-sans`}>
        <Component {...pageProps} />
    </main>
      </SessionProvider>
  )
}

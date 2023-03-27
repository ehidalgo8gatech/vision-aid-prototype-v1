import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.css'
import {SessionProvider} from "next-auth/react"
import { Inter } from 'next/font/google'

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ['latin'] })



export default function App({
                                Component,
                                pageProps: {session, ...pageProps},
                            }) {
    return (
        <SessionProvider session={session}>
            <Component {...pageProps} />
        </SessionProvider>
        
    )
}

import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import {useSession, signIn, signOut, getSession} from "next-auth/react";

import Navbar from '../comps/Navbar'
/*import Footer from './footer'*/

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
     
     <Navbar />
      
      <main className={styles.main}>
      <div className={styles.description}>
        <Head>
          <title>Vision Aid P11</title>
          <link rel="manifest" href="/manifest.json" />
          <meta name="description" content="Vision Aid P11"/>
          <meta name="theme-color" content="#317EFB"/>
        </Head>

      
        
        
        <code className={styles.code}></code>
        
         
          <div>
            <a
              href="https://sites.google.com/view/visionaidwebinterface/home?authuser=0"
              
            >
              {' '}
              <Image
                src="/vision-aid-logo-trns(1).png"
                alt="Vercel Logo"
                className={styles.vercelLogo}
                width={100}
                height={100}
                priority
              /> 
          
                
            </a>
          </div>
        </div>

        <div className={styles.center}>
          <Image
            className={styles.logo}
            src="/vision-aid-logo-trns(1).png"
            alt="VisionAid Logo trns"
            width={200}
            height={200}
            priority
          />
          
            
        </div>
        

        <div className={styles.grid}>
          <a
            href=""
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Admin <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              For Vision Aid Admins to  and enter data.
            </p>
          </a>
          
          <a href="/tech"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Technician <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Data Entry (in development).
            </p>
          </a>
          
          <a
            href=""
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Manager <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Manager Overview for Vision Aid Beneficiaries.
            </p>
          </a>
        </div>
      </main>
    </>
  )
}


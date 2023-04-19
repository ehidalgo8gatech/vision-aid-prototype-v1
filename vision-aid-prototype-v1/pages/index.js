import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import Link from 'next/link'
import {useSession, signIn, signOut, getSession} from "next-auth/react";


import Navbar from '../comps/Navbar'
/*import Footer from './footer'*/

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
    const {data: session} = useSession();
  return (
    <>


  <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="navbar-brand">
          <Link href="/">
            <img src="/vision-aid-logo.jpeg" width="80" height="80" class="d-inline-block" alt="Home"/>
          </Link>
        </div>

          <a class="d-inline-block">
                        {!session ? (
                            <div>
                               <button type="button" class="btn rounded-pill btn-secondary" onClick={() => signIn()}>Sign in</button>
                            </div>
                            ) : (
                                <div>
                                    <p1> Signed in as {session.user.email} </p1>
                                    <br/>
                                    <button type="button" class="btn rounded-pill btn-secondary" onClick={() => signOut()}>Sign out</button>
                                </div>
                        )}
        </a>

  </nav>

  <main className={styles.body}>
  <div class="container">
     <div class="row">
        <div className={styles.grid}>
          <a
            href="/reports"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Admin
            </h2>
            <p className={inter.className}>
              For Vision Aid Admins to edit & enter data
            </p>
          </a>

          <a href="/beneficiaryinformation"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Technician
            </h2>
            <p className={inter.className}>
              Data Entry (in development)
            </p>
          </a>

          <a
            href="/requiredfields"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Manager
            </h2>
            <p className={inter.className}>
              Manager Overview for Vision Aid Beneficiaries
            </p>
          </a>


         </div>
        </div>

        </div>
        </main>


   </>
  )
}


import Link from "next/link";
import styles from '@/styles/Home.module.css'
import {useSession, signIn, signOut, getSession} from "next-auth/react";


export default function Navbar() {

    const {data: session} = useSession();
    return (
    <div>
      <nav>
        
        <div className="logo">
          <h1>
          </h1>
          
{!session ? (
                <div>
                    <p>Not signed in</p>
                    <br/>
                    <button onClick={() => signIn()}>Sign in</button>
                </div>
            ) : (
                <div>
                    <h4>Signed in as {session.user.email}</h4>
                    <button onClick={() => signOut()}>Sign out</button>
                </div>
            )}
<Link legacyBehavior href={"/"}><a id="/">Home</a></Link>
            </div>
            
      </nav>
      </div>
  );
  }
   
 
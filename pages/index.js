import { Inter } from "@next/font/google";
import {
  useSession,
  getSession,
} from "next-auth/react";
import Navigation from "./navigation/Navigation";
import { readUser } from "./api/user";
import  LandingPage from "./landingpage.js";


const inter = Inter({ subsets: ["latin"] });

export default function Home(props) {
  const { data: session } = useSession();
  // console.log(session);
  // console.log(props);
  
  return (
    <>
      
      <Navigation user={props.user} />
      {session && !props.user && (
        <strong>Please ask an admin to add you as user!</strong>
      )}
      < LandingPage user={props.user}></ LandingPage>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  if (session == null) {
    console.log("session is null");
    return {
      props: {
        user: null,
      },
    };
  }
  const user = await readUser(session.user.email);
  return {
    props: {
      user: user,
    },
  };
}

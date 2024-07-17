import {
  useSession,
  getSession,
} from "next-auth/react";
import Navigation from "./navigation/Navigation";
import Layout from './components/layout';
import { readUser } from "./api/user";
import  LandingPage from "./landingpage.js";

export default function Home(props) {
  const { data: session } = useSession();
  
  return (
    <Layout>
      <Navigation user={props.user} />
      {session && !props.user && (
        <strong>Please ask an admin to add you as user!</strong>
      )}
      < LandingPage user={props.user}></ LandingPage>
    </Layout>
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
      user: JSON.parse(JSON.stringify(user)),
    },
  };
}

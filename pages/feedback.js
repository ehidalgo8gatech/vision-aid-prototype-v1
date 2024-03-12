// pages/feedback.js
import Navigation from "./navigation/Navigation";
import Layout from './components/layout';
import Head from "next/head";
import { getSession } from "next-auth/react";
import { readUser } from "./api/user";

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  if (session == null) {
    return {
      props: {
        user: null
      }
    };
  }
  const user = await readUser(session.user.email);
  return {
    props: {
      user: user,
    },
  };
}

export default function FeedbackPage(props) {
  return (
    <Layout>
      <Navigation user={props.user}/>
      <Head>
        <title>Feedback</title>
      </Head>
      <div class="content">
        <div className="container">
          <h1>Provide Website Feedback</h1>
          <form id="feedbackForm" action="/submit-feedback" method="POST">
            <div>
              <label htmlFor="rating">Overall Satisfaction:</label><br />
              <select id="rating" name="rating" required>
                <option value="">Select...</option>
                <option value="1">1 - Very Dissatisfied</option>
                <option value="2">2 - Dissatisfied</option>
                <option value="3">3 - Neutral</option>
                <option value="4">4 - Satisfied</option>
                <option value="5">5 - Very Satisfied</option>
              </select>
            </div>
            <div>
              <label htmlFor="comments">Additional comments (optional):</label><br />
              <textarea id="comments" name="comments" className="textarea" required></textarea>
            </div>
            <div>
              <label htmlFor="email">Email (optional):</label><br />
              <input type="email" id="email" name="email" className="textarea-small" />
            </div>
            <button type="submit">Submit Feedback</button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
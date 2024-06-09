// feedback.js page
import Navigation from "./navigation/Navigation";
import Layout from './components/layout';
import Head from "next/head";
import { useState } from "react";
import { getUserFromSession } from "@/pages/api/user";

export async function getServerSideProps(ctx) {
  const user = await getUserFromSession(ctx);
  return { props: { user } };
}

export default function FeedbackPage(props) {
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const formDataJson = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataJson)
      });

      if (response.ok) {
        setFeedbackSubmitted(true);
      } else {
        console.error('Failed to submit feedback:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <Layout>
      <Navigation user={props.user} />
      <Head>
        <title>Feedback</title>
      </Head>
      <div className="content">
        <div className="container feedback-container">
          {feedbackSubmitted ? (
            <h1 className="text-center mt-4 mb-4">Thank you for your feedback!</h1>
          ) : (
            <h1 className="text-center mt-4 mb-4">Provide Website Feedback</h1>
          )}
          {!feedbackSubmitted && (
            <form id="feedbackForm" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="rating">Overall Satisfaction:</label><br />
                <select id="rating" name="rating" className="textarea small-box" required>
                  <option value="">Select...</option>
                  <option value="5">5 - Very Satisfied</option>
                  <option value="4">4 - Satisfied</option>
                  <option value="3">3 - Neutral</option>
                  <option value="2">2 - Dissatisfied</option>
                  <option value="1">1 - Very Dissatisfied</option>
                </select>
              </div>
              <div>
                <label htmlFor="comments">Additional Comments (optional):</label><br />
                <textarea id="comments" name="comments" className="textarea"></textarea>
              </div>
              <div>
                <label htmlFor="email">Email (optional):</label><br />
                <input type="email" id="email" name="email" className="textarea small-box" />
              </div>
              <button type="submit" className="btn btn-success border-0 btn-block">Submit Feedback</button>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}

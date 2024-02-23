// pages/feedback.js
import Navigation from "./navigation/Navigation";

export default function FeedbackPage() {
  return (
    <div>
      <Navigation />
      <div>
        <h1>Provide Feedback</h1>
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSf-kvQTTYt8IFMQdMORTAlrrYXawQjLHcCMOms7z65Nk4oFfw/viewform?embedded=true"
          width="640"
          height="880"
          frameborder="0"
          marginheight="0"
          marginwidth="0"
          title="Feedback Form"
        >
          Loading…
        </iframe>
      </div>
    </div>
  );
}

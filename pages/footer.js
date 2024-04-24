// components/footer.js
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <p>
        <Link href="/feedback">Provide Feedback</Link>
      </p>
      <p>&copy; Vision-Aid Partners {currentYear}</p>
    </footer>
  );
};

export default Footer;

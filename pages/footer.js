// components/footer.js
import Link from "next/link";

const Footer = () => {

  return (
    <footer className="footer">
      <p>
        <Link href="/feedback">Provide Feedback</Link>
      </p>
      <p>VA-Partners Spring 2024</p>
    </footer>
  );
};

export default Footer;

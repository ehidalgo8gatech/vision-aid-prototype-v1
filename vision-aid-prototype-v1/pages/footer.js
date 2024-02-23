// components/Footer.js

import Link from "next/link";

const Footer = () => {
  return (
    <footer className="footer">
      {/* Your footer content goes here */}
      <p>
        To report an issue or provide feedback,{" "}
        <Link href="/feedback">click here</Link>.
      </p>
      <p>VA-Partners Spring 2024</p>
    </footer>
  );
};

export default Footer;

// components/Layout.js

// import Navigation from "../navigation/Navigation"; // Adjust the path
import Footer from "../footer";

const Layout = ({ children }) => {
    return (
      <div>
        {children}
        <Footer />
      </div>
    );
  };
  
  export default Layout;

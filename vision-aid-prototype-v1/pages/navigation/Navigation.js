import Link from 'next/link';
import { useRouter } from 'next/router';

const Navigation = () => {
  const router = useRouter();

  return (
    <nav>
      <ul>
        <li>
          <Link href="/beneficiary" legacyBehavior>
            <a className={router.pathname === "/beneficiary" ? "active" : ""}>Beneficiaries</a>
          </Link>
        </li>
        <li>
          <Link href="/reports" legacyBehavior>
            <a className={router.pathname === "/reports" ? "active" : ""}>Reports</a>
          </Link>
        </li>
        <li>
          <Link href="/users" legacyBehavior>
            <a className={router.pathname === "/users" ? "active" : ""}>Users</a>
          </Link>
        </li>
        <li>
          <Link href="/requiredfields" legacyBehavior>
            <a className={router.pathname === "/requiredfields" ? "active" : ""}>Configuration</a>
          </Link>
        </li>
      </ul>
      
      <style jsx>{`
        nav {
          background-color: #1B5E20;
        }
        
        ul {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        
        
        a {
          color: #fff;
          text-decoration: none;
          padding: 0.5rem;
          border-radius: 0.5rem;
        }
        
        a:hover {
          background-color: #4CAF50;
          color: #fff;
        }
        
        a.active {
          background-color: #81C784;
          color: #000;
        }
      `}</style>
    </nav>
  );
};

export default Navigation;

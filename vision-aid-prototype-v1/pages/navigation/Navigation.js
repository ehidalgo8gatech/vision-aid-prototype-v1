import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Navigation = () => {
  const router = useRouter();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#1B5E20' }}>
      <div className="container-fluid">
        <Link href="/" legacyBehavior>
          <a className="navbar-brand p-2">
            <img src="/vision-aid-logo.jpeg" alt="Logo" height="80" width="80" />
          </a>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item p-4">
              <Link href="/beneficiary" legacyBehavior>
                <a className={`nav-link custom-link ${router.pathname === '/beneficiary' ? 'active' : ''}`}>Beneficiaries</a>
              </Link>
            </li>
            <li className="nav-item p-4">
              <Link href="/reports" legacyBehavior>
                <a className={`nav-link custom-link ${router.pathname === '/reports' ? 'active' : ''}`}>Reports</a>
              </Link>
            </li>
            <li className="nav-item p-4">
              <Link href="/users" legacyBehavior>
                <a className={`nav-link custom-link ${router.pathname === '/users' ? 'active' : ''}`}>Users</a>
              </Link>
            </li>
            <li className="nav-item p-4">
              <Link href="/requiredfields" legacyBehavior>
                <a className={`nav-link custom-link ${router.pathname === '/requiredfields' ? 'active' : ''}`}>Configuration</a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <style jsx>{`
        .custom-link {
          font-size: 1.5rem;
        }
        nav a{
          margin: 0 0px;
        }
      `}</style>
    </nav>
  );
};

export default Navigation;

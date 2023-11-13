import Link from "next/link";
import { useRouter } from "next/router";
import { signIn, signOut } from "next-auth/react";

function Navigation({ user } = props) {
  const router = useRouter();
  let role = "";
  if (user) {
    role = user.admin
      ? "admin"
      : user.hospitalRole.admin
      ? "manager"
      : user.hospitalRole
      ? "technician"
      : "invalid";
  }

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark container-fluid flex"
      style={{ backgroundColor: "#1B5E20" }}
    >
      {/* <div className="container-fluid flex"> */}
      <div className="d-flex w-100">
        <div className="p-2">
          <Link href="/" legacyBehavior>
            <a className="navbar-brand p-2">
              <img
                src="/vision-aid-logo.jpeg"
                alt="Logo"
                height="80"
                width="80"
              />
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
        </div>
        <div>
          {user && role != "invalid" && (
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item p-4">
                  <Link href="/beneficiary" legacyBehavior>
                    <a
                      className={`nav-link custom-link ${
                        router.pathname === "/beneficiary" ? "active" : ""
                      }`}
                    >
                      Beneficiaries
                    </a>
                  </Link>
                </li>
                <li className="nav-item p-4">
                  <Link href="/reports" legacyBehavior>
                    <a
                      className={`nav-link custom-link ${
                        router.pathname === "/reports" ? "active" : ""
                      }`}
                    >
                      Reports
                    </a>
                  </Link>
                </li>
                {/* don't display if technician */}
                {(role === "admin" || role === "manager") && (
                  <li className="nav-item p-4">
                    <Link href="/users" legacyBehavior>
                      <a
                        className={`nav-link custom-link ${
                          router.pathname === "/users" ? "active" : ""
                        }`}
                      >
                        Users
                      </a>
                    </Link>
                  </li>
                )}
                {/* display only if admin */}
                {role === "admin" && (
                  <li className="nav-item p-4">
                    <Link href="/requiredfields" legacyBehavior>
                      <a
                        className={`nav-link custom-link ${
                          router.pathname === "/requiredfields" ? "active" : ""
                        }`}
                      >
                        Configuration
                      </a>
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
        {user && (
          <div className="left-auto-margin column">
            {/* <p> */}
            <small className="top display text-light">
              Signed in as {user.email}
            </small>
            {/* </p> */}
            <br />
            <div className="text-align-right">
              <button
                type="button"
                className="btn btn-sm btn-light"
                onClick={() => {
                  signOut();
                }}
              >
                Sign out
              </button>
            </div>
            {/* <p className="text-align-right display text-light nopadding">
              <small>Signed in as {user.email}</small>
            </p>
            <div className="h-100 right-align nopadding">
              <button
                type="button"
                className="btn btn-sm btn-light"
                onClick={() => {
                  signOut();
                }}
              >
                Sign out
              </button>
            </div> */}
          </div>
        )}
        {!user && (
          <div className="text-align-right">
            <button
              type="button"
              className="btn btn-sm btn-light"
              onClick={() => signIn()}
            >
              Sign in
            </button>
          </div>
        )}
        {/* </div> */}
      </div>

      <style jsx>{`
        .custom-link {
          font-size: 1.5rem;
        }
        nav a {
          margin: 0 0px;
        }
      `}</style>
    </nav>
  );
}

export default Navigation;

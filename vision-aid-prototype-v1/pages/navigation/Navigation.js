import Link from "next/link";
import { useRouter } from "next/router";
import { signIn, signOut} from "next-auth/react";

function Navigation({ user } = props) {
  const router = useRouter();
  console.log("Props in Navigation: ", user);
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
      className="navbar navbar-expand-lg navbar-dark"
      style={{ backgroundColor: "#1B5E20" }}
    >
      <div className="container-fluid">
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

        {user && (
          <div className="text-align-right">
            <p className="display text-light nopadding">
              Signed in as {user.email}
            </p>
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

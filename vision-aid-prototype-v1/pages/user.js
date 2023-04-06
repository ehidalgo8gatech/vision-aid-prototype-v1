// pages/user.js
import { useRouter } from 'next/router';

function UserPage({ user }) {
  const router = useRouter();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1 className="text-center mt-4 mb-4">User Details</h1>
      {/* Display user information */}
      <p><strong>MRN:</strong> {user.mrn}</p>
      {/* Add other user attributes as needed */}
    </div>
  );
}

export async function getServerSideProps({ query }) {
    var user;
    try {
        const beneficiary = await await fetch(`${process.env.NEXTAUTH_URL}/api/beneficiary?mrn=${query.mrn}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        })
        user = await beneficiary.json();
      } catch (error) {
        console.error('Error fetching users:', error);
      }

  if (!user) {
    return {
      notFound: true,
    };
  }

  return {
    props: { user },
  };
}

export default UserPage;

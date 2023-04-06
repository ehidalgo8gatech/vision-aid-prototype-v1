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
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <strong>MRN:</strong> {user.mrn}
          </div>
          <div className="mb-3">
            <strong>Beneficiary Name:</strong> {user.beneficiaryName}
          </div>
          <div className="mb-3">
            <strong>Hospital ID:</strong> {user.hospitalId}
          </div>
          <div className="mb-3">
            <strong>Date of Birth:</strong> {user.dateOfBirth}
          </div>
          <div className="mb-3">
            <strong>Gender:</strong> {user.gender}
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <strong>Phone Number:</strong> {user.phoneNumber}
          </div>
          <div className="mb-3">
            <strong>Education:</strong> {user.education}
          </div>
          <div className="mb-3">
            <strong>Occupation:</strong> {user.occupation}
          </div>
          <div className="mb-3">
            <strong>Districts:</strong> {user.districts}
          </div>
          <div className="mb-3">
            <strong>State:</strong> {user.state}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="mb-3">
            <strong>Diagnosis:</strong> {user.diagnosis}
          </div>
          <div className="mb-3">
            <strong>Vision:</strong> {user.vision}
          </div>
          <div className="mb-3">
            <strong>mDVI:</strong> {user.mDVI}
          </div>
          <div className="mb-3">
            <strong>Extra Information:</strong> {user.extraInformation}
          </div>
        </div>
      </div>
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

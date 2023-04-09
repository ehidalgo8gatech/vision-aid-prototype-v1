// pages/user.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Pencil } from 'react-bootstrap-icons';

function UserPage({ user }) {
  const router = useRouter();

  // State variable for form fields
  const [formData, setFormData] = useState(user);
  const [editableField, setEditableField] = useState('');

  // Handle input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle edit icon click
  const handleEditClick = (field) => {
    setEditableField(field);
  };

  // Submit the edited data
  const handleSubmit = async (e, field) => {
    e.preventDefault();
  
    // Update user data in the database
    const response = await fetch(`/api/beneficiary`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mrn: user.mrn, [field]: formData[field] }),
    });
  
    // Handle response from the API
    if (response.ok) {
      alert('User data saved successfully!');
      setEditableField('');
    } else {
      alert('An error occurred while saving user data. Please try again.');
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const renderField = (label, field) => (
    <div className="mb-3">
      <strong>{label}:</strong>
      {editableField === field ? (
        <form onSubmit={(e) => handleSubmit(e, field)} className="d-inline ms-2">
          <input
            type="text"
            className="form-control d-inline w-auto"
            name={field}
            value={formData[field]}
            onChange={handleInputChange}
          />
          <button type="submit" className="btn btn-primary btn-sm ms-2">
            Save
          </button>
        </form>
      ) : (
        <span className="ms-2">
          {formData[field]}
          <button
            type="button"
            className="btn btn-link btn-sm text-primary ms-2"
            onClick={() => handleEditClick(field)}
          >
           <Pencil />
          </button>
        </span>
      )}
    </div>
  );

  return (
    <div className="container">
      <h1 className="text-center mt-4 mb-4">User Details</h1>
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            {renderField('MRN', 'mrn')}
          </div>
          <div className="mb-3">
            {renderField('Beneficiary Name', 'beneficiaryName')}
          </div>
          <div className="mb-3">
            {renderField('Hospital ID', 'hospitalId')}
          </div>
          <div className="mb-3">
            {renderField('Date of Birth', 'dateOfBirth')}
          </div>
          <div className="mb-3">
            {renderField('Gender', 'gender')}
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            {renderField('Phone Number', 'phoneNumber')}
          </div>
          <div className="mb-3">
            {renderField('Education', 'education')}
          </div>
          <div className="mb-3">
            {renderField('Occupation', 'occupation')}
          </div>
          <div className="mb-3">
            {renderField('Districts', 'districts')}
          </div>
          <div className="mb-3">
            {renderField('State', 'state')}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="mb-3">
            {renderField('Extra Information', 'extraInformation')}
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

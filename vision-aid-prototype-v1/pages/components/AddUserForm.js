import { useState } from 'react';

function AddUserForm({ onAddUser }) {
    const [newUser, setNewUser] = useState({
      mrn: '',
      beneficiaryName: '',
      hospitalId: '',
      dateOfBirth: '',
      gender: '',
      phoneNumber: '',
      education: '',
      occupation: '',
      districts: '',
      state: '',
      diagnosis: '',
      vision: '',
      mDVI: '',
      extraInformation: '',
    });
  
    const handleChange = (event) => {
      setNewUser({ ...newUser, [event.target.name]: event.target.value });
    };
  
    const handleSubmit = (event) => {
      event.preventDefault();
      onAddUser(newUser);
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="mrn" className="form-label">MRN</label>
          <input
            type="text"
            className="form-control"
            id="mrn"
            name="mrn"
            value={newUser.mrn}
            onChange={handleChange}
            required
          />
        </div>
        {/* Add other form fields for the Beneficiary model */}
        <div className="mb-3">
          <label htmlFor="beneficiaryName" className="form-label">Beneficiary Name</label>
          <input
            type="text"
            className="form-control"
            id="beneficiaryName"
            name="beneficiaryName"
            value={newUser.beneficiaryName}
            onChange={handleChange}
            required
          />
        </div>
        {/* Add more form fields as needed */}
  
        <button type="submit" className="btn btn-primary">Add User</button>
      </form>
    );
  }

  export default AddUserForm;
import { useState } from 'react';
import { useRouter } from 'next/router';
import Navigation from './navigation/Navigation';

const AddUser = () => {
  const [formData, setFormData] = useState({});
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);
    var hospitalName = formData['hospitalName'];
    const hospital = await fetch('/api/hospital?name=' + hospitalName, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    })
    const hospitalJson = await hospital.json()
    if (hospitalJson == null || hospitalJson.error != null) {
        alert("Can't find hospital name in db " + hospitalName)
        return
    }
    formData['hospitalId'] = hospitalJson.id
    formData['dateOfBirth'] = new Date(formData['dateOfBirth']);

    const response = await fetch('/api/beneficiary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
        router.push('/user?mrn=' + formData['mrn']);
    } else {
      alert('An error occurred while creating the user. Please try again.');
    }
  };

  const renderField = (label, name, input_type = "text") => (
    <div>
      <label htmlFor={name}>{label}</label>
      <input
        type={input_type}
        className="form-control"
        name={name}
        id={name}
        value={formData[name] || ''}
        onChange={handleChange}
      />
    </div>
  );

  return (
    <div className="container">
      <Navigation />
      <h1 className="text-center mt-4 mb-4">Add User</h1>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">{renderField('MRN', 'mrn')}</div>
            <div className="mb-3">
              {renderField('Beneficiary Name', 'beneficiaryName',)}
            </div>
            <div className="mb-3">
              {renderField('Hospital Name', 'hospitalName')}
            </div>
            <div className="mb-3">
              {renderField('Date of Birth', 'dateOfBirth', 'date')}
            </div>
            <div className="mb-3">{renderField('Gender', 'gender')}</div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              {renderField('Phone Number', 'phoneNumber')}
            </div>
            <div className="mb-3">{renderField('Education', 'education')}</div>
            <div className="mb-3">{renderField('Occupation', 'occupation')}</div>
            <div className="mb-3">{renderField('Districts', 'districts')}</div>
            <div className="mb-3">{renderField('State', 'state')}</div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="mb-3">{renderField('Diagnosis', 'diagnosis')}</div>
            <div className="mb-3">{renderField('Vision', 'vision')}</div>
            <div className="mb-3">{renderField('mDVI', 'mDVI')}</div>
            <div className="mb-3">
              {renderField('Extra Information', 'extraInformation')}
            </div>
          </div>
        </div>
        <div className="text-center">
          <button type="submit" className="btn btn-primary mt-3">
            Create User
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;
// pages/user.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Pencil } from 'react-bootstrap-icons';
import Navigation from './navigation/Navigation';
import TrainingForm from './components/TrainingForm';

function UserPage(props) {
  const router = useRouter();

  // State variable for form fields
  const [formData, setFormData] = useState(props.user);
  const [editableField, setEditableField] = useState('');

  const [mobileTrainingData, setMobileTrainingData] = useState([]);
  const [computerTrainingData, setComputerTrainingData] = useState([]);
  const [visionTrainingData, setVisionTrainingData] = useState([]);
  const [openMobile, setOpenMobile] = useState(false);
  const [openComputer, setOpenComputer] = useState(false);
  const [openVision, setOpenVision] = useState(false);


  useEffect(() => {
    setMobileTrainingData(props.user.Mobile_Training);
   }, []);
   useEffect(() => {
      setComputerTrainingData(props.user.Computer_Training);
   }, []);
    useEffect(() => {
      if (props.user.Vision_Enhancement){
        setVisionTrainingData(props.user.Vision_Enhancement);
      }

    }, []);

  
    const callMe = async (data, url, setter, cur_data) => {
      data['sessionNumber'] = parseInt(data['sessionNumber']);
      // parse date
      data['date'] = new Date(data['date']);
      data['beneficiaryId'] = props.user.mrn;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      // Handle response from the API
      if (response.ok) {
        alert('Training data saved successfully!');
        setOpenMobile(false);
        // get data from response
        data['date'] = data['date'].toISOString().split('T')[0];
        setter([...cur_data, data]);
      } else {
        alert('An error occurred while saving Mobile Training data. Please try again.');
      }
    }


  const handleSubmitMobileTraining = async (data) => {
    // Submit the MobileTraining data to the API
    const url = '/api/mobileTraining';
    callMe(data, url, setMobileTrainingData, mobileTrainingData);
  };
  
  const handleSubmitComputerTraining = async (data) => {
    // Submit the ComputerTraining data to the API
    const url = '/api/computerTraining';
    callMe(data, url, setComputerTrainingData, computerTrainingData);
  };
  
  const handleSubmitVisionTraining = async (data) => {
    // Submit the VisionTraining data to the API
    const url = '/api/visionEnhancement';
    callMe(data, url, setVisionTrainingData, visionTrainingData);
  };  

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
      body: JSON.stringify({ mrn: props.user.mrn, [field]: formData[field] }),
    });
  
    // Handle response from the API
    if (response.ok) {
      alert('User data saved successfully!');
      setEditableField('');
    } else {
      alert('An error occurred while saving user data. Please try again.');
    }
  };

  if (!props.user) {
    return <div>Loading...</div>;
  }

  const renderField = (label, field, type) => (
    <div className="mb-3">
      {editableField === field ? (
              <div>
                  <strong>{label}:</strong>
        <form onSubmit={(e) => handleSubmit(e, field)} className="d-inline ms-2">
          <input
            type={type}
            className="form-control d-inline w-auto"
            name={field}
            value={formData[field]}
            onChange={handleInputChange}
          />
          <button type="submit" className="btn btn-primary btn-sm ms-2">
            Save
          </button>
        </form>
              </div>
      ) : type == 'hidden' ? (<div></div>) : (
          <div>
              <strong>{label}:</strong>
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
          </div>
      )}
    </div>
  );
  return (
    <div>
        <Navigation />
        <div className="container">
        <h1 className="text-center mt-4 mb-4">Beneficiary Details</h1>
        <div className="row">
            <div className="col-md-6">
            <div className="mb-3">
                {renderField('MRN', 'mrn', 'text')}
            </div>
            <div className="mb-3">
                {renderField('Beneficiary Name', 'beneficiaryName', 'text')}
            </div>
            <div className="mb-3">
                {renderField('Hospital ID', 'hospitalId', 'text')}
            </div>
            <div className="mb-3">
                {renderField('Date of Birth', 'dateOfBirth', 'date')}
            </div>
            <div className="mb-3">
                {renderField('Gender', 'gender', 'text')}
            </div>
            <div className="mb-3">
                {renderField('Phone Number', 'phoneNumber', ((props.beneficiaryMirror.phoneNumberRequired) ? 'text' : (props.beneficiaryMirror)))}
            </div>
            <div className="mb-3">
                {renderField('Education', 'education', ((props.beneficiaryMirror.educationRequired) ? 'text' : (props.beneficiaryMirror)))}
            </div>
            <div className="mb-3">
                {renderField('Occupation', 'occupation', ((props.beneficiaryMirror.occupationRequired) ? 'text' : (props.beneficiaryMirror)))}
            </div>
            <div className="mb-3">
                {renderField('Districts', 'districts', ((props.beneficiaryMirror.districtsRequired) ? 'text' : (props.beneficiaryMirror)))}
            </div>
            <div className="mb-3">
                {renderField('State', 'state', ((props.beneficiaryMirror.stateRequired) ? 'text' : (props.beneficiaryMirror)))}
            </div>
            <div className="mb-3">
                {renderField('Extra Information', 'extraInformation')}
            </div>
            </div>
            <div className="col-md-6">
            <TrainingForm
            existingTrainings={mobileTrainingData}
            addNewTraining={handleSubmitMobileTraining}
            title="Mobile Training"
            customFields={['vision', 'typeOfCounselling']}
          />
          <br/>
          <TrainingForm
            existingTrainings={computerTrainingData}
            addNewTraining={handleSubmitComputerTraining}
            title="Computer Training"
            customFields={['vision', 'typeOfCounselling']}
          />
          <br/>
          <TrainingForm
            existingTrainings={visionTrainingData}
            addNewTraining={handleSubmitVisionTraining}
            title="Vision Enhancement"
            customFields={['Diagnosis', 'MDVI']}
          />
            
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

    const benMirror = await fetch(`${process.env.NEXTAUTH_URL}/api/beneficiaryMirror?hospital=` + user.hospital.name, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    })
    const benMirrorJson = await benMirror.json();


  return {
    props: {
        user: user,
        beneficiaryMirror: benMirrorJson
    },
  };
}

export default UserPage;
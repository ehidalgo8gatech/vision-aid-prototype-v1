// pages/user.js
import { useState, useEffect } from 'react';
import Router, { useRouter } from 'next/router';
import { Pencil } from 'react-bootstrap-icons';
import Navigation from './navigation/Navigation';
import TrainingForm from './components/TrainingForm';
import TrainingFormCLVE from './components/TrainingFormCLVE';
import {getTrainingTypes} from "@/pages/api/trainingType";
import {getCounsellingType} from "@/pages/api/counsellingType";
import {getTrainingSubTypes} from "@/pages/api/trainingSubType";

function UserPage(props) {
  const router = useRouter();

  // State variable for form fields
  const [formData, setFormData] = useState(props.user);
  const [editableField, setEditableField] = useState('');

  const [mobileTrainingData, setMobileTrainingData] = useState([]);
    const [trainingData, setTrainingData] = useState([]);
  const [computerTrainingData, setComputerTrainingData] = useState([]);
  const [visionTrainingData, setVisionTrainingData] = useState([]);
  const [comprehensiveLowVisionEvaluationData, setComprehensiveLowVisionEvaluationData] = useState([]);
  const [lowVisionEvaluationData, setLowVisionEvaluationData] = useState([]);
  const [counsellingEducationData, setCounsellingEducationData] = useState([]);
  const [orientationMobilityData, setOrientationMobilityData] = useState([]);
  const [openMobile, setOpenMobile] = useState(false);
  const [openComputer, setOpenComputer] = useState(false);
  const [openVision, setOpenVision] = useState(false);


  useEffect(() => {
    setMobileTrainingData(props.user.Mobile_Training);
   }, []);
    useEffect(() => {
        setTrainingData(props.user.Training);
    }, []);
   useEffect(() => {
      setComputerTrainingData(props.user.Computer_Training);
   }, []);
    useEffect(() => {
      setVisionTrainingData(props.user.Vision_Enhancement);
    }, []);
    useEffect(() => {
      setComprehensiveLowVisionEvaluationData(props.user.Comprehensive_Low_Vision_Evaluation);
    }, []);
    useEffect(() => {
        setLowVisionEvaluationData(props.user.Low_Vision_Evaluation);
    }, []);
    useEffect(() => {
      setCounsellingEducationData(props.user.Counselling_Education);
    }, []);
    useEffect(() => {
      setOrientationMobilityData(props.user.Orientation_Mobility_Training);
    }, []);

  
    const callMe = async (data, url, setter, cur_data) => {
      data['sessionNumber'] = parseInt(data['sessionNumber']);
      // parse date
      data['date'] = new Date(data['date']);
      data['beneficiaryId'] = props.user.mrn;
      if (data['type'] == 'Other' && data['subType'] == null) {
          data['type'] = data['typeOther']
      } else if (data['subType'] == 'Other') {
          data['subType'] = data['subTypeOther']
      }
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
      } else {
        alert('An error occurred while saving data. Please try again.');
      }
      Router.reload()
    }


  const handleSubmitMobileTraining = async (data) => {
    // Submit the MobileTraining data to the API
    const url = '/api/mobileTraining';
    callMe(data, url, setMobileTrainingData, mobileTrainingData);
  };

    const handleSubmitTraining = async (data) => {
        // Submit the MobileTraining data to the API
        const url = '/api/training';
        callMe(data, url, setTrainingData, trainingData);
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

  const handleSubmitComprehensiveLowVisionEvaluation = async (data) => {
    // Submit the VisionTraining data to the API
    const url = '/api/comprehensiveLowVisionEvaluation';
    callMe(data, url, setVisionTrainingData, visionTrainingData);
  };

    const handleSubmitLowVisionEvaluation = async (data) => {
        // Submit the VisionTraining data to the API
        const url = '/api/lowVisionEvaluation';
        callMe(data, url, setVisionTrainingData, visionTrainingData);
    };

    const handleSubmitCounsellingEducation = async (data) => {
    // Submit the VisionTraining data to the API
    const url = '/api/counsellingEducation';
    callMe(data, url, setCounsellingEducationData, counsellingEducationData);
  }; 

  const handleSubmitOrientationMobility = async (data) => {
    // Submit the VisionTraining data to the API
    const url = '/api/orientationMobileTraining';
    callMe(data, url, setOrientationMobilityData, orientationMobilityData);
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

  const renderField = (label, field, type, canEdit) => (
    <div className="mb-3">
      {canEdit && editableField === field ? (
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
              {canEdit && (<Pencil />)}
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
        <h2 className="text-center mt-4 mb-4"><strong>Beneficiary Details</strong></h2>
        <br/>
        <div className="row">
            <div className="col-md-6">
            <div className="mb-3">
                {renderField('MRN', 'mrn', 'text', true)}
            </div>
            <div className="mb-3">
                {renderField('Beneficiary Name', 'beneficiaryName', 'text', true)}
            </div>
            <div className="mb-3">
                {renderField('Hospital Name', 'hospitalName', 'text', false)}
            </div>
            <div className="mb-3">
                      {editableField === "dateOfBirth" ? (
                        <div>
                            <strong>Date of Birth:</strong>
                            <form onSubmit={(e) => handleSubmit(e, "dateOfBirth")} className="d-inline ms-2">
                              <input
                                type="date"
                                className="form-control d-inline w-auto"
                                name="dateOfBirth"
                                value={formData["dateOfBirth"]}
                                onChange={handleInputChange}
                              />
                              <button type="submit" className="btn btn-primary btn-sm ms-2">
                                Save
                              </button>
                            </form>
                        </div>
                        ) : "date" == 'hidden' ? (<div></div>) : (
                        <div>
                            <strong>Date of Birth:</strong>
                            <span className="ms-2">
                              {formData["dateOfBirth"].toString().split('T')[0]}
                              <button
                                type="button"
                                className="btn btn-link btn-sm text-primary ms-2"
                                onClick={() => handleEditClick("dateOfBirth")}
                              >
                                  {(<Pencil />)}
                              </button>
                            </span>
                        </div>
                )}
            </div>
            <div className="mb-3">
                {renderField('Gender', 'gender', 'text', true)}
            </div>
            <div className="mb-3">
                {renderField('Phone Number', 'phoneNumber', ((props.beneficiaryMirror.phoneNumberRequired) ? 'text' : (props.beneficiaryMirror)), true)}
            </div>
            <div className="mb-3">
                {renderField('Education', 'education', ((props.beneficiaryMirror.educationRequired) ? 'text' : (props.beneficiaryMirror)), true)}
            </div>
            <div className="mb-3">
                {renderField('Occupation', 'occupation', ((props.beneficiaryMirror.occupationRequired) ? 'text' : (props.beneficiaryMirror)), true)}
            </div>
            <div className="mb-3">
                {renderField('Districts', 'districts', ((props.beneficiaryMirror.districtsRequired) ? 'text' : (props.beneficiaryMirror)), true)}
            </div>
            <div className="mb-3">
                {renderField('State', 'state', ((props.beneficiaryMirror.stateRequired) ? 'text' : (props.beneficiaryMirror)), true)}
            </div>
            <div className="mb-3">
            {editableField === "extraInformation" ? (
                        <div>
                            <strong>Extra Information:</strong>
                            <form onSubmit={(e) => handleSubmit(e, "extraInformation")} className="d-inline ms-2">
                              <input
                                type="text"
                                className="form-control d-inline w-auto"
                                name="extraInformation"
                                value={formData["extraInformation"]}
                                onChange={handleInputChange}
                              />
                              <button type="submit" className="btn btn-primary btn-sm ms-2">
                                Save
                              </button>
                            </form>
                        </div>
                        ) : "text" == 'hidden' ? (<div></div>) : (
                        <div>
                            <strong>Extra Information:</strong>
                            <span className="ms-2">
                            {formData["extraInformation"].toString().split(':')[1].split('"')[1]}:  {formData["extraInformation"].toString().split(':')[2].split('"')[1]}
                              <button
                                type="button"
                                className="btn btn-link btn-sm text-primary ms-2"
                                onClick={() => handleEditClick("extraInformation")}
                              >
                                  {(<Pencil />)}
                              </button>
                            </span>
                        </div>
                )}
            </div>
            </div>
            <div className="col-md-6">
                <TrainingFormCLVE
                    existingTrainings={lowVisionEvaluationData}
                    addNewTraining={handleSubmitLowVisionEvaluation}
                    title="Low Vision Screening"
                    customFieldsDistance={[
                        'distanceVisualAcuityRE',
                        'distanceVisualAcuityLE',
                        'distanceBinocularVisionBE',
                    ]}
                    customFieldsNear={[
                        'nearVisualAcuityRE',
                        'nearVisualAcuityLE',
                        'nearBinocularVisionBE',
                    ]}
                    api='lowVisionEvaluation'
                    allfields={false}
                />
                <br/>
            <TrainingFormCLVE
              existingTrainings={comprehensiveLowVisionEvaluationData}
              addNewTraining={handleSubmitComprehensiveLowVisionEvaluation}
              title="Comprehensive Low Vision Evaluation"
              customFieldsDistance={[
                'distanceVisualAcuityRE', 
                'distanceVisualAcuityLE', 
                'distanceBinocularVisionBE',
              ]}
              customFieldsNear={[
                'nearVisualAcuityRE', 
                'nearVisualAcuityLE',
                'nearBinocularVisionBE',
              ]}
              api='comprehensiveLowVisionEvaluation'
              allfields={true}
            />
            <br/>
            <TrainingForm
              existingTrainings={visionTrainingData}
              addNewTraining={handleSubmitVisionTraining}
              title="Vision Enhancement"
              customFields={[]}
              api='visionEnhancement'
              submitButtonTest='Add New Vision Enhancement'
              typeList={null}
              mdvi={true}
              subTypeList={null}
            />
            <br/>
            <br/>
            <br/>
            <br/>
                <br/>
                <TrainingForm
                    existingTrainings={counsellingEducationData}
                    addNewTraining={handleSubmitCounsellingEducation}
                    title="Counseling"
                    customFields={[]}
                    api='counsellingEducation'
                    submitButtonTest='Add New Counseling'
                    typeList={props.counsellingType}
                    mdvi={false}
                    subTypeList={null}
                />
                <br/>
            <TrainingForm
              existingTrainings={trainingData}
              addNewTraining={handleSubmitTraining}
              title="Training"
              customFields={[]}
              api='training'
              submitButtonTest='Add New Training'
              typeList={props.trainingType}
              mdvi={false}
              subTypeList={props.trainingSubType}
            />
            <br/>

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

  user.hospitalName = user.hospital.name

  return {
    props: {
        user: user,
        beneficiaryMirror: benMirrorJson,
        trainingType: await getTrainingTypes(),
        counsellingType: await getCounsellingType(),
        trainingSubType: await getTrainingSubTypes(),
    },
  };
}

export default UserPage;
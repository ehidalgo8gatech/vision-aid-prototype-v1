// pages/user.js
import { useState, useEffect } from "react";
import Router, { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { Pencil, Check2 } from "react-bootstrap-icons";
import Navigation from "./navigation/Navigation";
import TrainingForm from "./components/TrainingForm";
import BeneficiaryServicesTable from "./components/BeneficiaryServicesTable";
import UserProfileCard from "./components/UserProfileCard";
import TrainingFormCLVE from "./components/TrainingFormCLVE";
import { getTrainingTypes } from "@/pages/api/trainingType";
import { getCounsellingType } from "@/pages/api/counsellingType";
import { getTrainingSubTypes } from "@/pages/api/trainingSubType";
import { findAllHospital } from "./api/hospital";

function UserPage(props) {
  // console.log("props: ", JSON.stringify(props));
  // const session = await getSession();
  // const loggedInUser = getSessionUser();
  // console.log("session.user: ", JSON.stringify(session.user));
  const router = useRouter();

  // State variable for form fields
  const [formData, setFormData] = useState(props.user);
  const [editableField, setEditableField] = useState("");

  const [mobileTrainingData, setMobileTrainingData] = useState([]);
  const [trainingData, setTrainingData] = useState([]);
  const [computerTrainingData, setComputerTrainingData] = useState([]);
  const [visionTrainingData, setVisionTrainingData] = useState([]);
  const [
    comprehensiveLowVisionEvaluationData,
    setComprehensiveLowVisionEvaluationData,
  ] = useState([]);
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
    setComprehensiveLowVisionEvaluationData(
      props.user.Comprehensive_Low_Vision_Evaluation
    );
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

  const hospitalOptions = [];
  for (let i = 0; i < props.hospitals.length; i++) {
    const hospital = props.hospitals[i];
    hospitalOptions.push(
      <option key={hospital.name} value={hospital.id}>
        {hospital.name} (ID {hospital.id})
      </option>
    );
  }

  const callMe = async (data, url, setter, cur_data) => {
    data["sessionNumber"] = parseInt(data["sessionNumber"]);
    // parse date
    data["date"] = new Date(data["date"]);
    data["beneficiaryId"] = props.user.mrn;
    if (data["type"] == "Other" && data["subType"] == null) {
      data["type"] = data["typeOther"];
    } else if (data["subType"] == "Other") {
      data["subType"] = data["subTypeOther"];
    }
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // Handle response from the API
    if (!response.ok) {
      alert("An error occurred while saving data. Please try again.");
    }
    Router.reload();
  };

  const handleSubmitMobileTraining = async (data) => {
    // Submit the MobileTraining data to the API
    const url = "/api/mobileTraining";
    callMe(data, url, setMobileTrainingData, mobileTrainingData);
  };

  const handleSubmitTraining = async (data) => {
    // Submit the MobileTraining data to the API
    const url = "/api/training";
    callMe(data, url, setTrainingData, trainingData);
  };

  const handleSubmitComputerTraining = async (data) => {
    // Submit the ComputerTraining data to the API
    const url = "/api/computerTraining";
    callMe(data, url, setComputerTrainingData, computerTrainingData);
  };

  const handleSubmitVisionTraining = async (data) => {
    // Submit the VisionTraining data to the API
    const url = "/api/visionEnhancement";
    callMe(data, url, setVisionTrainingData, visionTrainingData);
  };

  const handleSubmitComprehensiveLowVisionEvaluation = async (data) => {
    // Submit the VisionTraining data to the API
    const url = "/api/comprehensiveLowVisionEvaluation";
    callMe(data, url, setVisionTrainingData, visionTrainingData);
  };

  const handleSubmitLowVisionEvaluation = async (data) => {
    // Submit the VisionTraining data to the API
    const url = "/api/lowVisionEvaluation";
    callMe(data, url, setVisionTrainingData, visionTrainingData);
  };

  const handleSubmitCounsellingEducation = async (data) => {
    // Submit the VisionTraining data to the API
    const url = "/api/counsellingEducation";
    callMe(data, url, setCounsellingEducationData, counsellingEducationData);
  };

  const handleSubmitOrientationMobility = async (data) => {
    // Submit the VisionTraining data to the API
    const url = "/api/orientationMobileTraining";
    callMe(data, url, setOrientationMobilityData, orientationMobilityData);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    console.log("Entered", e);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle select changes
  const handleSelectChange = (e) => {
    console.log("Entered", e);
    let sel = e.target;
    setFormData({
      ...formData,
      [sel.name]: sel.selectedOptions[0].label.split("(")[0],
    });
    if (sel.name === "hospitalName")
      setFormData((formData) => ({
          ...formData,
          hospitalId: sel.selectedOptions[0].value,
        }
      ));
  };

  // Handle edit icon click
  const handleEditClick = (field) => {
    setEditableField(field);
  };

  // Submit the edited data
  const handleSubmit = async (e, field) => {
    e.preventDefault();
    let fieldValue = formData[field];
    if (field === "hospitalName") {
      fieldValue = parseInt(document.getElementById("hospitalName").value);
      field = "hospitalId";
    }

    // Update user data in the database
    const response = await fetch(`/api/beneficiary`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mrn: props.user.mrn, [field]: fieldValue }),
    });

    // Handle response from the API
    if (response.ok) {
      setEditableField("");
    } else {
      alert("An error occurred while saving user data. Please try again.");
    }
  };

  if (!props.user) {
    return <div>Loading...</div>;
  }

  const renderSelectField = (field, type, canEdit) => {
    let options = [];
    let currentValue = null;
    if (field === "hospitalName") {
      options = hospitalOptions;
      currentValue = formData["hospitalId"];
    } else if (field === "gender") {
      options = [
        <option value="">Select Gender</option>,
        <option key="Male" value="Male">
          Male
        </option>,
        <option key="Female" value="Female">
          Female
        </option>,
        <option key="Other" value="Other">
          Other
        </option>,
      ];
      currentValue = formData[field];
    } else if (field === "mDVI") {
      options = [
        <option key="Yes" value="Yes">
          Yes
        </option>,
        <option key="No" value="No">
          No
        </option>,
        <option key="At Risk" value="At Risk">
          At Risk
        </option>,
      ];
      currentValue = formData[field];
    }

    return canEdit && editableField === field ? (
      <div className="text-align-left">
        <div className="flex-container">
          <form
            onSubmit={(e) => handleSubmit(e, field)}
            className="d-inline ms-2"
          >
            <div className="row">
              <div className="col-md-9 nopadding">
                <select
                  // className="form-select"
                  className="profile-card-select"
                  name={field}
                  id={field}
                  onChange={handleSelectChange}
                  value={currentValue}
                >
                  {options}
                </select>
              </div>
              {/* <div className="divider" /> */}
              <div className="col-md-1 nopadding" />
              <div className="col-md-2 nopadding">
                <button
                  type="submit"
                  className="btn text-primary ms-2 nopadding"
                >
                  <Check2 />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    ) : type == "hidden" ? (
      <div></div>
    ) : (
      <div className="text-align-left">
        <div className="flex-container">
          {formData[field]}
          <button
            type="button"
            className="btn btn-link btn-sm text-primary ms-2"
            onClick={() => handleEditClick(field)}
          >
            {canEdit && <Pencil />}
          </button>
        </div>
      </div>
    );
  };

  const renderField = (field, type, canEdit) => {
    return canEdit && editableField === field ? (
      <div className="text-align-left">
        <div className="flex-container">
          <form
            onSubmit={(e) => handleSubmit(e, field)}
            className="d-inline ms-2"
          >
            <div className="row">
              <div className="col-md-9 nopadding">
                <input
                  type={type}
                  className="profile-card-input"
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                />
              </div>
              {/* <div className="divider" /> */}
              <div className="col-md-1 nopadding" />
              <div className="col-md-2 nopadding">
                <button
                  type="submit"
                  className="btn text-primary ms-2 nopadding"
                >
                  <Check2 />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    ) : type == "hidden" ? (
      <div></div>
    ) : (
      <div className="text-align-left">
        <div className="flex-container">
          <div>{formData[field]}</div>
          <div className="text-align-right">
            <button
              type="button"
              className="btn btn-link btn-sm text-primary ms-2"
              onClick={() => handleEditClick(field)}
            >
              {canEdit && <Pencil />}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderDOB = () => {
    return editableField === "dateOfBirth" ? (
      <div className="text-align-left">
        <div className="flex-container">
          <form
            onSubmit={(e) => handleSubmit(e, "dateOfBirth")}
            // className="d-inline ms-2"
          >
            <div className="row nopadding">
              <div className="col-md-9 nopadding">
                <input
                  type="date"
                  className="profile-card-input"
                  name="dateOfBirth"
                  value={formData["dateOfBirth"]}
                  onChange={handleInputChange}
                />
              </div>
              {/* <div className="divider" /> */}
              <div className="col-md-1 nopadding" />
              <div className="col-md-2 nopadding">
                <button
                  type="submit"
                  className="btn text-primary ms-2 nopadding text-align-right"
                >
                  <Check2 />
                </button>
              </div>
              {/* </div> */}
            </div>
          </form>
        </div>
      </div>
    ) : "date" == "hidden" ? (
      <div></div>
    ) : (
      <div className="text-align-left">
        <div className="flex-container">
          {formData["dateOfBirth"].toString().split("T")[0]}
          <button
            type="button"
            className="btn btn-link btn-sm text-primary ms-2 text-align-right"
            onClick={() => handleEditClick("dateOfBirth")}
          >
            {<Pencil />}
          </button>
        </div>
      </div>
    );
  };

  const renderExtraInformation = () => {
    return editableField === "extraInformation" ? (
      <div className="text-align-left">
        <div className="flex-container">
          <form
            onSubmit={(e) => handleSubmit(e, "extraInformation")}
            className="d-inline ms-2"
          >
            <div className="row">
              <div className="col-md-9 nopadding">
                <textarea
                  type="text"
                  className="profile-card-input"
                  name="extraInformation"
                  value={formData["extraInformation"]}
                  onChange={handleInputChange}
                />
              </div>
              {/* <div className="divider" /> */}
              <div className="col-md-1 nopadding" />
              <div className="col-md-2 nopadding">
                <button
                  type="submit"
                  className="btn text-primary ms-2 nopadding text-align-right"
                >
                  <Check2 />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    ) : "text" == "hidden" ? (
      <div></div>
    ) : (
      <div className="text-align-left">
        <div className="flex-container">
          {formData["extraInformation"].toString().split(":")[1].split('"')[1]}:{" "}
          {formData["extraInformation"].toString().split(":")[2].split('"')[1]}
          <button
            type="button"
            className="btn btn-link btn-sm text-primary ms-2"
            onClick={() => handleEditClick("extraInformation")}
          >
            {<Pencil />}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Navigation />
      <div className="container">
        <h2 class="benficiary-heading">Beneficiary Details</h2>
        <hr class="horizontal-line" />
        <div className="row">
          <div className="col-md-6">
            <UserProfileCard
              gender={renderSelectField("gender", "text", true)}
              phoneNumber={renderField("phoneNumber", "text", true)}
              MRN={renderField("mrn", "text", true)}
              dob={renderDOB()}
              hospitalName={renderSelectField("hospitalName", "text", true)}
              education={renderField(
                "education",
                props.beneficiaryMirror.educationRequired
                  ? "text"
                  : props.beneficiaryMirror,
                true
              )}
              districts={renderField(
                "districts",
                props.beneficiaryMirror.occupationRequired
                  ? "text"
                  : props.beneficiaryMirror,
                true
              )}
              state={renderField(
                "state",
                props.beneficiaryMirror.stateRequired
                  ? "text"
                  : props.beneficiaryMirror,
                true
              )}
              beneficiaryName={renderField("beneficiaryName", "text", true)}
              occupation={renderField(
                "occupation",
                props.beneficiaryMirror.occupationRequired
                  ? "text"
                  : props.beneficiaryMirror,
                true
              )}
              extraInformation={renderExtraInformation()}
              name={formData["beneficiaryName"]}
              mdvi={renderSelectField("mDVI", "text", true)}
            />
          </div>
          <div className="col-md-6">
            <BeneficiaryServicesTable user={props.user} />
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps({ query }) {
  var user;
  try {
    const beneficiary = await await fetch(
      `${process.env.NEXTAUTH_URL}/api/beneficiary?mrn=${query.mrn}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    user = await beneficiary.json();
  } catch (error) {
    console.error("Error fetching users:", error);
  }

  if (!user) {
    return {
      notFound: true,
    };
  }

  const benMirror = await fetch(
    `${process.env.NEXTAUTH_URL}/api/beneficiaryMirror?hospital=` +
      user.hospital.name,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );
  const benMirrorJson = await benMirror.json();

  user.hospitalName = user.hospital.name;

  return {
    props: {
      user: user,
      beneficiaryMirror: benMirrorJson,
      trainingType: await getTrainingTypes(),
      counsellingType: await getCounsellingType(),
      trainingSubType: await getTrainingSubTypes(),
      hospitals: await findAllHospital(),
    },
  };
}

export default UserPage;

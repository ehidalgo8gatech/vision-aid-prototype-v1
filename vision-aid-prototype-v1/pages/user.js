// pages/user.js
import { useState, useEffect } from "react";
import Router, { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { Pencil } from "react-bootstrap-icons";
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
  console.log("props: ", JSON.stringify(props));
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
    if (response.ok) {
      alert("Training data saved successfully!");
    } else {
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
  };

  // Handle edit icon click
  const handleEditClick = (field) => {
    setEditableField(field);
  };

  // Submit the edited data
  const handleSubmit = async (e, field) => {
    e.preventDefault();
    let fieldValue = formData[field];
    if(field === "hospitalName") {
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
      alert("User data saved successfully!");
      setEditableField("");
    } else {
      alert("An error occurred while saving user data. Please try again.");
    }
  };

  if (!props.user) {
    return <div>Loading...</div>;
  }

  const renderSelectField = (field, type, canEdit) => {
    const hospitalOptions = [];
    for (let i = 0; i < props.hospitals.length; i++) {
      const hospital = props.hospitals[i];
      hospitalOptions.push(
        <option key={hospital.name} value={hospital.id}>
          {hospital.name} (ID {hospital.id})
        </option>
      );
    }
    return (
      <div className="mb-3">
        {canEdit && editableField === field ? (
          <div>
            <form
              onSubmit={(e) => handleSubmit(e, field)}
              className="d-inline ms-2"
            >
              <select className="form-select" name={field} id="hospitalName" onChange={handleSelectChange}>
                <option selected key="" value="">
                  Select Hospital
                </option>
                {hospitalOptions}
              </select>
              <button type="submit" className="btn btn-primary btn-sm ms-2">
                Save
              </button>
            </form>
          </div>
        ) : type == "hidden" ? (
          <div></div>
        ) : (
          <div>
            <span className="ms-2">
              {formData[field]}
              <button
                type="button"
                className="btn btn-link btn-sm text-primary ms-2"
                onClick={() => handleEditClick(field)}
              >
                {canEdit && <Pencil />}
              </button>
            </span>
          </div>
        )}
      </div>
    );
  };
  
  const renderField = (field, type, canEdit) => (
    <div className="mb-3">
      {canEdit && editableField === field ? (
        <div>
          <form
            onSubmit={(e) => handleSubmit(e, field)}
            className="d-inline ms-2"
          >
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
      ) : type == "hidden" ? (
        <div></div>
      ) : (
        <div>
          <span className="ms-2">
            {formData[field]}
            <button
              type="button"
              className="btn btn-link btn-sm text-primary ms-2"
              onClick={() => handleEditClick(field)}
            >
              {canEdit && <Pencil />}
            </button>
          </span>
        </div>
      )}
    </div>
  );

  const renderDOB = () => {
    return editableField === "dateOfBirth" ? (
      <div>
        <form
          onSubmit={(e) => handleSubmit(e, "dateOfBirth")}
          className="d-inline ms-2"
        >
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
    ) : "date" == "hidden" ? (
      <div></div>
    ) : (
      <div>
        <span className="ms-2">
          {formData["dateOfBirth"].toString().split("T")[0]}
          <button
            type="button"
            className="btn btn-link btn-sm text-primary ms-2"
            onClick={() => handleEditClick("dateOfBirth")}
          >
            {<Pencil />}
          </button>
        </span>
      </div>
    );
  };

  const renderExtraInformation = () => {
    return editableField === "extraInformation" ? (
      <div>
        <form
          onSubmit={(e) => handleSubmit(e, "extraInformation")}
          className="d-inline ms-2"
        >
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
    ) : "text" == "hidden" ? (
      <div></div>
    ) : (
      <div>
        <span className="ms-2">
          {formData["extraInformation"].toString().split(":")[1].split('"')[1]}:{" "}
          {formData["extraInformation"].toString().split(":")[2].split('"')[1]}
          <button
            type="button"
            className="btn btn-link btn-sm text-primary ms-2"
            onClick={() => handleEditClick("extraInformation")}
          >
            {<Pencil />}
          </button>
        </span>
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
              gender={renderField("gender", "text", true)}
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

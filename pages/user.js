// pages/user.js
import { useState, useEffect } from "react";
import Router, { useRouter } from "next/router";
import { Pencil, Check2 } from "react-bootstrap-icons";
import Navigation from "./navigation/Navigation";
import BeneficiaryServicesTable from "./components/BeneficiaryServicesTable";
import UserProfileCard from "./components/UserProfileCard";
import { getTrainingTypes } from "@/pages/api/trainingType";
import { getCounsellingType } from "@/pages/api/counsellingType";
import { getTrainingSubTypes } from "@/pages/api/trainingSubType";
import { findAllHospital } from "./api/hospital";
import { getUserFromSession } from "@/pages/api/user";
import ConsentForm from "./components/ConsentForm";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const currentUser = await getUserFromSession(ctx);
    if (currentUser === null) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    var user;
    try {
      const beneficiary = await await fetch(
        `${process.env.NEXTAUTH_URL}/api/beneficiary?mrn=${ctx.query.mrn}`,
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
        currentUser: currentUser,
        user: user,
        beneficiaryMirror: benMirrorJson,
        trainingType: await getTrainingTypes(),
        counsellingType: await getCounsellingType(),
        trainingSubType: await getTrainingSubTypes(),
        hospitals: await findAllHospital(),
      },
    };
  }
});

function UserPage(props) {
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
  const [consentName, setConsentName] = useState("");

  useEffect(() => {
    setMobileTrainingData(props.user.Mobile_Training);
  }, [props.user.Mobile_Training]);
  useEffect(() => {
    setTrainingData(props.user.Training);
  }, [props.user.Training]);
  useEffect(() => {
    setComputerTrainingData(props.user.Computer_Training);
  }, [props.user.Computer_Training]);
  useEffect(() => {
    setVisionTrainingData(props.user.Vision_Enhancement);
  }, [props.user.Vision_Enhancement]);
  useEffect(() => {
    setComprehensiveLowVisionEvaluationData(
      props.user.Comprehensive_Low_Vision_Evaluation
    );
  }, [props.user.Comprehensive_Low_Vision_Evaluation]);
  useEffect(() => {
    setLowVisionEvaluationData(props.user.Low_Vision_Evaluation);
  }, [props.user.Low_Vision_Evaluation]);
  useEffect(() => {
    setCounsellingEducationData(props.user.Counselling_Education);
  }, [props.user.Counselling_Education]);
  useEffect(() => {
    setOrientationMobilityData(props.user.Orientation_Mobility_Training);
  }, [props.user.Orientation_Mobility_Training]);

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

  const grantConsent = async () => {
    if (consentName === props.user.beneficiaryName) {
      // Update user data in the database
      const response = await fetch(`/api/beneficiary`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mrn: props.user.mrn, consent: "Yes" }),
      });

      // Handle response from the API
      if (response.ok) {
        setEditableField("");
        setConsentName("");
        setFormData((formData) => ({ ...formData, consent: "Yes" }));
      } else {
        alert("An error occurred while saving user data. Please try again.");
      }
    } else {
      alert(
        "Please ensure that you have entered the beneficiary's name correctly. Try again!"
      );
      setConsentName("");
    }
  };

  const revokeConsent = async () => {
    // Update user data in the database
    const response = await fetch(`/api/beneficiary`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mrn: props.user.mrn, consent: "No" }),
    });

    // Handle response from the API
    if (response.ok) {
      setEditableField("");
      setFormData((formData) => ({ ...formData, consent: "No" }));
      setConsentName("");
    } else {
      alert("An error occurred while saving user data. Please try again.");
    }
  };

  const softDeleteBeneficiary = async () => {
    // Update user data in the database
    const response = await fetch(`/api/beneficiary`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mrn: props.user.mrn, deleted: true }),
    });
    // Handle response from the API
    if (response.ok) {
      router.push("/beneficiary");
    } else {
      alert("An error occurred while deleting user. Please try again.");
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
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
      }));
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

  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const renderConsentField = (field, type, canEdit) => {
    if (formData[field] == null || formData[field] === "") {
      return (
        <div>
          <div className="text-align-left">
            <div className="flex-container">
              <div className="text-danger">
                No consent information recorded.
              </div>
              <div className="text-align-right">
                <button
                  className="btn btn-sm btn-link"
                  data-bs-toggle="modal"
                  data-bs-target="#indicateConsent"
                >
                  Indicate Consent
                </button>
              </div>
            </div>
          </div>
          <div className="modal" id="indicateConsent">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                {/* <!-- Modal Header --> */}
                <div className="modal-header">
                  <h4 className="modal-title">Consent Form</h4>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    id="close-indicate"
                  ></button>
                </div>

                {/* <!-- Modal body --> */}
                <div className="modal-body">
                  I hereby grant Vision-Aid the authority to use my photos,
                  videos or other media in their public campaigns.
                  <br />
                  <br />
                  <div>
                    Please type beneficiary&apos;s full name to grant consent:
                    <br />
                    <br />
                    <input
                      type="text"
                      value={consentName}
                      onChange={(e) => setConsentName(e.target.value)}
                    />
                  </div>
                </div>

                {/* <!-- Modal footer --> */}
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-success"
                    data-bs-dismiss="modal"
                    onClick={() => grantConsent()}
                  >
                    Yes, I consent
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    data-bs-dismiss="modal"
                    onClick={() => revokeConsent()}
                  >
                    No, I do not consent
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (formData[field] === "Yes") {
      return (
        <div>
          <div className="text-align-left">
            <div className="flex-container">
              <div>{formData[field]}</div>
              <div className="text-align-right">
                {canEdit && (
                  <button
                    className="btn btn-sm btn-link text-primary ms-2"
                    data-bs-toggle="modal"
                    data-bs-target="#revokeConsent"
                  >
                    Revoke Consent
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="modal" id="revokeConsent">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                {/* <!-- Modal Header --> */}
                <div className="modal-header">
                  <h4 className="modal-title">Revoke Consent?</h4>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    id="close-revoke"
                  ></button>
                </div>

                {/* <!-- Modal body --> */}
                <div className="modal-body">
                  Please confirm that you wish to revoke consent.
                </div>

                {/* <!-- Modal footer --> */}
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-danger"
                    data-bs-dismiss="modal"
                    onClick={() => revokeConsent()}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (formData[field] === "No") {
      return (
        <div>
          <div className="text-align-left">
            <div className="flex-container">
              <div>{formData[field]}</div>
              <div className="text-align-right">
                {canEdit && (
                  <button
                    className="btn btn-sm btn-link text-primary ms-2"
                    data-bs-toggle="modal"
                    data-bs-target="#grantConsent"
                  >
                    Grant Consent
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="modal" id="grantConsent">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                {/* <!-- Modal Header --> */}
                <div className="modal-header">
                  <h4 className="modal-title">Grant Consent?</h4>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    id="close-grant"
                  ></button>
                </div>

                {/* <!-- Modal body --> */}
                <div className="modal-body">
                  <div>
                    Type the beneficiary&apos;s full name to grant consent to
                    Vision-Aid. Please do so only if you wish to give Vision-Aid
                    the authority to use your photos, videos or other media in
                    their public campaigns.
                  </div>
                  <br /> <br />
                  <input
                    type="text"
                    value={consentName}
                    onChange={(e) => setConsentName(e.target.value)}
                  />
                </div>

                {/* <!-- Modal footer --> */}
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-success"
                    data-bs-dismiss="modal"
                    onClick={() => grantConsent()}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  const renderSelectField = (field, type, canEdit) => {
    let options = [];
    let currentValue = null;
    if (field === "hospitalName") {
      options = hospitalOptions;
      currentValue = formData["hospitalId"];
    } else if (field === "gender") {
      options = [
        <option key="" value="">
          Select Gender
        </option>,
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
    ) : (
      <div className="text-align-left">
        <div className="flex-container">
          {formatDate(formData["dateOfBirth"].toString().split("T")[0])}
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
      <Navigation user={props.currentUser} />
      <div className="container p-4 mb-3">
        <div className="d-flex">
          <h2 className="nopadding">Beneficiary Details</h2>
          <div className="left-auto-margin flex-container">
            <button
              className="btn btn-danger"
              data-bs-toggle="modal"
              data-bs-target="#deleteBeneficiary"
            >
              Delete Beneficiary
            </button>
          </div>
          <div className="modal" id="deleteBeneficiary">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                {/* <!-- Modal Header --> */}
                <div className="modal-header">
                  <h4 className="modal-title">Delete Beneficiary</h4>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    id="close-revoke"
                  ></button>
                </div>

                {/* <!-- Modal body --> */}
                <div className="modal-body">
                  Please confirm that you wish to delete this beneficiary permanently.
                </div>

                {/* <!-- Modal footer --> */}
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-danger"
                    data-bs-dismiss="modal"
                    onClick={() => softDeleteBeneficiary()}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr className="horizontal-line" />
        <div className="row">
          <div className="col-md-5">
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
          {/* <div className="col-md-1"></div> */}
          <div className="col-md-7">
            <BeneficiaryServicesTable user={props.user} />
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-md-5">
            <ConsentForm
              consent={renderConsentField("consent", "text", true)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserPage;

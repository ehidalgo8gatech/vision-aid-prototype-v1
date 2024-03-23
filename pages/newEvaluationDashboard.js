import Link from "next/link";
import styles from "@/styles/Home.module.css";
import Head from "next/head";
import Image from "next/image";
import Router, { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Inter } from "@next/font/google";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import TrainingFormCLVE from "./components/TrainingFormCLVE";
import TrainingForm from "./components/TrainingForm";
import UserProfileCard from "./components/UserProfileCard";
import Navigation from "./navigation/Navigation";
import { readUser } from "./api/user";

export default function NewEvaluationDashboard(props) {
  // State variable for form fields
  const [formData, setFormData] = useState(props.user);
  const service = props.user[props.service];
  const counsellingTypeList = props.counsellingTypeList;
  const trainingTypeList = props.trainingTypeList;
  const trainingSubTypeList = props.trainingSubTypeList;
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

  const updateMDVIForBeneficiary = async (data) => {
    data["mrn"] = props.user.mrn;

    const response = await fetch(`api/beneficiary`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // Handle response from the API
    if (!response.ok) {
      alert("An error occurred while saving data. Please try again.");
    }
  };

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
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mrn: props.user.mrn, [field]: formData[field] }),
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

  const formatTitle = (title) => {
    return title.split("_").join(" ");
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <Navigation user={props.currentUser} />
      <div className="container p-4 mb-3">
        <h2 className="benficiary-heading">{formatTitle(props.service)}</h2>
        <hr className="horizontal-line" />
        <div className="row">
          <div className="col-md-5">
            <UserProfileCard
              gender={props.user.gender}
              phoneNumber={props.user.phoneNumber}
              MRN={props.user.mrn}
              dob={formatDate(props.user.dateOfBirth)}
              hospitalName={props.user.hospitalName}
              education={props.user.education}
              districts={props.user.districts}
              state={props.user.state}
              beneficiaryName={props.user.beneficiaryName}
              occupation={props.user.occupation}
              extraInformation={props.user.extraInformation[0].value}
              name={props.user.beneficiaryName}
              mdvi={props.user.mDVI}
            />
          </div>
          <div className="col-md-7">
            {props.service === "Comprehensive_Low_Vision_Evaluation" && (
              <TrainingFormCLVE
                existingTrainings={comprehensiveLowVisionEvaluationData}
                addNewTraining={handleSubmitComprehensiveLowVisionEvaluation}
                mdvi={props.user.mDVI}
                updateMDVIForBeneficiary={updateMDVIForBeneficiary}
                title="Comprehensive Low Vision Evaluation"
                customFieldsDistance={[
                  "distanceVisualAcuityRE",
                  "distanceVisualAcuityLE",
                  "distanceBinocularVisionBE",
                ]}
                customFieldsNear={[
                  "nearVisualAcuityRE",
                  "nearVisualAcuityLE",
                  "nearBinocularVisionBE",
                ]}
                api="comprehensiveLowVisionEvaluation"
                allfields={true}
              />
            )}
            {props.service === "Low_Vision_Screening" && (
              <TrainingFormCLVE
                existingTrainings={lowVisionEvaluationData}
                addNewTraining={handleSubmitLowVisionEvaluation}
                mdvi={props.user.mDVI}
                updateMDVIForBeneficiary={updateMDVIForBeneficiary}
                title="Low Vision Screening"
                customFieldsDistance={[
                  "distanceVisualAcuityRE",
                  "distanceVisualAcuityLE",
                  "distanceBinocularVisionBE",
                ]}
                customFieldsNear={[
                  "nearVisualAcuityRE",
                  "nearVisualAcuityLE",
                  "nearBinocularVisionBE",
                ]}
                api="lowVisionEvaluation"
                allfields={false}
              />
            )}
            {props.service === "Vision_Enhancement" && (
              <TrainingForm
                existingTrainings={visionTrainingData}
                addNewTraining={handleSubmitVisionTraining}
                title="Vision Enhancement"
                customFields={[]}
                api="visionEnhancement"
                submitButtonTest="Add New Vision Enhancement"
                typeList={null}
                mdvi={true}
                updateMDVIForBeneficiary={updateMDVIForBeneficiary}
                mdviValue={props.user.mDVI}
                subTypeList={null}
              />
            )}
            {props.service === "Counselling_Education" && (
              <TrainingForm
                existingTrainings={counsellingEducationData}
                addNewTraining={handleSubmitCounsellingEducation}
                title="Counseling"
                customFields={[]}
                api="counsellingEducation"
                submitButtonTest="Add New Counseling"
                typeList={counsellingTypeList}
                mdvi={false}
                subTypeList={null}
              />
            )}
            {props.service === "Training" && (
              <TrainingForm
                existingTrainings={trainingData}
                addNewTraining={handleSubmitTraining}
                title="Training"
                customFields={[]}
                api="training"
                submitButtonTest="Add New Training"
                typeList={trainingTypeList}
                mdvi={false}
                subTypeList={trainingSubTypeList}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  if (session == null) {
    console.log("session is null");
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const currentUser = await readUser(session.user.email);
  var user;
  const service = ctx.query.service;
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

  let counsellingTypeList = [];
  let trainingTypeList = [];
  let trainingSubTypeList = [];
  if (service === "Counselling_Education") {
    try {
      const counsellingType = await await fetch(
        `${process.env.NEXTAUTH_URL}/api/counsellingType`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      counsellingTypeList = await counsellingType.json();
    } catch (error) {
      console.error("Error fetching counselling type:", error);
    }
  } else if (service === "Training") {
    try {
      const trainingType = await await fetch(
        `${process.env.NEXTAUTH_URL}/api/trainingType`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const trainingSubType = await await fetch(
        `${process.env.NEXTAUTH_URL}/api/trainingSubType`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      trainingTypeList = await trainingType.json();
      trainingSubTypeList = await trainingSubType.json();
    } catch (error) {
      console.error("Error fetching training type:", error);
    }
  }

  user.hospitalName = user.hospital.name;

  return {
    props: {
      currentUser: currentUser,
      user: user,
      service: service,
      counsellingTypeList: counsellingTypeList,
      trainingTypeList: trainingTypeList,
      trainingSubTypeList: trainingSubTypeList,
    },
  };
}

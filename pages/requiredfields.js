// This function gets called at build time
import { readUser } from "./api/user";
import { Table } from "react-bootstrap";
import { getSession } from "next-auth/react";
import { readBeneficiaryMirror } from "@/pages/api/beneficiaryMirror";
import { v4 as uuidv4 } from "uuid";
import Router from "next/router";
import Navigation from "./navigation/Navigation";
import { findAllHospital, findAllHospitalsHistory } from "@/pages/api/hospital";
import TrainingForm from "@/pages/components/TrainingForm";
import { readMobileTrainingMirror } from "@/pages/api/mobileTrainingMirror";
import { readComputerTrainingMirror } from "@/pages/api/computerTrainingMirror";
import { readOrientationMobilityTrainingMirror } from "@/pages/api/orientationMobilityTrainingMirror";
import { readVisionEnhancementMirror } from "@/pages/api/visionEnhancementMirror";
import { readComprehensiveLowVisionEvaluationMirror } from "@/pages/api/comprehensiveLowVisionEvaluationMirror";
import { readCounsellingEducationMirror } from "@/pages/api/counsellingEducationMirror";
import { ChevronDown, ChevronRight, Trash } from "react-bootstrap-icons";
import { useState } from "react";
import { getCounsellingType } from "@/pages/api/counsellingType";
import { getTrainingTypes } from "@/pages/api/trainingType";
import { getTrainingSubTypes } from "@/pages/api/trainingSubType";
import { Modal, Button, Form } from 'react-bootstrap';
import Layout from './components/layout';

// http://localhost:3000/requiredfields
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
  const user = await readUser(session.user.email);
  if (user.admin == null) {
    console.log("user admin is null");
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      user: user,
      requiredBeneficiaryFields: await readBeneficiaryMirror(),
      requiredMobileTraining: await readMobileTrainingMirror(),
      requiredComputerTraining: await readComputerTrainingMirror(),
      requiredOrientationMobilityTraining:
        await readOrientationMobilityTrainingMirror(),
      requiredVisionEnhancement: await readVisionEnhancementMirror(),
      requiredComprehensiveLowVisionEvaluation:
        await readComprehensiveLowVisionEvaluationMirror(),
      requiredCounsellingEducation: await readCounsellingEducationMirror(),
      hospitals: await findAllHospitalsHistory(),
      counselingTypeList: await getCounsellingType(),
      trainingTypeList: await getTrainingTypes(),
      trainingSubTypeList: await getTrainingSubTypes(),
      error: null,
    },
  };
}

function RequiredFields(props) {
  const [section, setSection] = useState("");
  const [hospitals, setHospitals] = useState(props.hospitals);

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const posts = [
    { id: 1, title: 'Post 1', content: 'Content 1', date: '2022-03-08' },
    { id: 2, title: 'Post 2', content: 'Content 2', date: '2022-03-09' },
    { id: 3, title: 'Post 3', content: 'Content 3', date: '2022-03-07' },
  ];

  const handleShow = () => {
    setShowModal(true);
    setEditMode(false);
  };

  const handleClose = () => {
    setShowModal(false);
    setConfirmDelete(false);
    setTitle('');
    setContent('');
    setSelectedPost(null);
  };

  const handleEdit = (post) => {
    setSelectedPost(post);
    setTitle(post.title);
    setContent(post.content);
    setShowModal(true);
    setEditMode(true);
  };

  const handleDelete = (post) => {
    setSelectedPost(post);
    setConfirmDelete(true);
  };

  const handleSaveChanges = () => {
    // Handle saving changes
    handleClose();
  };

  function removeExtraField(fieldId) {
    return function () {
      console.log(fieldId);
      document.getElementById(fieldId).remove();
    };
  }

  async function addFieldsSubmit(e) {
    e.preventDefault();
    let hospitalNameOverride = document.getElementById("hospitalSelect").value;
    if (hospitalNameOverride == "") {
      hospitalNameOverride = null;
    }
    let phoneNumberRequired = document.getElementById(
      "phoneNumberRequired"
    ).checked;
    let educationRequired =
      document.getElementById("educationRequired").checked;
    let occupationRequired =
      document.getElementById("occupationRequired").checked;
    let districtsRequired =
      document.getElementById("districtsRequired").checked;
    let stateRequired = document.getElementById("stateRequired").checked;
    //let diagnosisRequired = document.getElementById("diagnosisRequired").checked
    //let visionRequired = document.getElementById("visionRequired").checked
    //let mDVIRequired = document.getElementById("mDVIRequired").checked
    //console.log("phoneNumberRequired" + phoneNumberRequired, "educationRequired" + educationRequired, "occupationRequired" + occupationRequired, "districtsRequired" + districtsRequired, "stateRequired" + stateRequired, "diagnosisRequired" + diagnosisRequired, "visionRequired" + visionRequired, "mDVIRequired" + mDVIRequired)
    let elements = document.getElementsByName("extraField");
    let extraInformation = [];
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].value == null || elements[i].value == "") continue;
      let body = {
        name: elements[i].value,
        type: "txt",
        required: true,
      };
      extraInformation.push(body);
    }
    let extraInformationRequired = JSON.stringify(extraInformation);
    console.log(extraInformationRequired);
    console.log("extra fields required" + extraInformationRequired);
    let response = await fetch("/api/beneficiaryMirror", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hospitalNameOverride: hospitalNameOverride,
        phoneNumberRequired: phoneNumberRequired,
        educationRequired: educationRequired,
        occupationRequired: occupationRequired,
        districtsRequired: districtsRequired,
        stateRequired: stateRequired,
        //diagnosisRequired: diagnosisRequired,
        //visionRequired: visionRequired,
        //mDVIRequired: mDVIRequired,
        extraInformationRequired: extraInformationRequired,
      }),
    });
    let json = await response.json();
    alert("beneficiary required " + JSON.stringify(json));
    Router.reload();
  }

  function addField(elementId, name) {
    let container = document.getElementById(elementId);
    let input = document.createElement("input");
    let fieldId = uuidv4();

    let outerWrapper = document.createElement("div");
    outerWrapper.id = fieldId;

    let wrapper = document.createElement("div");
    wrapper.className = "row";

    let inputDiv = document.createElement("div");
    inputDiv.className = "col-md-6";

    let buttonDiv = document.createElement("div");
    buttonDiv.className = "col-md-6";

    input.type = "text";
    input.name = name;
    input.className = "form-control";
    let button = document.createElement("button");
    let buttonId = uuidv4();

    button.onclick = removeExtraField(fieldId);
    button.id = buttonId;
    button.type = "button";
    button.className = "btn btn-danger border-0 btn-block";
    button.textContent = "Remove Field";
    inputDiv.appendChild(input);
    buttonDiv.appendChild(button);
    wrapper.appendChild(inputDiv);
    wrapper.appendChild(buttonDiv);
    outerWrapper.appendChild(wrapper);
    outerWrapper.appendChild(document.createElement("br"));
    container.appendChild(outerWrapper);
  }

  let extraInformation = JSON.parse(
    props.requiredBeneficiaryFields.extraInformationRequired
  );
  const exInfo = [];
  extraInformation.forEach((data) => {
    exInfo.push(
      <div class="col-md-12" id={data.name + "Beneficiary"}>
        <div class="row">
          <div class="col-md-6">
            <input
              type="text"
              name="extraField"
              class="form-control"
              defaultValue={data.name}
            />
          </div>
          <div class="col-md-6">
            <button
              type="button"
              onClick={removeExtraField(data.name + "Beneficiary")}
              class="btn btn-danger border-0 btn-block"
            >
              Remove Field
            </button>
          </div>
        </div>
        <br />
      </div>
    );
  });
  const hospitalInfo = [];
  props.hospitals.forEach((data) => {
    hospitalInfo.push(
      <div>
        <p>{data.name}</p>
        <br />
      </div>
    );
  });

  async function addFieldsTrainingSubmit(e, type, api) {
    e.preventDefault();
    let hospitalNameOverride = document.getElementById(
      "hospitalNameOverride" + type
    ).value;
    if (hospitalNameOverride == "") {
      hospitalNameOverride = null;
    }
    let elements = document.getElementsByName("extraFields" + type);
    let extraInformation = [];
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].value == null || elements[i].value == "") continue;
      let body = {
        name: elements[i].value,
        type: "txt",
        required: true,
      };
      extraInformation.push(body);
    }
    let extraInformationRequired = JSON.stringify(extraInformation);
    console.log(extraInformationRequired);
    console.log("extra fields required" + extraInformationRequired);
    let response = await fetch("/api/" + api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hospitalNameOverride: hospitalNameOverride,
        extraInformationRequired: extraInformationRequired,
      }),
    });
    let json = await response.json();
    alert("training " + type + " required " + JSON.stringify(json));
    Router.reload();
  }

  let exInfoMobileTrainingPOJO = JSON.parse(
    props.requiredMobileTraining.extraInformationRequired
  );
  const exInfoMobileTraining = [];
  exInfoMobileTrainingPOJO.forEach((data) => {
    exInfoMobileTraining.push(
      <div class="col-md-12" id={data.name + "mobileTraining"}>
        <div class="row">
          <div class="col-md-10">
            <input
              type="text"
              name="extraFieldsMobileTraining"
              class="form-control"
              defaultValue={data.name}
            />
          </div>
          <div class="col-md-2">
            <button
              type="button"
              onClick={removeExtraField(data.name + "mobileTraining")}
              class="btn btn-danger border-0 btn-block"
            >
              Remove Field
            </button>
          </div>
        </div>
        <br />
      </div>
    );
  });

  let exInfoComprehensiveLowVisionEvaluationPOJO = JSON.parse(
    props.requiredComprehensiveLowVisionEvaluation.extraInformationRequired
  );
  const exInfoComprehensiveLowVisionEvaluation = [];
  exInfoComprehensiveLowVisionEvaluationPOJO.forEach((data) => {
    exInfoComprehensiveLowVisionEvaluation.push(
      <div
        class="col-md-12"
        id={data.name + "comprehensiveLowVisionEvaluation"}
      >
        <div class="row">
          <div class="col-md-10">
            <input
              type="text"
              name="extraFieldsComprehensiveLowVisionEvaluation"
              class="form-control"
              defaultValue={data.name}
            />
          </div>
          <div class="col-md-2">
            <button
              type="button"
              onClick={removeExtraField(
                data.name + "comprehensiveLowVisionEvaluation"
              )}
              class="btn btn-danger border-0 btn-block"
            >
              Remove Field
            </button>
          </div>
        </div>
        <br />
      </div>
    );
  });

  let exInfoVisionEnhancementPOJO = JSON.parse(
    props.requiredVisionEnhancement.extraInformationRequired
  );
  const exInfoVisionEnhancement = [];
  exInfoVisionEnhancementPOJO.forEach((data) => {
    exInfoVisionEnhancement.push(
      <div class="col-md-12" id={data.name + "visionEnhancement"}>
        <div class="row">
          <div class="col-md-10">
            <input
              type="text"
              name="extraFieldsVisionEnhancement"
              class="form-control"
              defaultValue={data.name}
            />
          </div>
          <div class="col-md-2">
            <button
              type="button"
              onClick={removeExtraField(data.name + "visionEnhancement")}
              class="btn btn-danger border-0 btn-block"
            >
              Remove Field
            </button>
          </div>
        </div>
        <br />
      </div>
    );
  });

  let exInfoCounsellingEducationPOJO = JSON.parse(
    props.requiredCounsellingEducation.extraInformationRequired
  );
  const exInfoCounsellingEducation = [];
  exInfoCounsellingEducationPOJO.forEach((data) => {
    exInfoCounsellingEducation.push(
      <div class="col-md-12" id={data.name + "counsellingEducation"}>
        <div class="row">
          <div class="col-md-10">
            <input
              type="text"
              name="extraFieldsCounsellingEducation"
              class="form-control"
              defaultValue={data.name}
            />
          </div>
          <div class="col-md-2">
            <button
              type="button"
              onClick={removeExtraField(data.name + "counsellingEducation")}
              class="btn btn-danger border-0 btn-block"
            >
              Remove Field
            </button>
          </div>
        </div>
        <br />
      </div>
    );
  });

  var showForm = {
    ComprehensiveLowVisionEvaluation: false,
    visionEnhancement: false,
    counsellingEducation: false,
    mobile: false,
    computer: false,
    orientationMobility: false,
    addCounsellingType: false,
    addTrainingType: false,
    removeCounsellingType: false,
    removeTrainingType: false,
    addTrainingSubType: false,
  };
  function handleToggle(type) {
    var displayTrainingElement = document.getElementById(
      type + "TrainingRequiredFields"
    );
    if (displayTrainingElement.style.display === "block") {
      displayTrainingElement.style.display = "none";
    } else {
      displayTrainingElement.style.display = "block";
    }
    showForm[type] = !showForm[type];
  }

  function handleToggleByType(type) {
    var displayTrainingElement = document.getElementById(type);
    if (displayTrainingElement.style.display === "block") {
      displayTrainingElement.style.display = "none";
    } else {
      displayTrainingElement.style.display = "block";
    }
    showForm[type] = !showForm[type];
  }

  const hospitalOptions = [];
  for (let i = 0; i < props.hospitals.length; i++) {
    const hospital = props.hospitals[i];
    hospitalOptions.push(
      <option key={hospital.name} value={hospital.name}>
        {hospital.name} (ID {hospital.id})
      </option>
    );
  }

  async function addHospital(e) {
    e.preventDefault();
    let hospitalName = document.getElementById("createHospitalName").value;
    let response = await fetch("/api/hospital", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: hospitalName,
      }),
    });
    let json = await response.json();
    alert("hospital added " + JSON.stringify(json));
    Router.reload();
  }

  async function addTypesSubmit(e, api, type) {
    e.preventDefault();
    const response = await fetch("api/" + api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value: e.target[type].value }),
    });

    // Handle response from the API
    if (response.ok) {
      alert("Type data saved successfully!");
    } else {
      alert("An error occurred while saving data. Please try again.");
    }
    Router.reload();
  }

  let removeTypeCounseling = [];
  let foundTypeCounselingOther = false;

  for (const counselingType of props.counselingTypeList) {
    if (foundTypeCounselingOther == false && counselingType == "Other") {
      foundTypeCounselingOther = true;
      console.log("Do not delete other option");
      continue;
    }
    removeTypeCounseling.push(
      <div>
        <span>Delete Counseling Type: {counselingType}</span>&nbsp;
        <Trash
          style={{ cursor: "pointer" }}
          onClick={() => deleteTraining("counsellingType", counselingType)}
        />
      </div>
    );
  }

  let removeTypeTraining = [];
  let foundTypeTrainingOther = false;
  let trainingTypesOption = [];

  async function deleteTraining(api, trainingType) {
    await fetch("/api/" + api, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        value: trainingType,
      }),
    });
    Router.reload();
  }

  for (const trainingType of props.trainingTypeList) {
    trainingTypesOption.push(
      <option value={trainingType}>{trainingType}</option>
    );
    if (foundTypeTrainingOther == false && trainingType == "Other") {
      foundTypeTrainingOther = true;
      console.log("Do not delete other option");
      continue;
    }
    removeTypeTraining.push(
      <div>
        <span>Delete Training Type: {trainingType}</span>&nbsp;
        <Trash style={{ cursor: "pointer" }} onClick={() => deleteTraining("trainingType", trainingType)} />
      </div>
    );
  }

  async function removeTypesSubmit(e, api, html) {
    e.preventDefault();
    await fetch("/api/" + api, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        value: e.target[html].value,
      }),
    });
    Router.reload();
  }

  let removeSubTypeTraining = [];
  let foundSubTypeTrainingOther = {};

  async function deleteTrainingSubType(id) {
    await fetch("/api/" + "trainingSubType", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: id,
      }),
    });
    Router.reload();
  }

  for (const trainingSubType of props.trainingSubTypeList) {
    if (
      foundSubTypeTrainingOther[trainingSubType.trainingType.id] == null &&
      trainingSubType.value == "Other"
    ) {
      foundSubTypeTrainingOther[trainingSubType.trainingType.id] = true;
      console.log("Do not delete other option");
      continue;
    }
    removeSubTypeTraining.push(
      <div>
        <span>
          Delete Training Type: {trainingSubType.trainingType.value} Training
          Sub Type: {trainingSubType.value}
        </span>&nbsp;
        <Trash style={{ cursor: "pointer" }} onClick={() => deleteTrainingSubType(trainingSubType.id)} />
      </div>
    );
  }

  async function addSubTypesSubmit(e) {
    e.preventDefault();
    const response = await fetch("api/" + "trainingSubType", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        value: e.target["addTrainingSubType"].value,
        trainingTypeId: e.target["training"].value,
      }),
    });

    // Handle response from the API
    if (response.ok) {
      alert("Type data saved successfully!");
    } else {
      alert("An error occurred while saving data. Please try again.");
    }
    Router.reload();
  }

  const hideHospital = async (id, name) => {
    const data = {
      id: id,
      name: name,
      deleted: true,
    };
    const res = await fetch("/api/hospital", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const benData = { hospitalId: id, deleted: true };
    const benRes = await fetch("/api/beneficiary", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(benData),
    });
    if (res.status == 200 && benRes.status == 200) {
      alert("Hospital removed successfully!");
      setHospitals((hospitals) =>
        hospitals.map((hospital) =>
          hospital.id === id ? { ...hospital, deleted: true } : hospital
        )
      );
    } else {
      alert("Failed to save data!");
    }
  };

  const showHospital = async (id, name) => {
    const data = {
      id: id,
      name: name,
      deleted: false,
    };
    const res = await fetch("/api/hospital", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const benData = { hospitalId: id, deleted: false };
    const benRes = await fetch("/api/beneficiary", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(benData),
    });
    if (res.status == 200 && benRes.status == 200) {
      alert("Hospital restored successfully!");
      setHospitals((hospitals) =>
        hospitals.map((hospital) =>
          hospital.id === id ? { ...hospital, deleted: false } : hospital
        )
      );
    } else {
      alert("Failed to save data!");
    }
  };

  return (
    <Layout>
    <div className="content">
      <Navigation user={props.user} />
      <div className="d-flex flex-row h-100 flex-grow-1">
        <div className="container col-md-3 m-4 p-4">
          <div className="p-2">
            <button
              className={`w-100 text-align-left ${
                section === "hospitals"
                  ? "btn btn-success btn-block active-tab"
                  : "btn btn-light btn-block"
              }`}
              onClick={() => setSection("hospitals")}
            >
              Hospitals
            </button>
          </div>
          <div className="p-2">
            <button
              className={`w-100 text-align-left ${
                section === "beneficiaries"
                  ? "btn btn-success btn-block active-tab"
                  : "btn btn-light btn-block"
              }`}
              onClick={() => setSection("beneficiaries")}
            >
              Beneficiaries
            </button>
          </div>
          <div className="p-2">
            <button
              className={`w-100 text-align-left ${
                section === "evaluations"
                  ? "btn btn-success btn-block active-tab"
                  : "btn btn-light btn-block"
              }`}
              onClick={() => setSection("evaluations")}
            >
              Evaluations
            </button>
          </div>
          <div className="p-2">
            <button
              className={`w-100 text-align-left ${
                section === "trainings"
                  ? "btn btn-success btn-block active-tab"
                  : "btn btn-light btn-block"
              }`}
              onClick={() => setSection("trainings")}
            >
              Trainings
            </button>
          </div>
          <div className="p-2">
            <button
              className={`w-100 text-align-left ${
                section === "landing-page"
                  ? "btn btn-success btn-block active-tab"
                  : "btn btn-light btn-block"
              }`}
              onClick={() => setSection("landing-page")}
            >
              Landing Page
            </button>
          </div>
        </div>
        <div className="col-md-8">
          {section === "hospitals" && (
            <div className="container m-4 p-4">
              <form action="#" method="POST" onSubmit={(e) => addHospital(e)}>
                <div className="text-center">
                  <h2 className="text-center mt-4 mb-4">
                    <strong>Add Hospital</strong>
                  </h2>
                  <div>
                    <input
                      type="text"
                      className="form-control"
                      id="createHospitalName"
                      // style={{ marginLeft: "170px" }}
                    />
                    <label
                      className="form-label"
                      htmlFor="createHospitalName"
                      // style={{ marginLeft: "325px" }}
                    >
                      Hospital Name
                    </label>
                  </div>
                  <br />
                  <button type="submit" className="btn btn-success">
                    Submit
                  </button>
                </div>
              </form>
              <div>
                <h2 className="text-center mt-4 mb-4">
                  <strong>Remove Hospital</strong>
                </h2>
                <div>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Hospital</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hospitals.map((hospital) => (
                        <tr key={hospital.id}>
                          <td>{hospital.name}</td>
                          <td>
                            {!hospital.deleted && (
                              <button
                                className="btn btn-danger"
                                type="button"
                                onClick={(e) =>
                                  hideHospital(hospital.id, hospital.name)
                                }
                              >
                                Hide
                              </button>
                            )}
                            {hospital.deleted && (
                              <button
                                className="btn btn-success"
                                type="button"
                                onClick={(e) =>
                                  showHospital(hospital.id, hospital.name)
                                }
                              >
                                Show
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
                <br />
              </div>
              <br />
            </div>
          )}
          {section === "beneficiaries" && (
            <div className="container m-4 p-4">
              <form
                action="#"
                method="POST"
                onSubmit={(e) => addFieldsSubmit(e)}
              >
                <h2 className="text-center mt-4 mb-4">
                  <strong>Required Beneficiary Fields</strong>
                </h2>

                <p>
                  MRN, Beneficiary Name, And Hospital Name Will Always Be
                  Required
                </p>

                <div class="row justify-content-center">
                  <div className="col-md-6 mx-auto">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <label
                        htmlFor="hospitalSelect"
                        style={{ marginRight: "10px" }}
                      >
                        Select a hospital
                      </label>
                      <select
                        id="hospitalSelect"
                        style={{
                          border: "1px solid #ccc",
                          borderRadius: "0.25rem",
                          color: "#495057",
                          backgroundColor: "#fff",
                          boxShadow: "inset 0 1px 1px rgba(0, 0, 0, 0.075)",
                          transition:
                            "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
                        }}
                      >
                        <option value="">All</option>
                        {hospitalOptions}
                      </select>
                    </div>
                  </div>
                </div>
                <br />
                <strong>Required Fields</strong>
                <br />
                <br />
                <div className="form-group">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="phoneNumberRequired"
                    defaultChecked={
                      props.requiredBeneficiaryFields.phoneNumberRequired
                    }
                  />
                  <label
                    className="form-check-label"
                    htmlFor="phoneNumberRequired"
                    style={{ marginLeft: "10px" }}
                  >
                    Phone Number
                  </label>
                </div>
                <br />
                <div className="form-group">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="educationRequired"
                    defaultChecked={
                      props.requiredBeneficiaryFields.educationRequired
                    }
                  />
                  <label
                    className="form-check-label"
                    htmlFor="educationRequired"
                    style={{ marginLeft: "10px" }}
                  >
                    Education
                  </label>
                </div>
                <br />
                <div className="form-group">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="occupationRequired"
                    defaultChecked={
                      props.requiredBeneficiaryFields.occupationRequired
                    }
                  />
                  <label
                    className="form-check-label"
                    htmlFor="occupationRequired"
                    style={{ marginLeft: "10px" }}
                  >
                    Occupation
                  </label>
                </div>
                <br />
                <div className="form-group">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="districtsRequired"
                    defaultChecked={
                      props.requiredBeneficiaryFields.districtsRequired
                    }
                  />
                  <label
                    className="form-check-label"
                    htmlFor="districtsRequired"
                    style={{ marginLeft: "10px" }}
                  >
                    Districts
                  </label>
                </div>
                <br />
                <div className="form-group">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="stateRequired"
                    defaultChecked={
                      props.requiredBeneficiaryFields.stateRequired
                    }
                  />
                  <label
                    className="form-check-label"
                    htmlFor="stateRequired"
                    style={{ marginLeft: "10px" }}
                  >
                    State
                  </label>
                  <br />
                  <br />
                  <div className="col-md-8 mx-auto">
                    <div id="extraFields">
                      <strong>Extra Fields</strong>
                      <br />
                      <br />
                      {exInfo}
                    </div>
                    <button
                      type="button"
                      onClick={() => addField("extraFields", "extraField")}
                      className="btn btn-success border-0 btn-block"
                    >
                      Add Required Field
                    </button>
                    <br />
                  </div>
                </div>
                <br />
                <br />
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </form>
            </div>
          )}
          {section === "evaluations" && (
            <div className="container m-4 p-4">
              <h2 className="text-center mt-4 mb-4">
                <strong>Other Form Required Fields</strong>
              </h2>
              <br />

              <div class="accordion" id="accordionExample">
                <div class="accordion-item">
                  <h2 class="accordion-header" id="headingOne">
                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                      <strong>Comprehensive Low Vision Evaluation</strong>
                    </button>
                  </h2>
                  <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                      <div
                        // className="container"
                        id="comprehensiveLowVisionEvaluationTrainingRequiredFields"
                      >
                        <form
                          action="#"
                          method="POST"
                          onSubmit={(e) =>
                            addFieldsTrainingSubmit(
                              e,
                              "ComprehensiveLowVisionEvaluation",
                              "comprehensiveLowVisionEvaluationMirror"
                            )
                          }
                        >
                          <div class="row justify-content-center">
                            <div className="col-md-6 mx-auto">
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <label
                                  htmlFor="hospitalNameOverrideComprehensiveLowVisionEvaluation"
                                  style={{ marginRight: "10px" }}
                                >
                                  Select a hospital
                                </label>
                                <select
                                  id="hospitalNameOverrideComprehensiveLowVisionEvaluation"
                                  style={{
                                    border: "1px solid #ccc",
                                    borderRadius: "0.25rem",
                                    color: "#495057",
                                    backgroundColor: "#fff",
                                    boxShadow: "inset 0 1px 1px rgba(0, 0, 0, 0.075)",
                                    transition:
                                      "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
                                  }}
                                >
                                  <option value="">All</option>
                                  {hospitalOptions}
                                </select>
                              </div>
                            </div>
                          </div>
                          <div id="extraFieldsComprehensiveLowVisionEvaluation">
                            <strong>Extra Fields</strong>
                            <br />
                            <br />
                            {exInfoComprehensiveLowVisionEvaluation}
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              addField(
                                "extraFieldsComprehensiveLowVisionEvaluation",
                                "extraFieldsComprehensiveLowVisionEvaluation"
                              )
                            }
                            className="btn btn-success border-0 btn-block"
                          >
                            Add Required Field
                          </button>
                          <br />
                          <br />
                          <button type="submit" className="btn btn-primary">
                            Submit
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="accordion-item">
                  <h2 class="accordion-header" id="headingTwo">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                      <strong>Vision Enhancement</strong>
                    </button>
                  </h2>
                  <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                      <div
                        // className="container"
                        id="visionEnhancementTrainingRequiredFields"
                      >
                        <form
                          action="#"
                          method="POST"
                          onSubmit={(e) =>
                            addFieldsTrainingSubmit(
                              e,
                              "VisionEnhancement",
                              "visionEnhancementMirror"
                            )
                          }
                        >
                          <div class="row justify-content-center">
                            <div className="col-md-6 mx-auto">
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <label
                                  htmlFor="hospitalNameOverrideVisionEnhancement"
                                  style={{ marginRight: "10px" }}
                                >
                                  Select a hospital
                                </label>
                                <select
                                  id="hospitalNameOverrideVisionEnhancement"
                                  style={{
                                    border: "1px solid #ccc",
                                    borderRadius: "0.25rem",
                                    color: "#495057",
                                    backgroundColor: "#fff",
                                    boxShadow: "inset 0 1px 1px rgba(0, 0, 0, 0.075)",
                                    transition:
                                      "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
                                  }}
                                >
                                  <option value="">All</option>
                                  {hospitalOptions}
                                </select>
                              </div>
                            </div>
                          </div>
                          <div id="extraFieldsVisionEnhancement">
                            <strong>Extra Fields</strong>
                            <br />
                            <br />
                            {exInfoVisionEnhancement}
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              addField(
                                "extraFieldsVisionEnhancement",
                                "extraFieldsVisionEnhancement"
                              )
                            }
                            className="btn btn-success border-0 btn-block"
                          >
                            Add Required Field
                          </button>
                          <br />
                          <br />
                          <button type="submit" className="btn btn-primary">
                            Submit
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="accordion-item">
                  <h2 class="accordion-header" id="headingThree">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                      <strong>Mobile Training</strong>
                    </button>
                  </h2>
                  <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                      <div id="mobileTrainingRequiredFields">
                        <form
                          action="#"
                          method="POST"
                          onSubmit={(e) =>
                            addFieldsTrainingSubmit(
                              e,
                              "MobileTraining",
                              "mobileTrainingMirror"
                            )
                          }
                        >
                          <div class="row justify-content-center">
                            <div className="col-md-6 mx-auto">
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <label
                                  htmlFor="hospitalNameOverrideMobileTraining"
                                  style={{ marginRight: "10px" }}
                                >
                                  Select a hospital
                                </label>
                                <select
                                  id="hospitalNameOverrideMobileTraining"
                                  style={{
                                    border: "1px solid #ccc",
                                    borderRadius: "0.25rem",
                                    color: "#495057",
                                    backgroundColor: "#fff",
                                    boxShadow: "inset 0 1px 1px rgba(0, 0, 0, 0.075)",
                                    transition:
                                      "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
                                  }}
                                >
                                  <option value="">All</option>
                                  {hospitalOptions}
                                </select>
                              </div>
                            </div>
                          </div>
                          <div id="extraFieldsMobileTraining">
                            <strong>Extra Fields</strong>
                            <br />
                            <br />
                            {exInfoMobileTraining}
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              addField(
                                "extraFieldsMobileTraining",
                                "extraFieldsMobileTraining"
                              )
                            }
                            className="btn btn-success border-0 btn-block"
                          >
                            Add Required Field
                          </button>
                          <br />
                          <br />
                          <button type="submit" className="btn btn-primary">
                            Submit
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="accordion-item">
                  <h2 class="accordion-header" id="headingFour">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                      <strong>Counselling Education</strong>
                    </button>
                  </h2>
                  <div id="collapseFour" class="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                      <div id="counsellingEducationTrainingRequiredFields">
                        <form
                          action="#"
                          method="POST"
                          onSubmit={(e) =>
                            addFieldsTrainingSubmit(
                              e,
                              "CounsellingEducation",
                              "counsellingEducationMirror"
                            )
                          }
                        >
                          <div class="row justify-content-center">
                            <div className="col-md-6 mx-auto">
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <label
                                  htmlFor="hospitalNameOverrideCounsellingEducation"
                                  style={{ marginRight: "10px" }}
                                >
                                  Select a hospital
                                </label>
                                <select
                                  id="hospitalNameOverrideCounsellingEducation"
                                  style={{
                                    border: "1px solid #ccc",
                                    borderRadius: "0.25rem",
                                    color: "#495057",
                                    backgroundColor: "#fff",
                                    boxShadow: "inset 0 1px 1px rgba(0, 0, 0, 0.075)",
                                    transition:
                                      "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
                                  }}
                                >
                                  <option value="">All</option>
                                  {hospitalOptions}
                                </select>
                              </div>
                            </div>
                          </div>
                          <div id="extraFieldsCounsellingEducation">
                            <strong>Extra Fields</strong>
                            <br />
                            <br />
                            {exInfoCounsellingEducation}
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              addField(
                                "extraFieldsCounsellingEducation",
                                "extraFieldsCounsellingEducation"
                              )
                            }
                            className="btn btn-success border-0 btn-block"
                          >
                            Add Required Field
                          </button>
                          <br />
                          <br />
                          <button type="submit" className="btn btn-primary">
                            Submit
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {section === "trainings" && (
            <div className="container mt-4">
              <h2 className="text-center mt-4 mb-4">
                <strong>Add Types</strong>
              </h2>
              <br />

              <div class="accordion" id="accordionExample">
                <div class="accordion-item">
                  <h2 class="accordion-header" id="headingOne">
                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                      <strong>Add/Delete Counseling Education</strong>
                    </button>
                  </h2>
                  <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                      <div id="addCounsellingTypeContainer">
                        {removeTypeCounseling}
                        <form
                          action="#"
                          method="POST"
                          onSubmit={(e) =>
                            addTypesSubmit(e, "counsellingType", "addCounsellingType")
                          }
                        >
                          <br/>
                          <label htmlFor="addCounsellingType">
                            Add Counseling Type:&nbsp;
                          </label>
                          <input
                            type="text"
                            id="addCounsellingType"
                            name="addCounsellingType"
                          />
                          <br /> <br />
                          <button type="submit" className="btn btn-success">
                            Submit
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="accordion-item">
                  <h2 class="accordion-header" id="headingTwo">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                      <strong>Add/Delete Training Type</strong>
                    </button>
                  </h2>
                  <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                      <div id="addTrainingTypeContainer">
                        {removeTypeTraining}
                        <form
                          action="#"
                          method="POST"
                          onSubmit={(e) =>
                            addTypesSubmit(e, "trainingType", "addTrainingType")
                          }
                        >
                          <br />
                          <label htmlFor="addTrainingType">Add Training Type:&nbsp;</label>
                          <input
                            type="text"
                            id="addTrainingType"
                            name="addTrainingType"
                          />
                          <br /> <br />
                          <button type="submit" className="btn btn-success">
                            Submit
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="accordion-item">
                  <h2 class="accordion-header" id="headingThree">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                      <strong>Add/Delete Training Sub Type</strong>
                    </button>
                  </h2>
                  <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                      <div id="addTrainingSubTypeContainer">
                        {removeSubTypeTraining}
                        <form
                          action="#"
                          method="POST"
                          onSubmit={(e) => addSubTypesSubmit(e)}
                        >
                          <br />
                          <label htmlFor="addTrainingSubType">
                            Add Training Sub Type:&nbsp;
                          </label>
                          <select name="training" id="training">
                            {trainingTypesOption}
                          </select>&nbsp;
                          <input
                            type="text"
                            id="addTrainingSubType"
                            name="addTrainingSubType"
                          />
                          <br /> <br />
                          <button type="submit" className="btn btn-success">
                            Submit
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {section === 'landing-page' && (
            <div className="container mt-4">
                <div className="row">
                  <div className="col text-end" style={{ marginTop: '10px' }}>
                <button type="button" className="btn btn-success" onClick={handleShow}>
                  Create new post
                </button>
                </div>
                </div>
                <br />
                <div>
                  {posts
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((post) => (
                      <div key={post.id} className="mb-3">
                        <h3>{post.title}</h3>
                        <p>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                        <div>
                          <button className="btn btn-primary me-2" onClick={() => handleEdit(post)}>
                            Edit
                          </button>
                          <button className="btn btn-danger" onClick={() => handleDelete(post)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              <Modal show={showModal} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                  <Modal.Title style={{ textAlign: 'left' }}>
                    {editMode ? 'Edit Post' : 'Create New Post'}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group controlId="postTitle">
                      <Form.Label className="text-left">Title</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group controlId="postContent">
                      <Form.Label className="text-left">Content</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        style={{ textAlign: 'left' }}
                      />
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                  {editMode ? (
                    <Button variant="primary" onClick={handleSaveChanges}>
                      Update
                    </Button>
                  ) : (
                    <Button variant="primary" onClick={handleSaveChanges}>
                      Save Changes
                    </Button>
                  )}
                </Modal.Footer>
              </Modal>
              <Modal show={confirmDelete} onHide={() => setConfirmDelete(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Are you sure you want to delete this post?
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => setConfirmDelete(false)}>
                    Cancel
                  </Button>
                  <Button variant="danger" onClick={() => handleSaveChanges(selectedPost)}>
                    Delete
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          )}
        </div>
      </div>
    </div>
    </Layout>
  );
}

export default RequiredFields;

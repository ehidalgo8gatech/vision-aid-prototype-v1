import React, { useEffect, useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { ChevronDown, ChevronRight, Pencil } from "react-bootstrap-icons";
import { v4 as uuidv4 } from "uuid";
import Router from "next/router";
import {
  Select,
  FormControl,
} from "@mui/material";
import {
  otherField,
  logMARValues,
  sixmValues,
  twentyftValues,
  logMARNVValues,
  nScaleValues,
  mUnitsValues,
  snellenImperialValues,
  snellenMetricValues,
} from "../../constants/acuityConstants";
import {
  spectacleDevices,
  opticalDevices,
  nonOpticalDevices,
  nonOpticalDevicesSubheadings,
  nonOpticalDevicesIndices,
  electronicDevices,
  electronicDevicesSubheadings,
  electronicDevicesIndices,
} from "@/constants/devicesConstants";
import {
  createMenu,
  createOptionMenu,
  parseInputDate,
} from "@/constants/globalFunctions";
import { comma, diagnosisValues } from "@/constants/generalConstants";
import { jsonToCSV } from "react-papaparse";
import moment from "moment";

const TrainingFormCLVE = ({
  existingTrainings = [],
  addNewTraining,
  updateMDVIForBeneficiary,
  mdvi,
  customFieldsDistance,
  customFieldsNear,
  title,
  api,
  allfields,
}) => {
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 600,
      },
    },
  };

  let config = {
    quotes: true,
    quoteChar: '"',
  };

  if (mdvi === null || mdvi === undefined || mdvi === "") {
    mdvi = "No";
  }
  const [mdviValue, setMdviValue] = useState(mdvi);
  const [section, setSection] = useState("vision_evaluation");
  const [diagnosis, setDiagnosis] = useState([]);
  const today = new Date();
  const [formData, setFormData] = useState({
    unitDistance: "LogMAR",
    unitNear: "LogMAR",
    date: today,
    dispensedDateSpectacle: today,
    dispensedDateOptical: today,
    dispensedDateNonOptical: today,
    dispensedDateElectronic: today,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    const customDataDistance = customFieldsDistance.reduce((acc, field) => {
      if(formData[field] === otherField) {
        acc[field] = formData[field];
      } else {
        acc[field] = formData[field] + " " + formData["unitDistance"];
      }
      return acc;
    }, {});
    const customDataNear = customFieldsNear.reduce((acc, field) => {
      if(formData[field] === otherField) {
        acc[field] = formData[field];
      } else {
        acc[field] = formData[field] + " " + formData["unitNear"];
      }
      return acc;
    }, {});
    var allDiagnosis = "";

    diagnosis.forEach((diagnosisValue) => {
      if (diagnosisValue == "Other") {
        allDiagnosis = allDiagnosis + " " + formData["diagnosisOther"];
      } else {
        allDiagnosis = allDiagnosis + " " + diagnosisValue;
      }
    });

    if (showOther.recommendationSpectacle) {
      devices.recommendationSpectacle.splice(
        devices.recommendationSpectacle.indexOf("Other"),
        1
      );
      devices.recommendationSpectacle.push(
        formData["recommendationSpectacleOther"]
      );
    }

    if (showOther.recommendationOptical) {
      devices.recommendationOptical.splice(
        devices.recommendationOptical.indexOf("Other"),
        1
      );
      devices.recommendationOptical.push(
        formData["recommendationOpticalOther"]
      );
    }

    if (showOther.recommendationNonOptical) {
      devices.recommendationNonOptical.splice(
        devices.recommendationNonOptical.indexOf("Other"),
        1
      );
      devices.recommendationNonOptical.push(
        formData["recommendationNonOpticalOther"]
      );
    }

    if (showOther.recommendationElectronic) {
      devices.recommendationElectronic.splice(
        devices.recommendationElectronic.indexOf("Other"),
        1
      );
      devices.recommendationElectronic.push(
        formData["recommendationElectronicOther"]
      );
    }

    const newTraining = {
      diagnosis: allDiagnosis,
      mdvi: mdviValue,
      date: formData["date"] ? formData["date"] : null,
      sessionNumber: formData["sessionNumber"]
        ? formData["sessionNumber"]
        : null,
      recommendationSpectacle:
        devices.recommendationSpectacle.length > 0
          ? jsonToCSV([devices.recommendationSpectacle], {
              ...config,
              delimiter: comma,
            })
          : "",
      dispensedDateSpectacle: formData["dispensedDateSpectacle"]
        ? formData["dispensedDateSpectacle"]
        : null,
      costSpectacle: formData["costSpectacle"]
        ? formData["costSpectacle"]
        : null,
      costToBeneficiarySpectacle: formData["costToBeneficiarySpectacle"]
        ? formData["costToBeneficiarySpectacle"]
        : null,
      dispensedSpectacle:
        devices.dispensedSpectacle === "Other"
          ? formData["dispensedSpectacleOther"]
          : devices.dispensedSpectacle,
      trainingGivenSpectacle: formData["trainingGivenSpectacle"]
        ? formData["trainingGivenSpectacle"]
        : null,
      recommendationOptical:
        devices.recommendationOptical.length > 0
          ? jsonToCSV([devices.recommendationOptical], {
              ...config,
              delimiter: comma,
            })
          : "",
      dispensedDateOptical: formData["dispensedDateOptical"]
        ? formData["dispensedDateOptical"]
        : null,
      costOptical: formData["costOptical"] ? formData["costOptical"] : null,
      costToBeneficiaryOptical: formData["costToBeneficiaryOptical"]
        ? formData["costToBeneficiaryOptical"]
        : null,
      dispensedOptical:
        devices.dispensedOptical === "Other"
          ? formData["dispensedOpticalOther"]
          : devices.dispensedOptical,
      trainingGivenOptical: formData["trainingGivenOptical"]
        ? formData["trainingGivenOptical"]
        : null,
      recommendationNonOptical:
        devices.recommendationNonOptical.length > 0
          ? jsonToCSV([devices.recommendationNonOptical], {
              ...config,
              delimiter: comma,
            })
          : "",
      dispensedDateNonOptical: formData["dispensedDateNonOptical"]
        ? formData["dispensedDateNonOptical"]
        : null,
      costNonOptical: formData["costNonOptical"]
        ? formData["costNonOptical"]
        : null,
      costToBeneficiaryNonOptical: formData["costToBeneficiaryNonOptical"]
        ? formData["costToBeneficiaryNonOptical"]
        : null,
      dispensedNonOptical:
        devices.dispensedNonOptical === "Other"
          ? formData["dispensedNonOpticalOther"]
          : devices.dispensedNonOptical,
      trainingGivenNonOptical: formData["trainingGivenNonOptical"]
        ? formData["trainingGivenNonOptical"]
        : null,
      recommendationElectronic:
        devices.recommendationElectronic.length > 0
          ? jsonToCSV([devices.recommendationElectronic], {
              ...config,
              delimiter: comma,
            })
          : "",
      dispensedDateElectronic: formData["dispensedDateElectronic"]
        ? formData["dispensedDateElectronic"]
        : null,
      costElectronic: formData["costElectronic"]
        ? formData["costElectronic"]
        : null,
      costToBeneficiaryElectronic: formData["costToBeneficiaryElectronic"]
        ? formData["costToBeneficiaryElectronic"]
        : null,
      dispensedElectronic:
        devices.dispensedElectronic === "Other"
          ? formData["dispensedElectronicOther"]
          : devices.dispensedElectronic,
      trainingGivenElectronic: formData["trainingGivenElectronic"]
        ? formData["trainingGivenElectronic"]
        : null,
      colourVisionRE:
        e.target.colourVisionRE == null ? null : e.target.colourVisionRE.value,
      colourVisionLE:
        e.target.colourVisionLE == null ? null : e.target.colourVisionLE.value,
      contrastSensitivityRE:
        e.target.contrastSensitivityRE == null
          ? null
          : e.target.contrastSensitivityRE.value,
      contrastSensitivityLE:
        e.target.contrastSensitivityLE == null
          ? null
          : e.target.contrastSensitivityLE.value,
      visualFieldsRE:
        e.target.visualFieldsRE == null ? null : e.target.visualFieldsRE.value,
      visualFieldsLE:
        e.target.visualFieldsLE == null ? null : e.target.visualFieldsLE.value,
      extraInformation: e.target.extraInformation.value,
      ...customDataDistance,
      ...customDataNear,
    };
    updateMDVIForBeneficiary({ mDVI: mdviValue });
    addNewTraining(newTraining);
  };

  const [devices, setDevices] = useState({
    recommendationSpectacle: [],
    recommendationOptical: [],
    recommendationNonOptical: [],
    recommendationElectronic: [],
    dispensedSpectacle: "",
    dispensedOptical: "",
    dispensedNonOptical: "",
    dispensedElectronic: "",
  });

  const createOptionList = (values) => {
    return values.map((value) => <option key={value}>{value}</option>);
  };

  const createOptionGroupList = (values, subheadings, indices) => {
    const allOptions = createOptionList(values);
    const optionGroups = [];
    for (var i = 0; i < subheadings.length; i++) {
      optionGroups.push(
        <optgroup key={subheadings[i]} label={subheadings[i]}>
          {allOptions.slice(indices[i], indices[i + 1])}
        </optgroup>
      );
    }
    return optionGroups;
  };

  const changeDvValues = (e) => {
    setFormData((formData) => ({ ...formData, unitDistance: e.target.value }));
    if (e.target.value == "LogMAR") {
      setDvAcuityValues(logMARValues);
    } else if (e.target.value == "6m") {
      setDvAcuityValues(sixmValues);
    } else if (e.target.value == "20ft") {
      setDvAcuityValues(twentyftValues);
    }
  };

  const changeNvValues = (e) => {
    setFormData((formData) => ({ ...formData, unitNear: e.target.value }));
    if (e.target.value == "LogMAR") {
      setNvAcuityValues(logMARNVValues);
    } else if (e.target.value == "N-scale") {
      setNvAcuityValues(nScaleValues);
    } else if (e.target.value == "M-units") {
      setNvAcuityValues(mUnitsValues);
    } else if (e.target.value == "Snellen - Imperial") {
      setNvAcuityValues(snellenImperialValues);
    } else if (e.target.value == "Snellen - Metric") {
      setNvAcuityValues(snellenMetricValues);
    }
  };

  const [dvAcuityValues, setDvAcuityValues] = useState(
    logMARValues
  );
  const [nvAcuityValues, setNvAcuityValues] = useState(
    logMARNVValues
  );

  useEffect(() => {
    customFieldsDistance.forEach((field) => {
      console.log("entered dv");
      setFormData((formData) => ({
        ...formData,
        [field]: dvAcuityValues[0],
      }));
    });
    console.log(formData);
  }, [customFieldsDistance, formData, dvAcuityValues]);

  useEffect(() => {
    console.log("entered nv");
    customFieldsNear.forEach((field) => {
      setFormData((formData) => ({
        ...formData,
        [field]: nvAcuityValues[0],
      }));
    });
    console.log(formData);
  }, [customFieldsNear, formData, nvAcuityValues]);

  const diagnosisOptions = createMenu(diagnosisValues, true, diagnosis);
  const recommendationSpectacleOptions = createMenu(
    spectacleDevices,
    true,
    devices["recommendationSpectacle"]
  );
  const dispensedSpectacleOptions = createMenu(
    spectacleDevices,
    false,
    devices["dispensedSpectacle"]
  );
  const recommendationOpticalOptions = createMenu(
    opticalDevices,
    true,
    devices["recommendationOptical"]
  );
  const dispensedOpticalOptions = createMenu(
    opticalDevices,
    false,
    devices["dispensedOptical"]
  );
  const recommendationNonOpticalOptions = createOptionMenu(
    nonOpticalDevices,
    nonOpticalDevicesSubheadings,
    nonOpticalDevicesIndices,
    true,
    devices["recommendationNonOptical"]
  );
  const dispensedNonOpticalOptions = createOptionMenu(
    nonOpticalDevices,
    nonOpticalDevicesSubheadings,
    nonOpticalDevicesIndices,
    false
  );
  const recommendationElectronicOptions = createOptionMenu(
    electronicDevices,
    electronicDevicesSubheadings,
    electronicDevicesIndices,
    true,
    devices["recommendationElectronic"]
  );
  const dispensedElectronicOptions = createOptionMenu(
    electronicDevices,
    electronicDevicesSubheadings,
    electronicDevicesIndices,
    false
  );

  const [showOther, setShowOther] = useState({
    recommendationSpectacle: false,
    recommendationOptical: false,
    recommendationNonOptical: false,
    recommendationElectronic: false,
    dispensedSpectacle: false,
    dispensedOptical: false,
    dispensedNonOptical: false,
    dispensedElectronic: false,
  });
  const [editableField, setEditableField] = useState("");

  const handleMultiSelectChange = (e, fieldName) => {
    const {
      target: { value },
    } = e;
    setDevices({
      ...devices,
      [fieldName]: value,
    });
    if (value.includes("Other")) {
      setShowOther({ ...showOther, [fieldName]: true });
    } else {
      setShowOther({ ...showOther, [fieldName]: false });
    }
  };

  const handleDiagnosisChange = (e) => {
    const {
      target: { value },
    } = e;
    setDiagnosis(value);
    if (value.includes("Other")) {
      setShowDiagnosisOther(true);
    } else {
      setShowDiagnosisOther(false);
    }
  };

  const handleSelectChange = (e, fieldName) => {
    const {
      target: { value },
    } = e;
    setDevices({ ...devices, [fieldName]: value });
    if (value === "Other") {
      setShowOther({ ...showOther, [fieldName]: true });
    } else {
      setShowOther({ ...showOther, [fieldName]: false });
    }
  };

  // Handle edit icon click
  const handleEditClick = (field) => {
    setEditableField(field);
  };
  const [rerenderForce, setRerenderForce] = useState();
  // Handle input changes
  const handleInputChange = (index, field, id) => {
    existingTrainings[index][field] = document.getElementById(id).value;
    setRerenderForce({
      ...rerenderForce,
      uuid: uuidv4(),
    });
  };

  const handleEditSubmit = async (e, api, field, index) => {
    e.preventDefault();
    var value;
    if (
      field == "date" ||
      field == "dispensedDateSpectacle" ||
      field == "dispensedDateOptical" ||
      field == "dispensedDateNonOptical" ||
      field == "dispensedDateElectronic"
    ) {
      value = new Date(existingTrainings[index][field]);
    } else if (
      field == "sessionNumber" ||
      field == "costSpectacle" ||
      field == "costToBeneficiarySpectacle" ||
      field == "costOptical" ||
      field == "costToBeneficiaryOptical" ||
      field == "costNonOptical" ||
      field == "costToBeneficiaryNonOptical" ||
      field == "costElectronic" ||
      field == "costToBeneficiaryElectronic"
    ) {
      value = parseInt(existingTrainings[index][field]);
    } else {
      value = existingTrainings[index][field];
    }

    // Update user data in the database
    const response = await fetch(`/api/` + api, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: existingTrainings[index].id, [field]: value }),
    });

    // Handle response from the API
    if (response.ok) {
      alert("User data saved successfully!");
    } else {
      alert("An error occurred while saving user data. Please try again.");
    }
    Router.reload();
  };

  const [showDiagnosisOther, setShowDiagnosisOther] = useState(false);
  function diagnosisOnChange(event) {
    if (event.target.checked == true) {
      setShowDiagnosisOther(true);
    } else {
      setShowDiagnosisOther(false);
    }
  }

  const updateFormData = (e, fieldName) => {
    if (e.target.type == "date") {
      setFormData((formData) => ({
        ...formData,
        [fieldName]: new Date(parseInputDate(e.target.value)),
      }));
      console.log(e.target.type, fieldName, formData[fieldName]);
    } else if (e.target.type == "number") {
      setFormData((formData) => ({
        ...formData,
        [fieldName]: parseInt(e.target.value),
      }));
      console.log(e.target.type, fieldName, formData[fieldName]);
    } else {
      setFormData((formData) => ({ ...formData, [fieldName]: e.target.value }));
      console.log(e.target.type, fieldName, formData[fieldName]);
    }
  };

  return (
    <div className="col-12">
      <div className="row">
        <div className="justify-content-center align-items-center">
          <h3>New Evaluation Form</h3>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="p-2 col">
          <button
            className={`w-100 text-align-left ${
              section === "vision_evaluation"
                ? "btn btn-success btn-block active-tab"
                : "btn btn-light btn-block"
            }`}
            onClick={() => setSection("vision_evaluation")}
          >
            Vision Evaluation
          </button>
        </div>
        <div className="p-2 col">
          <button
            className={`w-100 text-align-left ${
              section === "spectacle"
                ? "btn btn-success btn-block active-tab"
                : "btn btn-light btn-block"
            }`}
            onClick={() => setSection("spectacle")}
          >
            Spectacle
          </button>
        </div>
        <div className="p-2 col">
          <button
            className={`w-100 text-align-left ${
              section === "optical"
                ? "btn btn-success btn-block active-tab"
                : "btn btn-light btn-block"
            }`}
            onClick={() => setSection("optical")}
          >
            Optical
          </button>
        </div>
      </div>
      <div className="row">
        <div className="p-2 col">
          <button
            className={`w-100 text-align-left ${
              section === "non_optical"
                ? "btn btn-success btn-block active-tab"
                : "btn btn-light btn-block"
            }`}
            onClick={() => setSection("non_optical")}
          >
            Non-Optical
          </button>
        </div>
        <div className="p-2 col">
          <button
            className={`w-100 text-align-left ${
              section === "electronic"
                ? "btn btn-success btn-block active-tab"
                : "btn btn-light btn-block"
            }`}
            onClick={() => setSection("electronic")}
          >
            Electronic
          </button>
        </div>
        <div className="p-2 col">
          <button
            className={`w-100 text-align-left ${
              section === "other"
                ? "btn btn-success btn-block active-tab"
                : "btn btn-light btn-block"
            }`}
            onClick={() => setSection("other")}
          >
            Other and Comments
          </button>
        </div>
      </div>
      <hr />
      <Form onSubmit={handleSubmit} className="mt-3">
        {section === "vision_evaluation" && (
          <Row>
            <Col>
              <Form.Label>Diagnosis</Form.Label>
              <FormControl fullWidth size="small">
                <Select
                  value={diagnosis}
                  onChange={(e) => {
                    handleDiagnosisChange(e);
                  }}
                  multiple
                  renderValue={(selected) => selected.join(", ")}
                  MenuProps={MenuProps}
                >
                  {diagnosisOptions}
                </Select>
              </FormControl>
            </Col>
            <Col>
              <Form.Group controlId="mdvi">
                <Form.Label>MDVI</Form.Label>
                <Form.Control
                  as="select"
                  value={mdviValue}
                  onChange={(e) => {
                    setMdviValue(e.target.value);
                  }}
                >
                  <option key="Yes" value="Yes">
                    Yes
                  </option>
                  <option key="No" value="No">
                    No
                  </option>
                  <option key="At Risk" value="At Risk">
                    At Risk
                  </option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
        )}
        {section === "vision_evaluation" && showDiagnosisOther && (
          <Row>
            <Col>
              <Form.Group controlId="diagnosisOther">
                <Form.Label>Diagnosis Other</Form.Label>
                <Form.Control
                  type="text"
                  autoComplete="off"
                  value={formData["diagnosisOther"]}
                  onChange={(e) => updateFormData(e, "diagnosisOther")}
                />
              </Form.Group>
            </Col>
          </Row>
        )}
        {section === "vision_evaluation" && (
          <Row>
            <Col>
              <Form.Group controlId="date">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={moment(formData["date"]).format("YYYY-MM-DD")}
                  onChange={(e) => updateFormData(e, "date")}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="sessionNumber">
                <Form.Label>Session Number</Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  autoComplete="off"
                  value={formData["sessionNumber"]}
                  onChange={(e) => updateFormData(e, "sessionNumber")}
                />
              </Form.Group>
            </Col>
          </Row>
        )}
        {section === "vision_evaluation" && (
          <Form.Group controlId="unit-distance">
            <Form.Label>Select Distance metric:</Form.Label>
            <Form.Control
              as="select"
              value={formData["unitDistance"]}
              onChange={changeDvValues}
            >
              {/* <option defaultValue></option> */}
              <option>LogMAR</option>
              <option>6m</option>
              <option>20ft</option>
            </Form.Control>
          </Form.Group>
        )}
        {section === "vision_evaluation" && (
          <Row>
            {customFieldsDistance &&
              customFieldsDistance.map((field) => (
                <Col key={field}>
                  <Form.Group controlId={field} key={field}>
                    <Form.Label>{field}</Form.Label>
                    <Form.Control
                      as="select"
                      value={formData[field]}
                      onChange={(e) => updateFormData(e, field)}
                    >
                      {createOptionList(dvAcuityValues)}
                    </Form.Control>
                  </Form.Group>
                </Col>
              ))}
          </Row>
        )}
        {section === "vision_evaluation" && (
          <Form.Group controlId="unit-near">
            <Form.Label>Select Near metric:</Form.Label>
            <Form.Control
              as="select"
              value={formData["unitNear"]}
              onChange={changeNvValues}
            >
              <option>LogMAR</option>
              <option>N-scale</option>
              <option>M-units</option>
              <option>Snellen - Imperial</option>
              <option>Snellen - Metric</option>
            </Form.Control>
          </Form.Group>
        )}
        {section === "vision_evaluation" && (
          <Row>
            {customFieldsNear &&
              customFieldsNear.map((field) => (
                <Col key={field}>
                  <Form.Group controlId={field} key={field}>
                    <Form.Label>{field}</Form.Label>
                    <Form.Control
                      as="select"
                      value={formData[field]}
                      onChange={(e) => {
                        updateFormData(e, field);
                      }}
                    >
                      {createOptionList(nvAcuityValues)}
                    </Form.Control>
                  </Form.Group>
                </Col>
              ))}
          </Row>
        )}
        {section === "vision_evaluation" && (
          <div>
            <br />
            <Button
              className="btn btn-success border-0 btn-block"
              type="button"
              onClick={() => setSection("spectacle")}
            >
              Continue
            </Button>
          </div>
        )}
        {section === "spectacle" && (
          <Row>
            <Form.Group controlId="recommendationSpectacle">
              <Form.Label>Recommendation Spectacle</Form.Label>
            </Form.Group>
          </Row>
        )}
        {section === "spectacle" && (
          <FormControl fullWidth size="small">
            <Select
              value={devices.recommendationSpectacle}
              onChange={(e) => {
                handleMultiSelectChange(e, "recommendationSpectacle");
              }}
              multiple
              renderValue={(selected) => selected.join(", ")}
              MenuProps={MenuProps}
            >
              {recommendationSpectacleOptions}
            </Select>
          </FormControl>
        )}

        {section === "spectacle" && showOther.recommendationSpectacle && (
          <Form.Group controlId="recommendationSpectacleOther">
            <Form.Label>Other Recommendation Spectacle</Form.Label>
            <Form.Control
              as="input"
              autoComplete="off"
              value={formData["recommendationSpectacleOther"]}
              onChange={(e) => updateFormData(e, "recommendationSpectacleOther")}
            />
          </Form.Group>
        )}

        {section === "spectacle" && allfields && (
          <div>
            <Form.Group controlId="dispensedDateSpectacle">
              <Form.Label>Dispensed Date Spectacle</Form.Label>
              <Form.Control
                type="date"
                value={moment(formData["dispensedDateSpectacle"]).format(
                  "YYYY-MM-DD"
                )}
                onChange={(e) => updateFormData(e, "dispensedDateSpectacle")}
              />
            </Form.Group>
            <Row>
              <Col>
                <Form.Group controlId="costSpectacle">
                  <Form.Label>Cost Spectacle</Form.Label>
                  <Form.Control
                    type="number"
                    min={0}
                    autoComplete="off"
                    value={formData["costSpectacle"]}
                    onChange={(e) => updateFormData(e, "costSpectacle")}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="costToBeneficiarySpectacle">
                  <Form.Label>Cost to Beneficiary Spectacle</Form.Label>
                  <Form.Control
                    type="number"
                    min={0}
                    autoComplete="off"
                    value={formData["costToBeneficiarySpectacle"]}
                    onChange={(e) =>
                      updateFormData(e, "costToBeneficiarySpectacle")
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Row>
                  <Form.Group controlId="dispensedSpectacle">
                    <Form.Label>Dispensed Spectacle</Form.Label>
                  </Form.Group>
                </Row>
                <FormControl fullWidth size="small">
                  <Select
                    value={devices.dispensedSpectacle}
                    onChange={(e) => {
                      handleSelectChange(e, "dispensedSpectacle");
                    }}
                    MenuProps={MenuProps}
                  >
                    {dispensedSpectacleOptions}
                  </Select>
                </FormControl>
              </Col>
              <Col>
                <Form.Group controlId="trainingGivenSpectacle">
                  <Form.Label>Training Given Spectacle</Form.Label>
                  <Form.Control
                    as="select"
                    value={formData["trainingGivenSpectacle"]}
                    onChange={(e) =>
                      updateFormData(e, "trainingGivenSpectacle")
                    }
                  >
                    <option defaultValue></option>
                    <option>Yes</option>
                    <option>No</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            {showOther.dispensedSpectacle && (
              <Form.Group controlId="dispensedSpectacleOther">
                <Form.Label>Other Dispensed Spectacle</Form.Label>
                <Form.Control
                  as="input"
                  autoComplete="off"
                  value={formData["dispensedSpectacleOther"]}
                  onChange={(e) => updateFormData(e, "dispensedSpectacleOther")}
                />
              </Form.Group>
            )}
          </div>
        )}
        {section === "spectacle" && (
          <div>
            <br />
            <Button
              className="btn btn-success border-0 btn-block"
              type="button"
              onClick={() => setSection("optical")}
            >
              Continue
            </Button>
          </div>
        )}
        {section === "optical" && (
          <Row>
            <Form.Group controlId="recommendationOptical">
              <Form.Label>Recommendation Optical</Form.Label>
            </Form.Group>
          </Row>
        )}
        {section === "optical" && (
          <FormControl fullWidth size="small">
            <Select
              value={devices.recommendationOptical}
              onChange={(e) => {
                handleMultiSelectChange(e, "recommendationOptical");
              }}
              multiple
              renderValue={(selected) => selected.join(", ")}
              MenuProps={MenuProps}
            >
              {recommendationOpticalOptions}
            </Select>
          </FormControl>
        )}

        {section === "optical" && showOther.recommendationOptical && (
          <Form.Group controlId="recommendationOpticalOther">
            <Form.Label>Other Recommendation Optical</Form.Label>
            <Form.Control
              as="input"
              autoComplete="off"
              value={formData["recommendationOpticalOther"]}
              onChange={(e) => updateFormData(e, "recommendationOpticalOther")}
            />
          </Form.Group>
        )}

        {section === "optical" && allfields && (
          <div>
            <Form.Group controlId="dispensedDateOptical">
              <Form.Label>Dispensed Date Optical</Form.Label>
              <Form.Control
                type="date"
                value={moment(formData["dispensedDateOptical"]).format(
                  "YYYY-MM-DD"
                )}
                onChange={(e) => updateFormData(e, "dispensedDateOptical")}
              />
            </Form.Group>
            <Row>
              <Col>
                <Form.Group controlId="costOptical">
                  <Form.Label>Cost Optical</Form.Label>
                  <Form.Control
                    type="number"
                    min={0}
                    autoComplete="off"
                    value={formData["costOptical"]}
                    onChange={(e) => updateFormData(e, "costOptical")}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="costToBeneficiaryOptical">
                  <Form.Label>Cost to Beneficiary Optical</Form.Label>
                  <Form.Control
                    type="number"
                    min={0}
                    autoComplete="off"
                    value={formData["costToBeneficiaryOptical"]}
                    onChange={(e) =>
                      updateFormData(e, "costToBeneficiaryOptical")
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Row>
                  <Form.Group controlId="dispensedOptical">
                    <Form.Label>Dispensed Optical</Form.Label>
                  </Form.Group>
                </Row>
                <FormControl fullWidth size="small">
                  <Select
                    value={devices.dispensedOptical}
                    onChange={(e) => {
                      handleSelectChange(e, "dispensedOptical");
                    }}
                    MenuProps={MenuProps}
                  >
                    {dispensedOpticalOptions}
                  </Select>
                </FormControl>
              </Col>
              <Col>
                <Form.Group controlId="trainingGivenOptical">
                  <Form.Label>Training Given Optical</Form.Label>
                  <Form.Control
                    as="select"
                    value={formData["trainingGivenOptical"]}
                    onChange={(e) => updateFormData(e, "trainingGivenOptical")}
                  >
                    <option defaultValue></option>
                    <option>Yes</option>
                    <option>No</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            {showOther.dispensedOptical && (
              <Form.Group controlId="dispensedOpticalOther">
                <Form.Label>Other Dispensed Optical</Form.Label>
                <Form.Control
                  as="input"
                  autoComplete="off"
                  value={formData["dispensedOpticalOther"]}
                  onChange={(e) => updateFormData(e, "dispensedOpticalOther")}
                />
              </Form.Group>
            )}
          </div>
        )}
        {section === "optical" && (
          <div>
            <br />
            <Button
              className="btn btn-success border-0 btn-block"
              type="button"
              onClick={() => setSection("non_optical")}
            >
              Continue
            </Button>
          </div>
        )}
        {section === "non_optical" && (
          <Row>
            <Form.Group controlId="recommendationNonOptical">
              <Form.Label>Recommendation Non-Optical</Form.Label>
            </Form.Group>
          </Row>
        )}
        {section === "non_optical" && (
          <FormControl fullWidth size="small">
            <Select
              value={devices.recommendationNonOptical}
              onChange={(e) => {
                handleMultiSelectChange(e, "recommendationNonOptical");
              }}
              multiple
              renderValue={(selected) => selected.join(", ")}
              MenuProps={MenuProps}
            >
              {recommendationNonOpticalOptions}
            </Select>
          </FormControl>
        )}

        {section === "non_optical" && showOther.recommendationNonOptical && (
          <Form.Group controlId="recommendationNonOpticalOther">
            <Form.Label>Other Recommendation NonOptical</Form.Label>
            <Form.Control
              as="input"
              autoComplete="off"
              value={formData["recommendationNonOpticalOther"]}
              onChange={(e) =>
                updateFormData(e, "recommendationNonOpticalOther")
              }
            />
          </Form.Group>
        )}

        {section === "non_optical" && allfields && (
          <div>
            <Form.Group controlId="dispensedDateNonOptical">
              <Form.Label>Dispensed Date NonOptical</Form.Label>
              <Form.Control
                type="date"
                value={moment(formData["dispensedDateNonOptical"]).format(
                  "YYYY-MM-DD"
                )}
                onChange={(e) => updateFormData(e, "dispensedDateNonOptical")}
              />
            </Form.Group>
            <Row>
              <Col>
                <Form.Group controlId="costNonOptical">
                  <Form.Label>Cost NonOptical</Form.Label>
                  <Form.Control
                    type="number"
                    min={0}
                    autoComplete="off"
                    value={formData["costNonOptical"]}
                    onChange={(e) => updateFormData(e, "costNonOptical")}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="costToBeneficiaryNonOptical">
                  <Form.Label>Cost to Beneficiary NonOptical</Form.Label>
                  <Form.Control
                    type="number"
                    min={0}
                    autoComplete="off"
                    value={formData["costToBeneficiaryNonOptical"]}
                    onChange={(e) =>
                      updateFormData(e, "costToBeneficiaryNonOptical")
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Row>
                  <Form.Group controlId="dispensedNonOptical">
                    <Form.Label>Dispensed Non-Optical</Form.Label>
                  </Form.Group>
                </Row>
                <FormControl fullWidth size="small">
                  <Select
                    value={devices.dispensedNonOptical}
                    onChange={(e) => {
                      handleSelectChange(e, "dispensedNonOptical");
                    }}
                    MenuProps={MenuProps}
                  >
                    {dispensedNonOpticalOptions}
                  </Select>
                </FormControl>
              </Col>
              <Col>
                <Form.Group controlId="trainingGivenNonOptical">
                  <Form.Label>Training Given Non Optical</Form.Label>
                  <Form.Control
                    as="select"
                    value={formData["trainingGivenNonOptical"]}
                    onChange={(e) =>
                      updateFormData(e, "trainingGivenNonOptical")
                    }
                  >
                    <option defaultValue></option>
                    <option>Yes</option>
                    <option>No</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            {showOther.dispensedNonOptical && (
              <Form.Group controlId="dispensedNonOpticalOther">
                <Form.Label>Other Dispensed NonOptical</Form.Label>
                <Form.Control
                  as="input"
                  autoComplete="off"
                  value={formData["dispensedNonOpticalOther"]}
                  onChange={(e) =>
                    updateFormData(e, "dispensedNonOpticalOther")
                  }
                />
              </Form.Group>
            )}
          </div>
        )}
        {section === "non_optical" && (
          <div>
            <br />
            <Button
              className="btn btn-success border-0 btn-block"
              type="button"
              onClick={() => setSection("electronic")}
            >
              Continue
            </Button>
          </div>
        )}
        {section === "electronic" && (
          <Row>
            <Form.Group controlId="recommendationElectronic">
              <Form.Label>Recommendation Electronic</Form.Label>
            </Form.Group>
          </Row>
        )}
        {section === "electronic" && (
          <FormControl fullWidth size="small">
            <Select
              value={devices.recommendationElectronic}
              onChange={(e) => {
                handleMultiSelectChange(e, "recommendationElectronic");
              }}
              multiple
              renderValue={(selected) => selected.join(", ")}
              MenuProps={MenuProps}
            >
              {recommendationElectronicOptions}
            </Select>
          </FormControl>
        )}

        {section === "electronic" && showOther.recommendationElectronic && (
          <Form.Group controlId="recommendationElectronicOther">
            <Form.Label>Other Recommendation Electronic</Form.Label>
            <Form.Control
              as="input"
              autoComplete="off"
              value={formData["recommendationElectronicOther"]}
              onChange={(e) =>
                updateFormData(e, "recommendationElectronicOther")
              }
            />
          </Form.Group>
        )}

        {section === "electronic" && allfields && (
          <div>
            <Form.Group controlId="dispensedDateElectronic">
              <Form.Label>Dispensed Date Electronic</Form.Label>
              <Form.Control
                type="date"
                value={moment(formData["dispensedDateElectronic"]).format(
                  "YYYY-MM-DD"
                )}
                onChange={(e) => updateFormData(e, "dispensedDateElectronic")}
              />
            </Form.Group>
            <Row>
              <Col>
                <Form.Group controlId="costElectronic">
                  <Form.Label>Cost Electronic</Form.Label>
                  <Form.Control
                    type="number"
                    min={0}
                    autoComplete="off"
                    value={formData["costElectronic"]}
                    onChange={(e) => updateFormData(e, "costElectronic")}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="costToBeneficiaryElectronic">
                  <Form.Label>Cost to Beneficiary Electronic</Form.Label>
                  <Form.Control
                    type="number"
                    min={0}
                    autoComplete="off"
                    value={formData["costToBeneficiaryElectronic"]}
                    onChange={(e) =>
                      updateFormData(e, "costToBeneficiaryElectronic")
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Row>
                  <Form.Group controlId="dispensedElectronic">
                    <Form.Label>Dispensed Electronic</Form.Label>
                  </Form.Group>
                </Row>
                <FormControl fullWidth size="small">
                  <Select
                    value={devices.dispensedElectronic}
                    onChange={(e) => {
                      handleSelectChange(e, "dispensedElectronic");
                    }}
                    MenuProps={MenuProps}
                  >
                    {dispensedElectronicOptions}
                  </Select>
                </FormControl>
              </Col>

              <Col>
                <Form.Group controlId="trainingGivenElectronic">
                  <Form.Label>Training Given Electronic</Form.Label>
                  <Form.Control
                    as="select"
                    value={formData["trainingGivenElectronic"]}
                    onChange={(e) =>
                      updateFormData(e, "trainingGivenElectronic")
                    }
                  >
                    <option defaultValue></option>
                    <option>Yes</option>
                    <option>No</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            {showOther.dispensedElectronic && (
              <Form.Group controlId="dispensedElectronicOther">
                <Form.Label>Other Dispensed Electronic</Form.Label>
                <Form.Control
                  as="input"
                  autoComplete="off"
                  value={formData["dispensedElectronicOther"]}
                  onChange={(e) =>
                    updateFormData(e, "dispensedElectronicOther")
                  }
                />
              </Form.Group>
            )}
          </div>
        )}
        {section === "electronic" && (
          <div>
            <br />
            <Button
              className="btn btn-success border-0 btn-block"
              type="button"
              onClick={() => setSection("other")}
            >
              Continue
            </Button>
          </div>
        )}
        {section === "other" && allfields && (
          <div>
            <Row>
              <Col>
                <Form.Group controlId="colourVisionRE">
                  <Form.Label>Colour Vision Right Eye</Form.Label>
                  <Form.Control as="textarea" rows={1} autoComplete="off" />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="colourVisionLE">
                  <Form.Label>Colour Vision Left Eye</Form.Label>
                  <Form.Control as="textarea" rows={1} autoComplete="off" />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="contrastSensitivityRE">
                  <Form.Label>Contrast Sensitivity Right Eye</Form.Label>
                  <Form.Control as="textarea" rows={1} autoComplete="off" />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="contrastSensitivityLE">
                  <Form.Label>Contrast Sensitivity Left Eye</Form.Label>
                  <Form.Control as="textarea" rows={1} autoComplete="off" />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="visualFieldsRE">
                  <Form.Label>Visual Fields Right Eye</Form.Label>
                  <Form.Control as="textarea" rows={1} autoComplete="off" />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="visualFieldsLE">
                  <Form.Label>Visual Fields Left Eye</Form.Label>
                  <Form.Control as="textarea" rows={1} autoComplete="off" />
                </Form.Group>
              </Col>
            </Row>
          </div>
        )}
        {section === "other" && (
          <Form.Group controlId="extraInformation">
            <Form.Label>Comments</Form.Label>
            <Form.Control as="textarea" rows={3} autoComplete="off" />
          </Form.Group>
        )}
        {section === "other" && (
          <div>
            <br />
            <Button
              className="btn btn-success border-0 btn-block"
              type="submit"
            >
              Submit Evaluation
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
};

export default TrainingFormCLVE;

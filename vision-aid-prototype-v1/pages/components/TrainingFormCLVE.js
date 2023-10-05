import React, { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { ChevronDown, ChevronRight, Pencil } from "react-bootstrap-icons";
import { v4 as uuidv4 } from "uuid";
import Router from "next/router";
import {
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  ListSubheader,
  FormControl,
  Typography,
} from "@mui/material";
import {
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
import { createMenu, createOptionMenu } from "@/constants/globalFunctions";
import { delimiter } from "@/constants/generalConstants";

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

  const [mdviValue, setMdviValue] = useState(mdvi);

  const handleSubmit = (e) => {
    e.preventDefault();
    const customDataDistance = customFieldsDistance.reduce((acc, field) => {
      acc[field] =
        e.target[field].value + " " + e.target[`unit-distance`].value;
      return acc;
    }, {});
    const customDataNear = customFieldsNear.reduce((acc, field) => {
      acc[field] = e.target[field].value + " " + e.target[`unit-near`].value;
      return acc;
    }, {});
    var diagnosis = "";
    e.target.diagnosis.forEach((diagnosisValue) => {
      if (diagnosisValue.checked && diagnosisValue.value == "Other") {
        diagnosis = diagnosis + " " + e.target.diagnosisOther.value;
      } else if (diagnosisValue.checked) {
        diagnosis = diagnosis + " " + diagnosisValue.value;
      }
    });

    if (showOther.recommendationSpectacle) {
      devices.recommendationSpectacle.splice(
        devices.recommendationSpectacle.indexOf("Other"),
        1
      );
      devices.recommendationSpectacle.push(
        e.target.recommendationSpectacleOther.value
      );
    }

    if (showOther.recommendationOptical) {
      devices.recommendationOptical.splice(
        devices.recommendationOptical.indexOf("Other"),
        1
      );
      devices.recommendationOptical.push(
        e.target.recommendationOpticalOther.value
      );
    }

    if (showOther.recommendationNonOptical) {
      devices.recommendationNonOptical.splice(
        devices.recommendationNonOptical.indexOf("Other"),
        1
      );
      devices.recommendationNonOptical.push(
        e.target.recommendationNonOpticalOther.value
      );
    }

    if (showOther.recommendationElectronic) {
      devices.recommendationElectronic.splice(
        devices.recommendationElectronic.indexOf("Other"),
        1
      );
      devices.recommendationElectronic.push(
        e.target.recommendationElectronicOther.value
      );
    }

    const newTraining = {
      diagnosis: diagnosis,
      mdvi: mdviValue,
      date: e.target.date.value,
      sessionNumber: e.target.sessionNumber.value,
      recommendationSpectacle:
        devices.recommendationSpectacle.length > 0
          ? devices.recommendationSpectacle.join(delimiter)
          : "",
      dispensedDateSpectacle:
        e.target.dispensedDateSpectacle == null
          ? null
          : new Date(e.target.dispensedDateSpectacle.value),
      costSpectacle:
        e.target.costSpectacle == null
          ? null
          : parseInt(e.target.costSpectacle.value),
      costToBeneficiarySpectacle:
        e.target.costToBeneficiarySpectacle == null
          ? null
          : parseInt(e.target.costToBeneficiarySpectacle.value),
      dispensedSpectacle:
        devices.dispensedSpectacle === "Other"
          ? e.target.dispensedSpectacleOther.value
          : devices.dispensedSpectacle,
      trainingGivenSpectacle:
        e.target.trainingGivenSpectacle == null
          ? null
          : e.target.trainingGivenSpectacle.value,
      recommendationOptical:
        devices.recommendationOptical.length > 0
          ? devices.recommendationOptical.join(delimiter)
          : "",
      dispensedDateOptical:
        e.target.dispensedDateOptical == null
          ? null
          : new Date(e.target.dispensedDateOptical.value),
      costOptical:
        e.target.costOptical == null
          ? null
          : parseInt(e.target.costOptical.value),
      costToBeneficiaryOptical:
        e.target.costToBeneficiaryOptical == null
          ? null
          : parseInt(e.target.costToBeneficiaryOptical.value),
      dispensedOptical:
        devices.dispensedOptical === "Other"
          ? e.target.dispensedOpticalOther.value
          : devices.dispensedOptical,
      trainingGivenOptical:
        e.target.trainingGivenOptical == null
          ? null
          : e.target.trainingGivenOptical.value,
      recommendationNonOptical:
        devices.recommendationNonOptical.length > 0
          ? devices.recommendationNonOptical.join(delimiter)
          : "",
      dispensedDateNonOptical:
        e.target.dispensedDateNonOptical == null
          ? null
          : new Date(e.target.dispensedDateNonOptical.value),
      costNonOptical:
        e.target.costNonOptical == null
          ? null
          : parseInt(e.target.costNonOptical.value),
      costToBeneficiaryNonOptical:
        e.target.costToBeneficiaryNonOptical == null
          ? null
          : parseInt(e.target.costToBeneficiaryNonOptical.value),
      dispensedNonOptical:
        devices.dispensedNonOptical === "Other"
          ? e.target.dispensedNonOpticalOther.value
          : devices.dispensedNonOptical,
      trainingGivenNonOptical:
        e.target.trainingGivenNonOptical == null
          ? null
          : e.target.trainingGivenNonOptical.value,
      recommendationElectronic:
        devices.recommendationElectronic.length > 0
          ? devices.recommendationElectronic.join(delimiter)
          : "",
      dispensedDateElectronic:
        e.target.dispensedDateElectronic == null
          ? null
          : new Date(e.target.dispensedDateElectronic.value),
      costElectronic:
        e.target.costElectronic == null
          ? null
          : parseInt(e.target.costElectronic.value),
      costToBeneficiaryElectronic:
        e.target.costToBeneficiaryElectronic == null
          ? null
          : parseInt(e.target.costToBeneficiaryElectronic.value),
      dispensedElectronic:
        devices.dispensedElectronic === "Other"
          ? e.target.dispensedElectronicOther.value
          : devices.dispensedElectronic,
      trainingGivenElectronic:
        e.target.trainingGivenElectronic == null
          ? null
          : e.target.trainingGivenElectronic.value,
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
    setShowForm(false);
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
    if (e.target.value == "LogMAR") {
      setDvAcuityValues(createOptionList(logMARValues));
    } else if (e.target.value == "6m") {
      setDvAcuityValues(createOptionList(sixmValues));
    } else if (e.target.value == "20ft") {
      setDvAcuityValues(createOptionList(twentyftValues));
    }
  };

  const changeNvValues = (e) => {
    if (e.target.value == "LogMAR") {
      setNvAcuityValues(createOptionList(logMARNVValues));
    } else if (e.target.value == "N-scale") {
      setNvAcuityValues(createOptionList(nScaleValues));
    } else if (e.target.value == "M-units") {
      setNvAcuityValues(createOptionList(mUnitsValues));
    } else if (e.target.value == "Snellen - Imperial") {
      setNvAcuityValues(createOptionList(snellenImperialValues));
    } else if (e.target.value == "Snellen - Metric") {
      setNvAcuityValues(createOptionList(snellenMetricValues));
    }
  };

  const [dvAcuityValues, setDvAcuityValues] = useState(
    createOptionList(logMARValues)
  );
  const [nvAcuityValues, setNvAcuityValues] = useState(
    createOptionList(logMARNVValues)
  );
  const recommendationSpectacleOptions = createMenu(
    spectacleDevices,
    "recommendationSpectacle",
    true,
    devices
  );
  const dispensedSpectacleOptions = createMenu(
    spectacleDevices,
    "dispensedSpectacle",
    false,
    devices
  );
  const recommendationOpticalOptions = createMenu(
    opticalDevices,
    "recommendationOptical",
    true,
    devices
  );
  const dispensedOpticalOptions = createMenu(
    opticalDevices,
    "dispensedOptical",
    false,
    devices
  );
  const recommendationNonOpticalOptions = createOptionMenu(
    nonOpticalDevices,
    nonOpticalDevicesSubheadings,
    nonOpticalDevicesIndices,
    "recommendationNonOptical",
    true,
    devices
  );
  const dispensedNonOpticalOptions = createOptionMenu(
    nonOpticalDevices,
    nonOpticalDevicesSubheadings,
    nonOpticalDevicesIndices,
    "dispensedNonOptical",
    false,
    devices
  );
  const recommendationElectronicOptions = createOptionMenu(
    electronicDevices,
    electronicDevicesSubheadings,
    electronicDevicesIndices,
    "recommendationElectronic",
    true,
    devices
  );
  const dispensedElectronicOptions = createOptionMenu(
    electronicDevices,
    electronicDevicesSubheadings,
    electronicDevicesIndices,
    "dispensedElectronic",
    false,
    devices
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

  return (
    <div className="col-12">
      <div className="d-flex justify-content-center align-items-center">
        <h3>New Evaluation Form</h3>
      </div>
      <Form onSubmit={handleSubmit} className="mt-3">
        <Row>
          <Col>
            <Form.Group controlId="diagnosis">
              <Form.Label>Diagnosis</Form.Label>
              <Form.Check
                type="checkbox"
                label="Anterior segment condition"
                value="Anterior segment condition"
              />
              <Form.Check
                type="checkbox"
                label="Posterior eye disease"
                value="Posterior eye disease"
              />
              <Form.Check
                type="checkbox"
                label="Hereditary eye disease"
                value="Hereditary eye disease"
              />
              <Form.Check
                type="checkbox"
                label="Neuro-ophthalmic condition"
                value="Neuro-ophthalmic condition"
              />
              <Form.Check
                onChange={(event) => diagnosisOnChange(event)}
                type="checkbox"
                label="Other"
                value="Other"
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="mdvi">
              <Form.Label>MDVI</Form.Label>
              <Form.Control
                as="select"
                value={mdviValue}
                onChange={(e) => { setMdviValue(e.target.value) }}
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
        {showDiagnosisOther && (
          <Row>
            <Col>
              <Form.Group controlId="diagnosisOther">
                <Form.Label>Diagnosis Other</Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>
          </Row>
        )}
        <Row>
          <Col>
            <Form.Group controlId="date">
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="sessionNumber">
              <Form.Label>Session Number</Form.Label>
              <Form.Control type="number" />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group controlId="unit-distance">
          <Form.Label>Select Distance metric:</Form.Label>
          <Form.Control as="select" onChange={changeDvValues}>
            {/* <option defaultValue></option> */}
            <option>LogMAR</option>
            <option>6m</option>
            <option>20ft</option>
          </Form.Control>
        </Form.Group>

        <Row>
          {customFieldsDistance &&
            customFieldsDistance.map((field) => (
              <Col key={field}>
                <Form.Group controlId={field} key={field}>
                  <Form.Label>{field}</Form.Label>
                  <Form.Control as="select">{dvAcuityValues}</Form.Control>
                </Form.Group>
              </Col>
            ))}
        </Row>

        <Form.Group controlId="unit-near">
          <Form.Label>Select Near metric:</Form.Label>
          <Form.Control as="select" onChange={changeNvValues}>
            <option>LogMAR</option>
            <option>N-scale</option>
            <option>M-units</option>
            <option>Snellen - Imperial</option>
            <option>Snellen - Metric</option>
          </Form.Control>
        </Form.Group>
        <Row>
          {customFieldsNear &&
            customFieldsNear.map((field) => (
              <Col key={field}>
                <Form.Group controlId={field} key={field}>
                  <Form.Label>{field}</Form.Label>
                  <Form.Control as="select">{nvAcuityValues}</Form.Control>
                </Form.Group>
              </Col>
            ))}
        </Row>
        <Row>
          <Form.Group controlId="recommendationSpectacle">
            <Form.Label>Recommendation Spectacle</Form.Label>
          </Form.Group>
        </Row>
        <FormControl fullWidth>
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

        {showOther.recommendationSpectacle && (
          <Form.Group controlId="recommendationSpectacleOther">
            <Form.Label>Other Recommendation Spectacle</Form.Label>
            <Form.Control as="input" />
          </Form.Group>
        )}

        {allfields && (
          <div>
            <Form.Group controlId="dispensedDateSpectacle">
              <Form.Label>Dispensed Date Spectacle</Form.Label>
              <Form.Control type="date" />
            </Form.Group>
            <Row>
              <Col>
                <Form.Group controlId="costSpectacle">
                  <Form.Label>Cost Spectacle</Form.Label>
                  <Form.Control type="number" />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="costToBeneficiarySpectacle">
                  <Form.Label>Cost to Beneficiary Spectacle</Form.Label>
                  <Form.Control type="number" />
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
                <FormControl fullWidth>
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
                  <Form.Control as="select">
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
                <Form.Control as="input" />
              </Form.Group>
            )}
          </div>
        )}
        <Row>
          <Form.Group controlId="recommendationOptical">
            <Form.Label>Recommendation Optical</Form.Label>
          </Form.Group>
        </Row>
        <FormControl fullWidth>
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

        {showOther.recommendationOptical && (
          <Form.Group controlId="recommendationOpticalOther">
            <Form.Label>Other Recommendation Optical</Form.Label>
            <Form.Control as="input" />
          </Form.Group>
        )}

        {allfields && (
          <div>
            <Form.Group controlId="dispensedDateOptical">
              <Form.Label>Dispensed Date Optical</Form.Label>
              <Form.Control type="date" />
            </Form.Group>
            <Row>
              <Col>
                <Form.Group controlId="costOptical">
                  <Form.Label>Cost Optical</Form.Label>
                  <Form.Control type="number" />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="costToBeneficiaryOptical">
                  <Form.Label>Cost to Beneficiary Optical</Form.Label>
                  <Form.Control type="number" />
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
                <FormControl fullWidth>
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
                  <Form.Control as="select">
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
                <Form.Control as="input" />
              </Form.Group>
            )}
          </div>
        )}
        <Row>
          <Form.Group controlId="recommendationNonOptical">
            <Form.Label>Recommendation Non-Optical</Form.Label>
          </Form.Group>
        </Row>
        <FormControl fullWidth>
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

        {showOther.recommendationNonOptical && (
          <Form.Group controlId="recommendationNonOpticalOther">
            <Form.Label>Other Recommendation NonOptical</Form.Label>
            <Form.Control as="input" />
          </Form.Group>
        )}

        {allfields && (
          <div>
            <Form.Group controlId="dispensedDateNonOptical">
              <Form.Label>Dispensed Date NonOptical</Form.Label>
              <Form.Control type="date" />
            </Form.Group>
            <Row>
              <Col>
                <Form.Group controlId="costNonOptical">
                  <Form.Label>Cost NonOptical</Form.Label>
                  <Form.Control type="number" />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="costToBeneficiaryNonOptical">
                  <Form.Label>Cost to Beneficiary NonOptical</Form.Label>
                  <Form.Control type="number" />
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
                <FormControl fullWidth>
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
                  <Form.Control as="select">
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
                <Form.Control as="input" />
              </Form.Group>
            )}
          </div>
        )}
        <Row>
          <Form.Group controlId="recommendationElectronic">
            <Form.Label>Recommendation Electronic</Form.Label>
          </Form.Group>
        </Row>
        <FormControl fullWidth>
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

        {showOther.recommendationElectronic && (
          <Form.Group controlId="recommendationElectronicOther">
            <Form.Label>Other Recommendation Electronic</Form.Label>
            <Form.Control as="input" />
          </Form.Group>
        )}

        {allfields && (
          <div>
            <Form.Group controlId="dispensedDateElectronic">
              <Form.Label>Dispensed Date Electronic</Form.Label>
              <Form.Control type="date" />
            </Form.Group>
            <Row>
              <Col>
                <Form.Group controlId="costElectronic">
                  <Form.Label>Cost Electronic</Form.Label>
                  <Form.Control type="number" />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="costToBeneficiaryElectronic">
                  <Form.Label>Cost to Beneficiary Electronic</Form.Label>
                  <Form.Control type="number" />
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
                <FormControl fullWidth>
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
                  <Form.Control as="select">
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
                <Form.Control as="input" />
              </Form.Group>
            )}
          </div>
        )}

        {allfields && (
          <div>
            <Row>
              <Col>
                <Form.Group controlId="colourVisionRE">
                  <Form.Label>Colour Vision Right Eye</Form.Label>
                  <Form.Control as="textarea" rows={1} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="colourVisionLE">
                  <Form.Label>Colour Vision Left Eye</Form.Label>
                  <Form.Control as="textarea" rows={1} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="contrastSensitivityRE">
                  <Form.Label>Contrast Sensitivity Right Eye</Form.Label>
                  <Form.Control as="textarea" rows={1} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="contrastSensitivityLE">
                  <Form.Label>Contrast Sensitivity Left Eye</Form.Label>
                  <Form.Control as="textarea" rows={1} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="visualFieldsRE">
                  <Form.Label>Visual Fields Right Eye</Form.Label>
                  <Form.Control as="textarea" rows={1} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="visualFieldsLE">
                  <Form.Label>Visual Fields Left Eye</Form.Label>
                  <Form.Control as="textarea" rows={1} />
                </Form.Group>
              </Col>
            </Row>
          </div>
        )}
        <Form.Group controlId="extraInformation">
          <Form.Label>Comments</Form.Label>
          <Form.Control as="textarea" rows={3} />
        </Form.Group>
        <br />
        <Button variant="primary" type="submit">
          Submit Evaluation
        </Button>
      </Form>
    </div>
  );
};

export default TrainingFormCLVE;

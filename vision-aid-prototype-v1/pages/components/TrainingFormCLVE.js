import React, { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { ChevronDown, ChevronRight, Pencil } from "react-bootstrap-icons";
import { v4 as uuidv4 } from "uuid";
import Router from "next/router";
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

const TrainingFormCLVE = ({
  existingTrainings = [],
  addNewTraining,
  customFieldsDistance,
  customFieldsNear,
  title,
  api,
  allfields,
}) => {
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
    const newTraining = {
      diagnosis: diagnosis,
      mdvi: e.target.mdvi.value,
      date: e.target.date.value,
      sessionNumber: e.target.sessionNumber.value,
      recommendationSpectacle:
        e.target.recommendationSpectacle == null
          ? null
          : (e.target.recommendationSpectacle.value === "other"
          ? e.target.recommendationSpectacleOther.value
          : e.target.recommendationSpectacle.value),
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
        e.target.dispensedSpectacle == null
          ? null
          : (e.target.dispensedSpectacle.value === "other"
          ? e.target.dispensedSpectacleOther.value
          : e.target.dispensedSpectacle.value),
      trainingGivenSpectacle:
        e.target.trainingGivenSpectacle == null
          ? null
          : e.target.trainingGivenSpectacle.value,
      recommendationOptical:
        e.target.recommendationOptical == null
          ? null
          : (e.target.recommendationOptical.value === "other"
          ? e.target.recommendationOpticalOther.value
          : e.target.recommendationOptical.value),
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
        e.target.dispensedOptical == null
          ? null
          : (e.target.dispensedOptical.value === "other"
          ? e.target.dispensedOpticalOther.value
          : e.target.dispensedOptical.value),
      trainingGivenOptical:
        e.target.trainingGivenOptical == null
          ? null
          : e.target.trainingGivenOptical.value,
      recommendationNonOptical:
        e.target.recommendationNonOptical == null
          ? null
          : (e.target.recommendationNonOptical.value === "other"
          ? e.target.recommendationNonOpticalOther.value
          : e.target.recommendationNonOptical.value),
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
        e.target.dispensedNonOptical == null
          ? null
          : (e.target.dispensedNonOptical.value === "other"
          ? e.target.dispensedNonOpticalOther.value
          : e.target.dispensedNonOptical.value),
      trainingGivenNonOptical:
        e.target.trainingGivenNonOptical == null
          ? null
          : e.target.trainingGivenNonOptical.value,
      recommendationElectronic:
        e.target.recommendationElectronic == null
          ? null
          : (e.target.recommendationElectronic.value === "other"
          ? e.target.recommendationElectronicOther.value
          : e.target.recommendationElectronic.value),
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
        e.target.dispensedElectronic == null
          ? null
          : (e.target.dispensedElectronic.value === "other"
          ? e.target.dispensedElectronicOther.value
          : e.target.dispensedElectronic.value),
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
    addNewTraining(newTraining);
    setShowForm(false);
  };

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
  const spectacleOptions = createOptionList(spectacleDevices);
  const opticalOptions = createOptionList(opticalDevices);
  const nonOpticalOptions = createOptionGroupList(
    nonOpticalDevices,
    nonOpticalDevicesSubheadings,
    nonOpticalDevicesIndices
  );
  const electronicOptions = createOptionGroupList(
    electronicDevices,
    electronicDevicesSubheadings,
    electronicDevicesIndices
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

  const handleSelectChange = (e) => {
    if (e.target.value == "other") {
      setShowOther({ ...showOther, [e.target.id]: true });
    } else {
      setShowOther({ ...showOther, [e.target.id]: false });
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
              <Form.Control as="select">
                <option defaultValue></option>
                <option>Yes</option>
                <option>No</option>
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

        <Form.Group controlId="recommendationSpectacle">
          <Form.Label>Recommendation Spectacle</Form.Label>
          <Form.Control
            as="select"
            onChange={handleSelectChange}
            id="recommendationSpectacle"
          >
            <option defaultValue></option>
            {spectacleOptions}
            <option value="other">Other</option>
          </Form.Control>
        </Form.Group>

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
                <Form.Group controlId="dispensedSpectacle">
                  <Form.Label>Dispensed Spectacle</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={handleSelectChange}
                    id="dispensedSpectacle"
                  >
                    <option defaultValue></option>
                    {spectacleOptions}
                    <option value="other">Other</option>
                  </Form.Control>
                </Form.Group>
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

        <Form.Group controlId="recommendationOptical">
          <Form.Label>Recommendation Optical</Form.Label>
          <Form.Control
            as="select"
            onChange={handleSelectChange}
            id="recommendationOptical"
          >
            <option defaultValue></option>
            {opticalOptions}
            <option value="other">Other</option>
          </Form.Control>
        </Form.Group>

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
                <Form.Group controlId="dispensedOptical">
                  <Form.Label>Dispensed Optical</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={handleSelectChange}
                    id="dispensedOptical"
                  >
                    <option defaultValue></option>
                    {opticalOptions}
                    <option value="other">Other</option>
                  </Form.Control>
                </Form.Group>
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

        <Form.Group controlId="recommendationNonOptical">
          <Form.Label>Recommendation Non-Optical</Form.Label>
          <Form.Control
            as="select"
            onChange={handleSelectChange}
            id="recommendationNonOptical"
          >
            <option defaultValue></option>
            {nonOpticalOptions}
            <option value="other">Other</option>
          </Form.Control>
        </Form.Group>

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
                <Form.Group controlId="dispensedNonOptical">
                  <Form.Label>Dispensed Non-Optical</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={handleSelectChange}
                    id="dispensedNonOptical"
                  >
                    <option defaultValue></option>
                    {nonOpticalOptions}
                    <option value="other">Other</option>
                  </Form.Control>
                </Form.Group>
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

        <Form.Group controlId="recommendationElectronic">
          <Form.Label>Recommendation Electronic</Form.Label>
          <Form.Control
            as="select"
            onChange={handleSelectChange}
            id="recommendationElectronic"
          >
            <option defaultValue></option>
            {electronicOptions}
            <option value="other">Other</option>
          </Form.Control>
        </Form.Group>

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
                <Form.Group controlId="dispensedElectronic">
                  <Form.Label>Dispensed Electronic</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={handleSelectChange}
                    id="dispensedElectronic"
                  >
                    <option defaultValue></option>
                    {electronicOptions}
                    <option value="other">Other</option>
                  </Form.Control>
                </Form.Group>
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

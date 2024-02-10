import { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { ChevronDown, ChevronRight, Pencil } from "react-bootstrap-icons";
import { v4 as uuidv4 } from "uuid";
import Router from "next/router";

const TrainingForm = ({
  existingTrainings = [],
  addNewTraining,
  customFields,
  title,
  api,
  submitButtonTest,
  typeList,
  mdvi,
  updateMDVIForBeneficiary,
  mdviValue = "No",
  subTypeList,
}) => {
  if (mdviValue === null || mdviValue === undefined || mdviValue === "")
    mdviValue = "No";
  const [mdviVal, setMdviVal] = useState(mdviValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    const customData = customFields.reduce((acc, field) => {
      acc[field] = e.target[field].value;
      return acc;
    }, {});
    const newTraining = {
      date: e.target.date.value,
      sessionNumber: e.target.sessionNumber.value,
      type: e.target.type == null ? null : e.target.type.value,
      typeOther: e.target.typeOther == null ? null : e.target.typeOther.value,
      subType:
        e.target.subTypeSelect == null ? null : e.target.subTypeSelect.value,
      subTypeOther:
        e.target.subTypeOther == null ? null : e.target.subTypeOther.value,
      MDVI: mdvi ? mdviVal : null,
      Diagnosis: e.target.Diagnosis == null ? null : e.target.Diagnosis.value,
      extraInformation: e.target.extraInformation.value,
      ...customData,
    };
    if (mdvi) {
      updateMDVIForBeneficiary({ mDVI: mdviVal });
    }
    addNewTraining(newTraining);
  };

  const [editableField, setEditableField] = useState("");
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
    if (field == "date" || field == "dispensedDate") {
      value = new Date(existingTrainings[index][field]);
    } else if (
      field == "sessionNumber" ||
      field == "cost" ||
      field == "costToBeneficiary"
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

  let types = [];
  if (typeList != null) {
    typeList.forEach((type) => {
      if (type.value == "Other") {
        types.push(
          <option value={type.value} selected>
            {type.value}
          </option>
        );
      } else {
        types.push(<option value={type.value}>{type.value}</option>);
      }
    });
  }

  let subTypeInitial = [];
  if (subTypeList != null) {
    subTypeList.forEach((st) => {
      if (st.trainingType.value == "Other") {
        if (st.value == "Other") {
          subTypeInitial.push(
            <option value={st.value} selected>
              {st.value}
            </option>
          );
        } else {
          subTypeInitial.push(<option value={st.value}>{st.value}</option>);
        }
      }
    });
  }

  const [subType, setSubType] = useState([subTypeInitial]);
  const [showTypeOther, setShowTypeOther] = useState(true);
  const [showTypeOtherSub, setShowTypeOtherSub] = useState(true);
  function typeOnChange(event) {
    event.preventDefault();
    if (event.target.value == "Other") {
      setShowTypeOther(true);
    } else {
      setShowTypeOther(false);
    }
    if (subTypeList != null) {
      let stTemp = [];
      subTypeList.forEach((st) => {
        if (
          st.trainingType.value == event.target.value &&
          st.value == "Other"
        ) {
          stTemp.push(
            <option value={st.value} selected>
              {st.value}
            </option>
          );
        } else if (st.trainingType.value == event.target.value) {
          stTemp.push(<option value={st.value}>{st.value}</option>);
        }
      });
      setSubType(stTemp);
      document.getElementById("subTypeSelect").value = "Other";
      setShowTypeOtherSub(true);
    }
  }

  function subTypeOnChange(event) {
    event.preventDefault();
    if (event.target.value == "Other") {
      setShowTypeOtherSub(true);
    } else {
      setShowTypeOtherSub(false);
    }
  }

  return (
    <div className="col-12">
      <div className="row">
        <div className="justify-content-center align-items-center">
          <h3>New Evaluation Form</h3>
        </div>
      </div>
      <>
        <Form onSubmit={handleSubmit} className="mt-3">
          <br />
          <br />
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
                <Form.Control type="number" min={1} autoComplete="off" />
              </Form.Group>
            </Col>
          </Row>
          {customFields &&
            customFields.map((field) => (
              <Form.Group controlId={field} key={field}>
                <Form.Label>{field}</Form.Label>
                <Form.Control type="text" autoComplete="off" />
              </Form.Group>
            ))}
          {mdvi == true && (
            <Row>
              <Col>
                <Form.Group controlId="MDVI">
                  <Form.Label>MDVI</Form.Label>
                  <Form.Control
                    as="select"
                    value={mdviVal}
                    onChange={(e) => setMdviVal(e.target.value)}
                  >
                    <option key="Yes" value="Yes">
                      Yes
                    </option>
                    <option selected key="No" value="No">
                      No
                    </option>
                    <option key="At Risk" value="At Risk">
                      At Risk
                    </option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="Diagnosis">
                  <Form.Label>Diagnosis</Form.Label>
                  <Form.Control as="textarea" rows={1} autoComplete="off" />
                </Form.Group>
              </Col>
            </Row>
          )}
          {typeList != null && (
            <Form.Group controlId="type">
              <Form.Label>Type</Form.Label>
              <Form.Control as="select" onChange={typeOnChange}>
                {types}
              </Form.Control>
            </Form.Group>
          )}
          {showTypeOther && typeList != null && subTypeList == null && (
            <Form.Group controlId="typeOther">
              <Form.Label>Type Other</Form.Label>
              <Form.Control
                as="textarea"
                rows={1}
                autoComplete="off"
              ></Form.Control>
            </Form.Group>
          )}
          {typeList != null && subTypeList != null && (
            <Form.Group controlId="subType">
              <Form.Label>Sub Type</Form.Label>
              <Form.Control
                id="subTypeSelect"
                as="select"
                onChange={subTypeOnChange}
              >
                {subType}
              </Form.Control>
            </Form.Group>
          )}
          {showTypeOtherSub && typeList != null && subTypeList != null && (
            <Form.Group controlId="subTypeOther">
              <Form.Label>Type Sub Other</Form.Label>
              <Form.Control
                as="textarea"
                rows={1}
                autoComplete="off"
              ></Form.Control>
            </Form.Group>
          )}
          <Form.Group controlId="extraInformation">
            <Form.Label>Extra Information</Form.Label>
            <Form.Control as="textarea" rows={3} autoComplete="off" />
          </Form.Group>
          <br />
          <Button className="btn btn-success border-0 btn-block" type="submit">
            {submitButtonTest}
          </Button>
        </Form>
      </>
    </div>
  );
};

export default TrainingForm;

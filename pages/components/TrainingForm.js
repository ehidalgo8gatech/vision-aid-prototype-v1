import { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { required } from "./required";

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

  let types = [<option key="default"></option>];
  if (typeList != null) {
    typeList.forEach((type) => {
      if (type.value == "Other") {
        types.push(
          <option value={type.value}>
            {type.value}
          </option>
        );
      } else {
        types.push(<option value={type.value}>{type.value}</option>);
      }
    });
  }

  let subTypeInitial = [<option key="default" value={null}></option>];
  if (subTypeList != null) {
    subTypeList.forEach((st) => {
      subTypeInitial.push(<option value={st.value}>{st.value}</option>);
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
                <Form.Label>Date { required() } </Form.Label>
                <Form.Control type="date" required />
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
              <Form.Label>Type { required() }</Form.Label>
              <Form.Control as="select" required onChange={typeOnChange}>
                {types}
              </Form.Control>
            </Form.Group>
          )}
          {showTypeOther && typeList != null && subTypeList == null && (
            <Form.Group controlId="typeOther">
              <Form.Label>Type Other { required() }</Form.Label>
              <Form.Control
                as="textarea"
                required
                rows={1}
                autoComplete="off"
              ></Form.Control>
            </Form.Group>
          )}
          {typeList != null && subTypeList != null && (
            <Form.Group controlId="subType">
              <Form.Label>Sub Type { required() } </Form.Label>
              <Form.Control
                id="subTypeSelect"
                required
                as="select"
                onChange={subTypeOnChange}
              >
                {subType}
              </Form.Control>
            </Form.Group>
          )}
          {showTypeOtherSub && typeList != null && subTypeList != null && (
            <Form.Group controlId="subTypeOther">
              <Form.Label>Type Sub Other { required() }</Form.Label>
              <Form.Control
                as="textarea"
                rows={1}
                required
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

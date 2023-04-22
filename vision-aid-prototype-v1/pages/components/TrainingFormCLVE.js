import { useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import {ChevronDown, ChevronRight, Pencil} from 'react-bootstrap-icons';
import {v4 as uuidv4} from "uuid";
import Router from "next/router";

const TrainingFormCLVE = ({ existingTrainings = [], addNewTraining, customFieldsDistance, customFieldsNear,title,api }) => {
  const [showForm, setShowForm] = useState(false);

  const handleToggle = () => {
    setShowForm(!showForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const customDataDistance = customFieldsDistance.reduce((acc, field) => {
      acc[field] = e.target[field].value + ' ' + e.target[`unit-distance`].value
      return acc;
    }, {});
    const customDataNear = customFieldsNear.reduce((acc, field) => {
      acc[field] = e.target[field].value + ' ' + e.target[`unit-near`].value
      return acc;
    }, {});
    const newTraining = {
      date: e.target.date.value,
      sessionNumber: e.target.sessionNumber.value,
      recommendation: e.target.recommendation.value,
      dispensed: e.target.dispensed.value,
      dispensedDate: new Date(e.target.dispensedDate.value),
      cost: parseInt(e.target.cost.value),
      costToBeneficiary: parseInt(e.target.costToBeneficiary.value),
      extraInformation: e.target.extraInformation.value,
      ...customDataDistance,
      ...customDataNear
    };
    addNewTraining(newTraining);
    setShowForm(false);
  };
  const [editableField, setEditableField] = useState('')
  // Handle edit icon click
  const handleEditClick = (field) => {
    setEditableField(field);
  };

  const [rerenderForce, setRerenderForce] = useState();
  // Handle input changes
  const handleInputChange = (index, field, id) => {
    existingTrainings[index][field] = document.getElementById(id).value
    setRerenderForce({
      ...rerenderForce,
      "uuid": uuidv4()
    })
  }

  const handleEditSubmit = async (e, api, field, index) => {
    e.preventDefault();
    var value
    if (field == 'date') {
      value = new Date(existingTrainings[index][field])
    } else {
      value = existingTrainings[index][field]
    }

    // Update user data in the database
    const response = await fetch(`/api/`+api, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: existingTrainings[index].id, [field]:  value}),
    });

    // Handle response from the API
    if (response.ok) {
      alert('User data saved successfully!');
    } else {
      alert('An error occurred while saving user data. Please try again.');
    }
    Router.reload()
  };

  return (
<div className="col-12">
      <div className="d-flex justify-content-center align-items-center">
        {showForm ? (
          <ChevronDown
            className="ml-2"
            onClick={handleToggle}
            style={{ cursor: 'pointer' }}
          />
        ) : (
          <ChevronRight
            className="ml-2"
            onClick={handleToggle}
            style={{ cursor: 'pointer' }}
          />
        )}
        <h2>{title}</h2>
      </div>
      {showForm && (
        <>
          {existingTrainings.map((training, index) => (
            <div key={index}>
              {editableField === 'date' ? (
                  <div>
                    <strong>Date:</strong>
                    <form onSubmit={(e) => handleEditSubmit(e, api, 'date', index)} className="d-inline ms-2">
                      <input id={title + index + 'date'}
                          type="date"
                          className="form-control d-inline w-auto"
                          name='date'
                          value={training.date}
                          onChange={() => handleInputChange(index, 'date', title + index + 'date')}
                      />
                      <button type="submit" className="btn btn-primary btn-sm ms-2">
                        Save
                      </button>
                    </form>
                  </div>
              ) : (
                  <div>
                    <strong>Date:</strong>
                    <span className="ms-2">
          {training.date}
                      <button
                          type="button"
                          className="btn btn-link btn-sm text-primary ms-2"
                          onClick={() => handleEditClick('date')}
                      >
           <Pencil />
          </button>
        </span>
                  </div>
              )}
              <p>
                <strong>Session Number:</strong> {training.sessionNumber}
                <Pencil />
              </p>
              {customFieldsDistance.map((field) => (
                <p key={field}>
                  <strong>{field}:</strong> {training[field]}
                  <Pencil />
                </p>
              ))}
              {customFieldsNear.map((field) => (
                <p key={field}>
                  <strong>{field}:</strong> {training[field]}
                  <Pencil />
                </p>
              ))}
              <p>
                <strong>Recommendation:</strong> {training.recommendation}
                <Pencil />
              </p>
              <p>
                <strong>Dispensed:</strong> {training.dispensed}
                <Pencil />
              </p>
              <p>
                <strong>Dispensed Date:</strong> {training.dispensedDate.toString().split('T')[0]}
                <Pencil />
              </p>
              <p>
                <strong>Cost:</strong> {training.cost}
                <Pencil />
              </p>
              <p>
                <strong>Cost to beneficiary:</strong> {training.costToBeneficiary}
                <Pencil />
              </p>
              <p>
                <strong>Extra Information:</strong> {training.extraInformation}
                <Pencil />
              </p>
              <hr />
            </div>
          ))}
                {showForm && (
        <Form onSubmit={handleSubmit} className="mt-3">
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
                <Form.Control as="select">
                <option defaultValue></option>
                <option>N-scale</option>
                <option>M-units</option>
                <option>Imperial</option>
                <option>Metric</option>
                <option>LogMAR</option>
                </Form.Control>
            </Form.Group>
          
          {customFieldsDistance.map((field) => (
            <Row key={field}>
            <Col>
            <Form.Group controlId={field} key={field}>
              <Form.Label>{field}</Form.Label>
              <Form.Control type="text" />
            </Form.Group>
            </Col>
          </Row>
          ))}
           <Form.Group controlId="unit-near">
                <Form.Label>Select Near metric:</Form.Label>
                <Form.Control as="select">
                <option defaultValue></option>
                <option>N-scale</option>
                <option>M-units</option>
                <option>Imperial</option>
                <option>Metric</option>
                <option>LogMAR</option>
                </Form.Control>
            </Form.Group>
            {customFieldsNear.map((field) => (
            <Row key={field}>
            <Col>
            <Form.Group controlId={field} key={field}>
              <Form.Label>{field}</Form.Label>
              <Form.Control type="text" />
            </Form.Group>
            </Col>
          </Row>
          ))}
          <Form.Group controlId="recommendation" key="recommendation">
            <Form.Label>Recommendation</Form.Label>
            <Form.Control as="select">
                <option defaultValue></option>
                <option>Optical</option>
                <option>non-Optical</option>
                <option>Electronic</option>
                </Form.Control>
          </Form.Group>
          <Form.Group controlId="dispensed" key="dispensed">
            <Form.Label>Dispensed</Form.Label>
            <Form.Control as="select">
                <option defaultValue></option>
                <option>Yes</option>
                <option>No</option>
                </Form.Control>
          </Form.Group>
          <Form.Group controlId="dispensedDate">
                <Form.Label>Dispensed date</Form.Label>
                <Form.Control type="date" />
          </Form.Group>
          <Form.Group controlId="cost">
                <Form.Label>Cost</Form.Label>
                <Form.Control type="number" />
          </Form.Group>
          <Form.Group controlId="costToBeneficiary">
                <Form.Label>Cost to beneficiary</Form.Label>
                <Form.Control type="number" />
          </Form.Group>
          <Form.Group controlId="extraInformation">
            <Form.Label>Comments</Form.Label>
            <Form.Control as="textarea" rows={3} />
          </Form.Group>
          <br/>
          <Button variant="primary" type="submit">
            Submit Evaluation
          </Button>
        </Form>
      )}
        </>
      )}
    </div>
  );
};

export default TrainingFormCLVE;
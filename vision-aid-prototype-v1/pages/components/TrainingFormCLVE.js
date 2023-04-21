import { useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { ChevronDown, ChevronRight } from 'react-bootstrap-icons';

const TrainingFormCLVE = ({ existingTrainings = [], addNewTraining, customFieldsDistance, customFieldsNear,title }) => {
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
              <p>
                <strong>Date:</strong> {training.date}
              </p>
              <p>
                <strong>Session Number:</strong> {training.sessionNumber}
              </p>
              {customFieldsDistance.map((field) => (
                <p key={field}>
                  <strong>{field}:</strong> {training[field]}
                </p>
              ))}
              {customFieldsNear.map((field) => (
                <p key={field}>
                  <strong>{field}:</strong> {training[field]}
                </p>
              ))}
              <p>
                <strong>Recommendation:</strong> {training.recommendation}
              </p>
              <p>
                <strong>Dispensed:</strong> {training.dispensed}
              </p>
              <p>
                <strong>Dispensed Date:</strong> {training.dispensedDate.toString().split('T')[0]}
              </p>
              <p>
                <strong>Cost:</strong> {training.cost}
              </p>
              <p>
                <strong>Cost to beneficiary:</strong> {training.costToBeneficiary}
              </p>
              <p>
                <strong>Extra Information:</strong> {training.extraInformation}
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
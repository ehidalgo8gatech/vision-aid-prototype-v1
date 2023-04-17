import { useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { ChevronDown, ChevronRight } from 'react-bootstrap-icons';

const TrainingForm = ({ existingTrainings = [], addNewTraining, customFields, title }) => {
  const [showForm, setShowForm] = useState(false);

  const handleToggle = () => {
    setShowForm(!showForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const customData = customFields.reduce((acc, field) => {
      acc[field] = e.target[field].value;
      return acc;
    }, {});
    const newTraining = {
      date: e.target.date.value,
      sessionNumber: e.target.sessionNumber.value,
      extraInformation: e.target.extraInformation.value,
      ...customData,
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
              {customFields.map((field) => (
                <p key={field}>
                  <strong>{field}:</strong> {training[field]}
                </p>
              ))}
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
          {customFields.map((field) => (
            <Form.Group controlId={field} key={field}>
              <Form.Label>{field}</Form.Label>
              <Form.Control type="text" />
            </Form.Group>
          ))}
          <Form.Group controlId="extraInformation">
            <Form.Label>Extra Information</Form.Label>
            <Form.Control as="textarea" rows={3} />
          </Form.Group>
          <br/>
          <Button variant="primary" type="submit">
            Add New Training
          </Button>
        </Form>
      )}
        </>
      )}
    </div>
  );
};

export default TrainingForm;
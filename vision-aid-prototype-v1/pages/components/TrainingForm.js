import { useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { Pencil } from 'react-bootstrap-icons';

const TrainingForm = ({ existingTrainings, addNewTraining, customFields, title }) => {
  const [showForm, setShowForm] = useState(false);

  const handleToggle = () => {
    setShowForm(!showForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const customData = customFields.reduce((acc, field) => {
        acc[field] = e.target[field].value;
        return acc;
      }, {})
    const newTraining = {
      date: e.target.date.value,
      sessionNumber: e.target.sessionNumber.value,
      extraInformation: e.target.extraInformation.value,
      ...customData
    };
    console.log(newTraining);
    addNewTraining(newTraining);
    setShowForm(false);
  };

  console.log(existingTrainings);

  return (
    <div className="col-4">
      <h2 className="text-center">{title}</h2>
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
      <Button variant="primary" onClick={handleToggle}>
        {showForm ? 'Cancel' : 'Add New Training'}
      </Button>
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
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      )}
    </div>
  );
};

export default TrainingForm;

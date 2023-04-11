import { useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { Pencil } from 'react-bootstrap-icons';

const TrainingInstance = ({ trainingData, title, onSubmit }) => {
  const [showForm, setShowForm] = useState(trainingData.id ? false : true);

  const handleToggle = () => {
    setShowForm(!showForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTrainingData = {
      id: trainingData.id,
      date: e.target.date.value,
      sessionNumber: e.target.sessionNumber.value,
      extraInformation: e.target.extraInformation.value,
    };
    onSubmit(newTrainingData);
    setShowForm(false);
  };

  return (
    <div className="mt-4">
      <h3 className="text-center">{title}</h3>
      {trainingData.id && (
        <Button variant="link" className="text-primary" onClick={handleToggle}>
          <Pencil />
        </Button>
      )}
      {showForm ? (
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <Form.Group controlId="date">
                <Form.Label>Date</Form.Label>
                <Form.Control type="date" defaultValue={trainingData.date} />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="sessionNumber">
                <Form.Label>Session Number</Form.Label>
                <Form.Control
                  type="number"
                  defaultValue={trainingData.sessionNumber}
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group controlId="extraInformation">
            <Form.Label>Extra Information</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              defaultValue={trainingData.extraInformation}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
          <Button variant="secondary" onClick={handleToggle}>
            Cancel
          </Button>
        </Form>
      ) : (
        trainingData.id && (
          <div>
            <p>
              <strong>Date:</strong> {trainingData.date}
            </p>
            <p>
              <strong>Session Number:</strong> {trainingData.sessionNumber}
            </p>
            <p>
              <strong>Extra Information:</strong> {trainingData.extraInformation}
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default TrainingInstance;

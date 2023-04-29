import { useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import {ChevronDown, ChevronRight, Pencil} from 'react-bootstrap-icons';
import {v4 as uuidv4} from "uuid";
import Router from "next/router";

const TrainingForm = ({ existingTrainings = [], addNewTraining, customFields, title, api, submitButtonTest, typeList}) => {
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
      type: e.target.type.value,
      typeOther: e.target.typeOther == null ? null : e.target.typeOther.value,
      extraInformation: e.target.extraInformation.value,
      ...customData,
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
    if (field == 'date' || field == 'dispensedDate') {
      value = new Date(existingTrainings[index][field])
    } else if(field == 'sessionNumber' || field == 'cost' || field == 'costToBeneficiary') {
      value = parseInt(existingTrainings[index][field])
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

  let types = []
  if (typeList != null) {
    typeList.forEach(type => {
      types.push((<option>{type}</option>))
    })
  }

  const [showTypeOther, setShowTypeOther] = useState(true)
  function typeOnChange(event) {
    event.preventDefault()
    if (event.target.value == "Other") {
      console.log(event.target.value)
      setShowTypeOther(true)
    } else {
      setShowTypeOther(false)
    }
  }

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
          {training.date == null ? null : training.date.toString().split('T')[0]}
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

              {editableField === 'sessionNumber' ? (
                  <div>
                    <strong>Session Number:</strong>
                    <form onSubmit={(e) => handleEditSubmit(e, api, 'sessionNumber', index)} className="d-inline ms-2">
                      <input id={title + index + 'sessionNumber'}
                             type="number"
                             className="form-control d-inline w-auto"
                             name='sessionNumber'
                             value={training.sessionNumber}
                             onChange={() => handleInputChange(index, 'sessionNumber', title + index + 'sessionNumber')}
                      />
                      <button type="submit" className="btn btn-primary btn-sm ms-2">
                        Save
                      </button>
                    </form>
                  </div>
              ) : (
                  <div>
                    <strong>Session Number:</strong>
                    <span className="ms-2">
          {training.sessionNumber}
                      <button
                          type="button"
                          className="btn btn-link btn-sm text-primary ms-2"
                          onClick={() => handleEditClick('sessionNumber')}
                      >
           <Pencil/>
          </button>
        </span>
                  </div>
              )}

              {editableField === 'type' ? (
                  <div>
                    <strong>Type:</strong>
                    <form onSubmit={(e) => handleEditSubmit(e, api, 'type', index)} className="d-inline ms-2">
                      <input id={title + index + 'type'}
                             type="text"
                             className="form-control d-inline w-auto"
                             name='type'
                             value={training.type}
                             onChange={() => handleInputChange(index, 'type', title + index + 'type')}
                      />
                      <button type="submit" className="btn btn-primary btn-sm ms-2">
                        Save
                      </button>
                    </form>
                  </div>
              ) : (
                  <div>
                    <strong>Type:</strong>
                    <span className="ms-2">
          {training.type}
                      <button
                          type="button"
                          className="btn btn-link btn-sm text-primary ms-2"
                          onClick={() => handleEditClick('type')}
                      >
           <Pencil/>
          </button>
        </span>
                  </div>
              )}

              {customFields.map((field) => (
                  <div key={field}>
                    {editableField === field ? (
                        <div>
                          <strong>{field}:</strong>
                          <form onSubmit={(e) => handleEditSubmit(e, api, field, index)} className="d-inline ms-2">
                            <input id={title + index + field}
                                   type="text"
                                   className="form-control d-inline w-auto"
                                   name={field}
                                   value={training[field]}
                                   onChange={() => handleInputChange(index, field, title + index + field)}
                            />
                            <button type="submit" className="btn btn-primary btn-sm ms-2">
                              Save
                            </button>
                          </form>
                        </div>
                    ) : (
                        <div>
                          <strong>{field}: </strong>
                          <span className="ms-2">
          {training[field]}
                            <button
                                type="button"
                                className="btn btn-link btn-sm text-primary ms-2"
                                onClick={() => handleEditClick(field)}
                            >
           <Pencil/>
          </button>
        </span>
                        </div>
                    )}
                  </div>
              ))}

              {editableField === 'extraInformation' ? (
                  <div>
                    <strong>extraInformation:</strong>
                    <form onSubmit={(e) => handleEditSubmit(e, api, 'extraInformation', index)} className="d-inline ms-2">
                      <input id={title + index + 'extraInformation'}
                             type="text"
                             className="form-control d-inline w-auto"
                             name='extraInformation'
                             value={training.extraInformation}
                             onChange={() => handleInputChange(index, 'extraInformation', title + index + 'extraInformation')}
                      />
                      <button type="submit" className="btn btn-primary btn-sm ms-2">
                        Save
                      </button>
                    </form>
                  </div>
              ) : (
                  <div>
                    <strong>extraInformation:</strong>
                    <span className="ms-2">
          {training.extraInformation}
                      <button
                          type="button"
                          className="btn btn-link btn-sm text-primary ms-2"
                          onClick={() => handleEditClick('extraInformation')}
                      >
           <Pencil/>
          </button>
        </span>
                  </div>
              )}
              <hr />
            </div>
          ))}
                {showForm && (
        <Form onSubmit={handleSubmit} className="mt-3">
          <Button variant="primary" type="submit">
            {submitButtonTest}
          </Button>
          <br/>
          <br/>
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
          <Form.Group controlId="type">
            <Form.Label>Type</Form.Label>
            <Form.Control as="select" onChange={typeOnChange}>
              {types}
            </Form.Control>
          </Form.Group>
          {(showTypeOther && <Form.Group controlId="typeOther">
            <Form.Label>Type Other</Form.Label>
            <Form.Control as="textarea" rows={1}>
            </Form.Control>
          </Form.Group>)}
          <Form.Group controlId="extraInformation">
            <Form.Label>Extra Information</Form.Label>
            <Form.Control as="textarea" rows={3} />
          </Form.Group>
          <br/>
        </Form>
      )}
        </>
      )}
    </div>
  );
};

export default TrainingForm;
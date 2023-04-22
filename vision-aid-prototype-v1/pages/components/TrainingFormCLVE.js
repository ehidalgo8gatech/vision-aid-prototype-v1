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
              
              {customFieldsDistance.map((field) => (
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

              {customFieldsNear.map((field) => (
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

              {editableField === 'recommendation' ? (
                  <div>
                    <strong>Recommendation:</strong>
                    <form onSubmit={(e) => handleEditSubmit(e, api, 'recommendation', index)} className="d-inline ms-2">
                      <input id={title + index + 'recommendation'}
                             type="text"
                             className="form-control d-inline w-auto"
                             name='recommendation'
                             value={training.recommendation}
                             onChange={() => handleInputChange(index, 'recommendation', title + index + 'recommendation')}
                      />
                      <button type="submit" className="btn btn-primary btn-sm ms-2">
                        Save
                      </button>
                    </form>
                  </div>
              ) : (
                  <div>
                    <strong>Recommendation:</strong>
                    <span className="ms-2">
          {training.recommendation}
                      <button
                          type="button"
                          className="btn btn-link btn-sm text-primary ms-2"
                          onClick={() => handleEditClick('recommendation')}
                      >
           <Pencil/>
          </button>
        </span>
                  </div>
              )}

              {editableField === 'dispensed' ? (
                  <div>
                    <strong>Dispensed:</strong>
                    <form onSubmit={(e) => handleEditSubmit(e, api, 'dispensed', index)} className="d-inline ms-2">
                      <input id={title + index + 'dispensed'}
                             type="text"
                             className="form-control d-inline w-auto"
                             name='dispensed'
                             value={training.dispensed}
                             onChange={() => handleInputChange(index, 'dispensed', title + index + 'dispensed')}
                      />
                      <button type="submit" className="btn btn-primary btn-sm ms-2">
                        Save
                      </button>
                    </form>
                  </div>
              ) : (
                  <div>
                    <strong>Dispensed:</strong>
                    <span className="ms-2">
          {training.dispensed}
                      <button
                          type="button"
                          className="btn btn-link btn-sm text-primary ms-2"
                          onClick={() => handleEditClick('dispensed')}
                      >
           <Pencil/>
          </button>
        </span>
                  </div>
              )}

              {editableField === 'dispensedDate' ? (
                  <div>
                    <strong>Dispensed Date:</strong>
                    <form onSubmit={(e) => handleEditSubmit(e, api, 'dispensedDate', index)} className="d-inline ms-2">
                      <input id={title + index + 'dispensedDate'}
                             type="date"
                             className="form-control d-inline w-auto"
                             name='dispensedDate'
                             value={training.dispensedDate}
                             onChange={() => handleInputChange(index, 'dispensedDate', title + index + 'dispensedDate')}
                      />
                      <button type="submit" className="btn btn-primary btn-sm ms-2">
                        Save
                      </button>
                    </form>
                  </div>
              ) : (
                  <div>
                    <strong>Dispensed Date:</strong>
                    <span className="ms-2">
          {training.dispensedDate}
                      <button
                          type="button"
                          className="btn btn-link btn-sm text-primary ms-2"
                          onClick={() => handleEditClick('dispensedDate')}
                      >
           <Pencil/>
          </button>
        </span>
                  </div>
              )}

              {editableField === 'cost' ? (
                  <div>
                    <strong>cost:</strong>
                    <form onSubmit={(e) => handleEditSubmit(e, api, 'cost', index)} className="d-inline ms-2">
                      <input id={title + index + 'cost'}
                             type="number"
                             className="form-control d-inline w-auto"
                             name='cost'
                             value={training.cost}
                             onChange={() => handleInputChange(index, 'cost', title + index + 'cost')}
                      />
                      <button type="submit" className="btn btn-primary btn-sm ms-2">
                        Save
                      </button>
                    </form>
                  </div>
              ) : (
                  <div>
                    <strong>cost:</strong>
                    <span className="ms-2">
          {training.cost}
                      <button
                          type="button"
                          className="btn btn-link btn-sm text-primary ms-2"
                          onClick={() => handleEditClick('cost')}
                      >
           <Pencil/>
          </button>
        </span>
                  </div>
              )}

              {editableField === 'costToBeneficiary' ? (
                  <div>
                    <strong>costToBeneficiary:</strong>
                    <form onSubmit={(e) => handleEditSubmit(e, api, 'costToBeneficiary', index)} className="d-inline ms-2">
                      <input id={title + index + 'costToBeneficiary'}
                             type="number"
                             className="form-control d-inline w-auto"
                             name='costToBeneficiary'
                             value={training.costToBeneficiary}
                             onChange={() => handleInputChange(index, 'costToBeneficiary', title + index + 'costToBeneficiary')}
                      />
                      <button type="submit" className="btn btn-primary btn-sm ms-2">
                        Save
                      </button>
                    </form>
                  </div>
              ) : (
                  <div>
                    <strong>costToBeneficiary:</strong>
                    <span className="ms-2">
          {training.costToBeneficiary}
                      <button
                          type="button"
                          className="btn btn-link btn-sm text-primary ms-2"
                          onClick={() => handleEditClick('costToBeneficiary')}
                      >
           <Pencil/>
          </button>
        </span>
                  </div>
              )}

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
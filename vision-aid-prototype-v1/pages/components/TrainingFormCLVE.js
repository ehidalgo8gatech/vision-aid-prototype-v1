import React, { useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import {ChevronDown, ChevronRight, Pencil} from 'react-bootstrap-icons';
import {v4 as uuidv4} from "uuid";
import Router from "next/router";

const TrainingFormCLVE = ({ existingTrainings = [], addNewTraining, customFieldsDistance, customFieldsNear,title,api, allfields }) => {
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
    var diagnosis = ""
    e.target.diagnosis.forEach(diagnosisValue => {
      if (diagnosisValue.checked && diagnosisValue.value == 'Other') {
        diagnosis = diagnosis + " " + e.target.diagnosisOther.value
      } else if (diagnosisValue.checked) {
        diagnosis = diagnosis + " " + diagnosisValue.value
      }
    })
    const newTraining = {
      diagnosis: diagnosis,
      mdvi: e.target.mdvi.value,
      date: e.target.date.value,
      sessionNumber: e.target.sessionNumber.value,
      recommendationSpectacle: e.target.recommendationSpectacle == null ? null : e.target.recommendationSpectacle.value,
      dispensedDateSpectacle: e.target.dispensedDateSpectacle == null ? null : new Date(e.target.dispensedDateSpectacle.value),
      costSpectacle: e.target.costSpectacle == null ? null : parseInt(e.target.costSpectacle.value),
      costToBeneficiarySpectacle: e.target.costToBeneficiarySpectacle == null ? null : parseInt(e.target.costToBeneficiarySpectacle.value),
      dispensedSpectacle: e.target.dispensedSpectacle == null ? null : e.target.dispensedSpectacle.value,
      trainingGivenSpectacle: e.target.trainingGivenSpectacle == null ? null : e.target.trainingGivenSpectacle.value,
      recommendationOptical: e.target.recommendationOptical == null ? null : e.target.recommendationOptical.value,
      dispensedDateOptical: e.target.dispensedDateOptical == null ? null : new Date(e.target.dispensedDateOptical.value),
      costOptical: e.target.costOptical == null ? null : parseInt(e.target.costOptical.value),
      costToBeneficiaryOptical: e.target.costToBeneficiaryOptical == null ? null : parseInt(e.target.costToBeneficiaryOptical.value),
      dispensedOptical: e.target.dispensedOptical == null ? null : e.target.dispensedOptical.value,
      trainingGivenOptical: e.target.trainingGivenOptical == null ? null : e.target.trainingGivenOptical.value,
      recommendationNonOptical: e.target.recommendationNonOptical == null ? null : e.target.recommendationNonOptical.value,
      dispensedDateNonOptical: e.target.dispensedDateNonOptical == null ? null : new Date(e.target.dispensedDateNonOptical.value),
      costNonOptical: e.target.costNonOptical == null ? null : parseInt(e.target.costNonOptical.value),
      costToBeneficiaryNonOptical: e.target.costToBeneficiaryNonOptical == null ? null : parseInt(e.target.costToBeneficiaryNonOptical.value),
      dispensedNonOptical: e.target.dispensedNonOptical == null ? null : e.target.dispensedNonOptical.value,
      trainingGivenNonOptical: e.target.trainingGivenNonOptical == null ? null : e.target.trainingGivenNonOptical.value,
      recommendationElectronic: e.target.recommendationElectronic == null ? null : e.target.recommendationElectronic.value,
      dispensedDateElectronic: e.target.dispensedDateElectronic == null ? null : new Date(e.target.dispensedDateElectronic.value),
      costElectronic: e.target.costElectronic == null ? null : parseInt(e.target.costElectronic.value),
      costToBeneficiaryElectronic: e.target.costToBeneficiaryElectronic == null ? null : parseInt(e.target.costToBeneficiaryElectronic.value),
      dispensedElectronic: e.target.dispensedElectronic == null ? null : e.target.dispensedElectronic.value,
      trainingGivenElectronic: e.target.trainingGivenElectronic == null ? null : e.target.trainingGivenElectronic.value,
      colourVisionRE: e.target.colourVisionRE == null ? null : e.target.colourVisionRE.value,
      colourVisionLE: e.target.colourVisionLE == null ? null : e.target.colourVisionLE.value,
      contrastSensitivityRE: e.target.contrastSensitivityRE == null ? null : e.target.contrastSensitivityRE.value,
      contrastSensitivityLE: e.target.contrastSensitivityLE == null ? null : e.target.contrastSensitivityLE.value,
      visualFieldsRE: e.target.visualFieldsRE == null ? null : e.target.visualFieldsRE.value,
      visualFieldsLE: e.target.visualFieldsLE == null ? null : e.target.visualFieldsLE.value,
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
    if (field == 'date' || field == 'dispensedDateSpectacle' || field == 'dispensedDateOptical' || field == 'dispensedDateNonOptical' || field == 'dispensedDateElectronic') {
      value = new Date(existingTrainings[index][field])
    } else if(field == 'sessionNumber'  || field == 'costSpectacle' || field == 'costToBeneficiarySpectacle' || field == 'costOptical' || field == 'costToBeneficiaryOptical' || field == 'costNonOptical' || field == 'costToBeneficiaryNonOptical' || field == 'costElectronic' || field == 'costToBeneficiaryElectronic') {
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

  const [showDiagnosisOther, setShowDiagnosisOther] = useState(false)
  function diagnosisOnChange(event) {
    if (event.target.checked == true) {
      setShowDiagnosisOther(true)
    } else {
      setShowDiagnosisOther(false)
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
              
              {editableField === 'diagnosis' ? (
                  <div>
                    <strong>Diagnosis:</strong>
                    <form onSubmit={(e) => handleEditSubmit(e, api, 'diagnosis', index)} className="d-inline ms-2">
                      <input id={title + index + 'diagnosis'}
                             type="text"
                             className="form-control d-inline w-auto"
                             name='diagnosis'
                             value={training.diagnosis}
                             onChange={() => handleInputChange(index, 'diagnosis', title + index + 'diagnosis')}
                      />
                      <button type="submit" className="btn btn-primary btn-sm ms-2">
                        Save
                      </button>
                    </form>
                  </div>
              ) : (
                  <div>
                    <strong>diagnosis:</strong>
                    <span className="ms-2">
          {training.diagnosis}
                      <button
                          type="button"
                          className="btn btn-link btn-sm text-primary ms-2"
                          onClick={() => handleEditClick('diagnosis')}
                      >
           <Pencil/>
          </button>
        </span>
                  </div>
              )}

              {editableField === 'mdvi' ? (
                  <div>
                    <strong>MDVI:</strong>
                    <form onSubmit={(e) => handleEditSubmit(e, api, 'mdvi', index)} className="d-inline ms-2">
                      <input id={title + index + 'mdvi'}
                             type="text"
                             className="form-control d-inline w-auto"
                             name='mdvi'
                             value={training.mdvi}
                             onChange={() => handleInputChange(index, 'mdvi', title + index + 'mdvi')}
                      />
                      <button type="submit" className="btn btn-primary btn-sm ms-2">
                        Save
                      </button>
                    </form>
                  </div>
              ) : (
                  <div>
                    <strong>MDVI:</strong>
                    <span className="ms-2">
          {training.mdvi}
                      <button
                          type="button"
                          className="btn btn-link btn-sm text-primary ms-2"
                          onClick={() => handleEditClick('mdvi')}
                      >
           <Pencil/>
          </button>
        </span>
                  </div>
              )}

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

              {editableField === 'recommendationSpectacle' ? (
                  <div>
                    <strong>Recommendation Spectacle:</strong>
                    <form onSubmit={(e) => handleEditSubmit(e, api, 'recommendationSpectacle', index)} className="d-inline ms-2">
                      <input id={title + index + 'recommendationSpectacle'}
                             type="text"
                             className="form-control d-inline w-auto"
                             name='recommendationSpectacle'
                             value={training.recommendationSpectacle}
                             onChange={() => handleInputChange(index, 'recommendationSpectacle', title + index + 'recommendationSpectacle')}
                      />
                      <button type="submit" className="btn btn-primary btn-sm ms-2">
                        Save
                      </button>
                    </form>
                  </div>
              ) : (
                  <div>
                    <strong>Recommendation Spectacle:</strong>
                    <span className="ms-2">
          {training.recommendationSpectacle}
                      <button
                          type="button"
                          className="btn btn-link btn-sm text-primary ms-2"
                          onClick={() => handleEditClick('recommendationSpectacle')}
                      >
           <Pencil/>
          </button>
        </span>
                  </div>
              )}
              {allfields && editableField === 'dispensedDateSpectacle' ? (
                  <div>
                    <strong>Dispensed Date Spectacle:</strong>
                    <form onSubmit={(e) => handleEditSubmit(e, api, 'dispensedDateSpectacle', index)} className="d-inline ms-2">
                      <input id={title + index + 'dispensedDateSpectacle'}
                             type="date"
                             className="form-control d-inline w-auto"
                             name='dispensedDateSpectacle'
                             value={training.dispensedDateSpectacle}
                             onChange={() => handleInputChange(index, 'dispensedDateSpectacle', title + index + 'dispensedDateSpectacle')}
                      />
                      <button type="submit" className="btn btn-primary btn-sm ms-2">
                        Save
                      </button>
                    </form>
                  </div>
              ) : allfields && (
                  <div>
                    <strong>Dispensed Date Spectacle:</strong>
                    <span className="ms-2">
          {training.dispensedDateSpectacle}
                      <button
                          type="button"
                          className="btn btn-link btn-sm text-primary ms-2"
                          onClick={() => handleEditClick('dispensedDateSpectacle')}
                      >
           <Pencil/>
          </button>
        </span>
                  </div>
              )}
              {allfields && editableField === 'costSpectacle' ? (
                  <div>
                    <strong>Cost Spectacle:</strong>
                    <form onSubmit={(e) => handleEditSubmit(e, api, 'costSpectacle', index)} className="d-inline ms-2">
                      <input id={title + index + 'costSpectacle'}
                             type="number"
                             className="form-control d-inline w-auto"
                             name='costSpectacle'
                             value={training.costSpectacle}
                             onChange={() => handleInputChange(index, 'costSpectacle', title + index + 'costSpectacle')}
                      />
                      <button type="submit" className="btn btn-primary btn-sm ms-2">
                        Save
                      </button>
                    </form>
                  </div>
              ) : allfields && (
                  <div>
                    <strong>Cost Spectacle:</strong>
                    <span className="ms-2">
          {training.costSpectacle}
                      <button
                          type="button"
                          className="btn btn-link btn-sm text-primary ms-2"
                          onClick={() => handleEditClick('costSpectacle')}
                      >
           <Pencil/>
          </button>
        </span>
                  </div>
              )}
              {allfields && editableField === 'costToBeneficiarySpectacle' ? (
                  <div>
                    <strong>Cost To Beneficiary Spectacle:</strong>
                    <form onSubmit={(e) => handleEditSubmit(e, api, 'costToBeneficiarySpectacle', index)} className="d-inline ms-2">
                      <input id={title + index + 'costToBeneficiarySpectacle'}
                             type="number"
                             className="form-control d-inline w-auto"
                             name='costToBeneficiarySpectacle'
                             value={training.costToBeneficiarySpectacle}
                             onChange={() => handleInputChange(index, 'costToBeneficiarySpectacle', title + index + 'costToBeneficiarySpectacle')}
                      />
                      <button type="submit" className="btn btn-primary btn-sm ms-2">
                        Save
                      </button>
                    </form>
                  </div>
              ) : allfields && (
                  <div>
                    <strong>Cost To Beneficiary Spectacle:</strong>
                    <span className="ms-2">
          {training.costToBeneficiarySpectacle}
                      <button
                          type="button"
                          className="btn btn-link btn-sm text-primary ms-2"
                          onClick={() => handleEditClick('costToBeneficiarySpectacle')}
                      >
           <Pencil/>
          </button>
        </span>
                  </div>
              )}
              {allfields && editableField === 'dispensedSpectacle' ? (
                  <div>
                    <strong>Dispensed Spectacle:</strong>
                    <form onSubmit={(e) => handleEditSubmit(e, api, 'dispensedSpectacle', index)} className="d-inline ms-2">
                      <input id={title + index + 'dispensedSpectacle'}
                             type="text"
                             className="form-control d-inline w-auto"
                             name='dispensedSpectacle'
                             value={training.dispensedSpectacle}
                             onChange={() => handleInputChange(index, 'dispensedSpectacle', title + index + 'dispensedSpectacle')}
                      />
                      <button type="submit" className="btn btn-primary btn-sm ms-2">
                        Save
                      </button>
                    </form>
                  </div>
              ) : allfields && (
                  <div>
                    <strong>Dispensed Spectacle:</strong>
                    <span className="ms-2">
          {training.dispensedSpectacle}
                      <button
                          type="button"
                          className="btn btn-link btn-sm text-primary ms-2"
                          onClick={() => handleEditClick('dispensedSpectacle')}
                      >
           <Pencil/>
          </button>
        </span>
                  </div>
              )}
              {allfields && editableField === 'trainingGivenSpectacle' ? (
                  <div>
                    <strong>Training Given Spectacle:</strong>
                    <form onSubmit={(e) => handleEditSubmit(e, api, 'trainingGivenSpectacle', index)} className="d-inline ms-2">
                      <input id={title + index + 'trainingGivenSpectacle'}
                             type="text"
                             className="form-control d-inline w-auto"
                             name='trainingGivenSpectacle'
                             value={training.trainingGivenSpectacle}
                             onChange={() => handleInputChange(index, 'trainingGivenSpectacle', title + index + 'trainingGivenSpectacle')}
                      />
                      <button type="submit" className="btn btn-primary btn-sm ms-2">
                        Save
                      </button>
                    </form>
                  </div>
              ) : allfields && (
                  <div>
                    <strong>Training Given Spectacle:</strong>
                    <span className="ms-2">
          {training.trainingGivenSpectacle}
                      <button
                          type="button"
                          className="btn btn-link btn-sm text-primary ms-2"
                          onClick={() => handleEditClick('trainingGivenSpectacle')}
                      >
           <Pencil/>
          </button>
        </span>
                  </div>
              )}

              {editableField === 'recommendationOptical' ? (
                  <div>
                    <strong>Recommendation Optical:</strong>
                    <form onSubmit={(e) => handleEditSubmit(e, api, 'recommendationOptical', index)} className="d-inline ms-2">
                      <input id={title + index + 'recommendationOptical'}
                             type="text"
                             className="form-control d-inline w-auto"
                             name='recommendationOptical'
                             value={training.recommendationOptical}
                             onChange={() => handleInputChange(index, 'recommendationOptical', title + index + 'recommendationOptical')}
                      />
                      <button type="submit" className="btn btn-primary btn-sm ms-2">
                        Save
                      </button>
                    </form>
                  </div>
              ) : (
                  <div>
                    <strong>Recommendation Optical:</strong>
                    <span className="ms-2">
          {training.recommendationOptical}
                      <button
                          type="button"
                          className="btn btn-link btn-sm text-primary ms-2"
                          onClick={() => handleEditClick('recommendationOptical')}
                      >
           <Pencil/>
          </button>
        </span>
                  </div>
              )}
              {allfields && editableField === 'dispensedDateOptical' ? (
                  <div>
                    <strong>Dispensed Date Optical:</strong>
                    <form onSubmit={(e) => handleEditSubmit(e, api, 'dispensedDateOptical', index)} className="d-inline ms-2">
                      <input id={title + index + 'dispensedDateOptical'}
                             type="date"
                             className="form-control d-inline w-auto"
                             name='dispensedDateOptical'
                             value={training.dispensedDateOptical}
                             onChange={() => handleInputChange(index, 'dispensedDateOptical', title + index + 'dispensedDateOptical')}
                      />
                      <button type="submit" className="btn btn-primary btn-sm ms-2">
                        Save
                      </button>
                    </form>
                  </div>
              ) : allfields && (
                  <div>
                    <strong>Dispensed Date Optical:</strong>
                    <span className="ms-2">
          {training.dispensedDateOptical}
                      <button
                          type="button"
                          className="btn btn-link btn-sm text-primary ms-2"
                          onClick={() => handleEditClick('dispensedDateOptical')}
                      >
           <Pencil/>
          </button>
        </span>
                  </div>
              )}
              {allfields && editableField === 'costOptical' ? (
                  <div>
                    <strong>Cost Optical:</strong>
                    <form onSubmit={(e) => handleEditSubmit(e, api, 'costOptical', index)} className="d-inline ms-2">
                      <input id={title + index + 'costOptical'}
                             type="number"
                             className="form-control d-inline w-auto"
                             name='costOptical'
                             value={training.costOptical}
                             onChange={() => handleInputChange(index, 'costOptical', title + index + 'costOptical')}
                      />
                      <button type="submit" className="btn btn-primary btn-sm ms-2">
                        Save
                      </button>
                    </form>
                  </div>
              ) : allfields && (
                  <div>
                    <strong>Cost Optical:</strong>
                    <span className="ms-2">
          {training.costOptical}
                      <button
                          type="button"
                          className="btn btn-link btn-sm text-primary ms-2"
                          onClick={() => handleEditClick('costOptical')}
                      >
           <Pencil/>
          </button>
        </span>
                  </div>
              )}
              {allfields && editableField === 'costToBeneficiaryOptical' ? (
                  <div>
                    <strong>Cost To Beneficiary Optical:</strong>
                    <form onSubmit={(e) => handleEditSubmit(e, api, 'costToBeneficiaryOptical', index)} className="d-inline ms-2">
                      <input id={title + index + 'costToBeneficiaryOptical'}
                             type="number"
                             className="form-control d-inline w-auto"
                             name='costToBeneficiaryOptical'
                             value={training.costToBeneficiaryOptical}
                             onChange={() => handleInputChange(index, 'costToBeneficiaryOptical', title + index + 'costToBeneficiaryOptical')}
                      />
                      <button type="submit" className="btn btn-primary btn-sm ms-2">
                        Save
                      </button>
                    </form>
                  </div>
              ) : allfields && (
                  <div>
                    <strong>Cost To Beneficiary Optical:</strong>
                    <span className="ms-2">
          {training.costToBeneficiaryOptical}
                      <button
                          type="button"
                          className="btn btn-link btn-sm text-primary ms-2"
                          onClick={() => handleEditClick('costToBeneficiaryOptical')}
                      >
           <Pencil/>
          </button>
        </span>
                  </div>
              )}
              {allfields && editableField === 'dispensedOptical' ? (
                  <div>
                    <strong>Dispensed Optical:</strong>
                    <form onSubmit={(e) => handleEditSubmit(e, api, 'dispensedOptical', index)} className="d-inline ms-2">
                      <input id={title + index + 'dispensedOptical'}
                             type="text"
                             className="form-control d-inline w-auto"
                             name='dispensedOptical'
                             value={training.dispensedOptical}
                             onChange={() => handleInputChange(index, 'dispensedOptical', title + index + 'dispensedOptical')}
                      />
                      <button type="submit" className="btn btn-primary btn-sm ms-2">
                        Save
                      </button>
                    </form>
                  </div>
              ) : allfields && (
                  <div>
                    <strong>Dispensed Optical:</strong>
                    <span className="ms-2">
          {training.dispensedOptical}
                      <button
                          type="button"
                          className="btn btn-link btn-sm text-primary ms-2"
                          onClick={() => handleEditClick('dispensedOptical')}
                      >
           <Pencil/>
          </button>
        </span>
                  </div>
              )}
              {allfields && editableField === 'trainingGivenOptical' ? (
                  <div>
                    <strong>Training Given Optical:</strong>
                    <form onSubmit={(e) => handleEditSubmit(e, api, 'trainingGivenOptical', index)} className="d-inline ms-2">
                      <input id={title + index + 'trainingGivenOptical'}
                             type="text"
                             className="form-control d-inline w-auto"
                             name='trainingGivenOptical'
                             value={training.trainingGivenOptical}
                             onChange={() => handleInputChange(index, 'trainingGivenOptical', title + index + 'trainingGivenOptical')}
                      />
                      <button type="submit" className="btn btn-primary btn-sm ms-2">
                        Save
                      </button>
                    </form>
                  </div>
              ) : allfields && (
                  <div>
                    <strong>Training Given Optical:</strong>
                    <span className="ms-2">
          {training.trainingGivenOptical}
                      <button
                          type="button"
                          className="btn btn-link btn-sm text-primary ms-2"
                          onClick={() => handleEditClick('trainingGivenOptical')}
                      >
           <Pencil/>
          </button>
        </span>
                  </div>
              )}

              {editableField === 'recommendationNonOptical' ? (
                  <div>
                    <strong>Recommendation NonOptical:</strong>
                    <form onSubmit={(e) => handleEditSubmit(e, api, 'recommendationNonOptical', index)} className="d-inline ms-2">
                      <input id={title + index + 'recommendationNonOptical'}
                             type="text"
                             className="form-control d-inline w-auto"
                             name='recommendationNonOptical'
                             value={training.recommendationNonOptical}
                             onChange={() => handleInputChange(index, 'recommendationNonOptical', title + index + 'recommendationNonOptical')}
                      />
                      <button type="submit" className="btn btn-primary btn-sm ms-2">
                        Save
                      </button>
                    </form>
                  </div>
              ) : (
                  <div>
                    <strong>Recommendation NonOptical:</strong>
                    <span className="ms-2">
          {training.recommendationNonOptical}
                      <button
                          type="button"
                          className="btn btn-link btn-sm text-primary ms-2"
                          onClick={() => handleEditClick('recommendationNonOptical')}
                      >
           <Pencil/>
          </button>
        </span>
                  </div>
              )}
              {allfields && editableField === 'dispensedDateNonOptical' ? (
                  <div>
                    <strong>Dispensed Date NonOptical:</strong>
                    <form onSubmit={(e) => handleEditSubmit(e, api, 'dispensedDateNonOptical', index)} className="d-inline ms-2">
                      <input id={title + index + 'dispensedDateNonOptical'}
                             type="date"
                             className="form-control d-inline w-auto"
                             name='dispensedDateNonOptical'
                             value={training.dispensedDateNonOptical}
                             onChange={() => handleInputChange(index, 'dispensedDateNonOptical', title + index + 'dispensedDateNonOptical')}
                      />
                      <button type="submit" className="btn btn-primary btn-sm ms-2">
                        Save
                      </button>
                    </form>
                  </div>
              ) : allfields && (
                  <div>
                    <strong>Dispensed Date NonOptical:</strong>
                    <span className="ms-2">
          {training.dispensedDateNonOptical}
                      <button
                          type="button"
                          className="btn btn-link btn-sm text-primary ms-2"
                          onClick={() => handleEditClick('dispensedDateNonOptical')}
                      >
           <Pencil/>
          </button>
        </span>
                  </div>
              )}
              {allfields && editableField === 'costNonOptical' ? (
                  <div>
                    <strong>Cost NonOptical:</strong>
                    <form onSubmit={(e) => handleEditSubmit(e, api, 'costNonOptical', index)} className="d-inline ms-2">
                      <input id={title + index + 'costNonOptical'}
                             type="number"
                             className="form-control d-inline w-auto"
                             name='costNonOptical'
                             value={training.costNonOptical}
                             onChange={() => handleInputChange(index, 'costNonOptical', title + index + 'costNonOptical')}
                      />
                      <button type="submit" className="btn btn-primary btn-sm ms-2">
                        Save
                      </button>
                    </form>
                  </div>
              ) : allfields && (
                  <div>
                    <strong>Cost NonOptical:</strong>
                    <span className="ms-2">
          {training.costNonOptical}
                      <button
                          type="button"
                          className="btn btn-link btn-sm text-primary ms-2"
                          onClick={() => handleEditClick('costNonOptical')}
                      >
           <Pencil/>
          </button>
        </span>
                  </div>
              )}
              {allfields && editableField === 'costToBeneficiaryNonOptical' ? (
                  <div>
                    <strong>Cost To Beneficiary NonOptical:</strong>
                    <form onSubmit={(e) => handleEditSubmit(e, api, 'costToBeneficiaryNonOptical', index)} className="d-inline ms-2">
                      <input id={title + index + 'costToBeneficiaryNonOptical'}
                             type="number"
                             className="form-control d-inline w-auto"
                             name='costToBeneficiaryNonOptical'
                             value={training.costToBeneficiaryNonOptical}
                             onChange={() => handleInputChange(index, 'costToBeneficiaryNonOptical', title + index + 'costToBeneficiaryNonOptical')}
                      />
                      <button type="submit" className="btn btn-primary btn-sm ms-2">
                        Save
                      </button>
                    </form>
                  </div>
              ) : allfields && (
                  <div>
                    <strong>Cost To Beneficiary NonOptical:</strong>
                    <span className="ms-2">
          {training.costToBeneficiaryNonOptical}
                      <button
                          type="button"
                          className="btn btn-link btn-sm text-primary ms-2"
                          onClick={() => handleEditClick('costToBeneficiaryNonOptical')}
                      >
           <Pencil/>
          </button>
        </span>
                  </div>
              )}
              {allfields && editableField === 'dispensedNonOptical' ? (
                  <div>
                    <strong>Dispensed NonOptical:</strong>
                    <form onSubmit={(e) => handleEditSubmit(e, api, 'dispensedNonOptical', index)} className="d-inline ms-2">
                      <input id={title + index + 'dispensedNonOptical'}
                             type="text"
                             className="form-control d-inline w-auto"
                             name='dispensedNonOptical'
                             value={training.dispensedNonOptical}
                             onChange={() => handleInputChange(index, 'dispensedNonOptical', title + index + 'dispensedNonOptical')}
                      />
                      <button type="submit" className="btn btn-primary btn-sm ms-2">
                        Save
                      </button>
                    </form>
                  </div>
              ) : allfields && (
                  <div>
                    <strong>Dispensed NonOptical:</strong>
                    <span className="ms-2">
          {training.dispensedNonOptical}
                      <button
                          type="button"
                          className="btn btn-link btn-sm text-primary ms-2"
                          onClick={() => handleEditClick('dispensedNonOptical')}
                      >
           <Pencil/>
          </button>
        </span>
                  </div>
              )}
              {allfields && editableField === 'trainingGivenNonOptical' ? (
                  <div>
                    <strong>Training Given Non Optical:</strong>
                    <form onSubmit={(e) => handleEditSubmit(e, api, 'trainingGivenNonOptical', index)} className="d-inline ms-2">
                      <input id={title + index + 'trainingGivenNonOptical'}
                             type="text"
                             className="form-control d-inline w-auto"
                             name='trainingGivenNonOptical'
                             value={training.trainingGivenNonOptical}
                             onChange={() => handleInputChange(index, 'trainingGivenNonOptical', title + index + 'trainingGivenNonOptical')}
                      />
                      <button type="submit" className="btn btn-primary btn-sm ms-2">
                        Save
                      </button>
                    </form>
                  </div>
              ) : allfields && (
                  <div>
                    <strong>Training Given Non Optical:</strong>
                    <span className="ms-2">
          {training.trainingGivenNonOptical}
                      <button
                          type="button"
                          className="btn btn-link btn-sm text-primary ms-2"
                          onClick={() => handleEditClick('trainingGivenNonOptical')}
                      >
           <Pencil/>
          </button>
        </span>
                  </div>
              )}

              {editableField === 'recommendationElectronic' ? (
                  <div>
                    <strong>Recommendation Electronic:</strong>
                    <form onSubmit={(e) => handleEditSubmit(e, api, 'recommendationElectronic', index)} className="d-inline ms-2">
                      <input id={title + index + 'recommendationElectronic'}
                             type="text"
                             className="form-control d-inline w-auto"
                             name='recommendationElectronic'
                             value={training.recommendationElectronic}
                             onChange={() => handleInputChange(index, 'recommendationElectronic', title + index + 'recommendationElectronic')}
                      />
                      <button type="submit" className="btn btn-primary btn-sm ms-2">
                        Save
                      </button>
                    </form>
                  </div>
              ) : (
                  <div>
                    <strong>Recommendation Electronic:</strong>
                    <span className="ms-2">
          {training.recommendationElectronic}
                      <button
                          type="button"
                          className="btn btn-link btn-sm text-primary ms-2"
                          onClick={() => handleEditClick('recommendationElectronic')}
                      >
           <Pencil/>
          </button>
        </span>
                  </div>
              )}
              {allfields && editableField === 'dispensedDateElectronic' ? (
                  <div>
                    <strong>Dispensed Date Electronic:</strong>
                    <form onSubmit={(e) => handleEditSubmit(e, api, 'dispensedDateElectronic', index)} className="d-inline ms-2">
                      <input id={title + index + 'dispensedDateElectronic'}
                             type="date"
                             className="form-control d-inline w-auto"
                             name='dispensedDateElectronic'
                             value={training.dispensedDateElectronic}
                             onChange={() => handleInputChange(index, 'dispensedDateElectronic', title + index + 'dispensedDateElectronic')}
                      />
                      <button type="submit" className="btn btn-primary btn-sm ms-2">
                        Save
                      </button>
                    </form>
                  </div>
              ) : allfields && (
                  <div>
                    <strong>Dispensed Date Electronic:</strong>
                    <span className="ms-2">
          {training.dispensedDateElectronic}
                      <button
                          type="button"
                          className="btn btn-link btn-sm text-primary ms-2"
                          onClick={() => handleEditClick('dispensedDateElectronic')}
                      >
           <Pencil/>
          </button>
        </span>
                  </div>
              )}
              {allfields && editableField === 'costElectronic' ? (
                  <div>
                    <strong>Cost Electronic:</strong>
                    <form onSubmit={(e) => handleEditSubmit(e, api, 'costElectronic', index)} className="d-inline ms-2">
                      <input id={title + index + 'costElectronic'}
                             type="number"
                             className="form-control d-inline w-auto"
                             name='costElectronic'
                             value={training.costElectronic}
                             onChange={() => handleInputChange(index, 'costElectronic', title + index + 'costElectronic')}
                      />
                      <button type="submit" className="btn btn-primary btn-sm ms-2">
                        Save
                      </button>
                    </form>
                  </div>
              ) : allfields && (
                  <div>
                    <strong>Cost Electronic:</strong>
                    <span className="ms-2">
          {training.costElectronic}
                      <button
                          type="button"
                          className="btn btn-link btn-sm text-primary ms-2"
                          onClick={() => handleEditClick('costElectronic')}
                      >
           <Pencil/>
          </button>
        </span>
                  </div>
              )}
              {allfields && editableField === 'costToBeneficiaryElectronic' ? (
                  <div>
                    <strong>Cost To Beneficiary Electronic:</strong>
                    <form onSubmit={(e) => handleEditSubmit(e, api, 'costToBeneficiaryElectronic', index)} className="d-inline ms-2">
                      <input id={title + index + 'costToBeneficiaryElectronic'}
                             type="number"
                             className="form-control d-inline w-auto"
                             name='costToBeneficiaryElectronic'
                             value={training.costToBeneficiaryElectronic}
                             onChange={() => handleInputChange(index, 'costToBeneficiaryElectronic', title + index + 'costToBeneficiaryElectronic')}
                      />
                      <button type="submit" className="btn btn-primary btn-sm ms-2">
                        Save
                      </button>
                    </form>
                  </div>
              ) : allfields && (
                  <div>
                    <strong>Cost To Beneficiary Electronic:</strong>
                    <span className="ms-2">
          {training.costToBeneficiaryElectronic}
                      <button
                          type="button"
                          className="btn btn-link btn-sm text-primary ms-2"
                          onClick={() => handleEditClick('costToBeneficiaryElectronic')}
                      >
           <Pencil/>
          </button>
        </span>
                  </div>
              )}
              {allfields && editableField === 'dispensedElectronic' ? (
                  <div>
                    <strong>Dispensed Electronic:</strong>
                    <form onSubmit={(e) => handleEditSubmit(e, api, 'dispensedElectronic', index)} className="d-inline ms-2">
                      <input id={title + index + 'dispensedElectronic'}
                             type="text"
                             className="form-control d-inline w-auto"
                             name='dispensedElectronic'
                             value={training.dispensedElectronic}
                             onChange={() => handleInputChange(index, 'dispensedElectronic', title + index + 'dispensedElectronic')}
                      />
                      <button type="submit" className="btn btn-primary btn-sm ms-2">
                        Save
                      </button>
                    </form>
                  </div>
              ) : allfields && (
                  <div>
                    <strong>Dispensed Electronic:</strong>
                    <span className="ms-2">
          {training.dispensedElectronic}
                      <button
                          type="button"
                          className="btn btn-link btn-sm text-primary ms-2"
                          onClick={() => handleEditClick('dispensedElectronic')}
                      >
           <Pencil/>
          </button>
        </span>
                  </div>
              )}
              {allfields && editableField === 'trainingGivenElectronic' ? (
                  <div>
                    <strong>Training Given Electronic:</strong>
                    <form onSubmit={(e) => handleEditSubmit(e, api, 'trainingGivenElectronic', index)} className="d-inline ms-2">
                      <input id={title + index + 'trainingGivenElectronic'}
                             type="text"
                             className="form-control d-inline w-auto"
                             name='trainingGivenElectronic'
                             value={training.trainingGivenElectronic}
                             onChange={() => handleInputChange(index, 'trainingGivenElectronic', title + index + 'trainingGivenElectronic')}
                      />
                      <button type="submit" className="btn btn-primary btn-sm ms-2">
                        Save
                      </button>
                    </form>
                  </div>
              ) : allfields && (
                  <div>
                    <strong>Training Given Electronic:</strong>
                    <span className="ms-2">
          {training.trainingGivenElectronic}
                      <button
                          type="button"
                          className="btn btn-link btn-sm text-primary ms-2"
                          onClick={() => handleEditClick('trainingGivenElectronic')}
                      >
           <Pencil/>
          </button>
        </span>
                  </div>
              )}

              {allfields && editableField === 'colourVisionRE' ? (
                  <div>
                    <strong>Colour Vision Right Eye:</strong>
                    <form onSubmit={(e) => handleEditSubmit(e, api, 'colourVisionRE', index)} className="d-inline ms-2">
                      <input id={title + index + 'colourVisionRE'}
                             type="text"
                             className="form-control d-inline w-auto"
                             name='colourVisionRE'
                             value={training.colourVisionRE}
                             onChange={() => handleInputChange(index, 'colourVisionRE', title + index + 'colourVisionRE')}
                      />
                      <button type="submit" className="btn btn-primary btn-sm ms-2">
                        Save
                      </button>
                    </form>
                  </div>
              ) : allfields && (
                  <div>
                    <strong>Colour Vision Right Eye:</strong>
                    <span className="ms-2">
          {training.colourVisionRE}
                      <button
                          type="button"
                          className="btn btn-link btn-sm text-primary ms-2"
                          onClick={() => handleEditClick('colourVisionRE')}
                      >
           <Pencil/>
          </button>
        </span>
                  </div>
              )}

              {allfields && editableField === 'colourVisionLE' ? (
                  <div>
                    <strong>Colour Vision Left Eye:</strong>
                    <form onSubmit={(e) => handleEditSubmit(e, api, 'colourVisionLE', index)} className="d-inline ms-2">
                      <input id={title + index + 'colourVisionLE'}
                             type="text"
                             className="form-control d-inline w-auto"
                             name='colourVisionLE'
                             value={training.colourVisionLE}
                             onChange={() => handleInputChange(index, 'colourVisionLE', title + index + 'colourVisionLE')}
                      />
                      <button type="submit" className="btn btn-primary btn-sm ms-2">
                        Save
                      </button>
                    </form>
                  </div>
              ) : allfields && (
                  <div>
                    <strong>Colour Vision Left Eye:</strong>
                    <span className="ms-2">
          {training.colourVisionLE}
                      <button
                          type="button"
                          className="btn btn-link btn-sm text-primary ms-2"
                          onClick={() => handleEditClick('colourVisionLE')}
                      >
           <Pencil/>
          </button>
        </span>
                  </div>
              )}

              {allfields && editableField === 'contrastSensitivityRE' ? (
                  <div>
                    <strong>Contrast Sensitivity Right Eye :</strong>
                    <form onSubmit={(e) => handleEditSubmit(e, api, 'contrastSensitivityRE', index)} className="d-inline ms-2">
                      <input id={title + index + 'contrastSensitivityRE'}
                             type="text"
                             className="form-control d-inline w-auto"
                             name='contrastSensitivityRE'
                             value={training.contrastSensitivityRE}
                             onChange={() => handleInputChange(index, 'contrastSensitivityRE', title + index + 'contrastSensitivityRE')}
                      />
                      <button type="submit" className="btn btn-primary btn-sm ms-2">
                        Save
                      </button>
                    </form>
                  </div>
              ) : allfields && (
                  <div>
                    <strong>Contrast Sensitivity Right Eye:</strong>
                    <span className="ms-2">
          {training.contrastSensitivityRE}
                      <button
                          type="button"
                          className="btn btn-link btn-sm text-primary ms-2"
                          onClick={() => handleEditClick('contrastSensitivityRE')}
                      >
           <Pencil/>
          </button>
        </span>
                  </div>
              )}

              {allfields && editableField === 'contrastSensitivityLE' ? (
                  <div>
                    <strong>Contrast Sensitivity Left Eye :</strong>
                    <form onSubmit={(e) => handleEditSubmit(e, api, 'contrastSensitivityLE', index)} className="d-inline ms-2">
                      <input id={title + index + 'contrastSensitivityLE'}
                             type="text"
                             className="form-control d-inline w-auto"
                             name='contrastSensitivityLE'
                             value={training.contrastSensitivityLE}
                             onChange={() => handleInputChange(index, 'contrastSensitivityLE', title + index + 'contrastSensitivityLE')}
                      />
                      <button type="submit" className="btn btn-primary btn-sm ms-2">
                        Save
                      </button>
                    </form>
                  </div>
              ) : allfields && (
                  <div>
                    <strong>Contrast Sensitivity Left Eye:</strong>
                    <span className="ms-2">
          {training.contrastSensitivityLE}
                      <button
                          type="button"
                          className="btn btn-link btn-sm text-primary ms-2"
                          onClick={() => handleEditClick('contrastSensitivityLE')}
                      >
           <Pencil/>
          </button>
        </span>
                  </div>
              )}

              {allfields && editableField === 'visualFieldsRE' ? (
                  <div>
                    <strong>Visual Fields Right Eye :</strong>
                    <form onSubmit={(e) => handleEditSubmit(e, api, 'visualFieldsRE', index)} className="d-inline ms-2">
                      <input id={title + index + 'visualFieldsRE'}
                             type="text"
                             className="form-control d-inline w-auto"
                             name='visualFieldsRE'
                             value={training.visualFieldsRE}
                             onChange={() => handleInputChange(index, 'visualFieldsRE', title + index + 'visualFieldsRE')}
                      />
                      <button type="submit" className="btn btn-primary btn-sm ms-2">
                        Save
                      </button>
                    </form>
                  </div>
              ) : allfields &&(
                  <div>
                    <strong>Visual Fields Right Eye:</strong>
                    <span className="ms-2">
          {training.visualFieldsRE}
                      <button
                          type="button"
                          className="btn btn-link btn-sm text-primary ms-2"
                          onClick={() => handleEditClick('visualFieldsRE')}
                      >
           <Pencil/>
          </button>
        </span>
                  </div>
              )}

              {allfields && editableField === 'visualFieldsLE' ? (
                  <div>
                    <strong>Visual Fields Left Eye :</strong>
                    <form onSubmit={(e) => handleEditSubmit(e, api, 'visualFieldsLE', index)} className="d-inline ms-2">
                      <input id={title + index + 'visualFieldsLE'}
                             type="text"
                             className="form-control d-inline w-auto"
                             name='visualFieldsLE'
                             value={training.visualFieldsLE}
                             onChange={() => handleInputChange(index, 'visualFieldsLE', title + index + 'visualFieldsLE')}
                      />
                      <button type="submit" className="btn btn-primary btn-sm ms-2">
                        Save
                      </button>
                    </form>
                  </div>
              ) : allfields && (
                  <div>
                    <strong>Visual Fields Left Eye:</strong>
                    <span className="ms-2">
          {training.visualFieldsLE}
                      <button
                          type="button"
                          className="btn btn-link btn-sm text-primary ms-2"
                          onClick={() => handleEditClick('visualFieldsLE')}
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
              <Form.Group controlId="diagnosis">
                <Form.Label>Diagnosis</Form.Label>
                <Form.Check
                    type='checkbox'
                    label='Anterior segment condition'
                    value='Anterior segment condition'
                />
                <Form.Check
                    type='checkbox'
                    label='Posterior eye disease'
                    value='Posterior eye disease'
                />
                <Form.Check
                    type='checkbox'
                    label='Hereditary eye disease'
                    value='Hereditary eye disease'
                />
                <Form.Check
                    type='checkbox'
                    label='Neuro-ophthalmic condition'
                    value='Neuro-ophthalmic condition'
                />
                <Form.Check
                    onChange={(event) => diagnosisOnChange(event)}
                    type='checkbox'
                    label='Other'
                    value='Other'
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
                <Form.Control as="select">
                <option defaultValue></option>
                <option>6m</option>
                <option>20ft</option>
                <option>LogMAR</option>
                </Form.Control>
            </Form.Group>

          <Row>
          {customFieldsDistance.map((field) => (
            <Col key={field}>
            <Form.Group controlId={field} key={field}>
              <Form.Label>{field}</Form.Label>
              <Form.Control type="text" />
            </Form.Group>
            </Col>
          ))}
          </Row>

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
          <Row>
            {customFieldsNear.map((field) => (
                <Col key={field}>
            <Form.Group controlId={field} key={field}>
              <Form.Label>{field}</Form.Label>
              <Form.Control type="text" />
            </Form.Group>
                </Col>
          ))}
          </Row>

          <Form.Group controlId="recommendationSpectacle">
            <Form.Label>Recommendation Spectacle</Form.Label>
            <Form.Control as="textarea" rows={1} />
          </Form.Group>
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
                    <Form.Group controlId="dispensedSpectacle" key="dispensedSpectacle">
                      <Form.Label>Dispensed Spectacle</Form.Label>
                      <Form.Control as="select">
                        <option defaultValue></option>
                        <option>Yes</option>
                        <option>No</option>
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
              </div>
          )}
          
          <Form.Group controlId="recommendationOptical">
            <Form.Label>Recommendation Optical</Form.Label>
            <Form.Control as="textarea" rows={1} />
          </Form.Group>
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
                    <Form.Group controlId="dispensedOptical" key="dispensedOptical">
                      <Form.Label>Dispensed Optical</Form.Label>
                      <Form.Control as="select">
                        <option defaultValue></option>
                        <option>Yes</option>
                        <option>No</option>
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
              </div>
          )}

          <Form.Group controlId="recommendationNonOptical">
            <Form.Label>Recommendation NonOptical</Form.Label>
            <Form.Control as="textarea" rows={1} />
          </Form.Group>
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
                    <Form.Group controlId="dispensedNonOptical" key="dispensedNonOptical">
                      <Form.Label>Dispensed NonOptical</Form.Label>
                      <Form.Control as="select">
                        <option defaultValue></option>
                        <option>Yes</option>
                        <option>No</option>
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
              </div>
          )}

          <Form.Group controlId="recommendationElectronic">
            <Form.Label>Recommendation Electronic</Form.Label>
            <Form.Control as="textarea" rows={1} />
          </Form.Group>
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
                    <Form.Group controlId="dispensedElectronic" key="dispensedElectronic">
                      <Form.Label>Dispensed Electronic</Form.Label>
                      <Form.Control as="select">
                        <option defaultValue></option>
                        <option>Yes</option>
                        <option>No</option>
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
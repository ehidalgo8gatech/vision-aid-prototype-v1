// This function gets called at build time
import {readUser} from './api/user'
import {getSession} from "next-auth/react";
import {readBeneficiaryMirror} from "@/pages/api/beneficiaryMirror";
import {v4 as uuidv4} from 'uuid';
import Router from "next/router";
import Navigation from './navigation/Navigation';
import {findAllHospital} from "@/pages/api/hospital";
import TrainingForm from "@/pages/components/TrainingForm";
import {readMobileTrainingMirror} from "@/pages/api/mobileTrainingMirror";
import {readComputerTrainingMirror} from "@/pages/api/computerTrainingMirror";
import {readOrientationMobilityTrainingMirror} from "@/pages/api/orientationMobilityTrainingMirror";
import {readVisionEnhancementMirror} from "@/pages/api/visionEnhancementMirror";
import {readComprehensiveLowVisionEvaluationMirror} from "@/pages/api/comprehensiveLowVisionEvaluationMirror";
import {readCounsellingEducationMirror} from "@/pages/api/counsellingEducationMirror";
import {ChevronDown, ChevronRight} from "react-bootstrap-icons";
import {useState} from "react";

// http://localhost:3000/requiredfields
export async function getServerSideProps(ctx) {
    const session = await getSession(ctx)
    if (session == null) {
        console.log("session is null")
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }
    const user = await readUser(session.user.email)
    if (user.admin == null) {
        console.log("user admin is null")
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }
    return {
        props: {
            user: user,
            requiredBeneficiaryFields: await readBeneficiaryMirror(),
            requiredMobileTraining: await  readMobileTrainingMirror(),
            requiredComputerTraining: await  readComputerTrainingMirror(),
            requiredOrientationMobilityTraining: await  readOrientationMobilityTrainingMirror(),
            requiredVisionEnhancement: await readVisionEnhancementMirror(),
            requiredComprehensiveLowVisionEvaluation: await readComprehensiveLowVisionEvaluationMirror(),
            requiredCounsellingEducation: await readCounsellingEducationMirror(),
            hospitals: await findAllHospital(),
            error: null
        },
    }
}

function RequiredFields(props) {

    function removeExtraField(fieldId) {
        return function () {
            console.log(fieldId)
            document.getElementById(fieldId).remove()
        }
    }

    async function addFieldsSubmit(e) {
        e.preventDefault()
        let hospitalNameOverride = document.getElementById("hospitalSelect").value
        if (hospitalNameOverride == "") {
            hospitalNameOverride = null
        }
        let phoneNumberRequired = document.getElementById("phoneNumberRequired").checked
        let educationRequired = document.getElementById("educationRequired").checked
        let occupationRequired = document.getElementById("occupationRequired").checked
        let districtsRequired = document.getElementById("districtsRequired").checked
        let stateRequired = document.getElementById("stateRequired").checked
        //let diagnosisRequired = document.getElementById("diagnosisRequired").checked
        //let visionRequired = document.getElementById("visionRequired").checked
        //let mDVIRequired = document.getElementById("mDVIRequired").checked
        //console.log("phoneNumberRequired" + phoneNumberRequired, "educationRequired" + educationRequired, "occupationRequired" + occupationRequired, "districtsRequired" + districtsRequired, "stateRequired" + stateRequired, "diagnosisRequired" + diagnosisRequired, "visionRequired" + visionRequired, "mDVIRequired" + mDVIRequired)
        let elements = document.getElementsByName("extraField");
        let extraInformation = []
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].value == null || elements[i].value == "") continue
            let body = {
                name: elements[i].value,
                type: "txt",
                required: true
            }
            extraInformation.push(body)
        }
        let extraInformationRequired = JSON.stringify(extraInformation)
        console.log(extraInformationRequired)
        console.log("extra fields required" + extraInformationRequired)
        let response = await fetch('/api/beneficiaryMirror', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                hospitalNameOverride: hospitalNameOverride,
                phoneNumberRequired: phoneNumberRequired,
                educationRequired: educationRequired,
                occupationRequired: occupationRequired,
                districtsRequired: districtsRequired,
                stateRequired: stateRequired,
                //diagnosisRequired: diagnosisRequired,
                //visionRequired: visionRequired,
                //mDVIRequired: mDVIRequired,
                extraInformationRequired: extraInformationRequired
            })
        })
        let json = await response.json()
        alert("beneficiary required " + JSON.stringify(json))
        Router.reload()
    }

    function addField(elementId, name) {
        let container = document.getElementById(elementId)
        let input = document.createElement("input")
        let fieldId = uuidv4()

        let inputDiv = document.createElement("div")
        inputDiv.className = "form-group"
        container.appendChild(inputDiv)
        input.type = "text"
        input.name = name
        input.className = "extraField"
        input.id = fieldId
        container.appendChild(input)
        container.appendChild(document.createElement("br"))
        // let button = document.createElement("button")
        // let buttonId = uuidv4()

        //button.onclick = removeExtraField(fieldId)
        //button.id = buttonId
        //button.type = "button"
        //button.className = "btn btn-primary"
        //button.textContent = "remove field"
        //container.appendChild(button)
        //container.appendChild(document.createElement("br"))
    }

    let extraInformation = JSON.parse(props.requiredBeneficiaryFields.extraInformationRequired)
    const exInfo = []
    extraInformation.forEach((data) => {
        exInfo.push(
            <div class="col-md-12" id={data.name}>
                <div class="row">
                    <div class="col-md-6">
                        <input type="text" name="extraField" class="form-control"
                               defaultValue={data.name}/>
                    </div>
                    <div class="col-md-6">
                        <button type="button" onClick={removeExtraField(data.name)}
                                class="btn btn-danger border-0 btn-block">Remove Field
                        </button>
                    </div>
                </div>
                <br/>
            </div>
        )
    })
    const hospitalInfo = []
    props.hospitals.forEach((data) => {
        hospitalInfo.push(<div>
            <p>{data.name}</p>
            <br/>
        </div>)
    })

    async function addFieldsTrainingSubmit(e, type, api) {
        e.preventDefault()
        let hospitalNameOverride = document.getElementById("hospitalNameOverride" + type).value
        if (hospitalNameOverride == "") {
            hospitalNameOverride = null
        }
        let elements = document.getElementsByName("extraFields" + type);
        let extraInformation = []
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].value == null || elements[i].value == "") continue
            let body = {
                name: elements[i].value,
                type: "txt",
                required: true
            }
            extraInformation.push(body)
        }
        let extraInformationRequired = JSON.stringify(extraInformation)
        console.log(extraInformationRequired)
        console.log("extra fields required" + extraInformationRequired)
        let response = await fetch('/api/' + api, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                hospitalNameOverride: hospitalNameOverride,
                extraInformationRequired: extraInformationRequired
            })
        })
        let json = await response.json()
        alert("training " + type + " required " + JSON.stringify(json))
        Router.reload()
    }

    let exInfoMobileTrainingPOJO = JSON.parse(props.requiredMobileTraining.extraInformationRequired)
    const exInfoMobileTraining = []
    exInfoMobileTrainingPOJO.forEach((data) => {
        exInfoMobileTraining.push(
            <div class="col-md-12" id={data.name + "mobileTraining"}>
                <div class="row">
                    <div class="col-md-6">
                        <input type="text" name="extraFieldsMobileTraining" class="form-control"
                               defaultValue={data.name}/>
                    </div>
                    <div class="col-md-6">
                        <button type="button" onClick={removeExtraField(data.name + "mobileTraining")}
                                class="btn btn-danger border-0 btn-block">Remove Field
                        </button>
                    </div>
                </div>
                <br/>
            </div>
        )
    })

    let exInfoComputerTrainingPOJO = JSON.parse(props.requiredComputerTraining.extraInformationRequired)
    const exInfoComputerTraining = []
    exInfoComputerTrainingPOJO.forEach((data) => {
        exInfoComputerTraining.push(
            <div class="col-md-12" id={data.name + "computerTraining"}>
                <div class="row">
                    <div class="col-md-6">
                        <input type="text" name="extraFieldsComputerTraining" class="form-control"
                               defaultValue={data.name}/>
                    </div>
                    <div class="col-md-6">
                        <button type="button" onClick={removeExtraField(data.name + "computerTraining")}
                                class="btn btn-danger border-0 btn-block">Remove Field
                        </button>
                    </div>
                </div>
                <br/>
            </div>
        )
    })

    let exInfoOrientationMobilityTrainingPOJO = JSON.parse(props.requiredOrientationMobilityTraining.extraInformationRequired)
    const exInfoOrientationMobilityTraining = []
    exInfoOrientationMobilityTrainingPOJO.forEach((data) => {
        exInfoOrientationMobilityTraining.push(
            <div class="col-md-12" id={data.name + "orientationMobilityTraining"}>
                <div class="row">
                    <div class="col-md-6">
                        <input type="text" name="extraFieldsOrientationMobilityTraining" class="form-control"
                               defaultValue={data.name}/>
                    </div>
                    <div class="col-md-6">
                        <button type="button" onClick={removeExtraField(data.name + "orientationMobilityTraining")}
                                class="btn btn-danger border-0 btn-block">Remove Field
                        </button>
                    </div>
                </div>
                <br/>
            </div>
        )
    })

    let exInfoComprehensiveLowVisionEvaluationPOJO = JSON.parse(props.requiredComprehensiveLowVisionEvaluation.extraInformationRequired)
    const exInfoComprehensiveLowVisionEvaluation = []
    exInfoComprehensiveLowVisionEvaluationPOJO.forEach((data) => {
        exInfoComprehensiveLowVisionEvaluation.push(
            <div class="col-md-12" id={data.name + "comprehensiveLowVisionEvaluation"}>
                <div class="row">
                    <div class="col-md-6">
                        <input type="text" name="extraFieldsComprehensiveLowVisionEvaluation" class="form-control"
                               defaultValue={data.name}/>
                    </div>
                    <div class="col-md-6">
                        <button type="button" onClick={removeExtraField(data.name + "comprehensiveLowVisionEvaluation")}
                                class="btn btn-danger border-0 btn-block">Remove Field
                        </button>
                    </div>
                </div>
                <br/>
            </div>
        )
    })

    let exInfoVisionEnhancementPOJO = JSON.parse(props.requiredVisionEnhancement.extraInformationRequired)
    const exInfoVisionEnhancement = []
    exInfoVisionEnhancementPOJO.forEach((data) => {
        exInfoVisionEnhancement.push(
            <div class="col-md-12" id={data.name + "visionEnhancement"}>
                <div class="row">
                    <div class="col-md-6">
                        <input type="text" name="extraFieldsVisionEnhancement" class="form-control"
                               defaultValue={data.name}/>
                    </div>
                    <div class="col-md-6">
                        <button type="button" onClick={removeExtraField(data.name + "visionEnhancement")}
                                class="btn btn-danger border-0 btn-block">Remove Field
                        </button>
                    </div>
                </div>
                <br/>
            </div>
        )
    })

    let exInfoCounsellingEducationPOJO = JSON.parse(props.requiredCounsellingEducation.extraInformationRequired)
    const exInfoCounsellingEducation = []
    exInfoCounsellingEducationPOJO.forEach((data) => {
        exInfoCounsellingEducation.push(
            <div class="col-md-12" id={data.name + "counsellingEducation"}>
                <div class="row">
                    <div class="col-md-6">
                        <input type="text" name="extraFieldsCounsellingEducation" class="form-control"
                               defaultValue={data.name}/>
                    </div>
                    <div class="col-md-6">
                        <button type="button" onClick={removeExtraField(data.name + "counsellingEducation")}
                                class="btn btn-danger border-0 btn-block">Remove Field
                        </button>
                    </div>
                </div>
                <br/>
            </div>
        )
    })

    var showForm = {
        "ComprehensiveLowVisionEvaluation": false,
        "visionEnhancement": false,
        "counsellingEducation": false,
        "mobile": false,
        "computer": false,
        "orientationMobility": false,
    }
    function handleToggle(type) {
        var displayTrainingElement = document.getElementById(type + "TrainingRequiredFields");
        if (displayTrainingElement.style.display === "block") {
            displayTrainingElement.style.display = "none";
        } else {
            displayTrainingElement.style.display = "block";
        }
        showForm[type] = !showForm[type]
    }

    const hospitalOptions = [];
    for (let i = 0; i < props.hospitals.length; i++) {
        const hospital = props.hospitals[i];
        hospitalOptions.push(
            <option key={hospital.name} value={hospital.name}>
                {hospital.name} (ID {hospital.id})
            </option>
        );
    }

    return (
        <div>
            <Navigation/>
            <div className="row">
                <div className="col-md-6">
                    <form action="#" method="POST" onSubmit={(e) => addFieldsSubmit(e)}>
                        <h1 className="text-center mt-4 mb-4">Required Beneficiary Fields</h1>

                        <p>MRN, Beneficiary Name, And Hospital Name Will Always Be Required</p>

                        <div class="row justify-content-center">
                        <div className="col-md-6 mx-auto">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <label htmlFor="hospitalSelect" style={{ marginRight: '10px' }}>Select a hospital</label>
                                <select id="hospitalSelect"
                                        style={{
                                            border: "1px solid #ccc",
                                            borderRadius: "0.25rem",
                                            color: "#495057",
                                            backgroundColor: "#fff",
                                            boxShadow: "inset 0 1px 1px rgba(0, 0, 0, 0.075)",
                                            transition: "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out"
                                        }}
                                >
                                    <option value="">All</option>
                                    {hospitalOptions}
                                </select>
                            </div>
                        </div>
                        </div>
                        <br/>
                        <strong>Required Fields</strong>
                        <br/>
                        <br/>
                        <div className="form-group">
                            <input type="checkbox" className="form-check-input" id="phoneNumberRequired"
                                   defaultChecked={props.requiredBeneficiaryFields.phoneNumberRequired}/>
                            <label className="form-check-label" htmlFor="phoneNumberRequired"
                                   style={{marginLeft: '10px'}}>Phone Number</label>
                        </div>
                        <br/>
                        <div className="form-group">
                            <input type="checkbox" className="form-check-input" id="educationRequired"
                                   defaultChecked={props.requiredBeneficiaryFields.educationRequired}/>
                            <label className="form-check-label" htmlFor="educationRequired"
                                   style={{marginLeft: '10px'}}>Education</label>
                        </div>
                        <br/>
                        <div className="form-group">
                            <input type="checkbox" className="form-check-input" id="occupationRequired"
                                   defaultChecked={props.requiredBeneficiaryFields.occupationRequired}/>
                            <label className="form-check-label" htmlFor="occupationRequired"
                                   style={{marginLeft: '10px'}}>Occupation</label>
                        </div>
                        <br/>
                        <div className="form-group">
                            <input type="checkbox" className="form-check-input" id="districtsRequired"
                                   defaultChecked={props.requiredBeneficiaryFields.districtsRequired}/>
                            <label className="form-check-label" htmlFor="districtsRequired"
                                   style={{marginLeft: '10px'}}>Districts</label>
                        </div>
                        <br/>
                        <div className="form-group">
                            <input type="checkbox" className="form-check-input" id="stateRequired"
                                   defaultChecked={props.requiredBeneficiaryFields.stateRequired}/>
                            <label className="form-check-label" htmlFor="stateRequired"
                                   style={{marginLeft: '10px'}}>State</label>
                            <br/>
                            <br/>
                            <div className="col-md-8 mx-auto">
                                <div id="extraFields">
                                    <strong>Extra Fields</strong>
                                    <br/>
                                    <br/>
                                    {exInfo}
                                </div>
                                <button type="button" onClick={() => addField("extraFields", "extraField")}
                                        className="btn btn-success border-0 btn-block">Add Required Field
                                </button>
                                <br/>
                            </div>
                        </div>
                        <br/>
                        <br/>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>

                <div className="col-md-6">
                    <h1 className="text-center mt-4 mb-4">Other Form Required Fields</h1>
                    <br/>
                    <div className="d-flex justify-content-center align-items-center">
                    {showForm["comprehensiveLowVisionEvaluation"] ? (
                        <ChevronDown
                            className="ml-2"
                            onClick={() => handleToggle("comprehensiveLowVisionEvaluation")}
                            style={{ cursor: 'pointer' }}
                        />
                    ) : (
                        <ChevronRight
                            className="ml-2"
                            onClick={() => handleToggle("comprehensiveLowVisionEvaluation")}
                            style={{ cursor: 'pointer' }}
                        />
                    )}
                    <h2 className="text-center">Comprehensive Low Vision Evaluation</h2>
                    </div>
                    <div className='container' id="comprehensiveLowVisionEvaluationTrainingRequiredFields">
                        <form action="#" method="POST" onSubmit={(e) => addFieldsTrainingSubmit(e, "ComprehensiveLowVisionEvaluation", "comprehensiveLowVisionEvaluationMirror")}>
                            <div className='container'>
                                <div class="row justify-content-center">
                                    <div className="col-md-6 mx-auto">
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <label htmlFor="hospitalNameOverrideComprehensiveLowVisionEvaluation" style={{ marginRight: '10px' }}>Select a hospital</label>
                                            <select id="hospitalNameOverrideComprehensiveLowVisionEvaluation"
                                                    style={{
                                                        border: "1px solid #ccc",
                                                        borderRadius: "0.25rem",
                                                        color: "#495057",
                                                        backgroundColor: "#fff",
                                                        boxShadow: "inset 0 1px 1px rgba(0, 0, 0, 0.075)",
                                                        transition: "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out"
                                                    }}
                                            >
                                                <option value="">All</option>
                                                {hospitalOptions}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="extraFieldsComprehensiveLowVisionEvaluation">
                                <strong>Extra Fields</strong>
                                <br/>
                                <br/>
                                {exInfoComprehensiveLowVisionEvaluation}
                            </div>
                            <button type="button" onClick={() => addField("extraFieldsComprehensiveLowVisionEvaluation", "extraFieldsComprehensiveLowVisionEvaluation")}
                                    className="btn btn-success border-0 btn-block">Add Required Field
                            </button>
                            <br/>
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </form>
                    </div>
                    <br/>

                    <div className="d-flex justify-content-center align-items-center">
                        {showForm["visionEnhancement"] ? (
                            <ChevronDown
                                className="ml-2"
                                onClick={() => handleToggle("visionEnhancement")}
                                style={{ cursor: 'pointer' }}
                            />
                        ) : (
                            <ChevronRight
                                className="ml-2"
                                onClick={() => handleToggle("visionEnhancement")}
                                style={{ cursor: 'pointer' }}
                            />
                        )}
                        <h2 className="text-center">Vision Enhancement</h2>
                    </div>
                    <div className='container' id="visionEnhancementTrainingRequiredFields">
                        <form action="#" method="POST" onSubmit={(e) => addFieldsTrainingSubmit(e, "VisionEnhancement", "visionEnhancementMirror")}>
                            <div className='container'>
                                <div class="row justify-content-center">
                                    <div className="col-md-6 mx-auto">
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <label htmlFor="hospitalNameOverrideVisionEnhancement" style={{ marginRight: '10px' }}>Select a hospital</label>
                                            <select id="hospitalNameOverrideVisionEnhancement"
                                                    style={{
                                                        border: "1px solid #ccc",
                                                        borderRadius: "0.25rem",
                                                        color: "#495057",
                                                        backgroundColor: "#fff",
                                                        boxShadow: "inset 0 1px 1px rgba(0, 0, 0, 0.075)",
                                                        transition: "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out"
                                                    }}
                                            >
                                                <option value="">All</option>
                                                {hospitalOptions}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="extraFieldsVisionEnhancement">
                                <strong>Extra Fields</strong>
                                <br/>
                                <br/>
                                {exInfoVisionEnhancement}
                            </div>
                            <button type="button" onClick={() => addField("extraFieldsVisionEnhancement", "extraFieldsVisionEnhancement")}
                                    className="btn btn-success border-0 btn-block">Add Required Field
                            </button>
                            <br/>
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </form>
                    </div>
                    <br/>

                    <div className="d-flex justify-content-center align-items-center">
                        {showForm["counsellingEducation"] ? (
                            <ChevronDown
                                className="ml-2"
                                onClick={() => handleToggle("counsellingEducation")}
                                style={{ cursor: 'pointer' }}
                            />
                        ) : (
                            <ChevronRight
                                className="ml-2"
                                onClick={() => handleToggle("counsellingEducation")}
                                style={{ cursor: 'pointer' }}
                            />
                        )}
                        <h2 className="text-center">Counselling Education</h2>
                    </div>
                    <div className='container' id="counsellingEducationTrainingRequiredFields">
                        <form action="#" method="POST" onSubmit={(e) => addFieldsTrainingSubmit(e, "CounsellingEducation", "counsellingEducationMirror")}>
                            <div className='container'>
                                <div class="row justify-content-center">
                                    <div className="col-md-6 mx-auto">
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <label htmlFor="hospitalNameOverrideCounsellingEducation" style={{ marginRight: '10px' }}>Select a hospital</label>
                                            <select id="hospitalNameOverrideCounsellingEducation"
                                                    style={{
                                                        border: "1px solid #ccc",
                                                        borderRadius: "0.25rem",
                                                        color: "#495057",
                                                        backgroundColor: "#fff",
                                                        boxShadow: "inset 0 1px 1px rgba(0, 0, 0, 0.075)",
                                                        transition: "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out"
                                                    }}
                                            >
                                                <option value="">All</option>
                                                {hospitalOptions}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="extraFieldsCounsellingEducation">
                                <strong>Extra Fields</strong>
                                <br/>
                                <br/>
                                {exInfoCounsellingEducation}
                            </div>
                            <button type="button" onClick={() => addField("extraFieldsCounsellingEducation", "extraFieldsCounsellingEducation")}
                                    className="btn btn-success border-0 btn-block">Add Required Field
                            </button>
                            <br/>
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </form>
                    </div>
                    <br/>

                    <div className="d-flex justify-content-center align-items-center">
                        {showForm["mobile"] ? (
                            <ChevronDown
                                className="ml-2"
                                onClick={() => handleToggle("mobile")}
                                style={{ cursor: 'pointer' }}
                            />
                        ) : (
                            <ChevronRight
                                className="ml-2"
                                onClick={() => handleToggle("mobile")}
                                style={{ cursor: 'pointer' }}
                            />
                        )}
                        <h2 className="text-center">Mobile Training</h2>
                    </div>
                    <div className='container' id="mobileTrainingRequiredFields">
                        <form action="#" method="POST" onSubmit={(e) => addFieldsTrainingSubmit(e, "MobileTraining", "mobileTrainingMirror")}>
                            <div className='container'>
                                <div class="row justify-content-center">
                                    <div className="col-md-6 mx-auto">
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <label htmlFor="hospitalNameOverrideMobileTraining" style={{ marginRight: '10px' }}>Select a hospital</label>
                                            <select id="hospitalNameOverrideMobileTraining"
                                                    style={{
                                                        border: "1px solid #ccc",
                                                        borderRadius: "0.25rem",
                                                        color: "#495057",
                                                        backgroundColor: "#fff",
                                                        boxShadow: "inset 0 1px 1px rgba(0, 0, 0, 0.075)",
                                                        transition: "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out"
                                                    }}
                                            >
                                                <option value="">All</option>
                                                {hospitalOptions}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="extraFieldsMobileTraining">
                                <strong>Extra Fields</strong>
                                <br/>
                                <br/>
                                {exInfoMobileTraining}
                            </div>
                            <button type="button" onClick={() => addField("extraFieldsMobileTraining", "extraFieldsMobileTraining")}
                                    className="btn btn-success border-0 btn-block">Add Required Field
                            </button>
                            <br/>
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </form>
                    </div>
                    <br/>

                    <div className="d-flex justify-content-center align-items-center">
                        {showForm["computer"] ? (
                            <ChevronDown
                                className="ml-2"
                                onClick={() => handleToggle("computer")}
                                style={{ cursor: 'pointer' }}
                            />
                        ) : (
                            <ChevronRight
                                className="ml-2"
                                onClick={() => handleToggle("computer")}
                                style={{ cursor: 'pointer' }}
                            />
                        )}
                        <h2 className="text-center">Computer Training</h2>
                    </div>
                    <div className='container' id="computerTrainingRequiredFields">
                        <form action="#" method="POST" onSubmit={(e) => addFieldsTrainingSubmit(e, "ComputerTraining", "computerTrainingMirror")}>
                            <div className='container'>
                                <div class="row justify-content-center">
                                    <div className="col-md-6 mx-auto">
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <label htmlFor="hospitalNameOverrideComputerTraining" style={{ marginRight: '10px' }}>Select a hospital</label>
                                            <select id="hospitalNameOverrideComputerTraining"
                                                    style={{
                                                        border: "1px solid #ccc",
                                                        borderRadius: "0.25rem",
                                                        color: "#495057",
                                                        backgroundColor: "#fff",
                                                        boxShadow: "inset 0 1px 1px rgba(0, 0, 0, 0.075)",
                                                        transition: "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out"
                                                    }}
                                            >
                                                <option value="">All</option>
                                                {hospitalOptions}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="extraFieldsComputerTraining">
                                <strong>Extra Fields</strong>
                                <br/>
                                <br/>
                                {exInfoComputerTraining}
                            </div>
                            <button type="button" onClick={() => addField("extraFieldsComputerTraining", "extraFieldsComputerTraining")}
                                    className="btn btn-success border-0 btn-block">Add Required Field
                            </button>
                            <br/>
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </form>
                    </div>
                    <br/>

                    <div className="d-flex justify-content-center align-items-center">
                        {showForm["orientationMobility"] ? (
                            <ChevronDown
                                className="ml-2"
                                onClick={() => handleToggle("orientationMobility")}
                                style={{ cursor: 'pointer' }}
                            />
                        ) : (
                            <ChevronRight
                                className="ml-2"
                                onClick={() => handleToggle("orientationMobility")}
                                style={{ cursor: 'pointer' }}
                            />
                        )}
                        <h2 className="text-center">Orientation Mobility Training</h2>
                    </div>
                    <div className='container' id="orientationMobilityTrainingRequiredFields">
                        <form action="#" method="POST" onSubmit={(e) => addFieldsTrainingSubmit(e, "OrientationMobilityTraining", "orientationMobilityTrainingMirror")}>
                            <div className='container'>
                                <div class="row justify-content-center">
                                    <div className="col-md-6 mx-auto">
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <label htmlFor="hospitalNameOverrideOrientationMobilityTraining" style={{ marginRight: '10px' }}>Select a hospital</label>
                                            <select id="hospitalNameOverrideOrientationMobilityTraining"
                                                    style={{
                                                        border: "1px solid #ccc",
                                                        borderRadius: "0.25rem",
                                                        color: "#495057",
                                                        backgroundColor: "#fff",
                                                        boxShadow: "inset 0 1px 1px rgba(0, 0, 0, 0.075)",
                                                        transition: "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out"
                                                    }}
                                            >
                                                <option value="">All</option>
                                                {hospitalOptions}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="extraFieldsOrientationMobilityTraining">
                                <strong>Extra Fields</strong>
                                <br/>
                                <br/>
                                {exInfoOrientationMobilityTraining}
                            </div>
                            <button type="button" onClick={() => addField("extraFieldsOrientationMobilityTraining", "extraFieldsOrientationMobilityTraining", "orientationMobilityTrainingMirror")}
                                    className="btn btn-success border-0 btn-block">Add Required Field
                            </button>
                            <br/>
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RequiredFields
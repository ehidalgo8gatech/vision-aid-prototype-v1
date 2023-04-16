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
        let hospitalNameOverride = document.getElementById("hospitalNameOverride").value
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
    function toggleTraining(type) {
        var displayTrainingElement = document.getElementById(type + "TrainingRequiredFields");
        var trainingRequiredButton = document.getElementById(type + "TrainingRequiredButton");
        if (displayTrainingElement.style.display === "block") {
            displayTrainingElement.style.display = "none";
            trainingRequiredButton.innerText = "Expand"
        } else {
            displayTrainingElement.style.display = "block";
            trainingRequiredButton.innerText = "Collapse"
        }
    }

    async function addFieldsTrainingSubmit(e, type, api) {
        e.preventDefault()
        let hospitalNameOverride = document.getElementById("hospitalNameOverride" + type).value
        let elements = document.getElementsByName("extraFields" + type);
        let extraInformation = []
        for (let i = 0; i < elements.length; i++) {
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
    
    return (
        <div>
            <Navigation/>
            <div className="row">
                <div className="col-md-6">
                    <form action="#" method="POST" onSubmit={(e) => addFieldsSubmit(e)}>
                        <h1 className="text-center mt-4 mb-4">Required Beneficiary Input Fields</h1>

                        <p>MRN, Beneficiary Name, And Hospital Name Will Always Be Required</p>

                        <div className='container'>
                            <strong>Optional Override At Hospital Level</strong>
                            <input type="text" id="hospitalNameOverride" class="form-control"/>
                            <label className="form-check-label" htmlFor="hospitalNameOverride">Hospital Name
                                Override</label>
                        </div>
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
                            <div className="col-md-6">
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
                    <h2 className="text-center">Mobile Training</h2>
                    <div className='container' id="mobileTrainingRequiredFields">
                        <form action="#" method="POST" onSubmit={(e) => addFieldsTrainingSubmit(e, "MobileTraining", "mobileTrainingMirror")}>
                            <div className='container'>
                                <strong>Optional Override At Hospital Level</strong>
                                <input type="text" id="hospitalNameOverrideMobileTraining" className="form-control"/>
                                <label className="form-check-label" htmlFor="hospitalNameOverrideMobileTraining">Hospital Name
                                    Override</label>
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
                    <button className="btn btn-primary" id="mobileTrainingRequiredButton" onClick={() => toggleTraining("mobile")}>Expand</button>
                    <br/>
                    <h2 className="text-center">Computer Training</h2>
                    <div className='container' id="computerTrainingRequiredFields">
                        <form action="#" method="POST" onSubmit={(e) => addFieldsTrainingSubmit(e, "ComputerTraining", "computerTrainingMirror")}>
                            <div className='container'>
                                <strong>Optional Override At Hospital Level</strong>
                                <input type="text" id="hospitalNameOverrideComputerTraining" className="form-control"/>
                                <label className="form-check-label" htmlFor="hospitalNameOverrideComputerTraining">Hospital Name
                                    Override</label>
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
                    <button className="btn btn-primary" id="computerTrainingRequiredButton" onClick={() => toggleTraining("computer")}>Expand</button>
                    <br/>
                    <h2 className="text-center">Orientation Mobility Training</h2>
                    <div className='container' id="orientationMobilityTrainingRequiredFields">
                        <form action="#" method="POST" onSubmit={(e) => addFieldsTrainingSubmit(e, "OrientationMobilityTraining", "orientationMobilityTrainingMirror")}>
                            <div className='container'>
                                <strong>Optional Override At Hospital Level</strong>
                                <input type="text" id="hospitalNameOverrideOrientationMobilityTraining" className="form-control"/>
                                <label className="form-check-label" htmlFor="hospitalNameOverrideOrientationMobilityTraining">Hospital Name
                                    Override</label>
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
                    <button className="btn btn-primary" id="orientationMobilityTrainingRequiredButton" onClick={() => toggleTraining("orientationMobility")}>Expand</button>
                </div>
            </div>
        </div>
    )
}

export default RequiredFields
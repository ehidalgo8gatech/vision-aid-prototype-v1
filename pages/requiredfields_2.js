// This function gets called at build time
import { readUser } from './api/user'
import {getSession} from "next-auth/react";
import {readBeneficiaryMirror} from "@/pages/api/beneficiaryMirror";
import { v4 as uuidv4 } from 'uuid';
import Router from "next/router";
import {findAllHospital} from "@/pages/api/hospital";

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
            requiredBeneficiaryFields: await readBeneficiaryMirror(null),
            hospitals: await findAllHospital(),
            error: null
        },
    }
}

function requiredFields(props) {

    function removeExtraField(fieldId, buttonId) {
        return function () {
            console.log(fieldId, buttonId)
            document.getElementById(fieldId).remove()
            document.getElementById(buttonId).remove()
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
        let diagnosisRequired = document.getElementById("diagnosisRequired").checked
        let visionRequired = document.getElementById("visionRequired").checked
        let mDVIRequired = document.getElementById("mDVIRequired").checked
        console.log("phoneNumberRequired" + phoneNumberRequired, "educationRequired" + educationRequired, "occupationRequired" + occupationRequired, "districtsRequired" + districtsRequired, "stateRequired" + stateRequired, "diagnosisRequired" + diagnosisRequired, "visionRequired" + visionRequired, "mDVIRequired" + mDVIRequired)
        let elements = document.getElementsByClassName("extraField");
        let extraInformation = []
        for(let i = 0; i < elements.length; i++) {
            let body = {
                name: elements[i].value,
                type: "txt",
                required: true
            }
            extraInformation.push(body)
        }
        let extraInformationRequired = JSON.stringify(extraInformation)
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
                diagnosisRequired: diagnosisRequired,
                visionRequired: visionRequired,
                mDVIRequired: mDVIRequired,
                extraInformationRequired: extraInformationRequired
            })
        })
        let json = await response.json()
        alert("beneficiary required " + JSON.stringify(json))
        Router.reload()
    }

    function addField() {
        let container = document.getElementById("extraFields")
        let input = document.createElement("input")
        let fieldId = uuidv4()
        input.type = "text"
        input.name = "extraField"
        input.className = "extraField"
        input.id = fieldId
        container.appendChild(input)
        let button = document.createElement("button")
        let buttonId = uuidv4()

        button.onclick = removeExtraField(fieldId, buttonId)
        button.id = buttonId
        button.type = "button"
        button.className = "btn btn-primary"
        button.textContent = "remove field"
        container.appendChild(button)
        container.appendChild(document.createElement("br"))
    }

    let extraInformation = JSON.parse(props.requiredBeneficiaryFields.extraInformationRequired)
    const exInfo = []
    extraInformation.forEach((data) => {
        exInfo.push(
            <div>
            <input type="text" id={data.name} className="extraField" defaultValue={data.name}/>
            <button type="button" id={data.name} onClick={removeExtraField(data.name, data.name)} className="btn btn-primary">remove field</button>
        </div>)
    })
    const hospitalInfo = []
    props.hospitals.forEach((data) => {
        hospitalInfo.push(<div>
            <p>{data.name}</p>
            <br/>
        </div>)
    })
    return (
        <div>
            <p>Hospitals</p>
            {hospitalInfo}
            <form action="#" method="POST" onSubmit={(e) => addFieldsSubmit(e)}>
                <p>Required Beneficiary Input Fields</p>
                <p>MRN, Beneficiary Name, And Hospital Name Will Always Be Required</p>
                <p>Optional Override At Hospital Level</p>
                <div className="form-group">
                    <input type="text" id="hospitalNameOverride"/>
                    <label className="form-check-label" htmlFor="hospitalNameOverride">Hospital Name Override</label>
                </div>
                <p>Default Fields</p>
                <div className="form-group">
                    <input type="checkbox" className="form-check-input" id="phoneNumberRequired" defaultChecked={props.requiredBeneficiaryFields.phoneNumberRequired}/>
                    <label className="form-check-label" htmlFor="phoneNumberRequired">Phone Number Required</label>
                </div>
                <div className="form-group">
                    <input type="checkbox" className="form-check-input" id="educationRequired" defaultChecked={props.requiredBeneficiaryFields.educationRequired}/>
                    <label className="form-check-label" htmlFor="educationRequired">Education Required</label>
                </div>
                <div className="form-group">
                    <input type="checkbox" className="form-check-input" id="occupationRequired" defaultChecked={props.requiredBeneficiaryFields.occupationRequired}/>
                    <label className="form-check-label" htmlFor="occupationRequired">Occupation Required</label>
                </div>
                <div className="form-group">
                    <input type="checkbox" className="form-check-input" id="districtsRequired" defaultChecked={props.requiredBeneficiaryFields.districtsRequired}/>
                    <label className="form-check-label" htmlFor="districtsRequired">Districts Required</label>
                </div>
                <div className="form-group">
                    <input type="checkbox" className="form-check-input" id="stateRequired" defaultChecked={props.requiredBeneficiaryFields.stateRequired}/>
                    <label className="form-check-label" htmlFor="stateRequired">State Required</label>
                </div>
                <div className="form-group">
                    <input type="checkbox" className="form-check-input" id="diagnosisRequired" defaultChecked={props.requiredBeneficiaryFields.diagnosisRequired}/>
                    <label className="form-check-label" htmlFor="diagnosisRequired">Diagnosis Required</label>
                </div>
                <div className="form-group">
                    <input type="checkbox" className="form-check-input" id="visionRequired" defaultChecked={props.requiredBeneficiaryFields.visionRequired}/>
                    <label className="form-check-label" htmlFor="visionRequired">Vision Required</label>
                </div>
                <div className="form-group">
                    <input type="checkbox" className="form-check-input" id="mDVIRequired" defaultChecked={props.requiredBeneficiaryFields.mDVIRequired}/>
                    <label className="form-check-label" htmlFor="mDVIRequired">MDVI Required</label>
                </div>
                <br/>
                <div id="extraFields">
                    <p>Extra Fields</p>
                    {exInfo}
                </div>
                <button type="button" onClick={addField} className="btn btn-primary">Add Required Field</button>
                <br/>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default requiredFields
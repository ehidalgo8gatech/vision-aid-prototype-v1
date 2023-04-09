// This function gets called at build time
import { readUser } from './api/user'
import {getSession} from "next-auth/react";
import {readBeneficiaryMirror} from "@/pages/api/beneficiaryMirror";
import { v4 as uuidv4 } from 'uuid';
import Router from "next/router";
import Navigation from './navigation/Navigation';

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

    function addField() {
        let container = document.getElementById("extraFields")
        let input = document.createElement("input")
        let fieldId = uuidv4()

        let inputDiv = document.createElement("div")
        inputDiv.className = "form-group"
        container.appendChild(inputDiv)
        input.type = "text"
        input.name = "extraField"
        input.className = "form-control"
        input.id = fieldId
        container.appendChild(input)
        container.appendChild(document.createElement("br"))
        let button = document.createElement("button")
        let buttonId = uuidv4()

        //button.onclick = removeExtraField(fieldId, buttonId)
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
            <div class="col-md-12">
            <div class="row">
                <div class="col-md-6">
                <input type="text" id={data.name} name="extraField" class="form-control" defaultValue={data.name}/>
                </div>
                <div class="col-md-6">
                <button type="button" id={data.name} onClick={removeExtraField(data.name, data.name)} class="btn btn-danger border-0 btn-block">Remove Field</button>
                </div>
            </div>
            <br/>
            </div>
            

        )
    })
    return (
        <div>
            <Navigation />
            <form action="#" method="POST" onSubmit={(e) => addFieldsSubmit(e)}>
                <h1 className="text-center mt-4 mb-4">Required Beneficiary Input Fields</h1>
                
                <p>MRN, Beneficiary Name, And Hospital Name Will Always Be Required</p>
                <div className="row">
                    <div className="col-md-6">
                        <strong>Default Fields</strong>
                        <br/>
                        <br/>
                        <div className="form-group">
                            <input type="checkbox" className="form-check-input" id="phoneNumberRequired" defaultChecked={props.requiredBeneficiaryFields.phoneNumberRequired}/>
                            <label className="form-check-label" htmlFor="phoneNumberRequired">Phone Number Required</label>
                        </div>
                        <br/>
                        <div className="form-group">
                            <input type="checkbox" className="form-check-input" id="educationRequired" defaultChecked={props.requiredBeneficiaryFields.educationRequired}/>
                            <label className="form-check-label" htmlFor="educationRequired">Education Required</label>
                        </div>
                        <br/>
                        <div className="form-group">
                            <input type="checkbox" className="form-check-input" id="occupationRequired" defaultChecked={props.requiredBeneficiaryFields.occupationRequired}/>
                            <label className="form-check-label" htmlFor="occupationRequired">Occupation Required</label>
                        </div>
                        <br/>
                        <div className="form-group">
                            <input type="checkbox" className="form-check-input" id="districtsRequired" defaultChecked={props.requiredBeneficiaryFields.districtsRequired}/>
                            <label className="form-check-label" htmlFor="districtsRequired">Districts Required</label>
                        </div>
                        <br/>
                        <div className="form-group">
                            <input type="checkbox" className="form-check-input" id="stateRequired" defaultChecked={props.requiredBeneficiaryFields.stateRequired}/>
                            <label className="form-check-label" htmlFor="stateRequired">State Required</label>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div id="extraFields">
                            <strong>Extra Fields</strong>
                            <br/>
                            <br/>
                            {exInfo}
                        </div>
                        <button type="button" onClick={addField} className="btn btn-success border-0 btn-block">Add Required Field</button>
                        <br/>
                    </div>
                </div>
                <br/>
                <br/>
                <button type="submit" className="btn btn-primary">Submit</button>



            </form>
        </div>
    )
}

export default requiredFields
// This function gets called at build time
import {readUser} from './api/user'
import {getSession} from "next-auth/react";
import {readBeneficiaryMirror} from "@/pages/api/beneficiaryMirror";
import {v4 as uuidv4} from 'uuid';
import Router from "next/router";
import {getHospitalRoleByUserId} from "@/pages/api/hospitalRole";

// http://localhost:3000/beneficiaryinformation
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
    if (user == null || (user.admin == null && user.hospitalRole == null)) {
        console.log("user not logged in or admin is not null or added to a hospital")
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }
    const hospitalRole = await getHospitalRoleByUserId(user.id)
    var hospital = null
    if (hospitalRole != null) {
        hospital = hospitalRole.hospital
    }
    return {
        props: {
            user: user,
            requiredBeneficiaryFields: await readBeneficiaryMirror(hospital),
            error: null
        },
    }
}

function requiredFields(props) {

    async function submitInfo(e) {
        e.preventDefault()
        let mrn = document.getElementById("mrn") != null ? document.getElementById("mrn").value : null
        let beneficiaryName = document.getElementById("beneficiaryName") != null ? document.getElementById("beneficiaryName").value : null
        let hospitalName = document.getElementById("hospitalName") != null ? document.getElementById("hospitalName").value : null
        let dateOfBirth = document.getElementById("dateOfBirth") != null ? new Date(Date.parse(document.getElementById("dateOfBirth").value)) : null
        let gender = document.getElementById("gender") != null ? document.getElementById("gender").value : null
        let phoneNumber = document.getElementById("phoneNumber") != null ? document.getElementById("phoneNumber").value : null
        let education = document.getElementById("education") != null ? document.getElementById("education").value : null
        let occupation = document.getElementById("occupation") != null ? document.getElementById("occupation").value : null
        let districts = document.getElementById("districts") != null ? document.getElementById("districts").value : null
        let state = document.getElementById("state") != null ? document.getElementById("state").value : null
        let diagnosis = document.getElementById("diagnosis") != null ? document.getElementById("diagnosis").value : null
        let vision = document.getElementById("vision") != null ? document.getElementById("vision").value : null
        let mDVI = document.getElementById("mDVI") != null ? document.getElementById("mDVI").value : null
        console.log("mrn" + mrn + "beneficiaryName" + beneficiaryName + "dateOfBirth" + dateOfBirth + "gender" + gender + "phoneNumber" + phoneNumber, "education" + education, "occupation" + occupation, "districts" + districts, "state" + state, "diagnosis" + diagnosis, "vision" + vision, "mDVI" + mDVI)
        let elements = document.getElementsByClassName("extraField");
        let extraInformation = []
        for (let i = 0; i < elements.length; i++) {
            let body = {
                name: elements[i].id,
                value: elements[i].value
            }
            extraInformation.push(body)
        }
        var hospitalId;
        if (props.user.hospitalRole != null) {
            hospitalId = props.user.hospitalRole.hospitalId
        } else {
            const hospital = await fetch('/api/hospital?name=' + hospitalName, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
            })
            const hospitalJson = await hospital.json()
            if (hospitalJson == null || hospitalJson.error != null) {
                alert("Can't find hospital name in db " + hospitalName)
                return
            }
            hospitalId = hospitalJson.id
        }
        let extraInfo = JSON.stringify(extraInformation)
        console.log("extra fields " + extraInfo)
        let response = await fetch('/api/beneficiary', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                mrn: mrn,
                beneficiaryName: beneficiaryName,
                hospitalId: hospitalId,
                dateOfBirth: dateOfBirth,
                gender: gender,
                phoneNumber: phoneNumber,
                education: education,
                occupation: occupation,
                districts: districts,
                state: state,
                diagnosis: diagnosis,
                vision: vision,
                mDVI: mDVI,
                extraInformation: extraInfo
            })
        })
        let json = await response.json()
        alert("beneficiary " + JSON.stringify(json))
        Router.reload()
    }

    const mrn = (
        <div className="form-group">
            <input type="text" id="mrn"/>
            <label className="form-check-label" htmlFor="mrn">MRN</label>
        </div>
    )

    const beneficiaryName = (
        <div className="form-group">
            <input type="text" id="beneficiaryName"/>
            <label className="form-check-label" htmlFor="beneficiaryName">Beneficiary Name</label>
        </div>
    )

    var hospitalName;
    if (props.user.hospitalRole == null) {
        hospitalName = (
        <div className="form-group">
            <input type="text" id="hospitalName"/>
            <label className="form-check-label" htmlFor="hospitalName">Hospital Name</label>
        </div>
    )} else {
        hospitalName = (
            <div></div>
        )
    }

    const dateOfBirth = (
        <div className="form-group">
            <input type="date" id="dateOfBirth"/>
            <label className="form-check-label" htmlFor="dateOfBirth">Date Of Birth</label>
        </div>
    )


    const gender = (
        <div className="form-group">
            <input type="text" id="gender"/>
            <label className="form-check-label" htmlFor="gender">Gender</label>
        </div>
    )


    var phoneNumber;
    if (!props.requiredBeneficiaryFields.phoneNumberRequired) {
        phoneNumber = (
            <div></div>
        )
    } else {
        phoneNumber = (
            <div className="form-group">
                <input type="text" id="phoneNumber"/>
                <label className="form-check-label" htmlFor="phoneNumber">Phone Number</label>
            </div>
        )
    }

    var education;
    if (!props.requiredBeneficiaryFields.educationRequired) {
        education = (
            <div></div>
        )
    } else {
        education = (
            <div className="form-group">
                <input type="text" id="education"/>
                <label className="form-check-label" htmlFor="education">Education</label>
            </div>
        )
    }

    var occupation;
    if (!props.requiredBeneficiaryFields.occupationRequired) {
        occupation = (
            <div></div>
        )
    } else {

        occupation = (
            <div className="form-group">
                <input type="text" id="occupation"/>
                <label className="form-check-label" htmlFor="occupation">Occupation</label>
            </div>
        )
    }

    var districts;
    if (!props.requiredBeneficiaryFields.districtsRequired) {
        districts = (
            <div></div>
        )
    } else {
        districts = (
            <div className="form-group">
                <input type="text" id="districts"/>
                <label className="form-check-label" htmlFor="districts">Districts</label>
            </div>
        )
    }

    var state;
    if (!props.requiredBeneficiaryFields.stateRequired) {
        state = (
            <div></div>
        )
    } else {
        state = (
            <div className="form-group">
                <input type="text" id="state"/>
                <label className="form-check-label" htmlFor="state">State</label>
            </div>
        )
    }

    var diagnosis;
    if (!props.requiredBeneficiaryFields.diagnosisRequired) {
        diagnosis = (
            <div></div>
        )
    } else {

        diagnosis = (
            <div className="form-group">
                <input type="text" id="diagnosis"/>
                <label className="form-check-label" htmlFor="diagnosis">Diagnosis</label>
            </div>
        )
    }

    var vision;
    if (!props.requiredBeneficiaryFields.visionRequired) {
        vision = (
            <div></div>
        )
    } else {
        vision = (
            <div className="form-group">
                <input type="text" id="vision"/>
                <label className="form-check-label" htmlFor="vision">Vision</label>
            </div>
        )
    }

    var mDVI;
    if (!props.requiredBeneficiaryFields.mDVIRequired) {
        mDVI = (
            <div></div>
        )
    } else {
        mDVI = (
            <div className="form-group">
                <input type="text" id="mDVI"/>
                <label className="form-check-label" htmlFor="mDVI">MDVI</label>
            </div>
        )
    }

    let extraInformation = JSON.parse(props.requiredBeneficiaryFields.extraInformationRequired)
    const exInfo = []
    extraInformation.forEach((data) => {
        exInfo.push(
            <div>
                <input type="text" id={data.name} className="extraField"/>
                <label className="form-check-label" htmlFor={data.name}>{data.name}</label>
            </div>)
    })

    async function search(e) {
        e.preventDefault()
        let nameSearch = document.getElementById("searchName").value
        const beneficiary = await fetch('/api/beneficiary?beneficiaryName=' + nameSearch, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        })
        const beneficiaryJson = await beneficiary.json()
        if (beneficiaryJson == null || beneficiaryJson.error != null) {
            alert("Can't find beneficiary name in db " + nameSearch)
            return
        }
        beneficiaryJson.forEach((b) => {
            let container = document.getElementById("searchNameDiv")
            let tr = document.createElement("tr")
            let tdName = document.createElement("td")
            let tdMRN = document.createElement("td")
            let tdDOB = document.createElement("td")
            let tdHospitalName = document.createElement("td")
            tdName.innerText = b.beneficiaryName
            tdMRN.innerText = b.mrn
            tdDOB.innerText = b.dateOfBirth
            tdHospitalName.innerText = b.hospital.name
            tr.appendChild(tdName)
            tr.appendChild(tdMRN)
            tr.appendChild(tdDOB)
            tr.appendChild(tdHospitalName)
            container.appendChild(tr)
            }
        )
    }

    return (
        <div>
            <p>Search beneficiary information by name</p>
            <form action="#" method="POST" onSubmit={(e) => search(e)}>
                <input type="text" id="searchName"/>
                <label className="form-check-label" htmlFor="searchName">name</label>
                <br/>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
            <table className="table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>MRN</th>
                    <th>Date Of Birth</th>
                    <th>Hospital Name</th>
                </tr>
                </thead>
                <tbody id="searchNameDiv">
                </tbody>
            </table>

            <p>Enter Beneficiary Information</p>
            <form action="#" method="POST" onSubmit={(e) => submitInfo(e)}>
                {mrn}
                {beneficiaryName}
                {hospitalName}
                {dateOfBirth}
                {gender}
                {phoneNumber}
                {education}
                {occupation}
                {districts}
                {state}
                {diagnosis}
                {vision}
                {mDVI}
                <br/>
                <div id="extraFields">
                    <p>Extra Fields</p>
                    {exInfo}
                </div>
                <br/>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default requiredFields
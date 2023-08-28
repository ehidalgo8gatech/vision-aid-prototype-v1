// This function gets called at build time
import { readUser } from "./api/user";
import { getSession } from "next-auth/react";
import { readBeneficiaryMirror } from "@/pages/api/beneficiaryMirror";
import { findAllHospital } from "@/pages/api/hospital";
import { v4 as uuidv4 } from "uuid";
import Router from "next/router";
import { useRouter } from "next/router";
import { useState } from "react";
import Navigation from "./navigation/Navigation";

// http://localhost:3000/beneficiaryinformation
export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  if (session == null) {
    console.log("session is null");
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const user = await readUser(session.user.email);
  if (user.admin == null && user.hospitalRole == null) {
    console.log("user admin is not null or added to a hospital");
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      user: user,
      requiredBeneficiaryFields: await readBeneficiaryMirror(),
      hospitals: await findAllHospital(),
      error: null,
    },
  };
}

function RequiredFields(props) {
  const router = useRouter();
  async function submitInfo(e) {
    e.preventDefault();
    let mrn =
      document.getElementById("mrn") != null
        ? document.getElementById("mrn").value
        : null;
    let beneficiaryName =
      document.getElementById("beneficiaryName") != null
        ? document.getElementById("beneficiaryName").value
        : null;
    let hospitalId =
      document.getElementById("hospitalName") != null
        ? parseInt(document.getElementById("hospitalName").value)
        : null;
    let dateOfBirth =
      document.getElementById("dateOfBirth") != null
        ? new Date(Date.parse(document.getElementById("dateOfBirth").value))
        : null;
    let gender =
      document.getElementById("gender") != null
        ? document.getElementById("gender").value
        : null;
    let phoneNumber =
      document.getElementById("phoneNumber") != null
        ? document.getElementById("phoneNumber").value
        : null;
    let education =
      document.getElementById("education") != null
        ? document.getElementById("education").value
        : null;
    let occupation =
      document.getElementById("occupation") != null
        ? document.getElementById("occupation").value
        : null;
    let districts =
      document.getElementById("districts") != null
        ? document.getElementById("districts").value
        : null;
    let state =
      document.getElementById("state") != null
        ? document.getElementById("state").value
        : null;
    let diagnosis =
      document.getElementById("diagnosis") != null
        ? document.getElementById("diagnosis").value
        : null;
    let vision =
      document.getElementById("vision") != null
        ? document.getElementById("vision").value
        : null;
    let mDVI =
      document.getElementById("mDVI") != null
        ? document.getElementById("mDVI").value
        : null;
    console.log(
      "mrn" +
        mrn +
        "beneficiaryName" +
        beneficiaryName +
        "dateOfBirth" +
        dateOfBirth +
        "gender" +
        gender +
        "phoneNumber" +
        phoneNumber,
      "education" + education,
      "occupation" + occupation,
      "districts" + districts,
      "state" + state,
      "diagnosis" + diagnosis,
      "vision" + vision,
      "mDVI" + mDVI
    );
    let elements = document.getElementsByName("extraField");
    document.get;
    let extraInformation = [];
    for (let i = 0; i < elements.length; i++) {
      let body = {
        name: elements[i].id,
        value: elements[i].value,
      };
      extraInformation.push(body);
    }
    if (props.user.hospitalRole != null) {
      hospitalId = props.user.hospitalRole.hospitalId; // set by default to user's hospital ID
    }
    let extraInfo = JSON.stringify(extraInformation);
    console.log("extra fields " + extraInfo);
    let response = await fetch("/api/beneficiary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
        extraInformation: extraInfo,
      }),
    });
    let json = await response.json();
    //alert("beneficiary " + JSON.stringify(json))
    //Router.reload()
    if (response.ok) {
      router.push("/user?mrn=" + mrn);
    } else {
      alert(
        "An error occurred while creating the user. Please try again. Error: " +
          JSON.stringify(json)
      );
    }
  }

  const mrn = (
    <div>
      <label htmlFor="mrn">MRN</label>
      <input type="text" className="form-control" id="mrn" />
    </div>
  );

  const beneficiaryName = (
    <div>
      <label htmlFor="beneficiaryName">Beneficiary Name</label>
      <input type="text" className="form-control" id="beneficiaryName" />
    </div>
  );

  var hospitalName;
  if (props.user.hospitalRole == null) {
    const hospitalOptions = [];
    for (let i = 0; i < props.hospitals.length; i++) {
      const hospital = props.hospitals[i];
      hospitalOptions.push(
        <option key={hospital.name} value={hospital.id}>
          {hospital.name} (ID {hospital.id})
        </option>
      );
    }
    hospitalName = (
      <div className="form-group">
        <label className="form-check-label" htmlFor="hospitalName">
          Hospital Name
        </label>

        <select className="form-select" id="hospitalName">
          <option selected key="" value="">
            Select Hospital
          </option>
          {hospitalOptions}
        </select>
      </div>
    );
  } else {
    hospitalName = (<div className="form-group">
    <label className="form-check-label" htmlFor="hospitalName">
      Hospital Name
    </label>

    <select className="form-select" id="hospitalName" disabled>
      <option selected key="" value="">
        {props.hospitals.find(hospital => hospital.id == props.user.hospitalRole.hospitalId).name} (ID {props.user.hospitalRole.hospitalId})
      </option>
    </select>
  </div>)
    // <div></div>;
  }

  const dateOfBirth = (
    <div>
      <label htmlFor="dateOfBirth">Date Of Birth</label>
      <input type="date" className="form-control" id="dateOfBirth" />
    </div>
  );

  const gender = (
    <div>
      <label htmlFor="gender">Gender</label>
      <input type="text" className="form-control" id="gender" />
    </div>
  );

  var phoneNumber;
  if (!props.requiredBeneficiaryFields.phoneNumberRequired) {
    phoneNumber = <div></div>;
  } else {
    phoneNumber = (
      <div>
        <label htmlFor="phoneNumber">Phone Number</label>
        <input type="text" className="form-control" id="phoneNumber" />
      </div>
    );
  }

  var education;
  if (!props.requiredBeneficiaryFields.educationRequired) {
    education = <div></div>;
  } else {
    education = (
      <div>
        <label htmlFor="education">Education</label>
        <input type="text" className="form-control" id="education" />
      </div>
    );
  }

  var occupation;
  if (!props.requiredBeneficiaryFields.occupationRequired) {
    occupation = <div></div>;
  } else {
    occupation = (
      <div>
        <label htmlFor="occupation">Occupation</label>
        <input type="text" className="form-control" id="occupation" />
      </div>
    );
  }

  var districts;
  if (!props.requiredBeneficiaryFields.districtsRequired) {
    districts = <div></div>;
  } else {
    districts = (
      <div>
        <label htmlFor="districts">Districts</label>
        <input type="text" className="form-control" id="districts" />
      </div>
    );
  }

  var state;
  if (!props.requiredBeneficiaryFields.stateRequired) {
    state = <div></div>;
  } else {
    state = (
      <div>
        <label htmlFor="state">State</label>
        <input type="text" className="form-control" id="state" />
      </div>
    );
  }

  var diagnosis;
  if (!props.requiredBeneficiaryFields.diagnosisRequired) {
    diagnosis = <div></div>;
  } else {
    diagnosis = (
      <div className="form-group">
        <input type="text" id="diagnosis" />
        <label className="form-check-label" htmlFor="diagnosis">
          Diagnosis
        </label>
      </div>
    );
  }

  var vision;
  if (!props.requiredBeneficiaryFields.visionRequired) {
    vision = <div></div>;
  } else {
    vision = (
      <div className="form-group">
        <input type="text" id="vision" />
        <label className="form-check-label" htmlFor="vision">
          Vision
        </label>
      </div>
    );
  }

  var mDVI;
  if (!props.requiredBeneficiaryFields.mDVIRequired) {
    mDVI = <div></div>;
  } else {
    mDVI = (
      <div className="form-group">
        <input type="text" id="mDVI" />
        <label className="form-check-label" htmlFor="mDVI">
          MDVI
        </label>
      </div>
    );
  }

  let extraInformation = JSON.parse(
    props.requiredBeneficiaryFields.extraInformationRequired
  );
  const exInfo = [];
  extraInformation.forEach((data) => {
    exInfo.push(
      <div>
        <label htmlFor={data.name}>{data.name}</label>
        <input
          type="text"
          className="form-control"
          name="extraField"
          id={data.name}
        />
      </div>
    );
  });

  async function search(e) {
    e.preventDefault();
    let nameSearch = document.getElementById("searchName").value;
    const beneficiary = await fetch(
      "/api/beneficiary?beneficiaryName=" + nameSearch,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    const beneficiaryJson = await beneficiary.json();
    if (beneficiaryJson == null || beneficiaryJson.error != null) {
      alert("Can't find beneficiary name in db " + nameSearch);
      return;
    }
    beneficiaryJson.forEach((b) => {
      let container = document.getElementById("searchNameDiv");
      let tr = document.createElement("tr");
      let tdName = document.createElement("td");
      let tdMRN = document.createElement("td");
      let tdDOB = document.createElement("td");
      let tdHospitalName = document.createElement("td");
      tdName.innerText = b.beneficiaryName;
      tdMRN.innerText = b.mrn;
      tdDOB.innerText = b.dateOfBirth;
      tdHospitalName.innerText = b.hospital.name;
      tr.appendChild(tdName);
      tr.appendChild(tdMRN);
      tr.appendChild(tdDOB);
      tr.appendChild(tdHospitalName);
      container.appendChild(tr);
    });
  }

  return (
    <div>
      <Navigation />
      <div className="container">
        <h1 className="text-center mt-4 mb-4">Add Beneficiary</h1>
        <form action="#" method="POST" onSubmit={(e) => submitInfo(e)}>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">{mrn}</div>
              <div className="mb-3">{beneficiaryName}</div>
              <div className="mb-3">{hospitalName}</div>
              <div className="mb-3">{dateOfBirth}</div>
              <div className="mb-3">{gender}</div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">{phoneNumber}</div>
              <div className="mb-3">{education}</div>
              <div className="mb-3">{occupation}</div>
              <div className="mb-3">{districts}</div>
              <div className="mb-3">{state}</div>
            </div>
          </div>
          {diagnosis}
          {vision}
          {mDVI}
          <br />
          <div id="extraFields">
            <p>Additional Fields</p>
            {exInfo}
          </div>
          <br />
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default RequiredFields;

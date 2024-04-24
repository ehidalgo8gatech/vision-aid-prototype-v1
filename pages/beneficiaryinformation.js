import { readBeneficiaryMirror } from "@/pages/api/beneficiaryMirror";
import { findAllHospital } from "@/pages/api/hospital";
import { useRouter } from "next/router";
import { useState } from "react";
import Navigation from "./navigation/Navigation";
import moment from "moment";
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { getUserFromSession } from "@/pages/api/user";

// http://localhost:3000/beneficiaryinformation
export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const user = await getUserFromSession(ctx);
    if (user === null || (!user.admin && user.hospitalRole.length == 0)) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    return {
      props: {
        beneficiaryName: ctx.query.beneficiaryName,
        user: user,
        requiredBeneficiaryFields: await readBeneficiaryMirror(),
        hospitals: await findAllHospital(),
        error: null,
      },
    };
  }
});

function RequiredFields(props) {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const today = moment(new Date()).format("YYYY-MM-DD");
  const [beneficiaryNameVal, setBeneficiaryNameVal] = useState(
    props.beneficiaryName
  );

  const checkInput = (e) => {
    const onlyDigits = e.target.value.replace(/\D/g, "");
    setPhone(onlyDigits);
  };

  async function submitInfo(e) {
    e.preventDefault();
    let mrn =
      document.getElementById("mrn") != null
        ? document.getElementById("mrn").value.trim()
        : null;
    let beneficiaryName =
      document.getElementById("beneficiaryName") != null
        ? document.getElementById("beneficiaryName").value.trim()
        : null;
    let hospitalId =
      document.getElementById("hospitalName") != null &&
      document.getElementById("hospitalName").value != ""
        ? parseInt(document.getElementById("hospitalName").value)
        : null;
    let dateOfBirth =
      document.getElementById("dateOfBirth") != null
        ? new Date(Date.parse(document.getElementById("dateOfBirth").value))
        : null;
    let gender =
      document.getElementById("gender") != null &&
      document.getElementById("gender").value != ""
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
      <input
        type="text"
        className="form-control"
        id="mrn"
        placeholder="Enter beneficiary's MRN"
        autoComplete="off"
      />
    </div>
  );

  const beneficiaryName = (
    <div>
      <label htmlFor="beneficiaryName">Beneficiary Name</label>
      <input
        type="text"
        className="form-control"
        id="beneficiaryName"
        placeholder="Enter beneficiary's full name"
        value={beneficiaryNameVal}
        onChange={(e) => setBeneficiaryNameVal(e.target.value)}
        autoComplete="off"
      />
    </div>
  );

  var hospitalName;
  if (props.user.hospitalRole.length == 0) {
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
          <option value="">Select Hospital</option>
          {hospitalOptions}
        </select>
      </div>
    );
  } else {
    const hospitalOptions = [];
    for (const hospital of props.user.hospitalRole) {
      const name = props.hospitals.find(
        (h) => h.id == hospital.hospitalId
      ).name;
      hospitalOptions.push(
        <option key={name} value={hospital.hospitalId}>
          {name} (ID {hospital.hospitalId})
        </option>
      );
    }
    hospitalName = (
      <div className="form-group">
        <label className="form-check-label" htmlFor="hospitalName">
          Hospital Name
        </label>

        <select className="form-select" id="hospitalName">
            {hospitalOptions}
        </select>
      </div>
    );
    // <div></div>;
  }

  const dateOfBirth = (
    <div>
      <label htmlFor="dateOfBirth">Date Of Birth</label>
      <input
        type="date"
        className="form-control"
        id="dateOfBirth"
        max={today}
      />
    </div>
  );

  const gender = (
    <div>
      <label htmlFor="gender">Gender</label>
      <select className="form-select" id="gender">
        <option value="">Select Gender</option>
        <option key="M" value="M">
          Male
        </option>
        <option key="F" value="F">
          Female
        </option>
        <option key="O" value="Other">
          Other
        </option>
      </select>
    </div>
  );

  var phoneNumber;
  if (!props.requiredBeneficiaryFields.phoneNumberRequired) {
    phoneNumber = <div></div>;
  } else {
    phoneNumber = (
      <div>
        <label htmlFor="phoneNumber">Phone Number</label>
        <input
          type="tel"
          className="form-control"
          id="phoneNumber"
          placeholder="Enter beneficiary's phone number"
          maxLength={10}
          onChange={(e) => checkInput(e)}
          value={phone}
          autoComplete="off"
        />
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
        <input
          type="text"
          className="form-control"
          id="education"
          placeholder="Enter beneficiary's educational qualifications"
          autoComplete="off"
        />
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
        <input
          type="text"
          className="form-control"
          id="occupation"
          placeholder="Enter beneficiary's occupation"
          autoComplete="off"
        />
      </div>
    );
  }

  var districts;
  if (!props.requiredBeneficiaryFields.districtsRequired) {
    districts = <div></div>;
  } else {
    districts = (
      <div>
        <label htmlFor="districts">District</label>
        <input
          type="text"
          className="form-control"
          id="districts"
          placeholder="Enter beneficiary's district (location)"
          autoComplete="off"
        />
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
        <input
          type="text"
          className="form-control"
          id="state"
          placeholder="Enter beneficiary's state (location)"
          autoComplete="off"
        />
      </div>
    );
  }

  var diagnosis;
  if (!props.requiredBeneficiaryFields.diagnosisRequired) {
    diagnosis = <div></div>;
  } else {
    diagnosis = (
      <div className="form-group">
        <label className="form-check-label" htmlFor="diagnosis">
          Diagnosis
        </label>
        <input
          type="text"
          className="form-control"
          id="diagnosis"
          placeholder="Enter beneficiary's diagnosis"
          autoComplete="off"
        />
      </div>
    );
  }

  var vision;
  if (!props.requiredBeneficiaryFields.visionRequired) {
    vision = <div></div>;
  } else {
    vision = (
      <div className="form-group">
        <label className="form-check-label" htmlFor="vision">
          Vision
        </label>
        <input
          type="text"
          className="form-control"
          id="vision"
          placeholder="Enter beneficiary's vision details"
          autoComplete="off"
        />
      </div>
    );
  }

  var mDVI;
  mDVI = (
    <div className="form-group">
      <label className="form-check-label" htmlFor="mDVI">
        MDVI
      </label>
      <select className="form-select" id="mDVI">
        <option key="Yes" value="Yes">
          Yes
        </option>
        <option selected key="No" value="No">
          No
        </option>
        <option key="At Risk" value="At Risk">
          At Risk
        </option>
      </select>
    </div>
  );

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
          autoComplete="off"
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
      <Navigation user={props.user} />
      <div className="container">
        <h1 className="text-center mt-4 mb-4">Register Beneficiary</h1>
        <div className="beneficiary-child-container">
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
            {mDVI}
            {diagnosis}
            {vision}
            <br />
            <div id="extraFields">
              <p>Additional Fields</p>
              {exInfo}
            </div>
            <br />
            <button
              type="submit"
              className="btn btn-success border-0 btn-block"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RequiredFields;

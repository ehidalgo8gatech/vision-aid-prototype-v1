/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import {useState} from 'react'
import {useEffect, useRef} from 'react'
import {ChevronDownIcon} from '@heroicons/react/20/solid'
import {Switch} from '@headlessui/react'
import Image from 'next/image';
import {useSession, signIn, signOut, getSession} from "next-auth/react";
import moment from 'moment';
import Router from 'next/router'
import readXlsxFile from 'read-excel-file'
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
/*import Navbar from '@/comps/Navbar'*/


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

//function myFunction() {
//  document.getElementById("demo").innerHTML = "Beneficiary's information submitted"
//}

function myFunction() {


    const inputs = document.querySelectorAll('#date, #hospital-name, #session-number, #mrn, #patients-name, #age, #gender, #phone-number, #education, #occupation, #districts, #state, #diagnosis');
    for (let i = 0; i < inputs.length; i++) {
        if (!inputs[i].value) {
            alert("Please fill out all the fields.");
            return;
        }
    }
}

export default function Example() {
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [agreed, setAgreed] = useState(false)
    const [date, setDate] = useState();
    const [hospitalName, setHospitalName] = useState();
    const [sessionNumber, setSessionNummber] = useState();
    const [mrn, setMRN] = useState("");
    const [beneficiaryName, setBeneficiaryName] = useState("");
    const [age, setAge] = useState();
    const [gender, setGender] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [Education, setEducation] = useState("");
    const [Occupation, setOccupation] = useState("");
    const [Districts, setDistricts] = useState("");
    const [State, setState] = useState("");
    const [Diagnosis, setDiagnosis] = useState("");
    const [Vision, setVision] = useState("");

    const [MDVI, setMDVI] = useState("");
    const [typeCounselling, settypeCounselling] = useState("");
    const [schoolName, setschoolName] = useState("");
    const [studentName, setstudentName] = useState("");
    const [visualAcuityRE, setvisualAcuityRE] = useState("");
    const [visualAcuityLE, setvisualAcuityLE] = useState("");
    const [unaidedNearVision, setunaidedNearVision] = useState("");
    const [refractionVALE, setrefractionVALE] = useState("");
    const [LVA, setLVA] = useState("");
    const [LVANear, setLVANear] = useState("");
    const [nonOpticalAid, setnonOpticalAid] = useState("");
    const [actionNeeded, setactionNeeded] = useState("");
    const [typeCamp, settypeCamp] = useState("");
    const [screeningPlace, setscreeningPlace] = useState("");
    const [organiser, setorganiser] = useState("");
    const [contactNumber, setcontactNumber] = useState("");
    const [address, setaddress] = useState("");
    const [screenedTotal, setscreenedTotal] = useState("");
    const [refractiveErrors, setrefractiveErrors] = useState("");
    const [spectaclesDistributed, setspectaclesDistributed] = useState("");
    const [checked, setchecked] = useState("");
    const [refer, setrefer] = useState("");
    const [staff, setstaff] = useState("");
    const [lowVision, setlowVision] = useState("");

    const [APIResponse, setAPIResponse] = useState(null);
    const [focusedInput, setFocusedInput] = useState(null);


    //useEffect(() => {
    //  console.log("patientName", patientName);
    //  console.log("age", age);
    //  console.log("gender", gender);
    //  console.log("education", education);
    //  console.log("API response", APIResponse);
    //},[patientName, age, gender, education, APIResponse])

    const readDB = async () => {
        try {
            const response = await fetch('/api/patients', {
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
            });
            setAPIResponse(await response.json());
            if (response.status !== 200) {
                console.log('something went wrong')
                //set an error banner here
            } else {
                console.log('form submitted successfully !!!')
                //set a success banner here
            }
        } catch (error) {
            console.log("there was an error reading from the db", error);
        }
    }

    const postData = async (url = '', data = {}, functionName = '') => {
        const response = await fetch(`${url}?functionName=${functionName}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return response;
    }

    const handleSubmit = async (e, selectedOption) => {
        e.preventDefault()
        let body
        if (selectedOption === 'computer-training') {
            body = {date,hospitalName,sessionNumber,mrn,beneficiaryName,age,gender,phoneNumber,Education,Occupation,Districts,State,Diagnosis}
        } else if (selectedOption === 'mobile-training') {
            body = {date,hospitalName,sessionNumber,beneficiaryName,age,gender,phoneNumber,Education,Occupation,Districts,State,Vision}
        } else if (selectedOption === 'orientation-mobility-training') {
            body = {date,hospitalName,sessionNumber,mrn,beneficiaryName,age,gender,phoneNumber,Education,Occupation,Districts,State,Diagnosis}
        } else if (selectedOption === 'vision-enhancement') {
            body = {date,hospitalName,sessionNumber,mrn,beneficiaryName,age,gender,phoneNumber,Districts,Diagnosis,MDVI}
        } else if (selectedOption === 'counselling-education') {
            body = {date,hospitalName,sessionNumber,mrn,beneficiaryName,age,gender,phoneNumber,Districts,Diagnosis,typeCounselling}
        } else if (selectedOption === 'camps') {
            body = {date,hospitalName,schoolName,studentName,age,gender,Diagnosis,visualAcuityRE,visualAcuityLE,unaidedNearVision,refractionVALE,LVA,LVANear,nonOpticalAid,actionNeeded}
        } else if (selectedOption === 'school-screenings') {
            body = {date,hospitalName,typeCamp,screeningPlace,organiser,contactNumber,address,screenedTotal,refractiveErrors,spectaclesDistributed,checked,refer,staff,lowVision}
        }
        //const body = {
        //    date,
        //    hospitalName,
        //    sessionNumber,
        //    mrn,
        //    beneficiaryName,
        //    age,
        //    gender,
        //    phoneNumber,
        //    Education,
        //    Occupation,
        //    Districts,
        //    State,
        //    Diagnosis
        //}
        await addPatientsToDB(body, true, selectedOption)
    }

    const addPatientsToDB = async (body, reloadOnSuccess, selectedOption) => {
        try {
            const session = await getSession()
            if (!session) {
                alert("You need to be logged in to enter data")
                return
            }
            const user = await insertUserIfRequired(session)
            if (user == null) {
                alert("User not found in db")
                return
            }
            if (user.admin == null && user.hospitalRole == null) {
                alert("User is not admin or not connected to a hospital")
                return
            }
            const hospital = await fetch('/api/hospital?name=' + body.hospitalName, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
            });
            const hospitalJson = await hospital.json()
            if (hospitalJson == null || hospitalJson.error != null) {
                alert("Can't find hospital name in db " + body.hospitalName)
                return
            }
            if (user.admin == null && hospitalJson.id != user.hospitalRole.hospitalId) {
                alert("User does not have permission for hospital " + body.hospitalName)
                return
            }
            body.hospitalId = hospitalJson.id
            console.log(body)
            //const response = await fetch('/api/patients', {
            //    method: 'POST',
            //    headers: {'Content-Type': 'application/json'},
            //    body: JSON.stringify(body)
            //})
            const response = await postData('/api/patients',body,selectedOption)
            //const response = await postData('/api/patients',body,'addData')
            if (response.status !== 200) {
                alert("Something went wrong")
                console.log('something went wrong')
                //set an error banner here
            } else {
                resetForm();
                readDB();
                document.getElementById("demo").innerHTML = "Beneficiary's information submitted. Click on List of Beneficiaries to see the updated list.";
                console.log('form submitted successfully !!!')
                //set a success banner here
                alert("Form submitted success")
                if (reloadOnSuccess) {
                    Router.reload(window.location.pathname)
                }
            }
            //check response, if success is false, dont take them to success page
        } catch (error) {
            console.log('there was an error submitting', error)
        }
    }

    const excelSubmit = async (e) => {
        e.preventDefault()

        // File.
        const input = document.getElementById('excelInput')
        readXlsxFile(input.files[0]).then((rows) => {
            // `rows` is an array of rows
            // each row being an array of cells.
            if (rows.length < 2) {
                alert("The first row must be the data id and the following must be the values length at a min must be 2")
            }
            const jsonMap = []
            const keyMap = []
            for (let i = 0; i < rows[0].length; i++) {
                keyMap.push(rows[0][i])
            }
            console.log("Key map " + keyMap)
            for (let i = 1; i < rows.length; i++) {
                const pojo = {}
                for (let j = 0; j < rows[i].length; j++) {
                    pojo[rows[0][j]] = rows[i][j]
                }
                jsonMap.push(pojo)
            }
            console.log("excel to json object " + JSON.stringify(jsonMap))
            for (let i = 0; i < jsonMap.length; i++) {
                addPatientsToDB(jsonMap[i], false)
            }
        })
    }

    const resetForm = () => {
        setDate();
        setHospitalName();
        setSessionNummber();
        setMRN('');
        setBeneficiaryName('');
        setAge();
        setGender('');
        setPhoneNumber();
        setEducation('');
        setOccupation('');
        setDistricts('');
        setState('');
        setDiagnosis('');
    }

    const {data: session} = useSession();

    const insertUserIfRequired = async (session) => {
        if (session) {
            console.log("user session " + session.user.email)
            return await insertUserIfRequiredByEmail(session.user.email)
        }
    }

    const insertUserIfRequiredByEmail = async (email) => {
        var response = await fetch('/api/user?email=' + email, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        });
        var json = await response.json()
        if (json != null && json.error == null) {
            console.log("User found in db " + JSON.stringify(json))
            return json;
        }
        console.log("User not found adding to db " + email)
        response = await fetch('/api/user', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: email,
            })
        })
        json = await response.json()
        console.log("user " + JSON.stringify(json))
        return json
    }

    const hospitalsApi = async () => {
        const session = await getSession()
        if (!session) {
            alert("Must be logged on to view entries")
            return
        }
        const user = await insertUserIfRequired(session)
        if (user.admin == null) {
            alert("User must be admin to view hospitals")
        } else {
            fetch('/api/hospital')
                .then(response => response.json())
                .then(data => {
                    const responseDiv = document.getElementById('api-hospitals');
                    const hospitals = data.map((hospital, index) => `<li key=${index}>${
                        JSON.stringify(hospital, null, 2)
                            .replaceAll("{", "")
                            .replaceAll("}", "")
                            .replaceAll(",", "")
                    }</li>`);
                    responseDiv.innerHTML = `<ul>${hospitals}</ul>`;
                })
                .catch(error => console.error(error));
        }
    }

    const entriesApi = async () => {
        const session = await getSession()
        if (!session) {
            alert("Must be logged on to view entries")
            return
        }
        const user = await insertUserIfRequired(session)
        if (user.admin != null) {
            fetch('/api/patients')
                .then(response => response.json())
                .then(data => {
                    const responseDiv = document.getElementById('api-entries');
                    const beneficiaries = data.map((beneficiary, index) => `<li key=${index}>${
                        JSON.stringify(beneficiary, null, 2)
                            .replaceAll("{", "")
                            .replaceAll("}", "")
                            .replaceAll(",", "")
                    }</li>`);
                    responseDiv.innerHTML = `<ul>${beneficiaries}</ul>`;
                })
                .catch(error => console.error(error));
        } else if (user.hospitalRole != null && user.hospitalRole.admin == true) {
            fetch('/api/patients?hospitalId=' + user.hospitalRole.hospitalId)
                .then(response => response.json())
                .then(data => {
                    const responseDiv = document.getElementById('api-entries');
                    const beneficiaries = data.map((beneficiary, index) => `<li key=${index}>${
                        JSON.stringify(beneficiary, null, 2)
                            .replaceAll("{", "")
                            .replaceAll("}", "")
                            .replaceAll(",", "")
                    }</li>`);
                    responseDiv.innerHTML = `<ul>${beneficiaries}</ul>`;
                })
                .catch(error => console.error(error));
        } else if (user.hospitalRole != null) {
            alert("User is not a hospital admin")
        } else {
            alert("User is not part of a hospital or admin")
        }
    }

    const runApi = async () => {
        const session = await getSession()
        if (!session) {
            alert("Must be logged on to view entries")
            return
        }
        const user = await insertUserIfRequired(session)
        if (user.admin != null) {
            fetch('/api/patients')
                .then(response => response.json())
                .then(data => {
                    const responseDiv = document.getElementById('api-response');
                    const beneficiaries = data.map((beneficiary, index) => `<li key=${index}>${beneficiary.beneficiaryName}</li>`);
                    responseDiv.innerHTML = `<ul>${beneficiaries.join('')}</ul>`;
                })
                .catch(error => console.error(error));
        } else if (user.hospitalRole != null && user.hospitalRole.admin == true) {
            fetch('/api/patients?hospitalId=' + user.hospitalRole.hospitalId)
                .then(response => response.json())
                .then(data => {
                    const responseDiv = document.getElementById('api-response');
                    const beneficiaries = data.map((beneficiary, index) => `<li key=${index}>${beneficiary.beneficiaryName}</li>`);
                    responseDiv.innerHTML = `<ul>${beneficiaries.join('')}</ul>`;
                })
                .catch(error => console.error(error));
        } else if (user.hospitalRole != null) {
            alert("User is not a hospital admin")
        } else {
            alert("User is not part of a hospital or admin")
        }
    }

    const userToHospital = async (e) => {
        e.preventDefault()
        const userEmail = document.getElementById('userToHospitalEmail').value
        const hospitalName = document.getElementById('userToHospitalHospitalName').value
        const admin = document.getElementById('userToHospitalAdmin').checked
        console.log("user email " + userEmail + " hospital name " + hospitalName)
        const session = await getSession()
        if (!session) {
            alert("Must be logged on to add user to hospital")
            return
        }
        var user = await insertUserIfRequired(session)
        if (user == null) {
            alert("User not found in db")
            return
        }
        if (user.admin == null && user.hospitalRole == null) {
            alert("User is not admin not connected to a hospital")
            return
        }
        const hospital = await fetch('/api/hospital?name=' + hospitalName, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        });
        const hospitalJson = await hospital.json()
        if (hospitalJson == null || hospitalJson.error != null) {
            alert("Can't find hospital name in db " + hospitalName)
            return
        }
        if (user.admin == null && hospitalJson.id != user.hospitalRole.hospitalId) {
            alert("User does not have permission for hospital " + hospitalName)
            return
        }
        if (user.admin == null && user.hospitalRole.admin != true) {
            alert("User is not an admin for hospital or in general " + hospitalName)
            return
        }
        user = await insertUserIfRequiredByEmail(userEmail)
        const body = {
            userId: user.id,
            hospitalId: hospitalJson.id,
            admin: admin
        }
        const response = await fetch('/api/hospitalRole', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        })
        if (response.status !== 200) {
            alert("Something went wrong")
            console.log('something went wrong')
            //set an error banner here
        } else {
            console.log('form submitted successfully !!!')
            //set a success banner here
            alert("Form submitted success")
            Router.reload(window.location.pathname)
        }
    }

    const addHospital = async (e) => {
        e.preventDefault()
        const hospitalName = document.getElementById('addHospitalName').value
        const session = await getSession()
        if (!session) {
            alert("Must be logged on to add user to hospital")
            return
        }
        var user = await insertUserIfRequired(session)
        if (user == null) {
            alert("User not found in db")
            return
        }
        if (user.admin == null) {
            alert("User is not admin")
            return
        }
        const body = {
            name: hospitalName,
        }
        const response = await fetch('/api/hospital', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        })
        if (response.status !== 200) {
            alert("Something went wrong")
            console.log('something went wrong')
            //set an error banner here
        } else {
            console.log('form submitted successfully !!!')
            //set a success banner here
            alert("Form submitted success")
            Router.reload()
        }
    }

    return insertUserIfRequired(session) && (
        <div className="isolate bg-white py-24 px-6 sm:py-32 lg:px-8">
            
            <Head>
                <title>Vision Aid P11</title>
                <link rel="manifest" href="/manifest.json" />
                <meta name="description" content="Vision Aid P11"/>
                <meta name="theme-color" content="#317EFB"/>
            </Head>
         
            {!session ? (
                <div>
                    <p>Not signed in</p>
                    <br/>
                    <button onClick={() => signIn()}>Sign in</button>
                </div>
            ) : (
                <div>
                    <h4>Signed in as {session.user.email}</h4>
                    <button onClick={() => signOut()}>Sign out</button>
                </div>
            )}
            <br/>
            <Image
                src="/images/vision-aid-logo.jpg"
                height={144}
                width={144}
                alt=""
            />
            <div className={styles.description}>
                <p className={styles.description}>Vision Aid Partner Tracking
                    System</p>
                <p className="mt-2 text-lg leading-8 text-gray-600">
                    This form is for submitting the personal information of a beneficiary
                </p>
            </div>
            <form action="#" method="POST" onSubmit={(e) => handleSubmit(e, selectedOption)}
                  className={styles.description}>
                <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2">
                    <div>
                        <label htmlFor="option-select" className="block text-sm font-semibold leading-6 text-gray-900">
                            Select the desired subcategory
                        </label>
                        <div className="mt-2.5">
                            <select
                            id="option-select"
                            name="option-select"
                            onChange={(e) => setSelectedOption(e.target.value)}
                            className="border-gray-400 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 focus:ring-opacity-50">
                            <option value="">Subcategory</option>
                            <option value="computer-training">Computer Training</option>
                            <option value="mobile-training">Mobile Training</option>
                            <option value="orientation-mobility-training">Orientation Mobility Training</option>
                            <option value="vision-enhancement">Vision Enhancement</option>
                            <option value="counselling-education">Counselling & Education</option>
                            <option value="camps">Camps</option>
                            <option value="school-screenings">School Screenings</option>
                            </select>
                        </div>
                        {selectedOption === 'computer-training' && (
                            <>
                            <div>
                                <label htmlFor="date" className="block text-sm font-semibold leading-6 text-gray-900">
                                Date
                                </label>
                                <div className="mt-2.5">
                                <input
                                    onChange={(e) => setDate(moment(new Date(e.target.value)))}
                                    type="date"
                                    name="date"
                                    id="date"
                                    autoComplete=""
                                    className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                    required
                                />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="hospital-name" className="block text-sm font-semibold leading-6 text-gray-900">
                                Hospital Name
                                </label>
                                <div className="mt-2.5">
                                <input
                                    onChange={(e) => setHospitalName(e.target.value)}
                                    type="text"
                                    name="hospital-name"
                                    id="hospital-name"
                                    autoComplete="hospital-name"
                                    className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                    required
                                />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="session-number" className="block text-sm font-semibold leading-6 text-gray-900">
                                Number of Session
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setSessionNummber(parseInt(e.target.value))}
                                        type="number"
                                        name="session-number"
                                        id="session-number"
                                        autoComplete="given-name"
                                        className=""
                                        required/>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="mrn" className="block text-sm font-semibold leading-6 text-gray-900">
                                    MRN
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setMRN(e.target.value)}
                                        type="text"
                                        name="mrn"
                                        id="mrn"
                                        autoComplete="given-name"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="patients-name" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Name of the Beneficiary
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setBeneficiaryName(e.target.value)}
                                        type="text"
                                        name="patients-name"
                                        id="patients-name"
                                        autoComplete="given-name"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="age" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Age
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setAge(parseInt(e.target.value))}
                                        type="number"
                                        name="age"
                                        id="age"
                                        autoComplete="family-name"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="gender" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Gender
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setGender(e.target.value)}
                                        type="text"
                                        name="gender"
                                        id="gender"
                                        autoComplete="organization"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="phone-number" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Phone Number
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        type="text"
                                        name="phone-number"
                                        id="phone-number"
                                        autoComplete="organization"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="education" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Education
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setEducation(e.target.value)}
                                        type="education"
                                        name="education"
                                        id="education"
                                        autoComplete="education"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="occupation" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Occupation
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setOccupation(e.target.value)}
                                        type="text"
                                        name="occupation"
                                        id="occupation"
                                        autoComplete="education"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="districts" className="block text-sm font-semibold leading-6 text-gray-900">
                                    District
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setDistricts(e.target.value)}
                                        type="text"
                                        name="districts"
                                        id="districts"
                                        autoComplete="education"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="state" className="block text-sm font-semibold leading-6 text-gray-900">
                                    State
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setState(e.target.value)}
                                        type="text"
                                        name="state"
                                        id="state"
                                        autoComplete="education"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="diagnosis" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Diagnosis
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setDiagnosis(e.target.value)}
                                        type="text"
                                        name="diagnosis"
                                        id="diagnosis"
                                        autoComplete="education"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            </>
                        )}
                        {selectedOption === 'mobile-training' && (
                            <>
                            <div>
                                <label htmlFor="date" className="block text-sm font-semibold leading-6 text-gray-900">
                                Date
                                </label>
                                <div className="mt-2.5">
                                <input
                                    onChange={(e) => setDate(moment(new Date(e.target.value)))}
                                    type="date"
                                    name="date"
                                    id="date"
                                    autoComplete=""
                                    className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                    required
                                />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="hospital-name" className="block text-sm font-semibold leading-6 text-gray-900">
                                Hospital Name
                                </label>
                                <div className="mt-2.5">
                                <input
                                    onChange={(e) => setHospitalName(e.target.value)}
                                    type="text"
                                    name="hospital-name"
                                    id="hospital-name"
                                    autoComplete="hospital-name"
                                    className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                    required
                                />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="session-number" className="block text-sm font-semibold leading-6 text-gray-900">
                                Number of Session
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setSessionNummber(parseInt(e.target.value))}
                                        type="number"
                                        name="session-number"
                                        id="session-number"
                                        autoComplete="given-name"
                                        className=""
                                        required/>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="patients-name" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Name of the Beneficiary
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setBeneficiaryName(e.target.value)}
                                        type="text"
                                        name="patients-name"
                                        id="patients-name"
                                        autoComplete="given-name"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="age" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Age
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setAge(parseInt(e.target.value))}
                                        type="number"
                                        name="age"
                                        id="age"
                                        autoComplete="family-name"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="gender" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Gender
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setGender(e.target.value)}
                                        type="text"
                                        name="gender"
                                        id="gender"
                                        autoComplete="organization"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="phone-number" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Phone Number
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        type="text"
                                        name="phone-number"
                                        id="phone-number"
                                        autoComplete="organization"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="education" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Education
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setEducation(e.target.value)}
                                        type="education"
                                        name="education"
                                        id="education"
                                        autoComplete="education"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="occupation" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Occupation
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setOccupation(e.target.value)}
                                        type="text"
                                        name="occupation"
                                        id="occupation"
                                        autoComplete="education"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="districts" className="block text-sm font-semibold leading-6 text-gray-900">
                                    District
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setDistricts(e.target.value)}
                                        type="text"
                                        name="districts"
                                        id="districts"
                                        autoComplete="education"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="state" className="block text-sm font-semibold leading-6 text-gray-900">
                                    State
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setState(e.target.value)}
                                        type="text"
                                        name="state"
                                        id="state"
                                        autoComplete="education"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="diagnosis" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Vision
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setVision(e.target.value)}
                                        type="text"
                                        name="vision"
                                        id="vision"
                                        autoComplete="vision"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            </>
                        )}
                        {selectedOption === 'orientation-mobility-training' && (
                            <>
                            <div>
                                <label htmlFor="date" className="block text-sm font-semibold leading-6 text-gray-900">
                                Date
                                </label>
                                <div className="mt-2.5">
                                <input
                                    onChange={(e) => setDate(moment(new Date(e.target.value)))}
                                    type="date"
                                    name="date"
                                    id="date"
                                    autoComplete=""
                                    className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                    required
                                />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="hospital-name" className="block text-sm font-semibold leading-6 text-gray-900">
                                Hospital Name
                                </label>
                                <div className="mt-2.5">
                                <input
                                    onChange={(e) => setHospitalName(e.target.value)}
                                    type="text"
                                    name="hospital-name"
                                    id="hospital-name"
                                    autoComplete="hospital-name"
                                    className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                    required
                                />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="session-number" className="block text-sm font-semibold leading-6 text-gray-900">
                                Number of Session
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setSessionNummber(parseInt(e.target.value))}
                                        type="number"
                                        name="session-number"
                                        id="session-number"
                                        autoComplete="given-name"
                                        className=""
                                        required/>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="mrn" className="block text-sm font-semibold leading-6 text-gray-900">
                                    MRN
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setMRN(e.target.value)}
                                        type="text"
                                        name="mrn"
                                        id="mrn"
                                        autoComplete="given-name"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="patients-name" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Name of the Beneficiary
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setBeneficiaryName(e.target.value)}
                                        type="text"
                                        name="patients-name"
                                        id="patients-name"
                                        autoComplete="given-name"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="age" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Age
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setAge(parseInt(e.target.value))}
                                        type="number"
                                        name="age"
                                        id="age"
                                        autoComplete="family-name"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="gender" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Gender
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setGender(e.target.value)}
                                        type="text"
                                        name="gender"
                                        id="gender"
                                        autoComplete="organization"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="phone-number" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Phone Number
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        type="text"
                                        name="phone-number"
                                        id="phone-number"
                                        autoComplete="organization"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="education" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Education
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setEducation(e.target.value)}
                                        type="education"
                                        name="education"
                                        id="education"
                                        autoComplete="education"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="occupation" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Occupation
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setOccupation(e.target.value)}
                                        type="text"
                                        name="occupation"
                                        id="occupation"
                                        autoComplete="education"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="districts" className="block text-sm font-semibold leading-6 text-gray-900">
                                    District
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setDistricts(e.target.value)}
                                        type="text"
                                        name="districts"
                                        id="districts"
                                        autoComplete="education"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="state" className="block text-sm font-semibold leading-6 text-gray-900">
                                    State
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setState(e.target.value)}
                                        type="text"
                                        name="state"
                                        id="state"
                                        autoComplete="education"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="diagnosis" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Diagnosis
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setDiagnosis(e.target.value)}
                                        type="text"
                                        name="diagnosis"
                                        id="diagnosis"
                                        autoComplete="education"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            </>
                        )}
                        {selectedOption === 'vision-enhancement' && (
                            <>
                            <div>
                                <label htmlFor="date" className="block text-sm font-semibold leading-6 text-gray-900">
                                Date
                                </label>
                                <div className="mt-2.5">
                                <input
                                    onChange={(e) => setDate(moment(new Date(e.target.value)))}
                                    type="date"
                                    name="date"
                                    id="date"
                                    autoComplete=""
                                    className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                    required
                                />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="hospital-name" className="block text-sm font-semibold leading-6 text-gray-900">
                                Hospital Name
                                </label>
                                <div className="mt-2.5">
                                <input
                                    onChange={(e) => setHospitalName(e.target.value)}
                                    type="text"
                                    name="hospital-name"
                                    id="hospital-name"
                                    autoComplete="hospital-name"
                                    className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                    required
                                />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="session-number" className="block text-sm font-semibold leading-6 text-gray-900">
                                Number of Session
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setSessionNummber(parseInt(e.target.value))}
                                        type="number"
                                        name="session-number"
                                        id="session-number"
                                        autoComplete="given-name"
                                        className=""
                                        required/>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="mrn" className="block text-sm font-semibold leading-6 text-gray-900">
                                    MRN
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setMRN(e.target.value)}
                                        type="text"
                                        name="mrn"
                                        id="mrn"
                                        autoComplete="given-name"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="patients-name" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Name of the Beneficiary
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setBeneficiaryName(e.target.value)}
                                        type="text"
                                        name="patients-name"
                                        id="patients-name"
                                        autoComplete="given-name"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="age" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Age
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setAge(parseInt(e.target.value))}
                                        type="number"
                                        name="age"
                                        id="age"
                                        autoComplete="family-name"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="gender" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Gender
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setGender(e.target.value)}
                                        type="text"
                                        name="gender"
                                        id="gender"
                                        autoComplete="organization"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="phone-number" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Phone Number
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        type="text"
                                        name="phone-number"
                                        id="phone-number"
                                        autoComplete="organization"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="districts" className="block text-sm font-semibold leading-6 text-gray-900">
                                    District
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setDistricts(e.target.value)}
                                        type="text"
                                        name="districts"
                                        id="districts"
                                        autoComplete="education"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="diagnosis" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Diagnosis
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setDiagnosis(e.target.value)}
                                        type="text"
                                        name="diagnosis"
                                        id="diagnosis"
                                        autoComplete="education"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="mdvi" className="block text-sm font-semibold leading-6 text-gray-900">
                                    MDVI
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setMDVI(e.target.value)}
                                        type="text"
                                        name="mdvi"
                                        id="mdvi"
                                        autoComplete="mdvi"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            </>
                        )}
                        {selectedOption === 'counselling-education' && (
                            <>
                            <div>
                                <label htmlFor="date" className="block text-sm font-semibold leading-6 text-gray-900">
                                Date
                                </label>
                                <div className="mt-2.5">
                                <input
                                    onChange={(e) => setDate(moment(new Date(e.target.value)))}
                                    type="date"
                                    name="date"
                                    id="date"
                                    autoComplete=""
                                    className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                    required
                                />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="hospital-name" className="block text-sm font-semibold leading-6 text-gray-900">
                                Hospital Name
                                </label>
                                <div className="mt-2.5">
                                <input
                                    onChange={(e) => setHospitalName(e.target.value)}
                                    type="text"
                                    name="hospital-name"
                                    id="hospital-name"
                                    autoComplete="hospital-name"
                                    className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                    required
                                />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="session-number" className="block text-sm font-semibold leading-6 text-gray-900">
                                Number of Session
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setSessionNummber(parseInt(e.target.value))}
                                        type="number"
                                        name="session-number"
                                        id="session-number"
                                        autoComplete="given-name"
                                        className=""
                                        required/>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="mrn" className="block text-sm font-semibold leading-6 text-gray-900">
                                    MRN
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setMRN(e.target.value)}
                                        type="text"
                                        name="mrn"
                                        id="mrn"
                                        autoComplete="given-name"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="patients-name" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Name of the Beneficiary
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setBeneficiaryName(e.target.value)}
                                        type="text"
                                        name="patients-name"
                                        id="patients-name"
                                        autoComplete="given-name"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="age" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Age
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setAge(parseInt(e.target.value))}
                                        type="number"
                                        name="age"
                                        id="age"
                                        autoComplete="family-name"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="gender" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Gender
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setGender(e.target.value)}
                                        type="text"
                                        name="gender"
                                        id="gender"
                                        autoComplete="organization"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="phone-number" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Phone Number
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        type="text"
                                        name="phone-number"
                                        id="phone-number"
                                        autoComplete="organization"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="districts" className="block text-sm font-semibold leading-6 text-gray-900">
                                    District
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setDistricts(e.target.value)}
                                        type="text"
                                        name="districts"
                                        id="districts"
                                        autoComplete="education"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="diagnosis" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Diagnosis
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setDiagnosis(e.target.value)}
                                        type="text"
                                        name="diagnosis"
                                        id="diagnosis"
                                        autoComplete="education"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="typecounselling" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Type of Counselling
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => settypeCounselling(e.target.value)}
                                        type="text"
                                        name="typecounselling"
                                        id="typecounselling"
                                        autoComplete="typecounselling"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            </>
                        )}
                        {selectedOption === 'camps' && (
                            <>
                            <div>
                                <label htmlFor="date" className="block text-sm font-semibold leading-6 text-gray-900">
                                Date
                                </label>
                                <div className="mt-2.5">
                                <input
                                    onChange={(e) => setDate(moment(new Date(e.target.value)))}
                                    type="date"
                                    name="date"
                                    id="date"
                                    autoComplete=""
                                    className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                    required
                                />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="hospital-name" className="block text-sm font-semibold leading-6 text-gray-900">
                                Hospital Name
                                </label>
                                <div className="mt-2.5">
                                <input
                                    onChange={(e) => setHospitalName(e.target.value)}
                                    type="text"
                                    name="hospital-name"
                                    id="hospital-name"
                                    autoComplete="hospital-name"
                                    className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                    required
                                />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="school-name" className="block text-sm font-semibold leading-6 text-gray-900">
                                School Name
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setschoolName(e.target.value)}
                                        type="text"
                                        name="school-name"
                                        id="school-name"
                                        autoComplete="school-name"
                                        className=""
                                        required/>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="student-name" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Student Name
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setstudentName(e.target.value)}
                                        type="text"
                                        name="student-name"
                                        id="student-name"
                                        autoComplete="student-name"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="age" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Age
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setAge(parseInt(e.target.value))}
                                        type="number"
                                        name="age"
                                        id="age"
                                        autoComplete="family-name"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="gender" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Gender
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setGender(e.target.value)}
                                        type="text"
                                        name="gender"
                                        id="gender"
                                        autoComplete="organization"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="diagnosis" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Diagnosis
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setDiagnosis(e.target.value)}
                                        type="text"
                                        name="diagnosis"
                                        id="diagnosis"
                                        autoComplete="education"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="visual-acuity-re" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Visual Acuity RE
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setvisualAcuityRE(e.target.value)}
                                        type="text"
                                        name="visual-acuity-re"
                                        id="visual-acuity-re"
                                        autoComplete="visual-acuity-re"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="visual-acuity-le" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Visual Acuity LE
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setvisualAcuityLE(e.target.value)}
                                        type="text"
                                        name="visual-acuity-le"
                                        id="visual-acuity-le"
                                        autoComplete="visual-acuity-le"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="unaided-near-vision" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Unaided Near Vision
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setunaidedNearVision(e.target.value)}
                                        type="text"
                                        name="unaided-near-vision"
                                        id="unaided-near-vision"
                                        autoComplete="unaided-near-vision"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="refraction-va-le" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Refraction VA LE
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setrefractionVALE(e.target.value)}
                                        type="text"
                                        name="refraction-va-le"
                                        id="refraction-va-le"
                                        autoComplete="refraction-va-le"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="lva" className="block text-sm font-semibold leading-6 text-gray-900">
                                    LVA
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setLVA(e.target.value)}
                                        type="text"
                                        name="lva"
                                        id="lva"
                                        autoComplete="lva"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="lva-near" className="block text-sm font-semibold leading-6 text-gray-900">
                                    LVA Near
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setLVANear(e.target.value)}
                                        type="text"
                                        name="lva-near"
                                        id="lva-near"
                                        autoComplete="lva-near"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="non-optical-aid" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Non Optical Aid
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setnonOpticalAid(e.target.value)}
                                        type="text"
                                        name="non-optical-aid"
                                        id="non-optical-aid"
                                        autoComplete="non-optical-aid"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="action-needed" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Action Needed
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setactionNeeded(e.target.value)}
                                        type="text"
                                        name="action-needed"
                                        id="action-needed"
                                        autoComplete="action-needed"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            </>
                        )}
                        {selectedOption === 'school-screenings' && (
                            <>
                            <div>
                                <label htmlFor="date" className="block text-sm font-semibold leading-6 text-gray-900">
                                Date
                                </label>
                                <div className="mt-2.5">
                                <input
                                    onChange={(e) => setDate(moment(new Date(e.target.value)))}
                                    type="date"
                                    name="date"
                                    id="date"
                                    autoComplete=""
                                    className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                    required
                                />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="hospital-name" className="block text-sm font-semibold leading-6 text-gray-900">
                                Hospital Name
                                </label>
                                <div className="mt-2.5">
                                <input
                                    onChange={(e) => setHospitalName(e.target.value)}
                                    type="text"
                                    name="hospital-name"
                                    id="hospital-name"
                                    autoComplete="hospital-name"
                                    className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                    required
                                />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="type-camp" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Type of Camp
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => settypeCamp(e.target.value)}
                                        type="text"
                                        name="type-camp"
                                        id="type-camp"
                                        autoComplete="type-camp"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="screening-place" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Screening Place
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setscreeningPlace(e.target.value)}
                                        type="text"
                                        name="screening-place"
                                        id="screening-place"
                                        autoComplete="screening-place"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="organiser" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Organiser
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setorganiser(e.target.value)}
                                        type="text"
                                        name="organiser"
                                        id="organiser"
                                        autoComplete="organiser"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="phone-number" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Contact Number
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setcontactNumber(parseInt(e.target.value))}
                                        type="text"
                                        name="phone-number"
                                        id="phone-number"
                                        autoComplete="organization"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="address" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Address
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setaddress(e.target.value)}
                                        type="text"
                                        name="address"
                                        id="address"
                                        autoComplete="address"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="screened-total" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Screened Total
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setscreenedTotal(parseInt(e.target.value))}
                                        type="number"
                                        name="screened-total"
                                        id="screened-total"
                                        autoComplete="screened-total"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="refractive-errors" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Refractive Errors
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setrefractiveErrors(parseInt(e.target.value))}
                                        type="number"
                                        name="refractive-errors"
                                        id="refractive-errors"
                                        autoComplete="refractive-errors"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="spectacles-distributed" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Spectacles Distributed
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setspectaclesDistributed(parseInt(e.target.value))}
                                        type="number"
                                        name="spectacles-distributed"
                                        id="spectacles-distributed"
                                        autoComplete="spectacles-distributed"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="checked" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Checked
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setchecked(e.target.value)}
                                        type="text"
                                        name="checked"
                                        id="checked"
                                        autoComplete="checked"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="refer" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Refer
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setrefer(parseInt(e.target.value))}
                                        type="number"
                                        name="refer"
                                        id="refer"
                                        autoComplete="refer"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="staff" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Staff
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setstaff(parseInt(e.target.value))}
                                        type="number"
                                        name="staff"
                                        id="staff"
                                        autoComplete="staff"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="low-vision" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Low Vision
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        onChange={(e) => setlowVision(parseInt(e.target.value))}
                                        type="number"
                                        name="low-vision"
                                        id="low-vision"
                                        autoComplete="low-vision"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        required/>
                                </div>
                            </div>
                            </>
                        )}
                    </div>
                </div>
                <div className="mt-10">
                    <p id="demo"></p>
                    <button
                        type="submit"
                        className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={() => myFunction()}
                    >
                        Submit
                    </button>
                </div>
            </form>
            <br/>
            <div className="mx-auto max-w-2xl text-center">
                <p className="mt-2 text-lg leading-8 text-gray-600">This form is for submitting the personal information of a beneficiary in excel format</p>
                <p className="mt-2 text-lg leading-8 text-gray-600">Sample excel format</p>
                <table className="center">
                    <tbody>
                    <tr>
                        <th>date</th>
                        <th>hospitalName</th>
                        <th>sessionNumber</th>
                        <th>mrn</th>
                        <th>beneficiaryName</th>
                        <th>age</th>
                        <th>gender</th>
                        <th>phoneNumber</th>
                        <th>Education</th>
                        <th>Occupation</th>
                        <th>Districts</th>
                        <th>State</th>
                        <th>Diagnosis</th>
                    </tr>
                    <tr>
                        <td>03/05/23</td>
                        <td>SethHospital</td>
                        <td>1</td>
                        <td>SomeMRN</td>
                        <td>SomeBeneficiaryName</td>
                        <td>25</td>
                        <td>m</td>
                        <td>123-456-7890</td>
                        <td>MS</td>
                        <td>SDE</td>
                        <td>Broward</td>
                        <td>FL</td>
                        <td>GlassesRequired</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <form action="#" method="POST" onSubmit={(e) => excelSubmit(e)} className="mx-auto mt-16 max-w-xl sm:mt-20">
                <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2">
                    <div>
                        <label htmlFor="excel" className="block text-sm font-semibold leading-6 text-gray-900">
                            Excel Import
                        </label>
                        <div className="mt-2.5">
                            <input
                                id="excelInput"
                                accept=".xlsx"
                                type="file"
                                required/>
                        </div>
                    </div>
                </div>
                <div className="mt-10">
                    <p id="demoExcel"></p>
                    <button
                        type="submit"
                        className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Submit
                    </button>
                </div>
            </form>
            <form action="#" method="POST" onSubmit={(e) => userToHospital(e)} className="mx-auto mt-16 max-w-xl sm:mt-20">
                <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2">
                    <div>
                        <p>Add User To Hospital</p>
                        <label htmlFor="userEmail" className="block text-sm font-semibold leading-6 text-gray-900">
                            User Email
                        </label>
                        <div className="mt-2.5">
                            <input
                                type="text"
                                name="userEmail"
                                id="userToHospitalEmail"
                                required/>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2">
                    <div>
                        <label htmlFor="hospitalName" className="block text-sm font-semibold leading-6 text-gray-900">
                            Hospital Name
                        </label>
                        <div className="mt-2.5">
                            <input
                                type="text"
                                name="hospitalName"
                                id="userToHospitalHospitalName"
                                required/>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2">
                    <div>
                        <div className="mt-2.5">
                            <input type="checkbox" name="admin" value="admin" id="userToHospitalAdmin"/>
                                <label htmlFor="admin"> Admin</label>
                        </div>
                    </div>
                </div>
                <div className="mt-10">
                    <button
                        type="submit"
                        className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Submit
                    </button>
                </div>
            </form>
            <form action="#" method="POST" onSubmit={(e) => addHospital(e)} className="mx-auto mt-16 max-w-xl sm:mt-20">
                <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2">
                    <div>
                        <p>Add New Hospital</p>
                        <label htmlFor="userEmail" className="block text-sm font-semibold leading-6 text-gray-900">
                            Hospital Name
                        </label>
                        <div className="mt-2.5">
                            <input
                                type="text"
                                name="hospitalName"
                                id="addHospitalName"
                                required/>
                        </div>
                    </div>
                </div>
                <div className="mt-10">
                    <button
                        type="submit"
                        className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Submit
                    </button>
                </div>
            </form>
            <br/>
            <button onClick={() => runApi()}>List of Beneficiaries</button>
            <br/>
            <div className="api-response" id="api-response"></div>
            <br/>
            <button onClick={() => entriesApi()}>List Of Entries</button>
            <br/>
            <div className="api-entries" id="api-entries"></div>
            <br/>
            <button onClick={() => hospitalsApi()}>List Of Hospitals</button>
            <br/>
            <div className="api-hospitals" id="api-hospitals"></div>
        </div>
    )
}

//<button onClick={() => runApi()} >List of Beneficiaries</button>
//<div class="api-response" id="api-response"></div>
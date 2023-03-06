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
import {useEffect} from 'react'
import {ChevronDownIcon} from '@heroicons/react/20/solid'
import {Switch} from '@headlessui/react'
import Image from 'next/image';
import {useSession, signIn, signOut, getSession} from "next-auth/react";
import moment from 'moment';
import Router from 'next/router'
import readXlsxFile from 'read-excel-file'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

//function myFunction() {
//  document.getElementById("demo").innerHTML = "Beneficiary's information submitted"
//}

function myFunction() {
    const inputs = document.querySelectorAll('input[type=text], input[type=tel], input[type=number], input[type=email], select');
    for (let i = 0; i < inputs.length; i++) {
        if (!inputs[i].value) {
            alert("Please fill out all the fields.");
            return;
        }
    }
}

export default function Example() {
    const [agreed, setAgreed] = useState(false)
    const [date, setDate] = useState();
    const [hospitalName, setHospitalName] = useState();
    const [sessionNumber, setSessionNummber] = useState();
    const [mrn, setMRN] = useState("");
    const [beneficiaryName, setBeneficiaryName] = useState("");
    const [age, setAge] = useState();
    const [gender, setGender] = useState("");
    const [phoneNumber, setPhoneNumber] = useState();
    const [Education, setEducation] = useState("");
    const [Occupation, setOccupation] = useState("");
    const [Districts, setDistricts] = useState("");
    const [State, setState] = useState("");
    const [Diagnosis, setDiagnosis] = useState("");
    const [APIResponse, setAPIResponse] = useState(null);


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

    const handleSubmit = async (e) => {
        e.preventDefault()

        const body = {
            date,
            hospitalName,
            sessionNumber,
            mrn,
            beneficiaryName,
            age,
            gender,
            phoneNumber,
            Education,
            Occupation,
            Districts,
            State,
            Diagnosis
        }
        await addPatientsToDB(body, true)
    }

    const addPatientsToDB = async (body, reloadOnSuccess) => {
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
            if (user.admin == null && body.hospitalName != user.hospitalRole.hospital.hospitalName) {
                alert("User does not have permission for hospital " + body.hospitalName)
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
            body.hospitalId = hospitalJson.id
            console.log(body)
            const response = await fetch('/api/patients', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body)
            })
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
        if (user.admin == null && hospitalName != user.hospitalRole.hospital.hospitalName) {
            alert("User does not have permission for hospital " + hospitalName)
            return
        }
        if (user.admin == null && user.hospitalRole.admin != true) {
            alert("User is not an admin for hospital or in general " + hospitalName)
            return
        }
        user = await insertUserIfRequiredByEmail(userEmail)
        const hospital = await fetch('/api/hospital?name=' + hospitalName, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        });
        const hospitalJson = await hospital.json()
        if (hospitalJson == null || hospitalJson.error != null) {
            alert("Can't find hospital name in db " + hospitalName)
            return
        }
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

    return insertUserIfRequired(session) && (
        <div className="isolate bg-white py-24 px-6 sm:py-32 lg:px-8">
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
            <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Vision Aid Partner Tracking
                    System</h2>
                <p className="mt-2 text-lg leading-8 text-gray-600">
                    This form is for submitting the personal information of a beneficiary
                </p>
            </div>
            <form action="#" method="POST" onSubmit={(e) => handleSubmit(e)}
                  className="mx-auto mt-16 max-w-xl sm:mt-20">
                <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2">
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
                                className=""
                                required/>
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
                                className=""
                                required/>
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
                                onChange={(e) => setPhoneNumber(parseInt(e.target.value))}
                                type="number"
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
                <p className="mt-2 text-lg leading-8 text-gray-600">
                    This form is for submitting the personal information of a beneficiary in excel format
                </p>
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
            <br/>
            <button onClick={() => runApi()}>List of Beneficiaries</button>
            <br/>
            <div className="api-response" id="api-response"></div>
            <br/>
            <button onClick={() => entriesApi()}>List Of Entries</button>
            <br/>
            <div className="api-entries" id="api-entries"></div>
        </div>
    )
}

//<button onClick={() => runApi()} >List of Beneficiaries</button>
//<div class="api-response" id="api-response"></div>
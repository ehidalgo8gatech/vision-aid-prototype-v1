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
import { useState } from 'react'
import { useEffect } from 'react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Switch } from '@headlessui/react'
import Image from 'next/image';
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import moment from 'moment';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function myFunction() {
  document.getElementById("demo").innerHTML = "Patient's information submitted"
}

export default function Example() {
  const [agreed, setAgreed] = useState(false)
  const [date, setDate] = useState();
  const [hospitalId, setHospitalId] = useState();
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

  const readDB = async() => {
    try {
      const response = await fetch('/api/patients', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
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
    const body = { date, hospitalId, sessionNumber, mrn, beneficiaryName, age, gender, phoneNumber, Education, Occupation, Districts, State, Diagnosis }
    try {
     const session = await getSession()
     if (!session) {
       alert("You need to be logged in to enter data")
       return
     }
     // @TODO uncomment when insert user fix is in
     // const user = await insertUserIfRequired(session)
     // if (user.role.dataEntry != true) {
     //   alert("You do not have the dataEntry permission turned to true")
     //   return
     // }
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      if (response.status !== 200) {
        console.log('something went wrong')
        //set an error banner here
      } else {
        resetForm();
        readDB();
        console.log('form submitted successfully !!!')
        //set a success banner here
      }
      //check response, if success is false, dont take them to success page
    } catch (error) {
      console.log('there was an error submitting', error)
    }
  }
  
  const resetForm = () => {
    setDate();
    setHospitalId();
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

const { data: session } = useSession();

  const insertUserIfRequired = async (session) => {
    if (session) {
      console.log("user session " + session.user.email)
      var response = await fetch('/api/user?email='+session.user.email, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      var json = await response.json()
      if (json != null && json.error == null) {
        console.log("User found in db " + JSON.stringify(json))
        return json;
      }
      console.log("User not found adding to db " + json)
      // @TODO allow the admin to change other users roles
      // @TODO allow partner to insert patient information
      // @TODO allow viewer to view patient information and reports
      response = await fetch('/api/user', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: session.user.email,
                dataEntry: false,
                admin: false,
                manager: false
              })
       })
       json = await response.json()
       console.log("user " + JSON.stringify(json))
       return json
    }
  }

  return insertUserIfRequired(session) &&  (
    <div className="isolate bg-white py-24 px-6 sm:py-32 lg:px-8">
    {!session ? (
            <div>
              <p>Not signed in</p>
              <br />
              <button onClick={() => signIn()}>Sign in</button>
            </div>
          ) : (
              <div>
                <h4>Signed in as {session.user.email}</h4>
                <button onClick={() => signOut()}>Sign out</button>
              </div>
          )}
      <Image
        src="/images/vision-aid-logo.jpg"
        height={144}
        width={144}
        alt=""
      />
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Vision Aid Partner Tracking System</h2>
        <p className="mt-2 text-lg leading-8 text-gray-600">
          This form is for submitting the personal information of a patient
        </p>
      </div>
      <form action="#" method="POST" onSubmit={(e) => handleSubmit(e)} className="mx-auto mt-16 max-w-xl sm:mt-20">
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
              />
            </div>
          </div>
          <div>
            <label htmlFor="hospital-id" className="block text-sm font-semibold leading-6 text-gray-900">
              Hospital ID
            </label>
            <div className="mt-2.5">
              <input
                onChange={(e) => setHospitalId(parseInt(e.target.value))}
                type="number"
                name="hospital-id"
                id="hospital-id"
                autoComplete="hospital-id"
                className=""
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
              />
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
              />
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
              />
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
              />
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
              />
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
              />
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
              />
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
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="districts" className="block text-sm font-semibold leading-6 text-gray-900">
              Districts
            </label>
            <div className="mt-2.5">
              <input
                onChange={(e) => setDistricts(e.target.value)}
                type="text"
                name="districts"
                id="districts"
                autoComplete="education"
                className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
              />
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
              />
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
              />
            </div>
          </div>
        </div>
        <div className="mt-10">
          
          <button
            type="submit"
            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => myFunction()}
          >
            Submit
          </button>
          <p id="demo"></p>
        </div>
      </form>
      <div>{APIResponse?.map((beneficiary, index) => (<h4 key={index}>{beneficiary.beneficiaryName}</h4>))}</div>
    </div>
  )
}

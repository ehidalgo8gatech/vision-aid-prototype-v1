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

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function myFunction() {
  document.getElementById("demo").innerHTML = "Patient's information submitted"
}

export default function Example() {
  const [agreed, setAgreed] = useState(false)
  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [education, setEducation] = useState("");
  const [APIResponse, setAPIResponse] = useState(null);

  useEffect(() => {
    console.log("patientName", patientName);
    console.log("age", age);
    console.log("gender", gender);
    console.log("education", education);
    console.log("API response", APIResponse);
  },[patientName, age, gender, education, APIResponse])

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
    const body = { patientName, age, gender, education }
    try {
     const session = await getSession()
     if (!session) {
       alert("You need to be logged in to enter data")
       return
     }
     const user = await insertUserIfRequired(session)
     if (user.role.dataEntry != true) {
       alert("You do not have the dataEntry permission turned to true")
       return
     }
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
    setPatientName('');
    setAge('');
    setGender('');
    setEducation('');
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
      if (json != null) {
        console.log("User found in db " + JSON.stringify(json))
        return json;
      }
      console.log("User not found adding to db")
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
       console.log("user id " + json.id + " use email " + json.email + " added")
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
            <label htmlFor="patients-name" className="block text-sm font-semibold leading-6 text-gray-900">
              Name of the Patient
            </label>
            <div className="mt-2.5">
              <input
                onChange={(e) => setPatientName(e.target.value)}
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
                onChange={(e) => setAge(e.target.value)}
                type="text"
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
            <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900">
              Message
            </label>
            <div className="mt-2.5">
              <textarea
                name="message"
                id="message"
                rows={4}
                className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                defaultValue={''}
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
    </div>
  )
}

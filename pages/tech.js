import {useState} from 'react'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import moment from 'moment';

const inter = Inter({ subsets: ['latin'] })


export default function Home() {

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

    function myFunction() {   
    }

    const handleSubmit = async (e, selectedOption) => {

    }
    
    return (
    
    <> 
    
    
    {' '}
              <Image
                src="/vision-aid-logo-trns.png"
                alt="Vercel Logo"
                className={styles.vercelLogo}
                width={100}
                height={100}
                priority
              /> 
<div className={styles.main}>
<div className={styles.main}>
Vision Aid Partner Tracking
    System</div>
<p className={styles.code}>
    This form is for submitting the personal information of a beneficiary
</p>
</div>
<form action="#" method="POST" onSubmit={(e) => handleSubmit(e, selectedOption)}
  className={styles.main}>
<h1 className={styles.description}>
    <h1>
        <label htmlFor="option-select" className={styles.card}>
            Select the desired subcategory
        </label>
        <div className="mt-2.5">
            <select
            id="option-select"
            name="option-select"
            onChange={(e) => setSelectedOption(e.target.value)}
            className={styles.card}>
            <option value="">Subcategory</option>
            <option value="low-vision-screening">Low Vision Screening</option>
            <option value="comp-low-vision">Comprehensive Low Vision Evaluation</option>
            <option value="functional-vision">Functional Vision</option>
    
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
                        onChange={(e) => setlowVision(parseInt(e.target.checked))}
                        type="checkbox"
                        name="low-vision"
                        id="low-vision"
                        autoComplete="low-vision"
                        className="block w-full rounded-md border-0 py-2 px-3.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                        required/>
                </div>
            </div>
            </>
        )}
    </h1>
</h1>
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

</>
)}

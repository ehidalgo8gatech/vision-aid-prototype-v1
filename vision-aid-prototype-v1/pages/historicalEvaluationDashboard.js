import Link from "next/link";
import styles from '@/styles/Home.module.css'
import Head from 'next/head'
import { useState } from 'react';
import Image from 'next/image'
import { Inter } from '@next/font/google'
import {useSession, signIn, signOut, getSession} from "next-auth/react";
import Navigation from './navigation/Navigation';
import UserProfileCard from './components/UserProfileCard';
import HistoricalLowVisionScreeningForm from './components/HistoricalLowVisionScreeningForm';
import HistoricalCLVForm from './components/HistoricalCLVForm';
import HistoricalVisionEnhancementForm from './components/HistoricalVisionEnhancementForm';
import HistoricalCounselingForm from './components/HistoricalCounselingForm';
import HistoricalTrainingForm from './components/HistoricalTrainingForm';



export default function HistoricalEvaluationPage(props) {
    const service = props.user[props.service];
    const user = props.user;
    const [formData, setFormData] = useState({});

    const formatTitle = (title) => {
        return title.split("_").join(" ");
    }

    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
    }

    const filterData = (date, services) => {
        return services.filter(function(value) {
            return formatDate(value.date) == date;
        })[0];
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value});
        handleServiceChange(formatDate['historyDate'], service);
    };

    var historicalDashboard;

    const handleServiceChange = (date, services) => {
        if(date==undefined || filterData(date, services)==undefined){
            historicalDashboard = <div className="text-align-left">Select a historical evaluation date from the drop-down menu!</div>;
        } else {
            if(props.service == "Low_Vision_Screening"){
                historicalDashboard = <HistoricalLowVisionScreeningForm evaluationData={filterData(date, services)}/>;
            } else if(props.service == "Comprehensive_Low_Vision_Evaluation"){
                historicalDashboard = <HistoricalCLVForm evaluationData={filterData(date, services)}/>
            } else if(props.service == "Vision_Enhancement"){
                historicalDashboard = <HistoricalVisionEnhancementForm evaluationData={filterData(date, services)}/>
            } else if(props.service == "Counselling_Education"){
                historicalDashboard = <HistoricalCounselingForm evaluationData={filterData(date, services)}/>
            } else if(props.service == "Training"){
                historicalDashboard = <HistoricalTrainingForm evaluationData={filterData(date, services)}/>
            }
        }

        return historicalDashboard;

    }
   
   const historicalDates = service.map(item => formatDate(item.date));

    return (
    <div>
        <Navigation />
        <div className="container">
            <h2>{formatTitle(props.service)} Details</h2>
            <hr class="horizontal-line"/>
        <div className="row">
              <div className="col-md-6">
                <UserProfileCard 
                gender={props.user.gender} 
                phoneNumber={props.user.phoneNumber}
                MRN={props.user.mrn}
                dob={formatDate(props.user.dateOfBirth)}
                hospitalName={props.user.hospitalName}
                education={props.user.education}
                districts={props.user.districts}
                state={props.user.state}
                beneficiaryName={props.user.beneficiaryName}
                occupation={props.user.occupation}
                extraInformation={props.user.extraInformation[0].value}
                name={props.user.beneficiaryName}
                />
              </div>
              <div className="col-md-6">
                  <div className="row">
                  <div className="text-align-left">
                      Select a date:
                      <select className="mb-3" name="historyDate" id="historyDate" onChange={handleChange} style={{ width: '200px' }}>
                      <option value="">Date Picker</option>
                      {historicalDates.map((date, idx) => (
                        <option key={idx} value={formatDate(date)}>
                        {formatDate(date)}
                        </option>
                    ))}
                    </select>
                  </div>
                  </div>
                  <div className="row">
                    {handleServiceChange(formData['historyDate'], service)}
                  </div>
              </div>
          </div>
          </div>
    </div>
)
}

export async function getServerSideProps({query}){
    var user;
    var service;
    try {
        const beneficiary = await await fetch(`${process.env.NEXTAUTH_URL}/api/beneficiary?mrn=${query.mrn}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        })
        user = await beneficiary.json();
        service = query.service;
      } catch (error) {
        console.error('Error fetching users:', error);
      }

    if (!user || !service) {
        return {
        notFound: true,
        };
    }
    
    const benMirror = await fetch(`${process.env.NEXTAUTH_URL}/api/beneficiaryMirror?hospital=` + user.hospital.name, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    })
    const benMirrorJson = await benMirror.json();

    user.hospitalName = user.hospital.name

    return {
        props: {
            user: user,
            service: service,
            beneficiaryMirror: benMirrorJson
        },
    };

}


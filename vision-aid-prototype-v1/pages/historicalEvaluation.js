import Link from "next/link";
import styles from '@/styles/Home.module.css'
import Head from 'next/head'
import { useState } from 'react';
import Image from 'next/image'
import { Inter } from '@next/font/google'
import {useSession, signIn, signOut, getSession} from "next-auth/react";
import Navigation from './navigation/Navigation';
import UserProfileCard from './components/UserProfileCard';
import HistoricalEvaluationForm from './components/HistoricalEvaluationForm';



export default function HistoricalEvaluationPage(props) {
    const service = props.user[props.service];
    const user = props.user;
    const [formData, setFormData] = useState({});

    const formatTitle = (title) => {
        return title.split("_").join(" ");
    }

    const formatDate = (date) => {
        var newDate = new Date(date);
        const formattedDate = newDate.getFullYear()+"-"+("0" + (newDate.getMonth() + 1)).slice(-2)+"-"+("0" + newDate.getDate()).slice(-2);
        return formattedDate;
    }

    const filterData = (date, services) => {
        return services.filter(function(value) {
            return formatDate(value.date) == date;
        })[0];
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value});
    };

    console.log(props.user);

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
                      Select a date: <input className="mb-3" type="date" name="historyDate" id="historyDate" onChange={handleChange}></input>
                  </div>
                  </div>
                  <div className="row">
                  {filterData(formData['historyDate'], service)!==undefined ?
                 <HistoricalEvaluationForm evaluationData={filterData(formData['historyDate'], service)}/> : <div className="text-align-left">No historical data is present for this date!</div>}
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


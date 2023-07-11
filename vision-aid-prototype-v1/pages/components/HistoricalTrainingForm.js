import Link from "next/link";
import styles from '@/styles/Home.module.css'
import Head from 'next/head'
import Image from 'next/image'
import  { useRouter } from 'next/router';
import { Inter } from '@next/font/google'
import {useSession, signIn, signOut, getSession} from "next-auth/react";


export default function HistoricalTrainingForm(props) {
    const data = props.evaluationData;
    return(
        data == undefined ? <div className="text-align-left">No historical data is present for this date!</div>:
        <table class="table beneficiary-table table-bordered">
        <thead class="thead-dark">
            <tr>
            <th scope="col">Properties</th>
            <th scope="col">Data</th>
            </tr>
        </thead>
        <tbody>
            <tr>
            <th scope="row">Date</th>
            <td>{data.date}</td>
            </tr>
            <tr>
            <th scope="row">Session Number</th>
            <td>{data.sessionNumber}</td>
            </tr>
            <tr>
            <th scope="row">Type</th>
            <td>{data.type}</td>
            </tr>
            <tr>
            <th scope="row">Sub Type</th>
            <td>{data.subType}</td>
            </tr>
            <tr>
            <th scope="row">Other Sub Type</th>
            <td>{data.subTypeOther}</td>
            </tr>
            <tr>
            <th scope="row">Extra Information</th>
            <td>{data.extraInformation}</td>
            </tr>
            
        </tbody>
        </table>
    )
}
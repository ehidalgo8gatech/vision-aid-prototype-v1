import Link from "next/link";
import styles from '@/styles/Home.module.css'
import Head from 'next/head'
import Image from 'next/image'
import  { useRouter } from 'next/router';
import { Inter } from '@next/font/google'
import {useSession, signIn, signOut, getSession} from "next-auth/react";


export default function HistoricalCounselingForm(props) {
    const data = props.evaluationData;
    return(
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
            <th scope="row">Other Type</th>
            <td>{data.typeOther}</td>
            </tr>
            <tr>
            <th scope="row">Extra Information</th>
            <td>{data.extraInformation}</td>
            </tr>
            
        </tbody>
        </table>
    )
}
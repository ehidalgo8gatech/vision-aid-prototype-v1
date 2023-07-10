import Link from "next/link";
import styles from '@/styles/Home.module.css'
import Head from 'next/head'
import Image from 'next/image'
import  { useRouter } from 'next/router';
import { Inter } from '@next/font/google'
import {useSession, signIn, signOut, getSession} from "next-auth/react";


export default function HistoricalLowVisionScreeningForm(props) {
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
            <th scope="row">Diagnosis</th>
            <td>{data.diagnosis}</td>
            </tr>
            <tr>
            <th scope="row">MDVI</th>
            <td>{data.mdvi}</td>
            </tr>
            <tr>
            <th scope="row">Session Number</th>
            <td>{data.sessionNumber}</td>
            </tr>
            <tr>
            <th scope="row">distanceVisualAcuityRE</th>
            <td>{data.distanceVisualAcuityRE}</td>
            </tr>
            <tr>
            <th scope="row">distanceVisualAcuityLE</th>
            <td>{data.distanceVisualAcuityLE}</td>
            </tr>
            <tr>
            <th scope="row">distanceBinocularVisionBE</th>
            <td>{data.distanceBinocularVisionBE}</td>
            </tr>
            <tr>
            <th scope="row">nearVisualAcuityRE</th>
            <td>{data.nearVisualAcuityRE}</td>
            </tr>
            <tr>
            <th scope="row">nearVisualAcuityLE</th>
            <td>{data.nearVisualAcuityLE}</td>
            </tr>
            <tr>
            <th scope="row">nearBinocularVisionBE</th>
            <td>{data.nearBinocularVisionBE}</td>
            </tr>
            <tr>
            <th scope="row">Recommendation Spectacle</th>
            <td>{data.recommendationSpectacle}</td>
            </tr>
            <tr>
            <th scope="row">Recommendation Optical</th>
            <td>{data.recommendationOptical}</td>
            </tr>
            <tr>
            <th scope="row">Recommendation NonOptical</th>
            <td>{data.recommendationNonOptical}</td>
            </tr>
            <tr>
            <th scope="row">Recommendation Electronic</th>
            <td>{data.recommendationElectronic}</td>
            </tr>
            <tr>
            <th scope="row">Extra Information</th>
            <td>{data.extraInformation}</td>
            </tr>
            
        </tbody>
        </table>
    )
}
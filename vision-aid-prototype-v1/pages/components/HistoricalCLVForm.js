import Link from "next/link";
import styles from '@/styles/Home.module.css'
import Head from 'next/head'
import Image from 'next/image'
import  { useRouter } from 'next/router';
import { Inter } from '@next/font/google'
import {useSession, signIn, signOut, getSession} from "next-auth/react";


export default function HistoricalCLVForm(props) {
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
            <th scope="row">Dispensed Date Spectacle</th>
            <td>{data.dispensedDateSpectacle}</td>
            </tr>
            <tr>
            <th scope="row">Cost Spectacle</th>
            <td>{data.costSpectacle}</td>
            </tr>
            <tr>
            <th scope="row">Cost to Beneficiary Spectacle</th>
            <td>{data.costToBeneficiarySpectacle}</td>
            </tr>
            <tr>
            <th scope="row">Dispensed Spectacle</th>
            <td>{data.dispensedSpectacle}</td>
            </tr>
            <tr>
            <th scope="row">Training Given Spectacle</th>
            <td>{data.trainingGivenSpectacle}</td>
            </tr>
            <tr>
            <th scope="row">Recommendation Optical</th>
            <td>{data.recommendationOptical}</td>
            </tr>
            <tr>
            <th scope="row">Dispensed Date Optical</th>
            <td>{data.dispensedDateOptical}</td>
            </tr>
            <tr>
            <th scope="row">Cost Optical</th>
            <td>{data.costOptical}</td>
            </tr>
            <tr>
            <th scope="row">Cost to Beneficiary Optical</th>
            <td>{data.costToBeneficiaryOptical}</td>
            </tr>
            <tr>
            <th scope="row">Dispensed Optical</th>
            <td>{data.dispensedOptical}</td>
            </tr>
            <tr>
            <th scope="row">Training Given Optical</th>
            <td>{data.trainingGivenOptical}</td>
            </tr>
            <tr>
            <th scope="row">Recommendation Non-Optical</th>
            <td>{data.recommendationNonOptical}</td>
            </tr>
            <tr>
            <th scope="row">Dispensed Date NonOptical</th>
            <td>{data.dispensedDateNonOptical}</td>
            </tr>
            <tr>
            <th scope="row">Cost NonOptical</th>
            <td>{data.costNonOptical}</td>
            </tr>
            <tr>
            <th scope="row">Cost To Beneficiary NonOptical</th>
            <td>{data.costToBeneficiaryNonOptical}</td>
            </tr>
            <tr>
            <th scope="row">Dispensed NonOptical</th>
            <td>{data.dispensedNonOptical}</td>
            </tr>
            <tr>
            <th scope="row">Training Given Non Optical</th>
            <td>{data.trainingGivenNonOptical}</td>
            </tr>
            <tr>
            <th scope="row">Recommendation Electronic</th>
            <td>{data.recommendationElectronic}</td>
            </tr>
            <tr>
            <th scope="row">Dispensed Date Electronic</th>
            <td>{data.dispensedDateElectronic}</td>
            </tr>
            <tr>
            <th scope="row">Cost Electronic</th>
            <td>{data.costElectronic}</td>
            </tr>
            <tr>
            <th scope="row">Cost To Beneficiary Electronic</th>
            <td>{data.costToBeneficiaryElectronic}</td>
            </tr>
            <tr>
            <th scope="row">Dispensed Electronic</th>
            <td>{data.dispensedElectronic}</td>
            </tr>
            <tr>
            <th scope="row">Training Given Electronic</th>
            <td>{data.trainingGivenElectronic}</td>
            </tr>
            <tr>
            <th scope="row">Colour Vision Right Eye</th>
            <td>{data.colourVisionRE}</td>
            </tr>
            <tr>
            <th scope="row">Colour Vision Left Eye</th>
            <td>{data.colourVisionLE}</td>
            </tr>
            <tr>
            <th scope="row">Contrast Sensitivity Right Eye</th>
            <td>{data.contrastSensitivityRE}</td>
            </tr>
            <tr>
            <th scope="row">Contrast Sensitivity Left Eye</th>
            <td>{data.contrastSensitivityLE}</td>
            </tr>
            <tr>
            <th scope="row">Visual Fields Right Eye</th>
            <td>{data.visualFieldsRE}</td>
            </tr>
            <tr>
            <th scope="row">Visual Fields Left Eye</th>
            <td>{data.visualFieldsLE}</td>
            </tr>
            <tr>
            <th scope="row">Extra Information</th>
            <td>{data.extraInformation}</td>
            </tr>
            
        </tbody>
        </table>
    )
}
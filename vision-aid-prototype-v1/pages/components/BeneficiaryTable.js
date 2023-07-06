import Link from "next/link";
import styles from '@/styles/Home.module.css'
import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import {useSession, signIn, signOut, getSession} from "next-auth/react";


export default function BeneficiaryTable() {
    return(
        <table class="table table-bordered beneficiary-table">
        <thead class="thead-dark">
            <tr>
            <th scope="col">Services</th>
            <th scope="col">Actions</th>
            </tr>
        </thead>
        <tbody className="beneficiary-table-body">
            <tr>
            <th scope="row">Low Vision Screening</th>
            <td>
                <button type="button" class="btn btn-primary">View Historical Evaluation</button>
                <div class="divider"/>
                <button type="button" class="btn btn-primary">Submit New Evaluation</button>
            </td>
            </tr>
            <tr>
            <th scope="row">Comprehensive Low Vision Screening</th>
            <td>
                <button type="button" class="btn btn-primary">View Historical Evaluation</button>
                <div class="divider"/>
                <button type="button" class="btn btn-primary">Submit New Evaluation</button>
            </td>
            </tr>
            <tr>
            <th scope="row">Low Enhancement</th>
            <td>
                <button type="button" class="btn btn-primary">View Historical Evaluation</button>
                <div class="divider"/>
                <button type="button" class="btn btn-primary">Submit New Evaluation</button>
            </td>
            </tr>
            <tr>
            <th scope="row">Counseling</th>
            <td>
                <button type="button" class="btn btn-primary">View Historical Evaluation</button>
                <div class="divider"/>
                <button type="button" class="btn btn-primary">Submit New Evaluation</button>
            </td>
            </tr>
            <tr>
            <th scope="row">Training</th>
            <td>
                <button type="button" class="btn btn-primary">View Historical Evaluation</button>
                <div class="divider"/>
                <button type="button" class="btn btn-primary">Submit New Evaluation</button>
            </td>
            </tr>
        </tbody>
    </table>
    )
}
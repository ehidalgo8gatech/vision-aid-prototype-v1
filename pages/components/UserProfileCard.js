import Link from "next/link";
import styles from "@/styles/Home.module.css";
import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import logo from 'public/images/vision-aid-logo.webp';

export default function UserProfileCard({
  gender,
  phoneNumber,
  beneficiaryName,
  occupation,
  education,
  hospitalName,
  MRN,
  extraInformation,
  districts,
  state,
  dob,
  name,
  mdvi,
}) {
  return (
    <div className="user-profile-card">
      <div>
        <Image
          src={logo}
          alt="Profile Image"
          className="profile-image"
        />
        <h2 className="user-name">{name}</h2>
      </div>

      <div className="profile-info">
        <hr />

        <table>
          <tr>
            <td>MRN:</td>
            <td>{MRN}</td>
          </tr>
          <tr>
            <td>Beneficiary Name:</td>
            <td>{beneficiaryName}</td>
          </tr>
          <tr>
            <td>Hospital Name:</td>
            <td>{hospitalName}</td>
          </tr>
          <tr>
            <td>Gender:</td>
            <td>{gender}</td>
          </tr>
          <tr>
            <td>MDVI:</td>
            <td>{mdvi}</td>
          </tr>
          <tr>
            <td>Phone Number:</td>
            <td>{phoneNumber}</td>
          </tr>
          <tr>
            <td>Date of Birth:</td>
            <td>{dob}</td>
          </tr>
          <tr>
            <td>Occupation:</td>
            <td>{occupation}</td>
          </tr>
          <tr>
            <td>Education:</td>
            <td>{education}</td>
          </tr>
          <tr>
            <td>Districts:</td>
            <td>{districts}</td>
          </tr>
          <tr>
            <td>State:</td>
            <td>{state}</td>
          </tr>
          <tr>
            <td>Extra Information:</td>
            <td>{extraInformation}</td>
          </tr>
        </table>
      </div>
    </div>
  );
}

import Link from "next/link";
import styles from "@/styles/Home.module.css";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { Inter } from "@next/font/google";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import { useState, useEffect } from "react";
import moment from "moment";

export default function HistoricalVisionEnhancementForm(props) {
  //   let data = props.evaluationData.service;
  const [data, setData] = useState(props.evaluationData.service);

  const [editMode, setEditMode] = useState(false);

  const handleClick = (e) => {
    setEditMode(true);
  };

  const handleChange = (e) => {
    if (e.target.type === "date") {
      setData({
        ...data,
        [e.target.name]: new Date(Date.parse(e.target.value)),
      });
    } else if (e.target.type === "number") {
      setData({ ...data, [e.target.name]: parseInt(e.target.value) });
    } else {
      setData({ ...data, [e.target.name]: e.target.value });
    }
  };

  const saveVisionEnhancementData = async () => {
    delete data["beneficiaryId"];
    const res = await fetch("/api/visionEnhancement", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (res.status == 200) {
      setEditMode(false);
    } else {
      alert("Failed to save data!");
    }
    await props.refetchUser();
  };

  return data == undefined ? (
    <div className="text-align-left">
      No historical data is present for this date!
    </div>
  ) : (
    <div>
      <table class="table beneficiary-table table-bordered row">
        <thead class="thead-dark">
          <tr className="row">
            <th scope="col" className="col-md-4">
              Properties
            </th>
            <th scope="col" className="col-md-8">
              Data
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="row">
            <th scope="row" className="col-md-4">
              Date
            </th>
            <td scope="row" className="col-md-8">
              {!editMode &&
                data.date !== null &&
                moment(data.date).format("DD MMMM YYYY")}
              {!editMode && data.date !== null && ""}
              {editMode && (
                <input
                  type="date"
                  name="date"
                  value={moment(data.date).format("YYYY-MM-DD")}
                  onChange={(e) => handleChange(e)}
                />
              )}
            </td>
          </tr>
          <tr className="row">
            <th scope="row" className="col-md-4">
              MDVI
            </th>
            <td scope="row" className="col-md-8">
              {!editMode && data.MDVI}
              {editMode && (
                <input
                  type="text"
                  name="MDVI"
                  value={data.MDVI}
                  onChange={(e) => handleChange(e)}
                  autoComplete="off"
                />
              )}
            </td>
          </tr>
          <tr className="row">
            <th scope="row" className="col-md-4">
              Session Number
            </th>
            <td scope="row" className="col-md-8">
              {!editMode && data.sessionNumber}
              {editMode && (
                <input
                  type="number"
                  name="sessionNumber"
                  value={data.sessionNumber}
                  onChange={(e) => handleChange(e)}
                  min="1"
                  autoComplete="off"
                />
              )}
            </td>
          </tr>
          <tr className="row">
            <th scope="row" className="col-md-4">
              Diagnosis
            </th>
            <td scope="row" className="col-md-8">
              {!editMode && data.Diagnosis}
              {editMode && (
                <input
                  type="text"
                  name="Diagnosis"
                  value={data.Diagnosis}
                  onChange={(e) => handleChange(e)}
                  autoComplete="off"
                />
              )}
            </td>
          </tr>
          <tr className="row">
            <th scope="row" className="col-md-4">
              Extra Information
            </th>
            <td scope="row" className="col-md-8">
              {!editMode && data.extraInformation}
              {editMode && (
                <input
                  type="text"
                  name="extraInformation"
                  value={data.extraInformation}
                  onChange={(e) => handleChange(e)}
                  autoComplete="off"
                />
              )}
            </td>
          </tr>
        </tbody>
      </table>
      {props.evaluationData.editable && !editMode && (
        <button
          class="btn btn-success border-0 btn-block"
          onClick={handleClick}
        >
          Edit
        </button>
      )}
      {editMode && (
        <button
          class="btn btn-success border-0 btn-block"
          onClick={saveVisionEnhancementData}
        >
          Save
        </button>
      )}
    </div>
  );
}

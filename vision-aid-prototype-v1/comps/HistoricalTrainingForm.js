import Link from "next/link";
import styles from "@/styles/Home.module.css";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { Inter } from "@next/font/google";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import { useState, useEffect } from "react";
import moment from "moment";

export default function HistoricalTrainingForm(props) {
  // const data = props.evaluationData.service;
  const [data, setData] = useState({});
  useEffect(() => {
    setData(props.evaluationData.service);
  }, [props.evaluationData.service]);
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

  const saveTrainingData = async () => {
    const res = await fetch("/api/training", {
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
  };

  return data == undefined ? (
    <div className="text-align-left">
      No historical data is present for this date!
    </div>
  ) : (
    <div>
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
            <td>
              {!editMode && data.date !== null && moment(data.date).format("YYYY-MM-DD")}
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
          <tr>
            <th scope="row">Session Number</th>
            <td>
              {!editMode && data.sessionNumber}
              {editMode && (
                <input
                  type="number"
                  name="sessionNumber"
                  value={data.sessionNumber}
                  onChange={(e) => handleChange(e)}
                />
              )}
            </td>
          </tr>
          <tr>
            <th scope="row">Type</th>
            <td>
              {!editMode && data.type}
              {editMode && (
                <input
                  type="text"
                  name="type"
                  value={data.type}
                  onChange={(e) => handleChange(e)}
                />
              )}
            </td>
          </tr>
          <tr>
            <th scope="row">Sub Type</th>
            <td>
              {!editMode && data.subType}
              {editMode && (
                <input
                  type="text"
                  name="subType"
                  value={data.subType}
                  onChange={(e) => handleChange(e)}
                />
              )}
            </td>
          </tr>
          {/* <tr>
            <th scope="row">Other Sub Type</th>
            <td>
              {!editMode && data.subTypeOther}
              {editMode && (
                <input
                  type="text"
                  name="subTypeOther"
                  value={data.subTypeOther}
                  onChange={(e) => handleChange(e)}
                />
              )}
            </td>
          </tr> */}
          <tr>
            <th scope="row">Extra Information</th>
            <td>
              {!editMode && data.extraInformation}
              {editMode && (
                <input
                  type="text"
                  name="extraInformation"
                  value={data.extraInformation}
                  onChange={(e) => handleChange(e)}
                />
              )}
            </td>
          </tr>
        </tbody>
      </table>
      {props.evaluationData.editable && !editMode && (
        <button onClick={handleClick}>Edit</button>
      )}
      {editMode && <button onClick={saveTrainingData}>Save</button>}
    </div>
  );
}

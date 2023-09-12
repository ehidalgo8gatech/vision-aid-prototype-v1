import Link from "next/link";
import styles from "@/styles/Home.module.css";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { Inter } from "@next/font/google";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function HistoricalLowVisionScreeningForm(props={evaluationData:{service:{}, editable: false}}) {
  // let data = props.evaluationData.service;

  const [data, setData] = useState({});
  useEffect(() => {
    setData(props.evaluationData.service);
  }, [props.evaluationData.service]);

  const [editMode, setEditMode] = useState(false);

  const handleClick = (e) => {
    setEditMode(true);
  };

  const handleChange = (e) => {
    if (e.target.type === "number") {
      setData({ ...data, [e.target.name]: parseInt(e.target.value) });
    } else {
      setData({ ...data, [e.target.name]: e.target.value });
    }
  };

  const saveLowVisionData = async () => {
    delete data["beneficiaryId"];
    const res = await fetch("/api/lowVisionEvaluation", {
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
            <th scope="row">Diagnosis</th>
            <td>
              {!editMode && data.diagnosis}
              {editMode && (
                <input
                  type="text"
                  name="diagnosis"
                  value={data.diagnosis}
                  onChange={(e) => handleChange(e)}
                />
              )}
            </td>
          </tr>
          <tr>
            <th scope="row">MDVI</th>
            <td>
              {!editMode && data.mdvi}
              {editMode && (
                <input
                  type="text"
                  name="mdvi"
                  value={data.mdvi}
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
            <th scope="row">distanceVisualAcuityRE</th>
            <td>
              {!editMode && data.distanceVisualAcuityRE}
              {editMode && (
                <input
                  type="text"
                  name="distanceVisualAcuityRE"
                  value={data.distanceVisualAcuityRE}
                  onChange={(e) => handleChange(e)}
                />
              )}
            </td>
          </tr>
          <tr>
            <th scope="row">distanceVisualAcuityLE</th>
            <td>
              {!editMode && data.distanceVisualAcuityLE}
              {editMode && (
                <input
                  type="text"
                  name="distanceVisualAcuityLE"
                  value={data.distanceVisualAcuityLE}
                  onChange={(e) => handleChange(e)}
                />
              )}
            </td>
          </tr>
          <tr>
            <th scope="row">distanceBinocularVisionBE</th>
            <td>
              {!editMode && data.distanceBinocularVisionBE}
              {editMode && (
                <input
                  type="text"
                  name="distanceBinocularVisionBE"
                  value={data.distanceBinocularVisionBE}
                  onChange={(e) => handleChange(e)}
                />
              )}
            </td>
          </tr>
          <tr>
            <th scope="row">nearVisualAcuityRE</th>
            <td>
              {!editMode && data.nearVisualAcuityRE}
              {editMode && (
                <input
                  type="text"
                  name="nearVisualAcuityRE"
                  value={data.nearVisualAcuityRE}
                  onChange={(e) => handleChange(e)}
                />
              )}
            </td>
          </tr>
          <tr>
            <th scope="row">nearVisualAcuityLE</th>
            <td>
              {!editMode && data.nearVisualAcuityLE}
              {editMode && (
                <input
                  type="text"
                  name="nearVisualAcuityLE"
                  value={data.nearVisualAcuityLE}
                  onChange={(e) => handleChange(e)}
                />
              )}
            </td>
          </tr>
          <tr>
            <th scope="row">nearBinocularVisionBE</th>
            <td>
              {!editMode && data.nearBinocularVisionBE}
              {editMode && (
                <input
                  type="text"
                  name="nearBinocularVisionBE"
                  value={data.nearBinocularVisionBE}
                  onChange={(e) => handleChange(e)}
                />
              )}
            </td>
          </tr>
          <tr>
            <th scope="row">Recommendation Spectacle</th>
            <td>
              {!editMode && data.recommendationSpectacle}
              {editMode && (
                <input
                  type="text"
                  name="recommendationSpectacle"
                  value={data.recommendationSpectacle}
                  onChange={(e) => handleChange(e)}
                />
              )}
            </td>
          </tr>
          <tr>
            <th scope="row">Recommendation Optical</th>
            <td>
              {!editMode && data.recommendationOptical}
              {editMode && (
                <input
                  type="text"
                  name="recommendationOptical"
                  value={data.recommendationOptical}
                  onChange={(e) => handleChange(e)}
                />
              )}
            </td>
          </tr>
          <tr>
            <th scope="row">Recommendation NonOptical</th>
            <td>
              {!editMode && data.recommendationNonOptical}
              {editMode && (
                <input
                  type="text"
                  name="recommendationNonOptical"
                  value={data.recommendationNonOptical}
                  onChange={(e) => handleChange(e)}
                />
              )}
            </td>
          </tr>
          <tr>
            <th scope="row">Recommendation Electronic</th>
            <td>
              {!editMode && data.recommendationElectronic}
              {editMode && (
                <input
                  type="test"
                  name="recommendationElectronic"
                  value={data.recommendationElectronic}
                  onChange={(e) => handleChange(e)}
                />
              )}
            </td>
          </tr>
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
      {editMode && <button onClick={saveLowVisionData}>Save</button>}
    </div>
  );
}

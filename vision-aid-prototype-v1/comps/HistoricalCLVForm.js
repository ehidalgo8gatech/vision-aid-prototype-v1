import Link from "next/link";
import styles from "@/styles/Home.module.css";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { Inter } from "@next/font/google";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import { useState, useEffect } from "react";
import moment from "moment";

export default function HistoricalCLVForm(props) {
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

  const saveCLVEData = async () => {
    delete data["beneficiaryId"];
    const res = await fetch("/api/comprehensiveLowVisionEvaluation", {
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
            <th scope="row">Dispensed Date Spectacle</th>
            <td>
            {!editMode && data.dispensedDateSpectacle !== null && moment(data.dispensedDateSpectacle).format("YYYY-MM-DD")}
              {!editMode && data.dispensedDateSpectacle !== null && ""}
              {editMode && (
                <input
                  type="date"
                  name="dispensedDateSpectacle"
                  value={moment(data.dispensedDateSpectacle).format(
                    "YYYY-MM-DD"
                  )}
                  onChange={(e) => handleChange(e)}
                />
              )}
            </td>
          </tr>
          <tr>
            <th scope="row">Cost Spectacle</th>
            <td>
              {!editMode && data.costSpectacle}
              {editMode && (
                <input
                  type="number"
                  name="costSpectacle"
                  value={data.costSpectacle}
                  onChange={(e) => handleChange(e)}
                />
              )}
            </td>
          </tr>
          <tr>
            <th scope="row">Cost to Beneficiary Spectacle</th>
            <td>
              {!editMode && data.costToBeneficiarySpectacle}
              {editMode && (
                <input
                  type="number"
                  name="costToBeneficiarySpectacle"
                  value={data.costToBeneficiarySpectacle}
                  onChange={(e) => handleChange(e)}
                />
              )}
            </td>
          </tr>
          <tr>
            <th scope="row">Dispensed Spectacle</th>
            <td>
              {!editMode && data.dispensedSpectacle}
              {editMode && (
                <input
                  type="text"
                  name="dispensedSpectacle"
                  value={data.dispensedSpectacle}
                  onChange={(e) => handleChange(e)}
                />
              )}
            </td>
          </tr>
          <tr>
            <th scope="row">Training Given Spectacle</th>
            <td>
              {!editMode && data.trainingGivenSpectacle}
              {editMode && (
                <input
                  type="text"
                  name="trainingGivenSpectacle"
                  value={data.trainingGivenSpectacle}
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
            <th scope="row">Dispensed Date Optical</th>
            <td>
            {!editMode && data.dispensedDateOptical !== null && moment(data.dispensedDateOptical).format("YYYY-MM-DD")}
              {!editMode && data.dispensedDateOptical !== null && ""}
              {editMode && (
                <input
                  type="date"
                  name="dispensedDateOptical"
                  value={moment(data.dispensedDateOptical).format("YYYY-MM-DD")}
                  onChange={(e) => handleChange(e)}
                />
              )}
            </td>
          </tr>
          <tr>
            <th scope="row">Cost Optical</th>
            <td>
              {!editMode && data.costOptical}
              {editMode && (
                <input
                  type="number"
                  name="costOptical"
                  value={data.costOptical}
                  onChange={(e) => handleChange(e)}
                />
              )}
            </td>
          </tr>
          <tr>
            <th scope="row">Cost to Beneficiary Optical</th>
            <td>
              {!editMode && data.costToBeneficiaryOptical}
              {editMode && (
                <input
                  type="number"
                  name="costToBeneficiaryOptical"
                  value={data.costToBeneficiaryOptical}
                  onChange={(e) => handleChange(e)}
                />
              )}
            </td>
          </tr>
          <tr>
            <th scope="row">Dispensed Optical</th>
            <td>
              {!editMode && data.dispensedOptical}
              {editMode && (
                <input
                  type="text"
                  name="dispensedOptical"
                  value={data.dispensedOptical}
                  onChange={(e) => handleChange(e)}
                />
              )}
            </td>
          </tr>
          <tr>
            <th scope="row">Training Given Optical</th>
            <td>
              {!editMode && data.trainingGivenOptical}
              {editMode && (
                <input
                  type="text"
                  name="trainingGivenOptical"
                  value={data.trainingGivenOptical}
                  onChange={(e) => handleChange(e)}
                />
              )}
            </td>
          </tr>
          <tr>
            <th scope="row">Recommendation Non-Optical</th>
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
            <th scope="row">Dispensed Date NonOptical</th>
            <td>
            {!editMode && data.dispensedDateNonOptical !== null && moment(data.dispensedDateNonOptical).format("YYYY-MM-DD")}
              {!editMode && data.dispensedDateNonOptical !== null && ""}
              {editMode && (
                <input
                  type="date"
                  name="dispensedDateNonOptical"
                  value={moment(data.dispensedDateNonOptical).format(
                    "YYYY-MM-DD"
                  )}
                  onChange={(e) => handleChange(e)}
                />
              )}
            </td>
          </tr>
          <tr>
            <th scope="row">Cost NonOptical</th>
            <td>
              {!editMode && data.costNonOptical}
              {editMode && (
                <input
                  type="number"
                  name="costNonOptical"
                  value={data.costNonOptical}
                  onChange={(e) => handleChange(e)}
                />
              )}
            </td>
          </tr>
          <tr>
            <th scope="row">Cost To Beneficiary NonOptical</th>
            <td>
              {!editMode && data.costToBeneficiaryNonOptical}
              {editMode && (
                <input
                  type="number"
                  name="costToBeneficiaryNonOptical"
                  value={data.costToBeneficiaryNonOptical}
                  onChange={(e) => handleChange(e)}
                />
              )}
            </td>
          </tr>
          <tr>
            <th scope="row">Dispensed NonOptical</th>
            <td>
              {!editMode && data.dispensedNonOptical}
              {editMode && (
                <input
                  type="text"
                  name="dispensedNonOptical"
                  value={data.dispensedNonOptical}
                  onChange={(e) => handleChange(e)}
                />
              )}
            </td>
          </tr>
          <tr>
            <th scope="row">Training Given Non Optical</th>
            <td>
              {!editMode && data.trainingGivenNonOptical}
              {editMode && (
                <input
                  type="text"
                  name="trainingGivenNonOptical"
                  value={data.trainingGivenNonOptical}
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
            <th scope="row">Dispensed Date Electronic</th>
            <td>
            {!editMode && data.dispensedDateElectronic !== null && moment(data.dispensedDateElectronic).format("YYYY-MM-DD")}
              {!editMode && data.dispensedDateElectronic !== null && ""}
              {editMode && (
                <input
                  type="date"
                  name="dispensedDateElectronic"
                  value={moment(data.dispensedDateElectronic).format(
                    "YYYY-MM-DD"
                  )}
                  onChange={(e) => handleChange(e)}
                />
              )}
            </td>
          </tr>
          <tr>
            <th scope="row">Cost Electronic</th>
            <td>
              {!editMode && data.costElectronic}
              {editMode && (
                <input
                  type="number"
                  name="costElectronic"
                  value={data.costElectronic}
                  onChange={(e) => handleChange(e)}
                />
              )}
            </td>
          </tr>
          <tr>
            <th scope="row">Cost To Beneficiary Electronic</th>
            <td>
              {!editMode && data.costToBeneficiaryElectronic}
              {editMode && (
                <input
                  type="number"
                  name="costToBeneficiaryElectronic"
                  value={data.costToBeneficiaryElectronic}
                  onChange={(e) => handleChange(e)}
                />
              )}
            </td>
          </tr>
          <tr>
            <th scope="row">Dispensed Electronic</th>
            <td>
              {!editMode && data.dispensedElectronic}
              {editMode && (
                <input
                  type="text"
                  name="dispensedElectronic"
                  value={data.dispensedElectronic}
                  onChange={(e) => handleChange(e)}
                />
              )}
            </td>
          </tr>
          <tr>
            <th scope="row">Training Given Electronic</th>
            <td>
              {!editMode && data.trainingGivenElectronic}
              {editMode && (
                <input
                  type="text"
                  name="trainingGivenElectronic"
                  value={data.trainingGivenElectronic}
                  onChange={(e) => handleChange(e)}
                />
              )}
            </td>
          </tr>
          <tr>
            <th scope="row">Colour Vision Right Eye</th>
            <td>
              {!editMode && data.colourVisionRE}
              {editMode && (
                <input
                  type="text"
                  name="colourVisionRE"
                  value={data.colourVisionRE}
                  onChange={(e) => handleChange(e)}
                />
              )}
            </td>
          </tr>
          <tr>
            <th scope="row">Colour Vision Left Eye</th>
            <td>
              {!editMode && data.colourVisionLE}
              {editMode && (
                <input
                  type="text"
                  name="colourVisionLE"
                  value={data.colourVisionLE}
                  onChange={(e) => handleChange(e)}
                />
              )}
            </td>
          </tr>
          <tr>
            <th scope="row">Contrast Sensitivity Right Eye</th>
            <td>
              {!editMode && data.contrastSensitivityRE}
              {editMode && (
                <input
                  type="text"
                  name="contrastSensitivityRE"
                  value={data.contrastSensitivityRE}
                  onChange={(e) => handleChange(e)}
                />
              )}
            </td>
          </tr>
          <tr>
            <th scope="row">Contrast Sensitivity Left Eye</th>
            <td>
              {!editMode && data.contrastSensitivityLE}
              {editMode && (
                <input
                  type="text"
                  name="contrastSensitivityLE"
                  value={data.contrastSensitivityLE}
                  onChange={(e) => handleChange(e)}
                />
              )}
            </td>
          </tr>
          <tr>
            <th scope="row">Visual Fields Right Eye</th>
            <td>
              {!editMode && data.visualFieldsRE}
              {editMode && (
                <input
                  type="text"
                  name="visualFieldsRE"
                  value={data.visualFieldsRE}
                  onChange={(e) => handleChange(e)}
                />
              )}
            </td>
          </tr>
          <tr>
            <th scope="row">Visual Fields Left Eye</th>
            <td>
              {!editMode && data.visualFieldsLE}
              {editMode && (
                <input
                  type="text"
                  name="visualFieldsLE"
                  value={data.visualFieldsLE}
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
      {editMode && <button onClick={saveCLVEData}>Save</button>}
    </div>
  );
}

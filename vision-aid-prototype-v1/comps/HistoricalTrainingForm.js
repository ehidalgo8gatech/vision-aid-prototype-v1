import Link from "next/link";
import styles from "@/styles/Home.module.css";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { Inter } from "@next/font/google";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import { useState, useEffect } from "react";
import moment from "moment";
import { FormControl, Select } from "@mui/material";
import { createMenu } from "@/constants/globalFunctions";

export default function HistoricalTrainingForm(props) {
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 300,
      },
    },
  };
  const [data, setData] = useState(props.evaluationData.service);

  console.log("trainingTypeList: ", props.trainingTypeList);
  console.log(data.type);
  let trainingSubTypeList = props.trainingSubTypeList
    .filter((item) => item.trainingType.value === data.type)
    .map((item) => item.value);

  console.log(trainingSubTypeList);

  const trainingTypeOptions = createMenu(props.trainingTypeList, "type", false);
  console.log("trainingTypeOptions: ", trainingTypeOptions);
  const [trainingSubTypeOptions, setTrainingSubTypeOptions] = useState(
    createMenu(trainingSubTypeList, "subType", false)
  );

  console.log("Training subtypelist: ", trainingSubTypeList);

  const [editMode, setEditMode] = useState(false);

  // let subType = data.subType;
  const [showOther, setShowOther] = useState(
    trainingSubTypeList.includes(data.subType) ? false : true
  );
  const [otherType, setOtherType] = useState(
    trainingSubTypeList.includes(data.subType) ? "" : data.subType
  );

  useEffect(() => {
    if (showOther && editMode) {
      setData((data) => ({ ...data, subType: "Other" }));
    }
  }, [showOther, editMode]);

  console.log("subtype", data.subType);

  const handleClick = (e) => {
    setEditMode(true);
  };

  const handleTypeChange = (e) => {
    console.log("entered");
    setData({ ...data, [e.target.name]: e.target.value });

    trainingSubTypeList = props.trainingSubTypeList
      .filter((item) => item.trainingType.value === e.target.value)
      .map((item) => item.value);

    setTrainingSubTypeOptions(
      createMenu(trainingSubTypeList, "subType", false)
    );

    setData((data) => ({ ...data, subType: "" }));
    // subType = trainingSubTypeList.length > 0 ? trainingSubTypeList[0] : "";
    setShowOther(false);
    // console.log(subType);

    console.log("Subtype list: ", trainingSubTypeList);
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
    if (e.target.value === "Other") {
      setShowOther(true);
    } else {
      setShowOther(false);
    }
  };

  const saveTrainingData = async () => {
    let trainingData = { ...data };
    if (showOther) {
      trainingData = { ...trainingData, subType: otherType };
      setData((data) => ({ ...data, subType: otherType }));
    }
    const res = await fetch("/api/training", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(trainingData),
    });
    if (res.status == 200) {
      setEditMode(false);
    } else {
      alert("Failed to save data!");
    }
    // setShowOther(false);
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
            <td className="col-md-8">
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
              Session Number
            </th>
            <td className="col-md-8">
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
          <tr className="row">
            <th scope="row" className="col-md-4">
              Type
            </th>
            <td className="col-md-8">
              {!editMode && data.type}
              {editMode && (
                <FormControl fullWidth>
                  <Select
                    onChange={(e) => handleTypeChange(e)}
                    value={data.type}
                    name="type"
                    MenuProps={MenuProps}
                  >
                    {trainingTypeOptions}
                  </Select>
                </FormControl>
              )}
            </td>
          </tr>
          <tr className="row">
            <th scope="row" className="col-md-4">
              Sub Type
            </th>
            <td className="col-md-8">
              {!editMode && data.subType}
              {editMode && (
                <FormControl fullWidth>
                  <Select
                    onChange={(e) => handleChange(e)}
                    value={data.subType}
                    name="subType"
                    MenuProps={MenuProps}
                  >
                    {trainingSubTypeOptions}
                  </Select>
                </FormControl>
              )}
            </td>
          </tr>
          {showOther && editMode && (
            <tr className="row">
              <th scope="row" className="col-md-4">
                Other Sub Type
              </th>
              <td className="col-md-8">
                <input
                  type="text"
                  name="subTypeOther"
                  value={otherType}
                  onChange={(e) => setOtherType(e.target.value)}
                />
              </td>
            </tr>
          )}
          <tr className="row">
            <th scope="row" className="col-md-4">
              Extra Information
            </th>
            <td className="col-md-8">
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

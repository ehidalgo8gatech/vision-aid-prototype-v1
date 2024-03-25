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

export default function HistoricalCounselingForm(props) {
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
  const counselingTypeList = props.counselingTypeList;
  const counselingTypeOptions = createMenu(counselingTypeList, false);

  const [editMode, setEditMode] = useState(false);

  const [showOther, setShowOther] = useState(
    counselingTypeList.includes(data.type) ? false : true
  );
  const [otherType, setOtherType] = useState(
    counselingTypeList.includes(data.type) ? "" : data.type
  );

  useEffect(() => {
    if (showOther && editMode) {
      setData((data) => ({ ...data, type: "Other" }));
    }
  }, [showOther, editMode]);

  const handleClick = (e) => {
    setEditMode(true);
  };

  const handleChange = (e) => {
    if (e.target.type === "date") {
      setData({
        ...data,
        [e.target.name]: new Date(Date.parse(e.target.value)),
      });
      // add reload to include this new date in drop-down
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

  const saveCounselingData = async () => {
    let trainingData = { ...data };
    if (showOther) {
      trainingData = { ...trainingData, type: otherType };
      setData((data) => ({ ...data, type: otherType }));
    }
    const res = await fetch("/api/counsellingEducation", {
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
                  min="1"
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
                <FormControl fullWidth size="small">
                  <Select
                    onChange={(e) => handleChange(e)}
                    value={data.type}
                    name="type"
                    MenuProps={MenuProps}
                  >
                    {counselingTypeOptions}
                  </Select>
                </FormControl>
              )}
            </td>
          </tr>
          {showOther && editMode && (
            <tr className="row">
              <th scope="row" className="col-md-4">
                Other Type
              </th>
              <td className="col-md-8">
                <input
                  type="text"
                  name="otherType"
                  value={otherType}
                  onChange={(e) => setOtherType(e.target.value)}
                  autoComplete="off"
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
          onClick={saveCounselingData}
        >
          Save
        </button>
      )}
    </div>
  );
}

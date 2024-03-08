import Link from "next/link";
import styles from "@/styles/Home.module.css";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { Inter } from "@next/font/google";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import { useState, useEffect } from "react";
import moment from "moment";
import { FormControl, Select, MenuItem } from "@mui/material";
import {
  spectacleDevices,
  opticalDevices,
  nonOpticalDevices,
  nonOpticalDevicesIndices,
  nonOpticalDevicesSubheadings,
  electronicDevices,
  electronicDevicesIndices,
  electronicDevicesSubheadings,
} from "@/constants/devicesConstants";
import {
  createOptionMenu,
  createMenu,
  isNotNullEmptyOrUndefined,
} from "@/constants/globalFunctions";
import { comma, commaAndSpace } from "@/constants/generalConstants";
import { jsonToCSV, readString } from "react-papaparse";

export default function HistoricalCLVForm(props) {
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

  let config = {
    quotes: true,
    quoteChar: '"',
  };

  const removeOtherDevices = (devicesArr, originalDevices) => {
    let otherDevices = devicesArr.filter(
      (device) => !originalDevices.includes(device)
    );
    for (let device of otherDevices) {
      devicesArr.splice(devicesArr.indexOf(device), 1);
    }
    return devicesArr;
  };

  const addOtherTerm = (devices) => {
    devices.push("Other");
    return devices;
  };

  const replaceOtherByDeviceName = (devices, otherDevices) => {
    let otherIndex = devices.indexOf("Other");
    devices.splice(otherIndex, 1);
    devices.push(otherDevices);
    return devices;
  };

  const [data, setData] = useState(props.evaluationData.service);

  const recommendationSpectacleArr = isNotNullEmptyOrUndefined(
    data.recommendationSpectacle
  )
    ? readString(data.recommendationSpectacle).data[0]
    : [];
  const recommendationOpticalArr = isNotNullEmptyOrUndefined(
    data.recommendationOptical
  )
    ? readString(data.recommendationOptical).data[0]
    : [];
  const recommendationNonOpticalArr = isNotNullEmptyOrUndefined(
    data.recommendationNonOptical
  )
    ? readString(data.recommendationNonOptical).data[0]
    : [];
  const recommendationElectronicArr = isNotNullEmptyOrUndefined(
    data.recommendationElectronic
  )
    ? readString(data.recommendationElectronic).data[0]
    : [];

  const [devices, setDevices] = useState({
    recommendationSpectacle: isNotNullEmptyOrUndefined(
      data.recommendationSpectacle
    )
      ? recommendationSpectacleArr.every((device) =>
          spectacleDevices.includes(device)
        )
        ? recommendationSpectacleArr
        : addOtherTerm(
            removeOtherDevices(
              [...recommendationSpectacleArr],
              spectacleDevices
            )
          )
      : [],
    recommendationOptical: isNotNullEmptyOrUndefined(data.recommendationOptical)
      ? recommendationOpticalArr.every((device) =>
          opticalDevices.includes(device)
        )
        ? recommendationOpticalArr
        : addOtherTerm(
            removeOtherDevices([...recommendationOpticalArr], opticalDevices)
          )
      : [],
    recommendationNonOptical: isNotNullEmptyOrUndefined(
      data.recommendationNonOptical
    )
      ? recommendationNonOpticalArr.every((device) =>
          nonOpticalDevices.includes(device)
        )
        ? recommendationNonOpticalArr
        : addOtherTerm(
            removeOtherDevices(
              [...recommendationNonOpticalArr],
              nonOpticalDevices
            )
          )
      : [],
    recommendationElectronic: isNotNullEmptyOrUndefined(
      data.recommendationElectronic
    )
      ? recommendationElectronicArr.every((device) =>
          electronicDevices.includes(device)
        )
        ? recommendationElectronicArr
        : addOtherTerm(
            removeOtherDevices(
              [...recommendationElectronicArr],
              electronicDevices
            )
          )
      : [],
    dispensedSpectacle: isNotNullEmptyOrUndefined(data.dispensedSpectacle)
      ? spectacleDevices.includes(data.dispensedSpectacle)
        ? data.dispensedSpectacle
        : "Other"
      : "",
    dispensedOptical: isNotNullEmptyOrUndefined(data.dispensedOptical)
      ? opticalDevices.includes(data.dispensedOptical)
        ? data.dispensedOptical
        : "Other"
      : "",
    dispensedNonOptical: isNotNullEmptyOrUndefined(data.dispensedNonOptical)
      ? nonOpticalDevices.includes(data.dispensedNonOptical)
        ? data.dispensedNonOptical
        : "Other"
      : "",
    dispensedElectronic: isNotNullEmptyOrUndefined(data.dispensedElectronic)
      ? electronicDevices.includes(data.dispensedElectronic)
        ? data.dispensedElectronic
        : "Other"
      : "",
  });

  const [showOther, setShowOther] = useState({
    recommendationSpectacle:
      isNotNullEmptyOrUndefined(devices.recommendationSpectacle) &&
      devices.recommendationSpectacle.includes("Other"),
    recommendationOptical:
      isNotNullEmptyOrUndefined(devices.recommendationOptical) &&
      devices.recommendationOptical.includes("Other"),
    recommendationNonOptical:
      isNotNullEmptyOrUndefined(devices.recommendationNonOptical) &&
      devices.recommendationNonOptical.includes("Other"),
    recommendationElectronic:
      isNotNullEmptyOrUndefined(devices.recommendationElectronic) &&
      devices.recommendationElectronic.includes("Other"),
    dispensedSpectacle:
      isNotNullEmptyOrUndefined(devices.dispensedSpectacle) &&
      devices.dispensedSpectacle === "Other",
    dispensedOptical:
      isNotNullEmptyOrUndefined(devices.dispensedOptical) &&
      devices.dispensedOptical === "Other",
    dispensedNonOptical:
      isNotNullEmptyOrUndefined(devices.dispensedNonOptical) &&
      devices.dispensedNonOptical === "Other",
    dispensedElectronic:
      isNotNullEmptyOrUndefined(devices.dispensedElectronic) &&
      devices.dispensedElectronic === "Other",
  });

  const [otherDevices, setOtherDevices] = useState({
    recommendationSpectacle: isNotNullEmptyOrUndefined(
      data.recommendationSpectacle
    )
      ? devices.recommendationSpectacle.includes("Other")
        ? recommendationSpectacleArr.filter(
            (device) => !spectacleDevices.includes(device)
          )
        : ""
      : "",
    recommendationOptical: isNotNullEmptyOrUndefined(data.recommendationOptical)
      ? devices.recommendationOptical.includes("Other")
        ? recommendationOpticalArr.filter(
            (device) => !opticalDevices.includes(device)
          )
        : ""
      : "",
    recommendationNonOptical: isNotNullEmptyOrUndefined(
      data.recommendationNonOptical
    )
      ? devices.recommendationNonOptical.includes("Other")
        ? recommendationNonOpticalArr.filter(
            (device) => !nonOpticalDevices.includes(device)
          )
        : ""
      : "",
    recommendationElectronic: isNotNullEmptyOrUndefined(
      data.recommendationElectronic
    )
      ? devices.recommendationElectronic.includes("Other")
        ? recommendationElectronicArr.filter(
            (device) => !electronicDevices.includes(device)
          )
        : ""
      : "",
    dispensedSpectacle: isNotNullEmptyOrUndefined(devices.dispensedSpectacle)
      ? devices.dispensedSpectacle === "Other"
        ? data.dispensedSpectacle
        : ""
      : "",
    dispensedOptical: isNotNullEmptyOrUndefined(devices.dispensedOptical)
      ? devices.dispensedOptical === "Other"
        ? data.dispensedOptical
        : ""
      : "",
    dispensedNonOptical: isNotNullEmptyOrUndefined(devices.dispensedNonOptical)
      ? devices.dispensedNonOptical === "Other"
        ? data.dispensedNonOptical
        : ""
      : "",
    dispensedElectronic: isNotNullEmptyOrUndefined(devices.dispensedElectronic)
      ? devices.dispensedElectronic === "Other"
        ? data.dispensedElectronic
        : ""
      : "",
  });

  const [editMode, setEditMode] = useState(false);

  const recommendationSpectacleOptions = createMenu(
    spectacleDevices,
    true,
    devices["recommendationSpectacle"]
  );
  const dispensedSpectacleOptions = createMenu(spectacleDevices, false);
  const recommendationOpticalOptions = createMenu(
    opticalDevices,
    true,
    devices["recommendationOptical"]
  );
  const dispensedOpticalOptions = createMenu(opticalDevices, false);
  const recommendationNonOpticalOptions = createOptionMenu(
    nonOpticalDevices,
    nonOpticalDevicesSubheadings,
    nonOpticalDevicesIndices,
    true,
    devices["recommendationNonOptical"]
  );
  const dispensedNonOpticalOptions = createOptionMenu(
    nonOpticalDevices,
    nonOpticalDevicesSubheadings,
    nonOpticalDevicesIndices,
    false
  );
  const recommendationElectronicOptions = createOptionMenu(
    electronicDevices,
    electronicDevicesSubheadings,
    electronicDevicesIndices,
    true,
    devices["recommendationElectronic"]
  );
  const dispensedElectronicOptions = createOptionMenu(
    electronicDevices,
    electronicDevicesSubheadings,
    electronicDevicesIndices,
    false
  );

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
    } else if (e.target.type === "text") {
      setData({ ...data, [e.target.name]: e.target.value });
    } else {
      setDevices((devices) => ({
        ...devices,
        [e.target.name]: e.target.value,
      }));
    }
    if (e.target.value === "Other") {
      setShowOther({ ...showOther, [e.target.name]: true });
    } else {
      setShowOther({ ...showOther, [e.target.name]: false });
    }
  };

  const handleMultiSelectChange = (e, fieldName) => {
    const {
      target: { value },
    } = e;
    setDevices((devices) => ({
      ...devices,
      [fieldName]: value,
    }));
    if (value.includes("Other")) {
      setShowOther({ ...showOther, [fieldName]: true });
    } else {
      setShowOther({ ...showOther, [fieldName]: false });
    }
  };

  const saveCLVEData = async () => {
    delete data["beneficiaryId"];
    data["dispensedSpectacle"] =
      showOther.dispensedSpectacle === true
        ? otherDevices.dispensedSpectacle
        : devices["dispensedSpectacle"];
    data["dispensedOptical"] =
      showOther.dispensedOptical === true
        ? otherDevices.dispensedOptical
        : devices["dispensedOptical"];
    data["dispensedNonOptical"] =
      showOther.dispensedNonOptical === true
        ? otherDevices.dispensedNonOptical
        : devices["dispensedNonOptical"];
    data["dispensedElectronic"] =
      showOther.dispensedElectronic === true
        ? otherDevices.dispensedElectronic
        : devices["dispensedElectronic"];
    data["recommendationSpectacle"] =
      showOther.recommendationSpectacle === true
        ? jsonToCSV(
            [
              replaceOtherByDeviceName(
                devices["recommendationSpectacle"],
                otherDevices["recommendationSpectacle"]
              ),
            ],
            { ...config, delimiter: comma }
          )
        : jsonToCSV([devices["recommendationSpectacle"]], {
            ...config,
            delimiter: comma,
          });
    data["recommendationOptical"] =
      showOther.recommendationOptical === true
        ? jsonToCSV(
            [
              replaceOtherByDeviceName(
                devices["recommendationOptical"],
                otherDevices["recommendationOptical"]
              ),
            ],
            { ...config, delimiter: comma }
          )
        : jsonToCSV([devices["recommendationOptical"]], {
            ...config,
            delimiter: comma,
          });
    data["recommendationNonOptical"] =
      showOther.recommendationNonOptical === true
        ? jsonToCSV(
            [
              replaceOtherByDeviceName(
                devices["recommendationNonOptical"],
                otherDevices["recommendationNonOptical"]
              ),
            ],
            { ...config, delimiter: comma }
          )
        : jsonToCSV([devices["recommendationNonOptical"]], {
            ...config,
            delimiter: comma,
          });
    data["recommendationElectronic"] =
      showOther.recommendationElectronic === true
        ? jsonToCSV(
            [
              replaceOtherByDeviceName(
                devices["recommendationElectronic"],
                otherDevices["recommendationElectronic"]
              ),
            ],
            { ...config, delimiter: comma }
          )
        : jsonToCSV([devices["recommendationElectronic"]], {
            ...config,
            delimiter: comma,
          });

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
    await props.refetchUser();
  };

  return data == undefined ? (
    <div className="text-align-left">
      No historical data is present for this date!
    </div>
  ) : (
    <div>
      <table class="table beneficiary-table table-bordered row">
        <thead className="thead-dark">
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
              Diagnosis
            </th>
            <td scope="row" className="col-md-8">
              {!editMode && data.diagnosis}
              {editMode && (
                <FormControl fullWidth size="small">
                  <input
                    type="text"
                    name="diagnosis"
                    value={data.diagnosis}
                    onChange={(e) => handleChange(e)}
                    autoComplete="off"
                  />
                </FormControl>
              )}
            </td>
          </tr>
          <tr className="row">
            <th scope="row" className="col-md-4">
              MDVI
            </th>
            <td className="col-md-8">
              {!editMode && data.mdvi}
              {editMode && (
                <FormControl fullWidth size="small">
                  <Select
                    onChange={(e) => handleChange(e)}
                    value={data.mdvi}
                    name="mdvi"
                    MenuProps={MenuProps}
                  >
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </Select>
                </FormControl>
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
                <FormControl fullWidth size="small">
                  <input
                    type="number"
                    name="sessionNumber"
                    value={data.sessionNumber}
                    onChange={(e) => handleChange(e)}
                    min="1"
                    autoComplete="off"
                  />
                </FormControl>
              )}
            </td>
          </tr>
          <tr className="row">
            <th scope="row" className="col-md-4">
              Distance Visual Acuity RE
            </th>
            <td className="col-md-8">
              {!editMode && data.distanceVisualAcuityRE}
              {editMode && (
                <FormControl fullWidth size="small">
                  <input
                    type="text"
                    name="distanceVisualAcuityRE"
                    value={data.distanceVisualAcuityRE}
                    onChange={(e) => handleChange(e)}
                    autoComplete="off"
                  />
                </FormControl>
              )}
            </td>
          </tr>
          <tr className="row">
            <th scope="row" className="col-md-4">
              Distance Visual Acuity LE
            </th>
            <td className="col-md-8">
              {!editMode && data.distanceVisualAcuityLE}
              {editMode && (
                <FormControl fullWidth size="small">
                  <input
                    type="text"
                    name="distanceVisualAcuityLE"
                    value={data.distanceVisualAcuityLE}
                    onChange={(e) => handleChange(e)}
                    autoComplete="off"
                  />
                </FormControl>
              )}
            </td>
          </tr>
          <tr className="row">
            <th scope="row" className="col-md-4">
              Distance Binocular Vision BE
            </th>
            <td className="col-md-8">
              {!editMode && data.distanceBinocularVisionBE}
              {editMode && (
                <FormControl fullWidth size="small">
                  <input
                    type="text"
                    name="distanceBinocularVisionBE"
                    value={data.distanceBinocularVisionBE}
                    onChange={(e) => handleChange(e)}
                    autoComplete="off"
                  />
                </FormControl>
              )}
            </td>
          </tr>
          <tr className="row">
            <th scope="row" className="col-md-4">
              Near Visual Acuity RE
            </th>
            <td className="col-md-8">
              {!editMode && data.nearVisualAcuityRE}
              {editMode && (
                <FormControl fullWidth size="small">
                  <input
                    type="text"
                    name="nearVisualAcuityRE"
                    value={data.nearVisualAcuityRE}
                    onChange={(e) => handleChange(e)}
                    autoComplete="off"
                  />
                </FormControl>
              )}
            </td>
          </tr>
          <tr className="row">
            <th scope="row" className="col-md-4">
              Near Visual Acuity LE
            </th>
            <td className="col-md-8">
              {!editMode && data.nearVisualAcuityLE}
              {editMode && (
                <input
                  type="text"
                  name="nearVisualAcuityLE"
                  value={data.nearVisualAcuityLE}
                  onChange={(e) => handleChange(e)}
                  autoComplete="off"
                />
              )}
            </td>
          </tr>
          <tr className="row">
            <th scope="row" className="col-md-4">
              Near Binocular Vision BE
            </th>
            <td className="col-md-8">
              {!editMode && data.nearBinocularVisionBE}
              {editMode && (
                <FormControl fullWidth size="small">
                  <input
                    type="text"
                    name="nearBinocularVisionBE"
                    value={data.nearBinocularVisionBE}
                    onChange={(e) => handleChange(e)}
                    autoComplete="off"
                  />
                </FormControl>
              )}
            </td>
          </tr>
          <tr className="row">
            <th scope="row" className="col-md-4">
              Recommendation Spectacle
            </th>
            <td scope="row" className="col-md-8">
              {!editMode &&
                jsonToCSV([recommendationSpectacleArr], {
                  ...config,
                  delimiter: commaAndSpace,
                })}
              {editMode && (
                <FormControl fullWidth size="small">
                  <Select
                    onChange={(e) =>
                      handleMultiSelectChange(e, "recommendationSpectacle")
                    }
                    value={devices.recommendationSpectacle}
                    name="recommendationSpectacle"
                    multiple
                    renderValue={(selected) => selected.join(", ")}
                    MenuProps={MenuProps}
                  >
                    {recommendationSpectacleOptions}
                  </Select>
                </FormControl>
              )}
              {editMode && showOther.recommendationSpectacle && (
                <FormControl fullWidth size="small">
                  <input
                    type="text"
                    id="recommendationSpectacleOther"
                    value={otherDevices.recommendationSpectacle}
                    placeholder="Enter device name"
                    onChange={(e) =>
                      setOtherDevices({
                        ...otherDevices,
                        recommendationSpectacle: e.target.value,
                      })
                    }
                    autoComplete="off"
                  />
                </FormControl>
              )}
            </td>
          </tr>
          <tr className="row">
            <th scope="row" className="col-md-4">
              Dispensed Date Spectacle
            </th>
            <td className="col-md-8">
              {!editMode &&
                data.dispensedDateSpectacle !== null &&
                moment(data.dispensedDateSpectacle).format("DD MMMM YYYY")}
              {!editMode && data.dispensedDateSpectacle !== null && ""}
              {editMode && (
                <FormControl fullWidth size="small">
                  <input
                    type="date"
                    name="dispensedDateSpectacle"
                    value={moment(data.dispensedDateSpectacle).format(
                      "YYYY-MM-DD"
                    )}
                    onChange={(e) => handleChange(e)}
                  />
                </FormControl>
              )}
            </td>
          </tr>
          <tr className="row">
            <th scope="row" className="col-md-4">
              Cost Spectacle
            </th>
            <td className="col-md-8">
              {!editMode && data.costSpectacle}
              {editMode && (
                <FormControl fullWidth size="small">
                  <input
                    type="number"
                    name="costSpectacle"
                    value={data.costSpectacle}
                    onChange={(e) => handleChange(e)}
                    min="0"
                    autoComplete="off"
                  />
                </FormControl>
              )}
            </td>
          </tr>
          <tr className="row">
            <th scope="row" className="col-md-4">
              Cost to Beneficiary Spectacle
            </th>
            <td className="col-md-8">
              {!editMode && data.costToBeneficiarySpectacle}
              {editMode && (
                <FormControl fullWidth size="small">
                  <input
                    type="number"
                    name="costToBeneficiarySpectacle"
                    value={data.costToBeneficiarySpectacle}
                    onChange={(e) => handleChange(e)}
                    min="0"
                    autoComplete="off"
                  />
                </FormControl>
              )}
            </td>
          </tr>
          <tr className="row">
            <th scope="row" className="col-md-4">
              Dispensed Spectacle
            </th>
            <td className="col-md-8">
              {!editMode && data.dispensedSpectacle}
              {editMode && (
                <FormControl fullWidth size="small">
                  <Select
                    onChange={(e) => handleChange(e)}
                    value={devices.dispensedSpectacle}
                    name="dispensedSpectacle"
                    MenuProps={MenuProps}
                  >
                    {dispensedSpectacleOptions}
                  </Select>
                </FormControl>
              )}
              {editMode && showOther.dispensedSpectacle && (
                <FormControl fullWidth size="small">
                  <input
                    type="text"
                    id="dispensedSpectacleOther"
                    value={otherDevices.dispensedSpectacle}
                    placeholder="Enter device name"
                    onChange={(e) =>
                      setOtherDevices({
                        ...otherDevices,
                        dispensedSpectacle: e.target.value,
                      })
                    }
                    autoComplete="off"
                  />
                </FormControl>
              )}
            </td>
          </tr>
          <tr className="row">
            <th scope="row" className="col-md-4">
              Training Given Spectacle
            </th>
            <td className="col-md-8">
              {!editMode && data.trainingGivenSpectacle}
              {editMode && (
                <FormControl fullWidth size="small">
                  <input
                    type="text"
                    name="trainingGivenSpectacle"
                    value={data.trainingGivenSpectacle}
                    onChange={(e) => handleChange(e)}
                    autoComplete="off"
                  />
                </FormControl>
              )}
            </td>
          </tr>
          <tr className="row">
            <th scope="row" className="col-md-4">
              Recommendation Optical
            </th>
            <td className="col-md-8">
              {!editMode &&
                jsonToCSV([recommendationOpticalArr], {
                  ...config,
                  delimiter: commaAndSpace,
                })}
              {editMode && (
                <FormControl fullWidth size="small">
                  <Select
                    onChange={(e) =>
                      handleMultiSelectChange(e, "recommendationOptical")
                    }
                    value={devices.recommendationOptical}
                    name="recommendationOptical"
                    multiple
                    renderValue={(selected) => selected.join(", ")}
                    MenuProps={MenuProps}
                  >
                    {recommendationOpticalOptions}
                  </Select>
                </FormControl>
              )}
              {editMode && showOther.recommendationOptical && (
                <FormControl fullWidth size="small">
                  <input
                    type="text"
                    id="recommendationOpticalOther"
                    value={otherDevices.recommendationOptical}
                    placeholder="Enter device name"
                    onChange={(e) =>
                      setOtherDevices({
                        ...otherDevices,
                        recommendationOptical: e.target.value,
                      })
                    }
                    autoComplete="off"
                  />
                </FormControl>
              )}
            </td>
          </tr>
          <tr className="row">
            <th scope="row" className="col-md-4">
              Dispensed Date Optical
            </th>
            <td className="col-md-8">
              {!editMode &&
                data.dispensedDateOptical !== null &&
                moment(data.dispensedDateOptical).format("DD MMMM YYYY")}
              {!editMode && data.dispensedDateOptical !== null && ""}
              {editMode && (
                <FormControl fullWidth size="small">
                  <input
                    type="date"
                    name="dispensedDateOptical"
                    value={moment(data.dispensedDateOptical).format(
                      "YYYY-MM-DD"
                    )}
                    onChange={(e) => handleChange(e)}
                  />
                </FormControl>
              )}
            </td>
          </tr>
          <tr className="row">
            <th scope="row" className="col-md-4">
              Cost Optical
            </th>
            <td className="col-md-8">
              {!editMode && data.costOptical}
              {editMode && (
                <FormControl fullWidth size="small">
                  <input
                    type="number"
                    name="costOptical"
                    value={data.costOptical}
                    onChange={(e) => handleChange(e)}
                    min="0"
                    autoComplete="off"
                  />
                </FormControl>
              )}
            </td>
          </tr>
          <tr className="row">
            <th scope="row" className="col-md-4">
              Cost to Beneficiary Optical
            </th>
            <td className="col-md-8">
              {!editMode && data.costToBeneficiaryOptical}
              {editMode && (
                <FormControl fullWidth size="small">
                  <input
                    type="number"
                    name="costToBeneficiaryOptical"
                    value={data.costToBeneficiaryOptical}
                    onChange={(e) => handleChange(e)}
                    min="0"
                    autoComplete="off"
                  />
                </FormControl>
              )}
            </td>
          </tr>
          <tr className="row">
            <th scope="row" className="col-md-4">
              Dispensed Optical
            </th>
            <td className="col-md-8">
              {!editMode && data.dispensedOptical}
              {editMode && (
                <FormControl fullWidth size="small">
                  <Select
                    onChange={(e) => handleChange(e)}
                    value={devices.dispensedOptical}
                    name="dispensedOptical"
                    MenuProps={MenuProps}
                  >
                    {dispensedOpticalOptions}
                  </Select>
                </FormControl>
              )}
              {editMode && showOther.dispensedOptical && (
                <FormControl fullWidth size="small">
                  <input
                    type="text"
                    id="dispensedOpticalOther"
                    value={otherDevices.dispensedOptical}
                    placeholder="Enter device name"
                    onChange={(e) =>
                      setOtherDevices({
                        ...otherDevices,
                        dispensedOptical: e.target.value,
                      })
                    }
                    autoComplete="off"
                  />
                </FormControl>
              )}
            </td>
          </tr>
          <tr className="row">
            <th scope="row" className="col-md-4">
              Training Given Optical
            </th>
            <td className="col-md-8">
              {!editMode && data.trainingGivenOptical}
              {editMode && (
                <FormControl fullWidth size="small">
                  <input
                    type="text"
                    name="trainingGivenOptical"
                    value={data.trainingGivenOptical}
                    onChange={(e) => handleChange(e)}
                    autoComplete="off"
                  />
                </FormControl>
              )}
            </td>
          </tr>
          <tr className="row">
            <th scope="row" className="col-md-4">
              Recommendation Non-Optical
            </th>
            <td className="col-md-8">
              {!editMode &&
                jsonToCSV([recommendationNonOpticalArr], {
                  ...config,
                  delimiter: commaAndSpace,
                })}
              {editMode && (
                <FormControl fullWidth size="small">
                  <Select
                    onChange={(e) =>
                      handleMultiSelectChange(e, "recommendationNonOptical")
                    }
                    value={devices.recommendationNonOptical}
                    name="recommendationNonOptical"
                    multiple
                    renderValue={(selected) => selected.join(", ")}
                    MenuProps={MenuProps}
                  >
                    {recommendationNonOpticalOptions}
                  </Select>
                </FormControl>
              )}
              {editMode && showOther.recommendationNonOptical && (
                <FormControl fullWidth size="small">
                  <input
                    type="text"
                    id="recommendationNonOpticalOther"
                    value={otherDevices.recommendationNonOptical}
                    placeholder="Enter device name"
                    onChange={(e) =>
                      setOtherDevices({
                        ...otherDevices,
                        recommendationNonOptical: e.target.value,
                      })
                    }
                    autoComplete="off"
                  />
                </FormControl>
              )}
            </td>
          </tr>
          <tr className="row">
            <th scope="row" className="col-md-4">
              Dispensed Date Non-Optical
            </th>
            <td className="col-md-8">
              {!editMode &&
                data.dispensedDateNonOptical !== null &&
                moment(data.dispensedDateNonOptical).format("DD MMMM YYYY")}
              {!editMode && data.dispensedDateNonOptical !== null && ""}
              {editMode && (
                <FormControl fullWidth size="small">
                  <input
                    type="date"
                    name="dispensedDateNonOptical"
                    value={moment(data.dispensedDateNonOptical).format(
                      "YYYY-MM-DD"
                    )}
                    onChange={(e) => handleChange(e)}
                  />
                </FormControl>
              )}
            </td>
          </tr>
          <tr className="row">
            <th scope="row" className="col-md-4">
              Cost Non-Optical
            </th>
            <td className="col-md-8">
              {!editMode && data.costNonOptical}
              {editMode && (
                <FormControl fullWidth size="small">
                  <input
                    type="number"
                    name="costNonOptical"
                    value={data.costNonOptical}
                    onChange={(e) => handleChange(e)}
                    min="0"
                    autoComplete="off"
                  />
                </FormControl>
              )}
            </td>
          </tr>
          <tr className="row">
            <th scope="row" className="col-md-4">
              Cost To Beneficiary NonOptical
            </th>
            <td className="col-md-8">
              {!editMode && data.costToBeneficiaryNonOptical}
              {editMode && (
                <FormControl fullWidth size="small">
                  <input
                    type="number"
                    name="costToBeneficiaryNonOptical"
                    value={data.costToBeneficiaryNonOptical}
                    onChange={(e) => handleChange(e)}
                    min="0"
                    autoComplete="off"
                  />
                </FormControl>
              )}
            </td>
          </tr>
          <tr className="row">
            <th scope="row" className="col-md-4">
              Dispensed Non-Optical
            </th>
            <td className="col-md-8">
              {!editMode && data.dispensedNonOptical}
              {editMode && (
                <FormControl fullWidth size="small">
                  <Select
                    onChange={(e) => handleChange(e)}
                    value={devices.dispensedNonOptical}
                    name="dispensedNonOptical"
                    MenuProps={MenuProps}
                  >
                    {dispensedNonOpticalOptions}
                  </Select>
                </FormControl>
              )}
              {editMode && showOther.dispensedNonOptical && (
                <FormControl fullWidth size="small">
                  <input
                    type="text"
                    id="dispensedNonOpticalOther"
                    value={otherDevices.dispensedNonOptical}
                    placeholder="Enter device name"
                    onChange={(e) =>
                      setOtherDevices({
                        ...otherDevices,
                        dispensedNonOptical: e.target.value,
                      })
                    }
                    autoComplete="off"
                  />
                </FormControl>
              )}
            </td>
          </tr>
          <tr className="row">
            <th scope="row" className="col-md-4">
              Training Given Non-Optical
            </th>
            <td className="col-md-8">
              {!editMode && data.trainingGivenNonOptical}
              {editMode && (
                <FormControl fullWidth size="small">
                  <input
                    type="text"
                    name="trainingGivenNonOptical"
                    value={data.trainingGivenNonOptical}
                    onChange={(e) => handleChange(e)}
                    autoComplete="off"
                  />
                </FormControl>
              )}
            </td>
          </tr>
          <tr className="row">
            <th scope="row" className="col-md-4">
              Recommendation Electronic
            </th>
            <td className="col-md-8">
              {!editMode &&
                jsonToCSV([recommendationElectronicArr], {
                  ...config,
                  delimiter: commaAndSpace,
                })}
              {editMode && (
                <FormControl fullWidth size="small">
                  <Select
                    onChange={(e) =>
                      handleMultiSelectChange(e, "recommendationElectronic")
                    }
                    value={devices.recommendationElectronic}
                    name="recommendationElectronic"
                    multiple
                    renderValue={(selected) => selected.join(", ")}
                    MenuProps={MenuProps}
                  >
                    {recommendationElectronicOptions}
                  </Select>
                </FormControl>
              )}
              {editMode && showOther.recommendationElectronic && (
                <FormControl fullWidth size="small">
                  <input
                    type="text"
                    id="recommendationElectronicOther"
                    value={otherDevices.recommendationElectronic}
                    placeholder="Enter device name"
                    onChange={(e) =>
                      setOtherDevices({
                        ...otherDevices,
                        recommendationElectronic: e.target.value,
                      })
                    }
                    autoComplete="off"
                  />
                </FormControl>
              )}
            </td>
          </tr>
          <tr className="row">
            <th scope="row" className="col-md-4">
              Dispensed Date Electronic
            </th>
            <td className="col-md-8">
              {!editMode &&
                data.dispensedDateElectronic !== null &&
                moment(data.dispensedDateElectronic).format("DD MMMM YYYY")}
              {!editMode && data.dispensedDateElectronic !== null && ""}
              {editMode && (
                <FormControl fullWidth size="small">
                  <input
                    type="date"
                    name="dispensedDateElectronic"
                    value={moment(data.dispensedDateElectronic).format(
                      "YYYY-MM-DD"
                    )}
                    onChange={(e) => handleChange(e)}
                  />
                </FormControl>
              )}
            </td>
          </tr>
          <tr className="row">
            <th scope="row" className="col-md-4">
              Cost Electronic
            </th>
            <td className="col-md-8">
              {!editMode && data.costElectronic}
              {editMode && (
                <FormControl fullWidth size="small">
                  <input
                    type="number"
                    name="costElectronic"
                    value={data.costElectronic}
                    onChange={(e) => handleChange(e)}
                    min="0"
                    autoComplete="off"
                  />
                </FormControl>
              )}
            </td>
          </tr>
          <tr className="row">
            <th scope="row" className="col-md-4">
              Cost To Beneficiary Electronic
            </th>
            <td className="col-md-8">
              {!editMode && data.costToBeneficiaryElectronic}
              {editMode && (
                <FormControl fullWidth size="small">
                  <input
                    type="number"
                    name="costToBeneficiaryElectronic"
                    value={data.costToBeneficiaryElectronic}
                    onChange={(e) => handleChange(e)}
                    min="0"
                    autoComplete="off"
                  />
                </FormControl>
              )}
            </td>
          </tr>
          <tr className="row">
            <th scope="row" className="col-md-4">
              Dispensed Electronic
            </th>
            <td className="col-md-8">
              {!editMode && data.dispensedElectronic}
              {editMode && (
                <FormControl fullWidth size="small">
                  <Select
                    onChange={(e) => handleChange(e)}
                    value={devices.dispensedElectronic}
                    name="dispensedElectronic"
                    MenuProps={MenuProps}
                  >
                    {dispensedElectronicOptions}
                  </Select>
                </FormControl>
              )}
              {editMode && showOther.dispensedElectronic && (
                <FormControl fullWidth size="small">
                  <input
                    type="text"
                    id="dispensedElectronicOther"
                    value={otherDevices.dispensedElectronic}
                    placeholder="Enter device name"
                    onChange={(e) =>
                      setOtherDevices({
                        ...otherDevices,
                        dispensedElectronic: e.target.value,
                      })
                    }
                    autoComplete="off"
                  />
                </FormControl>
              )}
            </td>
          </tr>
          <tr className="row">
            <th scope="row" className="col-md-4">
              Training Given Electronic
            </th>
            <td className="col-md-8">
              {!editMode && data.trainingGivenElectronic}
              {editMode && (
                <FormControl fullWidth size="small">
                  <input
                    type="text"
                    name="trainingGivenElectronic"
                    value={data.trainingGivenElectronic}
                    onChange={(e) => handleChange(e)}
                    autoComplete="off"
                  />
                </FormControl>
              )}
            </td>
          </tr>
          <tr className="row">
            <th scope="row" className="col-md-4">
              Colour Vision Right Eye
            </th>
            <td className="col-md-8">
              {!editMode && data.colourVisionRE}
              {editMode && (
                <FormControl fullWidth size="small">
                  <input
                    type="text"
                    name="colourVisionRE"
                    value={data.colourVisionRE}
                    onChange={(e) => handleChange(e)}
                    autoComplete="off"
                  />
                </FormControl>
              )}
            </td>
          </tr>
          <tr className="row">
            <th scope="row" className="col-md-4">
              Colour Vision Left Eye
            </th>
            <td className="col-md-8">
              {!editMode && data.colourVisionLE}
              {editMode && (
                <FormControl fullWidth size="small">
                  <input
                    type="text"
                    name="colourVisionLE"
                    value={data.colourVisionLE}
                    onChange={(e) => handleChange(e)}
                    autoComplete="off"
                  />
                </FormControl>
              )}
            </td>
          </tr>
          <tr className="row">
            <th scope="row" className="col-md-4">
              Contrast Sensitivity Right Eye
            </th>
            <td className="col-md-8">
              {!editMode && data.contrastSensitivityRE}
              {editMode && (
                <FormControl fullWidth size="small">
                  <input
                    type="text"
                    name="contrastSensitivityRE"
                    value={data.contrastSensitivityRE}
                    onChange={(e) => handleChange(e)}
                    autoComplete="off"
                  />
                </FormControl>
              )}
            </td>
          </tr>
          <tr className="row">
            <th scope="row" className="col-md-4">
              Contrast Sensitivity Left Eye
            </th>
            <td className="col-md-8">
              {!editMode && data.contrastSensitivityLE}
              {editMode && (
                <FormControl fullWidth size="small">
                  <input
                    type="text"
                    name="contrastSensitivityLE"
                    value={data.contrastSensitivityLE}
                    onChange={(e) => handleChange(e)}
                    autoComplete="off"
                  />
                </FormControl>
              )}
            </td>
          </tr>
          <tr className="row">
            <th scope="row" className="col-md-4">
              Visual Fields Right Eye
            </th>
            <td className="col-md-8">
              {!editMode && data.visualFieldsRE}
              {editMode && (
                <FormControl fullWidth size="small">
                  <input
                    type="text"
                    name="visualFieldsRE"
                    value={data.visualFieldsRE}
                    onChange={(e) => handleChange(e)}
                    autoComplete="off"
                  />
                </FormControl>
              )}
            </td>
          </tr>
          <tr className="row">
            <th scope="row" className="col-md-4">
              Visual Fields Left Eye
            </th>
            <td className="col-md-8">
              {!editMode && data.visualFieldsLE}
              {editMode && (
                <FormControl fullWidth size="small">
                  <input
                    type="text"
                    name="visualFieldsLE"
                    value={data.visualFieldsLE}
                    onChange={(e) => handleChange(e)}
                    autoComplete="off"
                  />
                </FormControl>
              )}
            </td>
          </tr>
          <tr className="row">
            <th scope="row" className="col-md-4">
              Extra Information
            </th>
            <td className="col-md-8">
              {!editMode && data.extraInformation}
              {editMode && (
                <FormControl fullWidth size="small">
                  <input
                    type="text"
                    name="extraInformation"
                    value={data.extraInformation}
                    onChange={(e) => handleChange(e)}
                    autoComplete="off"
                  />
                </FormControl>
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
          onClick={saveCLVEData}
        >
          Save
        </button>
      )}
    </div>
  );
}

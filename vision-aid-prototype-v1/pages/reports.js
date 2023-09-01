import { readUser } from "./api/user";
import { getSession } from "next-auth/react";
import { Chart as ChartJS } from "chart.js/auto";
import { Chart } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import {
  getSummaryForAllHospitals,
  getSummaryForHospitalFromID,
} from "@/pages/api/hospital";
import { Container } from "react-bootstrap";
import Navigation from "./navigation/Navigation";
import { Table } from "react-bootstrap";
import Link from "next/link";
import moment from "moment";
import { useState, useEffect } from "react";
import { findAllBeneficiary } from "@/pages/api/beneficiary";
import { CSVLink, CSVDownload } from "react-csv";
import GraphCustomizer from "./components/GraphCustomizer";
import { Tab, Tabs, Paper } from "@mui/material";
import * as XLSX from "xlsx";
import { Orienta } from "@next/font/google";

// This function is called to load data from the server side.
export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  if (session == null) {
    console.log("session is null");
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // If it's a non admin user, we only want to show the summary for their hospital
  const user = await readUser(session.user.email);
  if (user.admin == null) {
    const hospitalSummary = await getSummaryForHospitalFromID(
      user.hospitalRole.hospitalId
    );
    return {
      props: {
        user: user,
        summary: JSON.parse(JSON.stringify([hospitalSummary])),
        error: null,
      },
    };
  }

  // The user is an admin, so we want to show the summary for all hospitals

  // The following is code to download summary data as a CSV file
  const beneficiaryListFromAPI = await findAllBeneficiary();

  let beneficiaryList = beneficiaryListFromAPI.map((beneficiary) => ({
    mrn: beneficiary.mrn,
    beneficiaryName: beneficiary.beneficiaryName,
    hospitalId: beneficiary.hospitalId,
    dateOfBirth: beneficiary.dateOfBirth,
    gender: beneficiary.gender,
    phoneNumber: beneficiary.phoneNumber,
    education: beneficiary.education,
    occupation: beneficiary.occupation,
    districts: beneficiary.districts,
    state: beneficiary.state,
    diagnosis: beneficiary.diagnosis,
    vision: beneficiary.vision,
    mDVI: beneficiary.mDVI,
    extraInformation: beneficiary.extraInformation,
    hospital: beneficiary.hospital,
    visionEnhancement: beneficiary.Vision_Enhancement,
    counsellingEducation: beneficiary.Counselling_Education,
    comprehensiveLowVisionEvaluation:
      beneficiary.Comprehensive_Low_Vision_Evaluation,
    lowVisionEvaluation: beneficiary.Low_Vision_Evaluation,
    training: beneficiary.Training,
    computerTraining: beneficiary.Computer_Training,
    mobileTraining: beneficiary.Mobile_Training,
    orientationMobilityTraining: beneficiary.Orientation_Mobility_Training,
  }));

  let flatList = [];
  console.log("here");
  function flatFields(extraInformation, key) {
    let flat = {};
    try {
      const ex = JSON.parse(extraInformation);
      for (let i = 0; i < ex.length; i++) {
        const e = ex[i];
        flat[(key + "." + i + "." + e.name).replaceAll(",", " ")] =
          e.value.replaceAll(",", " ");
      }
    } catch (e) {
      return {};
    }
    return flat;
  }

  function flatChildArray(childArray, key) {
    let flat = {};
    try {
      for (let i1 = 0; i1 < childArray.length; i1++) {
        const child = childArray[i1];
        for (let i = 0; i < Object.keys(child).length; i++) {
          const jsonKey = Object.keys(child)[i];
          flat[(key + "." + i1 + "." + jsonKey).replaceAll(",", " ")] =
            child[jsonKey] == null
              ? ""
              : child[jsonKey].toString().replaceAll(",", " ");
        }
      }
    } catch (e) {
      return {};
    }
    return flat;
  }

  function appendFlat(appendFrom, appendTo) {
    Object.keys(appendFrom).forEach((append) => {
      appendTo[append] = appendFrom[append];
    });
  }

  for (const beneficiary of beneficiaryListFromAPI) {
    const visionEnhancementFlat = flatChildArray(
      beneficiary.Vision_Enhancement,
      "visionEnhancement"
    );
    const counselingEducationFlat = flatChildArray(
      beneficiary.Counselling_Education,
      "counselingEducation"
    );
    const comprehensiveLowVisionEvaluationFlat = flatChildArray(
      beneficiary.Comprehensive_Low_Vision_Evaluation,
      "comprehensiveLowVisionEvaluation"
    );
    const lowVisionEvaluationFlat = flatChildArray(
      beneficiary.Low_Vision_Evaluation,
      "lowVisionEvaluation"
    );
    const trainingFlat = flatChildArray(beneficiary.Training, "training");
    const computerTrainingFlat = flatChildArray(
      beneficiary.Computer_Training,
      "computerTraining"
    );
    const mobileTrainingFlat = flatChildArray(
      beneficiary.Mobile_Training,
      "mobileTraining"
    );
    const orientationMobilityTrainingFlat = flatChildArray(
      beneficiary.Orientation_Mobility_Training,
      "orientationMobilityTraining"
    );
    const extraFields = flatFields(
      beneficiary.extraInformation,
      "BeneficiaryExtraField"
    );
    let flat = {
      mrn: beneficiary.mrn.replaceAll(",", " "),
      hospitalName:
        beneficiary.hospital == null
          ? ""
          : beneficiary.hospital.name.replaceAll(",", " "),
      beneficiaryName:
        beneficiary.beneficiaryName == null
          ? ""
          : beneficiary.beneficiaryName.replaceAll(",", " "),
      dateOfBirth:
        beneficiary.dateOfBirth == null
          ? ""
          : beneficiary.dateOfBirth.toString().replaceAll(",", " "),
      gender:
        beneficiary.gender == null
          ? ""
          : beneficiary.gender.replaceAll(",", " "),
      phoneNumber:
        beneficiary.phoneNumber == null
          ? ""
          : beneficiary.phoneNumber.replaceAll(",", " "),
      education:
        beneficiary.education == null
          ? ""
          : beneficiary.education.replaceAll(",", " "),
      occupation:
        beneficiary.occupation == null
          ? ""
          : beneficiary.occupation.replaceAll(",", " "),
      districts:
        beneficiary.districts == null
          ? ""
          : beneficiary.districts.replaceAll(",", " "),
      state:
        beneficiary.state == null ? "" : beneficiary.state.replaceAll(",", " "),
      diagnosis:
        beneficiary.diagnosis == null
          ? ""
          : beneficiary.diagnosis.replaceAll(",", " "),
      vision:
        beneficiary.vision == null
          ? ""
          : beneficiary.vision.replaceAll(",", " "),
      mDVI:
        beneficiary.mDVI == null ? "" : beneficiary.mDVI.replaceAll(",", " "),
      rawExtraFields:
        beneficiary.extraInformation == null
          ? ""
          : beneficiary.extraInformation.replaceAll(",", " "),
      visionEnhancement: JSON.stringify(beneficiary.Vision_Enhancement),
      counsellingEducation: JSON.stringify(beneficiary.Counselling_Education),
      comprehensiveLowVisionEvaluation: JSON.stringify(
        beneficiary.Comprehensive_Low_Vision_Evaluation
      ),
      lowVisionEvaluation: JSON.stringify(beneficiary.Low_Vision_Evaluation),
      training: JSON.stringify(beneficiary.Training),
      computerTraining: JSON.stringify(beneficiary.Computer_Training),
      mobileTraining: JSON.stringify(beneficiary.Mobile_Training),
      orientationMobilityTraining: JSON.stringify(
        beneficiary.Orientation_Mobility_Training
      ),
    };
    appendFlat(extraFields, flat);
    appendFlat(visionEnhancementFlat, flat);
    appendFlat(counselingEducationFlat, flat);
    appendFlat(comprehensiveLowVisionEvaluationFlat, flat);
    appendFlat(lowVisionEvaluationFlat, flat);
    appendFlat(trainingFlat, flat);
    appendFlat(computerTrainingFlat, flat);
    appendFlat(mobileTrainingFlat, flat);
    appendFlat(orientationMobilityTrainingFlat, flat);
    flatList.push(flat);
  }

  // We finally return all the data to the page
  if (user.admin != null) {
    const summary = await getSummaryForAllHospitals();

    return {
      props: {
        user: user,
        summary: JSON.parse(JSON.stringify(summary)),
        beneficiaryList: JSON.parse(JSON.stringify(beneficiaryList)),
        beneficiaryFlatList: flatList,
        error: null,
      },
    };
  }
}

// This function is used to filter a given training by date range
function filterByDate(training, start, end) {
  // increment end date by one day to include the end date
  start = moment(start).subtract(1, "day");
  return moment(training.date).isBetween(
    moment(start).startOf("day"),
    moment(end).startOf("day"),
    null,
    "[]"
  );
}

// This function is used to filter the entire summary data by date range
function filterTrainingSummaryByDateRange(
  startDate,
  endDate,
  summary,
  summaryType
) {
  const filteredSummary = summary.map((element) => {
    const mobileTraining = element.mobileTraining.filter((training) => {
      // log data of each training
      return filterByDate(training, startDate, endDate);
    });
    // log the difference in length before and after filter

    const computerTraining = element.computerTraining.filter((training) => {
      return filterByDate(training, startDate, endDate);
    });

    const orientationMobilityTraining =
      element.orientationMobilityTraining.filter((training) => {
        return filterByDate(training, startDate, endDate);
      });

    const visionEnhancement = element.visionEnhancement.filter((training) => {
      return filterByDate(training, startDate, endDate);
    });

    const counsellingEducation = element.counsellingEducation.filter(
      (training) => {
        return filterByDate(training, startDate, endDate);
      }
    );

    const comprehensiveLowVisionEvaluation =
      element.comprehensiveLowVisionEvaluation.filter((training) => {
        return filterByDate(training, startDate, endDate);
      });

    const lowVisionEvaluation = element.lowVisionEvaluation.filter(
      (training) => {
        return filterByDate(training, startDate, endDate);
      }
    );

    let filteredElement = {
      ...element,
      mobileTraining,
      computerTraining,
      orientationMobilityTraining,
      visionEnhancement,
      counsellingEducation,
      comprehensiveLowVisionEvaluation,
      lowVisionEvaluation,
    };

    if (summaryType === "hospital") {
      const beneficiary = element.beneficiary;

      return {
        ...filteredElement,
        beneficiary,
      };
    } else if (summaryType === "beneficiary") {
      const training = element.training.filter((tr) => {
        return filterByDate(tr, startDate, endDate);
      });

      return {
        ...filteredElement,
        training,
      };
    }
  });

  return filteredSummary;
}

// Graph Options that are constant for all graphs
const graphOptions = {
  backgroundColor: [
    "rgba(255, 99, 132, 0.2)",
    "rgba(54, 162, 235, 0.2)",
    "rgba(255, 206, 86, 0.2)",
    "rgba(75, 192, 192, 0.2)",
    "rgba(153, 102, 255, 0.2)",
    "rgba(255, 159, 64, 0.2)",
    "rgba(255, 99, 132, 0.2)",
    "rgba(119, 221, 119, 0.2)",
  ],
  borderColor: [
    "rgba(255, 99, 132, 1)",
    "rgba(54, 162, 235, 1)",
    "rgba(255, 206, 86, 1)",
    "rgba(75, 192, 192, 1)",
    "rgba(153, 102, 255, 1)",
    "rgba(255, 159, 64, 1)",
    "rgba(255, 99, 132, 1)",
    "rgba(119, 221, 119, 1)",
  ],
  borderWidth: 1,
};

// Function that builds a bar graph to show number of beneficiaries per hospital
function buildBeneficiaryGraph(data) {
  // data is an array of hopital objects
  const simplifiedData = data.map((hospital) => {
    return {
      name: hospital.name,
      value: hospital.beneficiary.length,
    };
  });

  // create a bar graph with graphData
  const graphData = {
    labels: simplifiedData.map((hospital) => hospital.name),
    datasets: [
      {
        label: "Beneficiaries",
        data: simplifiedData.map((hospital) => hospital.value),
        ...graphOptions,
      },
    ],
  };
  return graphData;
}

// Function that builds a bar graph to show all the activities involved
function buildActivitiesGraph(data) {
  //First get the evaluations
  const lowVisionScreeningCount = data.reduce(
    (sum, item) => sum + item.lowVisionEvaluation.length,
    0
  );
  const comprehensiveLowVisionEvaluationCount = data.reduce(
    (sum, item) => sum + item.comprehensiveLowVisionEvaluation.length,
    0
  );
  const visionEnhancementCount = data.reduce(
    (sum, item) => sum + item.visionEnhancement.length,
    0
  );

  // Then the trainings
  const mobileTrainingCount = data.reduce(
    (sum, item) => sum + item.mobileTraining.length,
    0
  );
  const computerTrainingCount = data.reduce(
    (sum, item) => sum + item.computerTraining.length,
    0
  );
  const orientationMobilityTrainingCount = data.reduce(
    (sum, item) => sum + item.orientationMobilityTraining.length,
    0
  );
  const trainingCount =
    data.reduce((sum, item) => sum + item.training.length, 0) +
    mobileTrainingCount +
    computerTrainingCount +
    orientationMobilityTrainingCount;

  // Then the counselling
  const counsellingCount = data.reduce(
    (sum, item) => sum + item.counsellingEducation.length,
    0
  );

  const chartData = {
    labels: [
      `Low Vision Screening (${lowVisionScreeningCount})`,
      `Comprehensive Low Vision Evaluation (${comprehensiveLowVisionEvaluationCount})`,
      `Vision Enhancement (${visionEnhancementCount})`,
      `All Training (${trainingCount})`,
      `All Counselling (${counsellingCount})`,
    ],
    datasets: [
      {
        label: "Cumulative Counts",
        data: [
          lowVisionScreeningCount,
          comprehensiveLowVisionEvaluationCount,
          visionEnhancementCount,
          trainingCount,
          counsellingCount,
        ],
        ...graphOptions,
      },
    ],
  };

  return chartData;
}

// Function that builds a bar graph at a sublevel. This function is called
// with both "training" and "counselling" as the breakdownType
function buildBreakdownGraph(data, breakdownType) {
  const types = data.reduce((types, hospital) => {
    const hospitalTypes = hospital[breakdownType].map((item) => item.type);
    return [...types, ...hospitalTypes];
  }, []);

  const typeCounts = types.reduce((counts, type) => {
    const count = counts[type] || 0;
    return {
      ...counts,
      [type]: count + 1,
    };
  }, {});

  const chartData = {
    labels: Object.keys(typeCounts),
    datasets: [
      {
        label: "Cumulative Counts",
        data: Object.values(typeCounts),
        ...graphOptions,
      },
    ],
  };

  return chartData;
}

// Function that builds a bar graph to show the number of devices dispensed
function buildDevicesGraph(data) {
  // The device information is stored inside the comprehensiveLowVisionEvaluation array
  // Inside the array, there are fields dispensedSpectacle, dispensedElectronic, dispensedOptical, dispensedNonOptical which is either "Yes" or "No"
  // We want to count the number of "Yes" for each field
  const dispensedSpectacleCount = data.reduce(
    (sum, item) =>
      sum +
      item.comprehensiveLowVisionEvaluation.filter(
        (evaluation) => evaluation.dispensedSpectacle === "Yes"
      ).length,
    0
  );
  const dispensedElectronicCount = data.reduce(
    (sum, item) =>
      sum +
      item.comprehensiveLowVisionEvaluation.filter(
        (evaluation) => evaluation.dispensedElectronic === "Yes"
      ).length,
    0
  );
  const dispensedOpticalCount = data.reduce(
    (sum, item) =>
      sum +
      item.comprehensiveLowVisionEvaluation.filter(
        (evaluation) => evaluation.dispensedOptical === "Yes"
      ).length,
    0
  );
  const dispensedNonOpticalCount = data.reduce(
    (sum, item) =>
      sum +
      item.comprehensiveLowVisionEvaluation.filter(
        (evaluation) => evaluation.dispensedNonOptical === "Yes"
      ).length,
    0
  );

  const chartData = {
    labels: [
      `Spectacle (${dispensedSpectacleCount})`,
      `Electronic (${dispensedElectronicCount})`,
      `Optical (${dispensedOpticalCount})`,
      `Non-Optical (${dispensedNonOpticalCount})`,
    ],
    datasets: [
      {
        label: "Cumulative Counts",
        data: [
          dispensedSpectacleCount,
          dispensedElectronicCount,
          dispensedOpticalCount,
          dispensedNonOpticalCount,
        ],
        ...graphOptions,
      },
    ],
  };

  return chartData;
}

export default function Summary({
  user,
  summary,
  beneficiaryList,
  beneficiaryFlatList,
  error,
}) {
  // create start date and end data states, start date is set to one year ago, end date is set to today
  const [startDate, setStartDate] = useState(
    moment().subtract(1, "year").toDate()
  );
  const [endDate, setEndDate] = useState(moment().toDate());

  const [selectedHospitals, setSelectedHospitals] = useState([]);

  useEffect(() => {
    setSelectedHospitals(summary.map((item) => item.id));
    // setSelectedHospitals(
    //   summary.map((item) => ({ id: item.id, name: item.name }))
    // );
  }, []);

  const handleHospitalSelection = (event) => {
    const hospitalId = parseInt(event.target.value);
    const isChecked = event.target.checked;

    if (isChecked) {
      setSelectedHospitals([...selectedHospitals, hospitalId]);
    } else {
      setSelectedHospitals(selectedHospitals.filter((id) => id !== hospitalId));
    }
  };

  const handleSelectAll = () => {
    setSelectedHospitals(summary.map((item) => item.id));
  };

  const getAge = (dateString) => {
    let today = new Date();
    let birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age -= 1;
    }
    return age;
  };

  // filter summary data based on start and end date of the training
  const dateFilteredSummary = filterTrainingSummaryByDateRange(
    startDate,
    endDate,
    summary,
    "hospital"
  );
  // filter summary data based on selected hospitals
  const filteredSummary = dateFilteredSummary.filter((item) =>
    selectedHospitals.includes(item.id)
  );

  const dateFilteredBeneficiaryData = filterTrainingSummaryByDateRange(
    startDate,
    endDate,
    JSON.parse(JSON.stringify(beneficiaryList)),
    "beneficiary"
  );

  const filteredBeneficiaryData = dateFilteredBeneficiaryData.filter((item) =>
    selectedHospitals.includes(item.hospital.id)
  );

  // generate all the data for required graphs
  const beneficiaryGraphData = buildBeneficiaryGraph(filteredSummary);
  const activitiesGraphData = buildActivitiesGraph(filteredSummary);
  const trainingBreakdownGraphData = buildBreakdownGraph(
    filteredSummary,
    "training"
  );
  const counsellingBreakdownGraphData = buildBreakdownGraph(
    filteredSummary,
    "counsellingEducation"
  );
  const devicesGraphData = buildDevicesGraph(filteredSummary);

  let beneficiaryData = [];
  let visionEnhancementData = [];
  let lowVisionEvaluationData = [];
  let comprehensiveLowVisionEvaluationData = [];
  let computerTrainingData = [];
  let mobileTrainingData = [];
  let orientationMobilityTrainingData = [];
  let trainingData = [];
  let counsellingEducationData = [];

  let beneficiaryIdx = 1;
  let clveIdx = 1;
  let veIdx = 1;
  let lveIdx = 1;
  let ctIdx = 1;
  let mtIdx = 1;
  let omtIdx = 1;
  let tIdx = 1;
  let ceIdx = 1;

  // Filtered Report Download
  for (let beneficiary of filteredBeneficiaryData) {
    // Commmon preceding columns for all sheets
    let commonData = {
      Index: beneficiaryIdx,
      Date: new Date(beneficiary["dateOfBirth"])
        .toLocaleDateString()
        .split(",")[0],
      MRN: beneficiary["mrn"],
      "Name of the Patient": beneficiary["beneficiaryName"],
      Age: getAge(beneficiary["dateOfBirth"]),
      Gender: beneficiary["gender"],
      Education: beneficiary["education"],
      Occupation: beneficiary["occupation"],
      Diagnosis: beneficiary["diagnosis"],
      District: beneficiary["districts"],
      State: beneficiary["state"],
    };

    // Beneficiary Data Sheet:
    let beneficiaryJson = { ...commonData };
    beneficiaryJson["Phone Number"] = beneficiary["phoneNumber"];
    beneficiaryJson["Hospital Name"] = beneficiary["hospital"]["name"];
    beneficiaryJson["Vision"] = beneficiary["vision"];
    beneficiaryJson["MDVI"] = beneficiary["mDVI"];
    beneficiaryJson["Extra Information"] = beneficiary["rawExtraFields"];
    beneficiaryData.push(beneficiaryJson);
    beneficiaryIdx += 1;

    // CLVE sheet:
    let beneficiaryCLVE = beneficiary["comprehensiveLowVisionEvaluation"];
    for (let clveData of beneficiaryCLVE) {
      let clveJson = { ...commonData };
      clveJson["Index"] = clveIdx;
      clveJson["Date"] = new Date(clveData["date"])
        .toLocaleDateString()
        .split(",")[0];
      clveJson["Diagnosis"] = clveData["diagnosis"];
      // clveJson["Acuity"] = {
      //   "Notation": clveData["distanceVisualAcuityRE"].split(" ")[1], // insert check for if [1] exists
      //   "RE": clveData["distanceVisualAcuityRE"].split(" ")[0],
      //   "LE": clveData["distanceVisualAcuityLE"].split(" ")[0],
      //   "BE": clveData["distanceBinocularVisionBE"].split(" ")[0],
      // }
      clveJson["Acuity Notation"] =
        clveData["distanceVisualAcuityRE"].split(" ")[1]; // insert check for if [1] exists
      clveJson["RE Acuity"] = clveData["distanceVisualAcuityRE"].split(" ")[0];
      clveJson["LE Acuity"] = clveData["distanceVisualAcuityLE"].split(" ")[0];
      clveJson["BE Acuity"] =
        clveData["distanceBinocularVisionBE"].split(" ")[0];
      clveJson["Near Visual Acuity Notation"] =
        clveData["nearVisualAcuityRE"].split(" ")[1]; // insert check for if [1] exists
      clveJson["RE Near Visual Acuity"] =
        clveData["nearVisualAcuityRE"].split(" ")[0];
      clveJson["LE Near Visual Acuity"] =
        clveData["nearVisualAcuityLE"].split(" ")[0];
      clveJson["BE Near Visual Acuity"] =
        clveData["nearBinocularVisionBE"].split(" ")[0];
      clveJson["Recommended Optical Aid"] = clveData["recommendationOptical"];
      clveJson["Recommended Non-Optical Aid"] =
        clveData["recommendationNonOptical"];
      clveJson["Recommended Electronic Aid"] =
        clveData["recommendationElectronic"];
      clveJson["Spectacles (Refractive Error Only)"] =
        clveData["recommendationSpectacle"]; // check correctness?
      clveJson["Dispensed Optical Aid"] = clveData["dispensedOptical"];
      clveJson["Dispensed Non-Optical Aid"] = clveData["dispensedNonOptical"];
      clveJson["Dispensed Electronic Aid"] = clveData["dispensedElectronic"];
      clveJson["Dispensed Spectacles (Refractive Error Only)"] =
        clveData["dispensedSpectacle"];
      clveJson["Cost of all the aids dispensed"] =
        clveData["costOptical"] +
        clveData["costNonOptical"] +
        clveData["costElectronic"] +
        clveData["costSpectacle"];
      clveJson["Cost to the Beneficiary"] =
        clveData["costToBeneficiaryOptical"] +
        clveData["costToBeneficiaryNonOptical"] +
        clveData["costToBeneficiaryElectronic"] +
        clveData["costToBeneficiarySpectacle"];

      comprehensiveLowVisionEvaluationData.push(clveJson);
      clveIdx += 1;
    }

    // Vision Enhancement Sheet
    let beneficiaryVE = beneficiary["visionEnhancement"];

    for (let veData of beneficiaryVE) {
      let veJson = { ...commonData };
      veJson["Index"] = veIdx;
      veJson["Date"] = new Date(veData["date"])
        .toLocaleDateString()
        .split(",")[0];
      veJson["Diagnosis"] = veData["Diagnosis"];
      veJson["Session Number"] = veData["sessionNumber"];
      veJson["MDVI"] = veData["MDVI"];
      veJson["Extra Information"] = veData["extraInformation"];

      visionEnhancementData.push(veJson);
      veIdx += 1;
    }

    // Low Vision Enhancement Sheet
    let beneficiaryLVE = beneficiary["lowVisionEvaluation"];

    for (let lveData of beneficiaryLVE) {
      let lveJson = { ...commonData };
      lveJson["Index"] = lveIdx;
      lveJson["Date"] = new Date(lveData["date"])
        .toLocaleDateString()
        .split(",")[0];
      lveJson["Diagnosis"] = lveData["diagnosis"];
      lveJson["Session Number"] = lveData["sessionNumber"];
      lveJson["MDVI"] = lveData["mdvi"];
      lveJson["Extra Information"] = lveData["extraInformation"];
      lveJson["Acuity Notation"] =
        lveData["distanceVisualAcuityRE"].split(" ")[1]; // insert check for if [1] exists
      lveJson["RE Acuity"] = lveData["distanceVisualAcuityRE"].split(" ")[0];
      lveJson["LE Acuity"] = lveData["distanceVisualAcuityLE"].split(" ")[0];
      lveJson["BE Acuity"] = lveData["distanceBinocularVisionBE"].split(" ")[0];
      lveJson["Near Visual Acuity Notation"] =
        lveData["nearVisualAcuityRE"].split(" ")[1]; // insert check for if [1] exists
      lveJson["RE Near Visual Acuity"] =
        lveData["nearVisualAcuityRE"].split(" ")[0];
      lveJson["LE Near Visual Acuity"] =
        lveData["nearVisualAcuityLE"].split(" ")[0];
      lveJson["BE Near Visual Acuity"] =
        lveData["nearBinocularVisionBE"].split(" ")[0];
      lveJson["Recommended Optical Aid"] = lveData["recommendationOptical"];
      lveJson["Recommended Non-Optical Aid"] =
        lveData["recommendationNonOptical"];
      lveJson["Recommended Electronic Aid"] =
        lveData["recommendationElectronic"];
      lveJson["Spectacles (Refractive Error Only)"] =
        lveData["recommendationSpectacle"];

      lowVisionEvaluationData.push(lveJson);
      lveIdx += 1;
    }

    // Computer Training Sheet
    let beneficiaryCT = beneficiary["computerTraining"];

    for (let ctData of beneficiaryCT) {
      let ctJson = { ...commonData };
      ctJson["Index"] = ctIdx;
      ctJson["Date"] = new Date(ctData["date"])
        .toLocaleDateString()
        .split(",")[0];
      ctJson["Session Number"] = ctData["sessionNumber"];
      ctJson["Vision Type"] = ctData["visionType"];
      ctJson["Type of Training"] = ctData["typeOfTraining"];
      ctJson["Extra Information"] = ctData["extraInformation"];

      computerTrainingData.push(ctJson);
      ctIdx += 1;
    }

    // Mobile Training Sheet
    let beneficiaryMT = beneficiary["mobileTraining"];

    for (let mtData of beneficiaryMT) {
      let mtJson = { ...commonData };
      mtJson["Index"] = mtIdx;
      mtJson["Date"] = new Date(mtData["date"])
        .toLocaleDateString()
        .split(",")[0];
      mtJson["Session Number"] = mtData["sessionNumber"];
      mtJson["Vision Type"] = mtData["vision"];
      mtJson["Type of Training"] = mtData["typeOfTraining"];
      mtJson["Extra Information"] = mtData["extraInformation"];

      mobileTrainingData.push(mtJson);
      mtIdx += 1;
    }

    // Orientation Mobility Training Sheet
    let beneficiaryOMT = beneficiary["orientationMobilityTraining"];

    for (let omtData of beneficiaryOMT) {
      let omtJson = { ...commonData };
      omtJson["Index"] = omtIdx;
      omtJson["Date"] = new Date(omtData["date"])
        .toLocaleDateString()
        .split(",")[0];
      omtJson["Session Number"] = omtData["sessionNumber"];
      omtJson["Vision Type"] = omtData["vision"];
      omtJson["Type of Training"] = omtData["typeOfTraining"];
      omtJson["Extra Information"] = omtData["extraInformation"];

      orientationMobilityTrainingData.push(omtJson);
      omtIdx += 1;
    }

    // Training Sheet
    let beneficiaryT = beneficiary["training"];

    for (let tData of beneficiaryT) {
      let tJson = { ...commonData };
      tJson["Index"] = tIdx;
      tJson["Date"] = new Date(tData["date"])
        .toLocaleDateString()
        .split(",")[0];
      tJson["Session Number"] = tData["sessionNumber"];
      tJson["Type of Training"] = tData["type"];
      tJson["Sub Type"] = tData["subType"];
      tJson["Extra Information"] = tData["extraInformation"];

      trainingData.push(tJson);
      tIdx += 1;
    }

    // Counseling Education Sheet
    let beneficiaryCE = beneficiary["counsellingEducation"];

    for (let ceData of beneficiaryCE) {
      let ceJson = { ...commonData };
      ceJson["Index"] = ceIdx;
      ceJson["Date"] = new Date(ceData["date"])
        .toLocaleDateString()
        .split(",")[0];
      ceJson["Session Number"] = ceData["sessionNumber"];
      ceJson["MDVI"] = ceData["MDVI"];
      ceJson["Vision Type"] = ceData["vision"];
      ceJson["Type"] = ceData["type"];
      ceJson["Type of Counselling"] = ceData["typeCounselling"];
      ceJson["Extra Information"] = ceData["extraInformation"];

      counsellingEducationData.push(ceJson);
      ceIdx += 1;
    }
  }

  const downloadFilteredReport = () => {
    const wb = XLSX.utils.book_new();

    const wben = XLSX.utils.json_to_sheet(beneficiaryData);
    const wved = XLSX.utils.json_to_sheet(visionEnhancementData);
    const wlved = XLSX.utils.json_to_sheet(lowVisionEvaluationData);
    const wclve = XLSX.utils.json_to_sheet(
      comprehensiveLowVisionEvaluationData
    );
    const wctd = XLSX.utils.json_to_sheet(computerTrainingData);
    const wmtd = XLSX.utils.json_to_sheet(mobileTrainingData);
    const womtd = XLSX.utils.json_to_sheet(orientationMobilityTrainingData);
    const wtd = XLSX.utils.json_to_sheet(trainingData);
    const wced = XLSX.utils.json_to_sheet(counsellingEducationData);

    XLSX.utils.book_append_sheet(wb, wben, "Beneficiary Sheet");
    XLSX.utils.book_append_sheet(wb, wved, "Vision Enhancement Sheet");
    XLSX.utils.book_append_sheet(wb, wlved, "Low Vision Screening");
    XLSX.utils.book_append_sheet(wb, wclve, "CLVE Sheet");
    XLSX.utils.book_append_sheet(wb, wctd, "Computer Training Sheet");
    XLSX.utils.book_append_sheet(wb, wmtd, "Mobile Training Sheet");
    XLSX.utils.book_append_sheet(wb, womtd, "Orientation Mobile Sheet");
    XLSX.utils.book_append_sheet(wb, wtd, "Training Sheet");
    XLSX.utils.book_append_sheet(wb, wced, "Counselling Education Sheet");

    XLSX.writeFile(wb, "filtered_report.xlsx");
  };

  const handleStartDateChange = (e) => {
    setStartDate(moment(e.target.value).toDate());
  };

  const handleEndDateChange = (e) => {
    setEndDate(moment(e.target.value).toDate());
  };

  const [activeGraphTab, setActiveGraphTab] = useState(0);
  const handleGraphTabChange = (event, newValue) => {
    setActiveGraphTab(newValue);
  };

  const renderGraph = (activeTab) => {
    switch (activeTab) {
      case 0:
        return <Bar data={beneficiaryGraphData} />;
      case 1:
        return <Bar data={activitiesGraphData} />;
      case 2:
        return <Bar data={trainingBreakdownGraphData} />;
      case 3:
        return <Bar data={counsellingBreakdownGraphData} />;
      case 4:
        return <Bar data={devicesGraphData} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <Navigation />
      <Container>
        <div className="row">
          {user.admin != null && (
            <GraphCustomizer
              summary={summary}
              selectedHospitals={selectedHospitals}
              handleHospitalSelection={handleHospitalSelection}
              handleSelectAll={handleSelectAll}
              startDate={startDate}
              handleStartDateChange={handleStartDateChange}
              endDate={endDate}
              handleEndDateChange={handleEndDateChange}
            />
          )}
          <div className="col-md-1"></div>
          <div className="col-md-9">
            <Paper>
              <Tabs
                value={activeGraphTab}
                onChange={handleGraphTabChange}
                indicatorColor="primary"
                textColor="primary"
                centered
              >
                <Tab label="Beneficiaries" />
                <Tab label="All Activities" />
                <Tab label="Training Activities" />
                <Tab label="Counselling Activities" />
                <Tab label="Devices" />
              </Tabs>
              {renderGraph(activeGraphTab)}
            </Paper>
          </div>
        </div>
      </Container>
      <br />
      <h1>Download All Beneficiary Data</h1>
      <p>
        Note this is , seperated if you separate by other delimiter it will not
        work
      </p>
      <button className="primary" onClick={downloadFilteredReport}>
        Download Filtered Report
      </button>
    </div>
  );
}

import XLSX from "xlsx-js-style";
import { isNotNullEmptyOrUndefined } from "./globalFunctions";
import moment from "moment";

// Merge cells in Excel sheet header
const mergeHeaderCells = ({ row = 0, col = 0, rowSpan = 0, colSpan = 0 }) => {
  return { s: { r: row, c: col }, e: { r: row + rowSpan, c: col + colSpan } };
};

// Add empty header cells
const addEmptyElements = (array, element, count) => {
  for (let i = 0; i < count; i++) {
    array.push(element);
  }
};

// Excel header for CLVE sheet
const clveMainHeader = [
  "Index",
  "Date",
  "MRN",
  "Name of the Patient",
  "Age",
  "Gender",
  "Education",
  "Occupation",
  "Diagnosis",
  "Districts",
  "State",
  "Acuity",
  "",
  "",
  "",
  "Near Visual Acuity",
  "",
  "",
  "",
  "Recommended Optical Aid",
  "Recommended Non-Optical Aid",
  "Recommended Electronic Aid",
  "Spectacles (Refractive Error Only)",
  "Dispensed Optical Aid",
  "Dispensed Non-Optical Aid",
  "Dispensed Electronic Aid",
  "Dispensed Spectacles (Refractive Error Only)",
  "Cost of all the aids dispensed",
  "Cost to the Beneficiary",
];

// Escel sub-header for CLVE sheet
let clveSubHeader = [];
addEmptyElements(clveSubHeader, "", 11);
clveSubHeader.push("Notation");
clveSubHeader.push("RE");
clveSubHeader.push("LE");
clveSubHeader.push("BE");
clveSubHeader.push("Notation");
clveSubHeader.push("RE");
clveSubHeader.push("LE");
clveSubHeader.push("BE");
addEmptyElements(clveSubHeader, "", 10);

// Excel header for Low Vision Screening Sheet
const lveMainHeader = [
  "Index",
  "Date",
  "MRN",
  "Name of the Patient",
  "Age",
  "Gender",
  "Education",
  "Occupation",
  "Diagnosis",
  "Districts",
  "State",
  "Session Number",
  "MDVI",
  "Acuity",
  "",
  "",
  "",
  "Near Visual Acuity",
  "",
  "",
  "",
  "Recommended Optical Aid",
  "Recommended Non-Optical Aid",
  "Recommended Electronic Aid",
  "Spectacles (Refractive Error Only)",
  "Extra Information",
];

// Excel sub-header for Low Vision Screening Sheet
let lveSubHeader = [];
addEmptyElements(lveSubHeader, "", 13);
lveSubHeader.push("Notation");
lveSubHeader.push("RE");
lveSubHeader.push("LE");
lveSubHeader.push("BE");
lveSubHeader.push("Notation");
lveSubHeader.push("RE");
lveSubHeader.push("LE");
lveSubHeader.push("BE");
addEmptyElements(lveSubHeader, "", 5);

// Get all sessions from CLVE data where devices were dispensed
function getSessionsForDispenedDevices(clveData) {
  const sessionsForDispensedDevices = clveData.filter(
    (evaluation) =>
      isNotNullEmptyOrUndefined(evaluation.dispensedSpectacle) ||
      isNotNullEmptyOrUndefined(evaluation.dispensedElectronic) ||
      isNotNullEmptyOrUndefined(evaluation.dispensedOptical) ||
      isNotNullEmptyOrUndefined(evaluation.dispensedNonOptical)
  );
  return sessionsForDispensedDevices;
}

// Populate the Aggregated Hospital Data Sheet
function populateAhdHeaders(hospitals) {
  // Reference sheet here: https://docs.google.com/spreadsheets/d/1cIYeMO9YuPSaNFwVEfRlDkJ1_qZdOsC-/edit#gid=535411624
  // Sheet Header (Row 1)
  const ahdMainHeader = [];
  ahdMainHeader.push("Programs");
  addEmptyElements(ahdMainHeader, "", 1);
  ahdMainHeader.push("Hospitals (Break up)");
  addEmptyElements(ahdMainHeader, "", hospitals.length * 2 - 1);
  ahdMainHeader.push("Beneficiaries of Hospitals");
  addEmptyElements(ahdMainHeader, "", 1);

  // Sheet Sub Headers (Row 2) & (Row 3)
  const ahdSubHeader1 = [];
  const ahdSubHeader2 = [];
  addEmptyElements(ahdSubHeader1, "", 2);
  addEmptyElements(ahdSubHeader2, "", 2);
  for (let i = 0; i < hospitals.length; i++) {
    ahdSubHeader1.push(hospitals[i]);
    addEmptyElements(ahdSubHeader1, "", 1);
    ahdSubHeader2.push("Sessions");
    ahdSubHeader2.push("Beneficiaries");
  }
  addEmptyElements(ahdSubHeader1, "", 2);

  ahdSubHeader2.push("Number of Sessions");
  ahdSubHeader2.push("Number of Beneficiaries");

  return { ahdMainHeader, ahdSubHeader1, ahdSubHeader2 };
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

// Returns common columns of all Excel sheets
function getCommonData(beneficiaryIdx, beneficiary) {
  const commonData = {
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

  return commonData;
}

// Get Beneficiary Sheet data
function getBeneficiaryJson(commonData, beneficiary) {
  let beneficiaryJson = { ...commonData };
  beneficiaryJson["Phone Number"] = beneficiary["phoneNumber"];
  beneficiaryJson["Hospital Name"] = beneficiary["hospital"]["name"];
  beneficiaryJson["Vision"] = beneficiary["vision"];
  beneficiaryJson["MDVI"] = beneficiary["mDVI"];
  beneficiaryJson["Extra Information"] = beneficiary["rawExtraFields"];

  return beneficiaryJson;
}

// Get CLVE Sheet data
function getClveJson(commonData, clveIdx, clveData) {
  let clveJson = { ...commonData };
  clveJson["Index"] = clveIdx;
  clveJson["Date"] = new Date(clveData["date"])
    .toLocaleDateString()
    .split(",")[0];
  clveJson["Diagnosis"] = clveData["diagnosis"];
  clveJson["Acuity Notation"] =
    clveData["distanceVisualAcuityRE"].split(" ")[1]; // insert check for if [1] exists
  clveJson["Acuity RE"] = clveData["distanceVisualAcuityRE"].split(" ")[0];
  clveJson["Acuity LE"] = clveData["distanceVisualAcuityLE"].split(" ")[0];
  clveJson["Acuity BE"] = clveData["distanceBinocularVisionBE"].split(" ")[0];
  clveJson["Near Visual Acuity Notation"] =
    clveData["nearVisualAcuityRE"].split(" ")[1]; // insert check for if [1] exists
  clveJson["Near Visual Acuity RE"] =
    clveData["nearVisualAcuityRE"].split(" ")[0];
  clveJson["Near Visual Acuity LE"] =
    clveData["nearVisualAcuityLE"].split(" ")[0];
  clveJson["Near Visual Acuity BE"] =
    clveData["nearBinocularVisionBE"].split(" ")[0];
  clveJson["Recommended Optical Aid"] = clveData["recommendationOptical"];
  clveJson["Recommended Non-Optical Aid"] =
    clveData["recommendationNonOptical"];
  clveJson["Recommended Electronic Aid"] = clveData["recommendationElectronic"];
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

  return clveJson;
}

// Get Vison Enhancement Sheet data
function getVeJson(commonData, veIdx, veData) {
  let veJson = { ...commonData };
  veJson["Index"] = veIdx;
  veJson["Date"] = new Date(veData["date"]).toLocaleDateString().split(",")[0];
  veJson["Diagnosis"] = veData["Diagnosis"];
  veJson["Session Number"] = veData["sessionNumber"];
  veJson["MDVI"] = veData["MDVI"];
  veJson["Extra Information"] = veData["extraInformation"];

  return veJson;
}

// Get Low Vision Screening Sheet data
function getLveJson(commonData, lveIdx, lveData) {
  let lveJson = { ...commonData };
  lveJson["Index"] = lveIdx;
  lveJson["Date"] = new Date(lveData["date"])
    .toLocaleDateString()
    .split(",")[0];
  lveJson["Diagnosis"] = lveData["diagnosis"];
  lveJson["Session Number"] = lveData["sessionNumber"];
  lveJson["MDVI"] = lveData["mdvi"];
  lveJson["Acuity Notation"] = lveData["distanceVisualAcuityRE"].split(" ")[1]; // insert check for if [1] exists
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
  lveJson["Recommended Non-Optical Aid"] = lveData["recommendationNonOptical"];
  lveJson["Recommended Electronic Aid"] = lveData["recommendationElectronic"];
  lveJson["Spectacles (Refractive Error Only)"] =
    lveData["recommendationSpectacle"];
  lveJson["Extra Information"] = lveData["extraInformation"];

  return lveJson;
}

// Get Computer Training Sheet data
function getCtJson(commonData, ctIdx, ctData) {
  let ctJson = { ...commonData };
  ctJson["Index"] = ctIdx;
  ctJson["Date"] = new Date(ctData["date"]).toLocaleDateString().split(",")[0];
  ctJson["Session Number"] = ctData["sessionNumber"];
  ctJson["Vision Type"] = ctData["visionType"];
  ctJson["Type of Training"] = ctData["typeOfTraining"];
  ctJson["Extra Information"] = ctData["extraInformation"];

  return ctJson;
}

// Get Mobile Training Sheet data
function getMtJson(commonData, mtIdx, mtData) {
  let mtJson = { ...commonData };
  mtJson["Index"] = mtIdx;
  mtJson["Date"] = new Date(mtData["date"]).toLocaleDateString().split(",")[0];
  mtJson["Session Number"] = mtData["sessionNumber"];
  mtJson["Vision Type"] = mtData["vision"];
  mtJson["Type of Training"] = mtData["typeOfTraining"];
  mtJson["Extra Information"] = mtData["extraInformation"];

  return mtJson;
}

// Get Orientation & Mobility Sheet data
function getOmtJson(commonData, omtIdx, omtData) {
  let omtJson = { ...commonData };
  omtJson["Index"] = omtIdx;
  omtJson["Date"] = new Date(omtData["date"])
    .toLocaleDateString()
    .split(",")[0];
  omtJson["Session Number"] = omtData["sessionNumber"];
  omtJson["Vision Type"] = omtData["vision"];
  omtJson["Type of Training"] = omtData["typeOfTraining"];
  omtJson["Extra Information"] = omtData["extraInformation"];

  return omtJson;
}

// Get Training Sheet data
function getTrainingJson(commonData, tIdx, tData) {
  let tJson = { ...commonData };
  tJson["Index"] = tIdx;
  tJson["Date"] = new Date(tData["date"]).toLocaleDateString().split(",")[0];
  tJson["Session Number"] = tData["sessionNumber"];
  tJson["Type of Training"] = tData["type"];
  tJson["Sub Type"] = tData["subType"];
  tJson["Extra Information"] = tData["extraInformation"];

  return tJson;
}

// Get Counselling Education Sheet data
function getCeJson(commonData, ceIdx, ceData) {
  let ceJson = { ...commonData };
  ceJson["Index"] = ceIdx;
  ceJson["Date"] = new Date(ceData["date"]).toLocaleDateString().split(",")[0];
  ceJson["Session Number"] = ceData["sessionNumber"];
  ceJson["MDVI"] = ceData["MDVI"];
  ceJson["Vision Type"] = ceData["vision"];
  ceJson["Type"] = ceData["type"];
  ceJson["Type of Counselling"] = ceData["typeCounselling"];
  ceJson["Extra Information"] = ceData["extraInformation"];

  return ceJson;
}

// Populates data for Aggregated Hospital Data Sheet
function getAggregatedHospitalData(
  filteredBeneficiaryData,
  filteredSummary,
  includeAllBeneficiaries
) {
  let aggregatedHospitalData = [];

  // Low Vision Screening
  let lveRow = {
    Programs1: "Screening / Out reach activities",
    Programs2: "Low vision screening/camps",
  };
  let lveSessionsTotal = 0;
  let lveBeneficiariesTotal = 0;

  // MDVI
  let mdviRow = { Programs1: "", Programs2: "Identification of MDVI" };
  let mdviTotal = 0;

  // Vision Enhancement
  let veRow = {
    Programs1: "Functional vision / Early intervention / Vision enhancement",
    Programs2: "",
  };
  let veSessionsTotal = 0;
  let veBeneficiariesTotal = 0;

  // Comprehensive Low Vision Evaluation
  let clveRow = {
    Programs1: "Comprehensive Low Vision Evaluation",
    Programs2: "",
  };
  let clveSessionsTotal = 0;
  let clveBeneficiariesTotal = 0;

  // Dispensed devices
  let devicesRow = {
    Programs1: "Assistive devices / aids / smartphone/ RLF tactile books",
    Programs2: "",
  };
  let devicesSessionsTotal = 0;
  let devicesBeneficiariesTotal = 0;

  // Counselling & referrals
  let ceRow = { Programs1: "Counseling & referrals", Programs2: "" };
  let ceSessionsTotal = 0;
  let ceBeneficiariesTotal = 0;

  // List of unique training types from training data
  const trainingTypes = Array.from(
    new Set(
      filteredBeneficiaryData
        .map((beneficiary) => {
          return (
            beneficiary.training
              // .filter((training) => isNotNullEmptyOrUndefined(training.type))
              .map((training) => training.type)
          );
        })
        .flat(Infinity)
    )
  );

  const tRowWithMainHeader = { Programs1: "Training activities at hospitals" };
  const tRowWithoutMainHeader = { Programs1: "" };

  // Setting up rows corresponding to each training type
  const trainingTypesList = trainingTypes.map((type, index) => {
    if (index === 0) {
      return {
        tRow: { ...tRowWithMainHeader, Programs2: type },
        tSessionsTotal: 0,
        tBeneficiariesTotal: 0,
      };
    } else {
      return {
        tRow: { ...tRowWithoutMainHeader, Programs2: type },
        tSessionsTotal: 0,
        tBeneficiariesTotal: 0,
      };
    }
  });

  // If all beneficiaries are not to be included in the report,
  // remove those beneficiaries from filteredSummary which do not meet selected criteria
  if (!includeAllBeneficiaries) {
    const filteredBeneficiaryIds = filteredBeneficiaryData.map(
      (beneficiary) => beneficiary.mrn
    );
    filteredSummary = filteredSummary.map((hospital) => {
      return {
        ...hospital,
        beneficiary: hospital.beneficiary.filter((beneficiary) =>
          filteredBeneficiaryIds.includes(beneficiary.mrn)
        ),
        comprehensiveLowVisionEvaluation:
          hospital.comprehensiveLowVisionEvaluation.filter((evaluation) =>
            filteredBeneficiaryIds.includes(evaluation.beneficiaryId)
          ),
        lowVisionEvaluation: hospital.lowVisionEvaluation.filter((evaluation) =>
          filteredBeneficiaryIds.includes(evaluation.beneficiaryId)
        ),
        visionEnhancement: hospital.visionEnhancement.filter((evaluation) =>
          filteredBeneficiaryIds.includes(evaluation.beneficiaryId)
        ),
        orientationMobilityTraining:
          hospital.orientationMobilityTraining.filter((evaluation) =>
            filteredBeneficiaryIds.includes(evaluation.beneficiaryId)
          ),
        mobileTraining: hospital.mobileTraining.filter((evaluation) =>
          filteredBeneficiaryIds.includes(evaluation.beneficiaryId)
        ),
        computerTraining: hospital.computerTraining.filter((evaluation) =>
          filteredBeneficiaryIds.includes(evaluation.beneficiaryId)
        ),
        counsellingEducation: hospital.counsellingEducation.filter(
          (evaluation) =>
            filteredBeneficiaryIds.includes(evaluation.beneficiaryId)
        ),
        training: hospital.training.filter((evaluation) =>
          filteredBeneficiaryIds.includes(evaluation.beneficiaryId)
        ),
      };
    });
  }
  console.log(filteredSummary);

  // Add checks for empty arrays
  for (let hospital of filteredSummary) {
    // Low Vision Screening data
    lveRow[hospital.name + " Sessions"] = hospital.lowVisionEvaluation.length;
    lveRow[hospital.name + " Beneficiaries"] = Array.from(
      new Set(
        hospital.lowVisionEvaluation.map(
          (evaluation) => evaluation.beneficiaryId
        )
      )
    ).length;
    lveSessionsTotal += lveRow[hospital.name + " Sessions"];
    lveBeneficiariesTotal += lveRow[hospital.name + " Beneficiaries"];

    // MDVI data
    mdviRow[hospital.name + " Sessions"] = "";
    mdviRow[hospital.name + " Beneficiaries"] = hospital.beneficiary.filter(
      (beneficiary) =>
        beneficiary.mDVI === "Yes" || beneficiary.mDVI === "At Risk"
    ).length;
    mdviTotal += mdviRow[hospital.name + " Beneficiaries"];

    // Vision Enhancement data
    veRow[hospital.name + " Sessions"] = hospital.visionEnhancement.length;
    veRow[hospital.name + " Beneficiaries"] = Array.from(
      new Set(
        hospital.visionEnhancement.map((evaluation) => evaluation.beneficiaryId)
      )
    ).length;
    veSessionsTotal += veRow[hospital.name + " Sessions"];
    veBeneficiariesTotal += veRow[hospital.name + " Beneficiaries"];

    // Comprehensive Low Vision Evaluation data
    clveRow[hospital.name + " Sessions"] =
      hospital.comprehensiveLowVisionEvaluation.length;
    clveRow[hospital.name + " Beneficiaries"] = Array.from(
      new Set(
        hospital.comprehensiveLowVisionEvaluation.map(
          (evaluation) => evaluation.beneficiaryId
        )
      )
    ).length;
    clveSessionsTotal += clveRow[hospital.name + " Sessions"];
    clveBeneficiariesTotal += clveRow[hospital.name + " Beneficiaries"];

    // Dispensed devices data
    devicesRow[hospital.name + " Sessions"] = getSessionsForDispenedDevices(
      hospital.comprehensiveLowVisionEvaluation
    ).length;
    devicesRow[hospital.name + " Beneficiaries"] = Array.from(
      new Set(
        getSessionsForDispenedDevices(
          hospital.comprehensiveLowVisionEvaluation
        ).map((evaluation) => evaluation.beneficiaryId)
      )
    ).length;
    devicesSessionsTotal += devicesRow[hospital.name + " Sessions"];
    devicesBeneficiariesTotal += devicesRow[hospital.name + " Beneficiaries"];

    // Counselling & referrals data
    ceRow[hospital.name + " Sessions"] = hospital.counsellingEducation.length;
    ceRow[hospital.name + " Beneficiaries"] = Array.from(
      new Set(
        hospital.counsellingEducation.map(
          (evaluation) => evaluation.beneficiaryId
        )
      )
    ).length;
    ceSessionsTotal += ceRow[hospital.name + " Sessions"];
    ceBeneficiariesTotal += ceRow[hospital.name + " Beneficiaries"];

    let trainingIdx = 0;
    // Populate row corresponding to each training type identified earlier
    for (let trainingType of trainingTypes) {
      trainingTypesList[trainingIdx]["tRow"][hospital.name + " Sessions"] =
        hospital.training.filter(
          (training) => training.type === trainingType
        ).length;
      trainingTypesList[trainingIdx]["tRow"][hospital.name + " Beneficiaries"] =
        Array.from(
          new Set(
            hospital.training
              .filter((training) => training.type === trainingType)
              .map((training) => training.beneficiaryId)
          )
        ).length;
      trainingTypesList[trainingIdx]["tSessionsTotal"] +=
        trainingTypesList[trainingIdx]["tRow"][hospital.name + " Sessions"];
      trainingTypesList[trainingIdx]["tBeneficiariesTotal"] +=
        trainingTypesList[trainingIdx]["tRow"][
          hospital.name + " Beneficiaries"
        ];

      trainingIdx += 1;
    }
  }

  // Push totals of each row
  lveRow["Number of Sessions"] = lveSessionsTotal;
  lveRow["Number of Beneficiaries"] = lveBeneficiariesTotal;

  mdviRow["Number of Sessions"] = "";
  mdviRow["Number of Beneficiaries"] = mdviTotal;

  veRow["Number of Sessions"] = veSessionsTotal;
  veRow["Number of Beneficiaries"] = veBeneficiariesTotal;

  clveRow["Number of Sessions"] = clveSessionsTotal;
  clveRow["Number of Beneficiaries"] = clveBeneficiariesTotal;

  devicesRow["Number of Sessions"] = devicesSessionsTotal;
  devicesRow["Number of Beneficiaries"] = devicesBeneficiariesTotal;

  ceRow["Number of Sessions"] = ceSessionsTotal;
  ceRow["Number of Beneficiaries"] = ceBeneficiariesTotal;

  let trainingIdx = 0;
  for (let trainingTypeRow of trainingTypesList) {
    trainingTypeRow["tRow"]["Number of Sessions"] =
      trainingTypeRow["tSessionsTotal"];
    trainingTypeRow["tRow"]["Number of Beneficiaries"] =
      trainingTypeRow["tBeneficiariesTotal"];
    trainingIdx += 1;
  }

  // Add rows to the aggregated hospital data
  aggregatedHospitalData.push(lveRow);
  aggregatedHospitalData.push(mdviRow);
  aggregatedHospitalData.push(veRow);
  aggregatedHospitalData.push(clveRow);
  aggregatedHospitalData.push(devicesRow);
  aggregatedHospitalData.push(ceRow);
  aggregatedHospitalData.push(...trainingTypesList.map((item) => item.tRow));

  return aggregatedHospitalData;
}

// This function is used to filter the entire summary data by date range
export function filterTrainingSummaryByDateRange(
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

// Get age from date of birth
export function getAge(dateString) {
  let today = new Date();
  let birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  let m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }
  return age;
}

// Sets the header for CLVE sheet, including merged cells and sub-headers
export function setClveHeader(wclve) {
  XLSX.utils.sheet_add_aoa(wclve, [clveMainHeader, clveSubHeader]);
  wclve["!merges"] = [
    mergeHeaderCells({ col: 0, rowSpan: 1 }), // {s: {r: 0, c: 0}, e: {r: 1, c: 0}}, Title: Index
    mergeHeaderCells({ col: 1, rowSpan: 1 }), // Date
    mergeHeaderCells({ col: 2, rowSpan: 1 }), // MRN
    mergeHeaderCells({ col: 3, rowSpan: 1 }), // Name of the Patient
    mergeHeaderCells({ col: 4, rowSpan: 1 }), // Age
    mergeHeaderCells({ col: 5, rowSpan: 1 }), // Gender
    mergeHeaderCells({ col: 6, rowSpan: 1 }), // Education
    mergeHeaderCells({ col: 7, rowSpan: 1 }), // Occupation
    mergeHeaderCells({ col: 8, rowSpan: 1 }), // Diagnosis
    mergeHeaderCells({ col: 9, rowSpan: 1 }), // District
    mergeHeaderCells({ col: 10, rowSpan: 1 }), // State
    mergeHeaderCells({ col: 11, colSpan: 3 }), // { s: { r: 0, c: 11 }, e: { r: 0, c: 14 } }, Title: Acuity
    mergeHeaderCells({ col: 15, colSpan: 3 }), // { s: { r: 0, c: 15 }, e: { r: 0, c: 18 } }, Title: Near Visual Acuity
    mergeHeaderCells({ col: 19, rowSpan: 1 }), // Recommended Optical Aid
    mergeHeaderCells({ col: 20, rowSpan: 1 }), // Recommended Non-Optical Aid
    mergeHeaderCells({ col: 21, rowSpan: 1 }), // Recommended Electronic Aid
    mergeHeaderCells({ col: 22, rowSpan: 1 }), // Spectacles (Refractive Error Only)
    mergeHeaderCells({ col: 23, rowSpan: 1 }), // Dispensed Optical Aid
    mergeHeaderCells({ col: 24, rowSpan: 1 }), // Dispensed Non-Optical Aid
    mergeHeaderCells({ col: 25, rowSpan: 1 }), // Dispensed Electronic Aid
    mergeHeaderCells({ col: 26, rowSpan: 1 }), // Dispensed Spectacles (Refractive Error Only)
    mergeHeaderCells({ col: 27, rowSpan: 1 }), // Cost of all the aids dispensed
    mergeHeaderCells({ col: 28, rowSpan: 1 }), // Cost to the Beneficiary
  ];

  return wclve;
}

// Sets the header for Low Vision Screening sheet, including merged cells and sub-headers
export function setLveHeader(wlved) {
  XLSX.utils.sheet_add_aoa(wlved, [lveMainHeader, lveSubHeader]);
  wlved["!merges"] = [
    mergeHeaderCells({ col: 0, rowSpan: 1 }), // {s: {r: 0, c: 0}, e: {r: 1, c: 0}}, Title: Index
    mergeHeaderCells({ col: 1, rowSpan: 1 }), // Date
    mergeHeaderCells({ col: 2, rowSpan: 1 }), // MRN
    mergeHeaderCells({ col: 3, rowSpan: 1 }), // Name of the Patient
    mergeHeaderCells({ col: 4, rowSpan: 1 }), // Age
    mergeHeaderCells({ col: 5, rowSpan: 1 }), // Gender
    mergeHeaderCells({ col: 6, rowSpan: 1 }), // Education
    mergeHeaderCells({ col: 7, rowSpan: 1 }), // Occupation
    mergeHeaderCells({ col: 8, rowSpan: 1 }), // Diagnosis
    mergeHeaderCells({ col: 9, rowSpan: 1 }), // District
    mergeHeaderCells({ col: 10, rowSpan: 1 }), // State
    mergeHeaderCells({ col: 11, rowSpan: 1 }), // Session Number
    mergeHeaderCells({ col: 12, rowSpan: 1 }), // MDVI
    mergeHeaderCells({ col: 13, colSpan: 3 }), // { s: { r: 0, c: 13 }, e: { r: 0, c: 16 } }, Title: Acuity
    mergeHeaderCells({ col: 17, colSpan: 3 }), // { s: { r: 0, c: 17 }, e: { r: 0, c: 20 } }, Title: Near Visual Acuity
    mergeHeaderCells({ col: 21, rowSpan: 1 }), // Recommended Optical Aid
    mergeHeaderCells({ col: 22, rowSpan: 1 }), // Recommended Non-Optical Aid
    mergeHeaderCells({ col: 23, rowSpan: 1 }), // Recommended Electronic Aid
    mergeHeaderCells({ col: 24, rowSpan: 1 }), // Spectacles (Refractive Error Only)
    mergeHeaderCells({ col: 25, rowSpan: 1 }), // Extra Information
  ];
}

// Sets the header for Aggregated Hospital Data sheet, including merged cells and sub-headers
export function setAhdHeader(wahd, hospitals) {
  let { ahdMainHeader, ahdSubHeader1, ahdSubHeader2 } =
    populateAhdHeaders(hospitals);
  XLSX.utils.sheet_add_aoa(wahd, [ahdMainHeader, ahdSubHeader1, ahdSubHeader2]);
  wahd["!merges"] = [
    mergeHeaderCells({ row: 0, col: 0, rowSpan: 2, colSpan: 1 }), // { s: { r: 0, c: 0 }, e: { r: 2, c: 1 } }, Title: Programs
    mergeHeaderCells({ col: 2, colSpan: hospitals.length * 2 - 1 }), // { s: { r: 0, c: 2 }, e: { r: 0, c: 2 + (hospitals.length * 2 - 1) } }, Title: Hospitals (Break up)
    mergeHeaderCells({
      row: 0,
      col: 2 + hospitals.length * 2,
      rowSpan: 1,
      colSpan: 1,
    }), // { s: { r: 0, c: 2 + hospitals.length * 2 }, e: { r: 1, c: 2 + hospitals.length * 2 + 1 } }, Title: Beneficiaries of Hospitals
  ];

  let currentColumn = 2;
  for (let i = 0; i < hospitals.length; i++) {
    wahd["!merges"].push(
      mergeHeaderCells({ row: 1, col: currentColumn, colSpan: 1 })
    );
    currentColumn += 2;
  }
}

// Get data for all sheets in the Report Excel
export function getReportData(
  filteredBeneficiaryData,
  filteredSummary,
  includeAllBeneficiaries
) {
  let beneficiaryData = [];
  let visionEnhancementData = [];
  let lowVisionEvaluationData = [];
  let comprehensiveLowVisionEvaluationData = [];
  let computerTrainingData = [];
  let mobileTrainingData = [];
  let orientationMobilityTrainingData = [];
  let trainingData = [];
  let counsellingEducationData = [];
  let aggregatedHospitalData = getAggregatedHospitalData(
    filteredBeneficiaryData,
    filteredSummary,
    includeAllBeneficiaries
  );

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
    let commonData = getCommonData(beneficiaryIdx, beneficiary);

    // Beneficiary Data Sheet:
    let beneficiaryJson = getBeneficiaryJson(commonData, beneficiary);
    beneficiaryData.push(beneficiaryJson);
    beneficiaryIdx += 1;

    // CLVE sheet:
    let beneficiaryCLVE = beneficiary["comprehensiveLowVisionEvaluation"];
    for (let clveData of beneficiaryCLVE) {
      let clveJson = getClveJson(commonData, clveIdx, clveData);
      comprehensiveLowVisionEvaluationData.push(clveJson);
      clveIdx += 1;
    }

    // Vision Enhancement Sheet
    let beneficiaryVE = beneficiary["visionEnhancement"];
    for (let veData of beneficiaryVE) {
      let veJson = getVeJson(commonData, veIdx, veData);
      visionEnhancementData.push(veJson);
      veIdx += 1;
    }

    // Low Vision Enhancement Sheet
    let beneficiaryLVE = beneficiary["lowVisionEvaluation"];
    for (let lveData of beneficiaryLVE) {
      let lveJson = getLveJson(commonData, lveIdx, lveData);
      lowVisionEvaluationData.push(lveJson);
      lveIdx += 1;
    }

    // Computer Training Sheet
    let beneficiaryCT = beneficiary["computerTraining"];
    for (let ctData of beneficiaryCT) {
      let ctJson = getCtJson(commonData, ctIdx, ctData);
      computerTrainingData.push(ctJson);
      ctIdx += 1;
    }

    // Mobile Training Sheet
    let beneficiaryMT = beneficiary["mobileTraining"];
    for (let mtData of beneficiaryMT) {
      let mtJson = getMtJson(commonData, mtIdx, mtData);
      mobileTrainingData.push(mtJson);
      mtIdx += 1;
    }

    // Orientation Mobility Training Sheet
    let beneficiaryOMT = beneficiary["orientationMobilityTraining"];
    for (let omtData of beneficiaryOMT) {
      let omtJson = getOmtJson(commonData, omtIdx, omtData);
      orientationMobilityTrainingData.push(omtJson);
      omtIdx += 1;
    }

    // Training Sheet
    let beneficiaryT = beneficiary["training"];
    for (let tData of beneficiaryT) {
      let tJson = getTrainingJson(commonData, tIdx, tData);
      trainingData.push(tJson);
      tIdx += 1;
    }

    // Counseling Education Sheet
    let beneficiaryCE = beneficiary["counsellingEducation"];
    for (let ceData of beneficiaryCE) {
      let ceJson = getCeJson(commonData, ceIdx, ceData);
      counsellingEducationData.push(ceJson);
      ceIdx += 1;
    }
  }

  return {
    beneficiaryData,
    visionEnhancementData,
    lowVisionEvaluationData,
    comprehensiveLowVisionEvaluationData,
    computerTrainingData,
    mobileTrainingData,
    orientationMobilityTrainingData,
    trainingData,
    counsellingEducationData,
    aggregatedHospitalData,
  };
}
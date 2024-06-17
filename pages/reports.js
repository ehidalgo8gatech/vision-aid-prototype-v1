import { readUser, allHospitalRoles } from "./api/user";
import { getSession } from "next-auth/react";
import { Chart as ChartJS } from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";
import {
  getSummaryForAllHospitals,
} from "@/pages/api/hospital";
import { Container } from "react-bootstrap";
import Navigation from "./navigation/Navigation";
import Layout from './components/layout';
import moment from "moment";
import { useState, useEffect } from "react";
import GraphCustomizer from "./components/GraphCustomizer";
import { Tab, Tabs, Paper } from "@mui/material";
// import * as XLSX from "xlsx";
import XLSX from "xlsx-js-style";
import { isNotNullBlankOrUndefined } from "@/constants/globalFunctions";
import { Download } from "react-bootstrap-icons";
import { useRouter } from "next/router";
import {
  setAhdHeader,
  setClveHeader,
  setLveHeader,
  filterTrainingSummaryByDateRange,
  getReportData,
} from "@/constants/reportFunctions";

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

  const getHospitalIdsByUsers = (id, users) => {
    let hospitalIds = [];
    for (const user of users ) {
      if (user.userId === id) {
        hospitalIds.push(user.hospitalId);
      }
    }
    return hospitalIds;
  }

  // If it's a non admin user, we only want to show the summary for their hospital
  const user = await readUser(session.user.email);
  const roles = await allHospitalRoles();
  let hospitalIds;
  const isAdmin = user.admin != null;
  if (!isAdmin) {
    hospitalIds = getHospitalIdsByUsers(user.id, roles);
  }

  // We finally return all the data to the page
  const summary = await getSummaryForAllHospitals(isAdmin, hospitalIds);

  return {
    props: {
      user: user,
      summary: JSON.parse(JSON.stringify(summary)),
      error: null,
    },
  };
}

// Configure Chart data label plugin globally
ChartJS.register(ChartDataLabels);
ChartJS.defaults.plugins.datalabels.font.size = 16;
ChartJS.defaults.plugins.datalabels.font.weight = "bold";
ChartJS.defaults.plugins.datalabels.display = function(context){
  return context.dataset.data[context.dataIndex] != 0;
};

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
  // Inside the array, there are fields dispensedSpectacle, dispensedElectronic, dispensedOptical, dispensedNonOptical
  // We want to count the number of entries in which these fields are not empty
  const dispensedSpectacleCount = data.reduce(
    (sum, item) => {
      const items = item.comprehensiveLowVisionEvaluation.filter(
        (evaluation) => isNotNullBlankOrUndefined(evaluation.dispensedSpectacle)
      );
      const count = items.reduce((sum, evaluation) => {
        return sum + evaluation.dispensedSpectacle.split("; ").length;
      }, 0);
      return sum + count;
    },
    0
  );
  const dispensedElectronicCount = data.reduce(
    (sum, item) => {
      const items = item.comprehensiveLowVisionEvaluation.filter(
        (evaluation) => isNotNullBlankOrUndefined(evaluation.dispensedElectronic)
      );
      const count = items.reduce((sum, evaluation) => {
        return sum + evaluation.dispensedElectronic.split("; ").length;
      }, 0);
      return sum + count;
    },
    0
  );
  const dispensedOpticalCount = data.reduce(
    (sum, item) => {
      const items = item.comprehensiveLowVisionEvaluation.filter(
        (evaluation) => isNotNullBlankOrUndefined(evaluation.dispensedOptical)
      );
      const count = items.reduce((sum, evaluation) => {
        return sum + evaluation.dispensedOptical.split("; ").length;
      }, 0);
      return sum + count;
    },
    0
  );
  const dispensedNonOpticalCount = data.reduce(
    (sum, item) => {
      const items = item.comprehensiveLowVisionEvaluation.filter(
        (evaluation) => isNotNullBlankOrUndefined(evaluation.dispensedNonOptical)
      );
      const count = items.reduce((sum, evaluation) => {
        return sum + evaluation.dispensedNonOptical.split("; ").length;
      }, 0);
      return sum + count;
    },
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

// Function that builds a bar graph to show the number of devices recommended
function buildRecDevicesGraph(data) {
  // The device information is stored inside the comprehensiveLowVisionEvaluation array
  // Inside the array, there are fields dispensedSpectacle, dispensedElectronic, dispensedOptical, dispensedNonOptical
  // We want to count the number of entries in which these fields are not empty
  console.log(data);
  const dispensedSpectacleCount = data.reduce(
    (sum, item) => {
      const items = item.comprehensiveLowVisionEvaluation.filter(
        (evaluation) => isNotNullBlankOrUndefined(evaluation.recommendationSpectacle)
      );
      const count = items.reduce((sum, evaluation) => {
        return sum + evaluation.recommendationSpectacle.split(",").length;
      }, 0);
      return sum + count;
    },
    0
  );
  const dispensedElectronicCount = data.reduce(
    (sum, item) => {
      const items = item.comprehensiveLowVisionEvaluation.filter(
        (evaluation) => isNotNullBlankOrUndefined(evaluation.recommendationElectronic)
      );
      const count = items.reduce((sum, evaluation) => {
        return sum + evaluation.recommendationElectronic.split(",").length;
      }, 0);
      return sum + count;
    },
    0
  );
  const dispensedOpticalCount = data.reduce(
    (sum, item) => {
      const items = item.comprehensiveLowVisionEvaluation.filter(
        (evaluation) => isNotNullBlankOrUndefined(evaluation.recommendationOptical)
      );
      const count = items.reduce((sum, evaluation) => {
        return sum + evaluation.recommendationOptical.split(",").length;
      }, 0);
      return sum + count;
    },
    0
  );
  const dispensedNonOpticalCount = data.reduce(
    (sum, item) => {
      const items = item.comprehensiveLowVisionEvaluation.filter(
        (evaluation) => isNotNullBlankOrUndefined(evaluation.recommendationNonOptical)
      );
      const count = items.reduce((sum, evaluation) => {
        return sum + evaluation.recommendationNonOptical.split(",").length;
      }, 0);
      return sum + count;
    },
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

// Function that builds a bar graph at a sublevel. This function is called
// with different devices types as the breakdownType (can be one of the AllowedDevices)
const allowedDevices = ["Electronic", "Spectacle", "Optical", "NonOptical"];
function buildDevicesBreakdownGraph(data, breakdownType) {
  if (!allowedDevices.includes(breakdownType)) {
    breakdownType = "Electronic";
  }
  const dispensedKey = "dispensed" + breakdownType;
  const deviceList = data.reduce((types, hospital) => {
    const filteredEvaluations = hospital.comprehensiveLowVisionEvaluation.filter(
      (evaluation) => isNotNullBlankOrUndefined(evaluation[dispensedKey])
    )
    const deviceTypes = filteredEvaluations.map((item) => item[dispensedKey].split("; "));
    return [...types, ...deviceTypes];
  }, []);

  const types = deviceList.reduce((accumulator, currentValue) => {
    return accumulator.concat(currentValue);
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

// Function that builds a bar graph at a sublevel for recommended devices. This function is called
// with different devices types as the breakdownType (can be one of the AllowedDevices)
function buildRecDevicesBreakdownGraph(data, breakdownType) {
  if (!allowedDevices.includes(breakdownType)) {
    breakdownType = "Electronic";
  }
  const dispensedKey = "recommendation" + breakdownType;
  const deviceList = data.reduce((types, hospital) => {
    const filteredEvaluations = hospital.comprehensiveLowVisionEvaluation.filter(
      (evaluation) => isNotNullBlankOrUndefined(evaluation[dispensedKey])
    )
    const deviceTypes = filteredEvaluations.map((item) => item[dispensedKey].split(","));
    return [...types, ...deviceTypes];
  }, []);

  const types = deviceList.reduce((accumulator, currentValue) => {
    return accumulator.concat(currentValue);
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

export default function Summary({
  user,
  summary,
  error,
}) {
  // Downloaded reports reference sheet data
  // TODO: this hardcoded information will be fetched from database in the future
  // Your tab-separated data
  const refData = `S.no\tPrograms\tTypes\tDescription
  1\tScreening /Out reach activities/ Camp\tLow Vision Screening\tLow vision screening of the school of the blind and Identification of the visually impaired for assistive technology
  2\t\tIdentification of MDVI\tBeneficiaries come under Multiple disabilities and vision impairment.
  3\tFunctional Vision/Early Intervention/ Vision enhancement\t\tAge group less than 7 years. Training of infants,children and parents to improve the brain’s ability to use and interpret visual information especially in kids with Cortical visual impairment (CVI)
  4\tLVD beneficiairies/Comprehensive Low Vision Evaluation - CLVE\t\tLow vision assessment / Functional vision assessment done by a Professional - Optometrist / Low vision care specialist / Rehabilitation Specialist
  5\tAssistive devices and aids\tAssistive devices/aids/RLF tactile books/ Optical/ Non Optical/ Electronic\tDevices for individuals with low vision and total blindness
  6\tLow vision device training\tTraining is given after dispensing devices\t
  7\tCounseling & referrals/ Counseling and education\tEducation and counseling\tList of referrals
  8\tOrientation & Mobility training (O and M)\t\tTraining to help the visually impaired orient to the environment around and navigate safely
  9\tComputer training\t\tTraining programs are conducted to build proficiency in computer skills using assistive technology like screen readers, magnification and contrast modifcations
  10\tMobile technologies \t\tEducating on various mobile app for navigation and other functions
  11\tVisual skills training\tAll subtypes under it as a whole\tVisual skills training greater than 7 years and adults
  12\tOther training\tCorporate skill development\tComputer Programming, Digital accessibility testing DAT
  13\t\tBraille Training & resources and Training with Braille reader / ORBIT reader\tTraining on Braille devices for education and Braille literacy
  14\t\tTraining for Life skills/ Money identification/ Home management / Kitchen skills\t
  15\t\tJob Coaching /IBPS\tIntegrated training program for Institute of Banking Personnel Selection and other job coaching
  16\t\tSpoken english training\tTraining to speak in English for both beginners and Intermediate.`;
  const refRows = refData.split('\n').map(row => row.split('\t'));

  const hospitalAbbr = {
    "Aravind Eye Hospital, Madurai": "AEH, MDU",
    "Aravind Eye Hospital, Coimbatore": "AEH, CBE",
    "Aravind Eye Hospital, Pondicherry": "AEH, PY",
    "Aravind Eye Hospital, Tirupati": "AEH, TPTY",
    "Aravind Eye Hospital, Tirunelveli": "AEH, TVL",
    "Sankara Nethralaya, Chennai": "SN, CHE",
    "Sankara Nethralaya, Kolkata": "SN, KOL",
    "Dr. Shroff's Charity Eye Hospital": "SCEH, DL",
    "Narayana Nethralaya, Rajajinagar, Bangalore": "NN, BLR",
    "Dr. Jawahar Lal Rohatgi Eye Hospital, Kanpur": "JLR, UP",
    "Sitapur Eye Hospital, Sitapur, UP": "SEH, UP",
    "Voluntary Health Services": "VHS, CHE",
    "Community Eye Care Foundation": "CECF, PUN"
  };

  // create start date and end data states, start date is set to one year ago, end date is set to today
  const [startDate, setStartDate] = useState(
    moment().subtract(1, "year").toDate()
  );
  const [endDate, setEndDate] = useState(moment().toDate());

  const [selectedHospitals, setSelectedHospitals] = useState([]);
  const [selectedHospitalNames, setSelectedHospitalNames] = useState([]);

  const router = useRouter();

  useEffect(() => {
    setSelectedHospitals(summary.map((item) => item.id));
  }, [summary]);

  useEffect(() => {
    setSelectedHospitalNames(summary.map((item) => item.name));
  }, [summary]);

  const handleMultiSelectChange = (e) => {
    const {
      target: { value },
    } = e;
    setSelectedHospitalNames(value);
    setSelectedHospitals(
      summary
        .filter((hospital) => value.includes(hospital.name))
        .map((hospital) => hospital.id)
    );
  };

  const handleAllSelect = (e, allSelect) => {
    if (allSelect) {
      setSelectedHospitals(summary.map((item) => item.id));
      setSelectedHospitalNames(summary.map((item) => item.name));
    } else {
      setSelectedHospitals([]);
      setSelectedHospitalNames([]);
    }
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
  const electronicDevicesGraphData =  buildDevicesBreakdownGraph(filteredSummary, "Electronic");
  const spectacleDevicesGraphData =  buildDevicesBreakdownGraph(filteredSummary, "Spectacle");
  const opticalDevicesGraphData =  buildDevicesBreakdownGraph(filteredSummary, "Optical");
  const nonOpticalDevicesGraphData =  buildDevicesBreakdownGraph(filteredSummary, "NonOptical");

  const recDevicesGraphData = buildRecDevicesGraph(filteredSummary);
  const electronicRecDevicesGraphData =  buildRecDevicesBreakdownGraph(filteredSummary, "Electronic");
  const spectacleRecDevicesGraphData =  buildRecDevicesBreakdownGraph(filteredSummary, "Spectacle");
  const opticalRecDevicesGraphData =  buildRecDevicesBreakdownGraph(filteredSummary, "Optical");
  const nonOpticalRecDevicesGraphData =  buildRecDevicesBreakdownGraph(filteredSummary, "NonOptical");

  async function downloadFilteredReport() {
    if (selectedHospitalNames.length === 0) {
      alert("No hospital was selected! Please select at least one hospital to download the report.");
      return;
    }
    try {
      const beneficiaryListAPI = selectedHospitalNames.map((id) => fetch(
        `/api/beneficiaryList?id=${id}&startDate=${startDate}&endDate=${endDate}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      ));
      console.log('beneficiaryListAPI: ', beneficiaryListAPI);
      let promises = await Promise.all(beneficiaryListAPI);
      console.log('promises: ', promises);
      var finalResult = await Promise.all(promises.map(res => res.json ? res.json().catch(err => err) : res));
      console.log('finalResult: ', finalResult);
    } catch (error) {
      console.error("Error fetching beneficiary list:", error);
    }
    const beneficiaryList = finalResult.flat();
    console.log('beneficiaryList: ', beneficiaryList);

    const dateFilteredBeneficiaryData = filterTrainingSummaryByDateRange(
      startDate,
      endDate,
      beneficiaryList,
      "beneficiary"
    );

    const filteredBeneficiaryData = dateFilteredBeneficiaryData.filter((item) =>
      selectedHospitals.includes(item.hospital.id)
    );

    const {
      beneficiaryData,
      visionEnhancementData,
      lowVisionEvaluationData,
      comprehensiveLowVisionEvaluationData,
      electronicDevicesData,
      trainingData,
      counsellingEducationData,
      aggregatedHospitalData,
    } = getReportData(filteredBeneficiaryData, filteredSummary, true);

    const wb = XLSX.utils.book_new();

    const wref = XLSX.utils.aoa_to_sheet(refRows);
    const wben = XLSX.utils.json_to_sheet(beneficiaryData);
    const wved = XLSX.utils.json_to_sheet(visionEnhancementData);

    const wlved = XLSX.utils.json_to_sheet([]);
    const wclve = XLSX.utils.json_to_sheet([]);

    const wed = XLSX.utils.json_to_sheet(electronicDevicesData);
    const wtd = XLSX.utils.json_to_sheet(trainingData);
    const wced = XLSX.utils.json_to_sheet(counsellingEducationData);

    const wahd = XLSX.utils.json_to_sheet([]);

    XLSX.utils.book_append_sheet(wb, [], "Summary");
    XLSX.utils.book_append_sheet(wb, [], "Summary of Finances");
    XLSX.utils.book_append_sheet(wb, wahd, "Summary of Services");
    XLSX.utils.book_append_sheet(wb, wref, "Reference");
    XLSX.utils.book_append_sheet(wb, wclve, "CLVE_LVD Beneficiaries");
    XLSX.utils.book_append_sheet(wb, wved, "Vision Enhancement Sheet");
    XLSX.utils.book_append_sheet(wb, wtd, "Training Sheet");
    XLSX.utils.book_append_sheet(wb, wced, "Counselling Education Sheet");
    XLSX.utils.book_append_sheet(wb, wlved, "Camp_Low Vision Screening");
    XLSX.utils.book_append_sheet(wb, wben, "Overall Beneficiary Sheet");
    XLSX.utils.book_append_sheet(wb, wed, "Electronic Devices Break Up");
    XLSX.utils.book_append_sheet(wb, [], "Action items from prev quarter");

    setClveHeader(wclve);
    XLSX.utils.sheet_add_json(wclve, comprehensiveLowVisionEvaluationData, {
      skipHeader: true,
      origin: -1,
    });

    setLveHeader(wlved);
    XLSX.utils.sheet_add_json(wlved, lowVisionEvaluationData, {
      skipHeader: true,
      origin: -1,
    });

    setAhdHeader(
      wahd,
      filteredSummary.map((hospital) => hospital.name)
    );
    XLSX.utils.sheet_add_json(wahd, aggregatedHospitalData, {
      skipHeader: true,
      origin: -1,
    });

    // Change the column width for the reference sheet
    const wscols = [];
    const wrefcols = [4, 53, 66, 84]; // values obtained from manually adjusting the downloaded excel sheet
    for (let i = 0; i < refRows[0].length; i++) {
        wscols.push({wch: wrefcols[i]}); // Set the initial width for each column
    }
    wref['!cols'] = wscols;

    // generate the filename based on the filter date range and the selected hospitals
    let reportHospitalName = hospitalAbbr[selectedHospitalNames[0]];
    if (selectedHospitalNames.length === summary.length) {
      reportHospitalName = "ALL";
    } else if (selectedHospitalNames.length > 1) {
      reportHospitalName = "MULTI";
    } else if (reportHospitalName === undefined) {
      reportHospitalName = selectedHospitalNames[0];
    }
    let fileNameComponents = [];
    fileNameComponents.push("Report");
    fileNameComponents.push(reportHospitalName);
    fileNameComponents.push(startDate.toISOString().split('T')[0]);
    fileNameComponents.push(endDate.toISOString().split('T')[0]);
    const filename = fileNameComponents.join("_") + ".xlsx";

    XLSX.writeFile(wb, filename);
  }

  const handleStartDateChange = (e) => {
    setStartDate(moment(e.target.value).toDate());
  };

  const handleEndDateChange = (e) => {
    setEndDate(moment(e.target.value).toDate());
  };

  const [activeGraphTab, setActiveGraphTab] = useState(0);
  const [activeBeneficiaryGraphTab, setActiveBeneficiaryGraphTab] = useState(0);
  const [activeDevicesGraphTab, setActiveDevicesGraphTab] = useState(0);
  const [activeRecDevicesGraphTab, setActiveRecDevicesGraphTab] = useState(0);
  const [activeActivitiesGraphTab, setActiveActivitiesGraphTab] = useState(0);
  const handleGraphTabChange = (event, newValue) => {
    setActiveGraphTab(newValue);
    setActiveBeneficiaryGraphTab(0);
    setActiveDevicesGraphTab(0);
    setActiveRecDevicesGraphTab(0);
    setActiveActivitiesGraphTab(0);
  };

  const handleBeneficiaryGraphTabChange = (event, newValue) => {
    setActiveBeneficiaryGraphTab(newValue);
  };

  const handleDevicesGraphTabChange = (event, newValue) => {
    setActiveDevicesGraphTab(newValue);
  };

  const handleRecDevicesGraphTabChange = (event, newValue) => {
    setActiveRecDevicesGraphTab(newValue);
  };

  const handleActivitiesGraphTabChange = (event, newValue) => {
    setActiveActivitiesGraphTab(newValue);
  };

  const options={
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  const renderGraph = () => {
    switch (activeGraphTab) {
      case 0:
        switch (activeBeneficiaryGraphTab) {
          case 0:
            return <Bar data={beneficiaryGraphData} options={options} />;
          default:
            return null;
        }
      case 1:
        switch (activeActivitiesGraphTab) {
          case 0:
            return <Bar data={activitiesGraphData} options={options} />;
          case 1:
            return <Bar data={trainingBreakdownGraphData} options={options} />;
          case 2:
            return <Bar data={counsellingBreakdownGraphData} options={options} />;
          default:
            return null;
        }
      case 2:
        switch (activeDevicesGraphTab) {
          case 0:
            return <Bar data={devicesGraphData} options={options} />;
          case 1:
            return <Bar data={electronicDevicesGraphData} options={options} />;
          case 2:
            return <Bar data={spectacleDevicesGraphData} options={options} />;
          case 3:
              return <Bar data={opticalDevicesGraphData} options={options} />;
          case 4:
              return <Bar data={nonOpticalDevicesGraphData} options={options} />;
          default:
            return null;
        }
        case 3:
          switch (activeRecDevicesGraphTab) {
            case 0:
              return <Bar data={recDevicesGraphData} options={options} />;
            case 1:
              return <Bar data={electronicRecDevicesGraphData} options={options} />;
            case 2:
              return <Bar data={spectacleRecDevicesGraphData} options={options} />;
            case 3:
                return <Bar data={opticalRecDevicesGraphData} options={options} />;
            case 4:
                return <Bar data={nonOpticalRecDevicesGraphData} options={options} />;
            default:
              return null;
          }
      default:
        return null;
    }
  };

  const enableGraphs = (user.admin || user.hospitalRole[0].admin) ||
    (user.hospitalRole.length != 0 && !user.hospitalRole[0].admin);

  return (
    <Layout>
    <div className="content">
      <Navigation user={user} />
      <Container className="p-3">
        <h1 className="text-center mt-4 mb-4">Visualization and Reports</h1>
        <div className="row">
          <div className="col-md-2 ">
            {(user.admin || user.hospitalRole[0].admin) && (
              <button
                onClick={() => router.push("/customizedReport")}
                className="btn btn-success border-0 btn-block"
              >
                More Customization
              </button>
            )}
          </div>
          {(user.admin || user.hospitalRole[0].admin) && (
            <div className="offset-md-8 col-md-2">
              <button
                className="btn btn-success border-0 btn-block text-align-right"
                onClick={downloadFilteredReport}
              >
                <Download></Download> Download Report
              </button>
            </div>
          )}
        </div>
        <br />
        {enableGraphs && (
          <div className="row">
            <div className="col-md-3">
              <GraphCustomizer
                user={user}
                summary={summary}
                selectedHospitals={selectedHospitalNames}
                handleHospitalSelection={handleMultiSelectChange}
                startDate={startDate}
                handleStartDateChange={handleStartDateChange}
                endDate={endDate}
                handleEndDateChange={handleEndDateChange}
                handleAllSelect={handleAllSelect}
              />
            </div>
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
                  <Tab label="Activities" />
                  <Tab label="Dispensed Devices" />
                  <Tab label="Recommended Devices" />
                </Tabs>
                {activeGraphTab == 0 ?
                <Tabs
                  value={activeBeneficiaryGraphTab}
                  onChange={handleBeneficiaryGraphTabChange}
                  indicatorColor="primary"
                  textColor="primary"
                  centered
                >
                  <Tab label="All Beneficiaries" />
                </Tabs>
                : <></>
                }
                {activeGraphTab == 1 ?
                <Tabs
                  value={activeActivitiesGraphTab}
                  onChange={handleActivitiesGraphTabChange}
                  indicatorColor="primary"
                  textColor="primary"
                  centered
                >
                  <Tab label="All Activities" />
                  <Tab label="Training Activities" />
                  <Tab label="Counselling Activities" />
                </Tabs>
                : <></>
                }
                {activeGraphTab == 2 ?
                <Tabs
                  value={activeDevicesGraphTab}
                  onChange={handleDevicesGraphTabChange}
                  indicatorColor="primary"
                  textColor="primary"
                  centered
                >
                  <Tab label="All Devices" />
                  <Tab label="Electronic" />
                  <Tab label="Spectacle" />
                  <Tab label="Optical" />
                  <Tab label="Non-Optical" />
                </Tabs>
                : <></>
                }
                {activeGraphTab == 3 ?
                <Tabs
                  value={activeRecDevicesGraphTab}
                  onChange={handleRecDevicesGraphTabChange}
                  indicatorColor="primary"
                  textColor="primary"
                  centered
                >
                  <Tab label="All Devices" />
                  <Tab label="Electronic" />
                  <Tab label="Spectacle" />
                  <Tab label="Optical" />
                  <Tab label="Non-Optical" />
                </Tabs>
                : <></>
                }
                {renderGraph()}
              </Paper>
            </div>
          </div>
        )}
      </Container>
      <br />
    </div>
    </Layout>
  );
}

import { readUser, allHospitalRoles } from "./api/user";
import { getSession } from "next-auth/react";
import { Chart as ChartJS } from "chart.js/auto";
import { Chart } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";
import {
  getSummaryForAllHospitals,
} from "@/pages/api/hospital";
import { Container } from "react-bootstrap";
import Navigation from "./navigation/Navigation";
import Layout from './components/layout';
import { Table } from "react-bootstrap";
import Link from "next/link";
import moment from "moment";
import { useState, useEffect } from "react";
import { CSVLink, CSVDownload } from "react-csv";
import GraphCustomizer from "./components/GraphCustomizer";
import { Tab, Tabs, Paper } from "@mui/material";
// import * as XLSX from "xlsx";
import XLSX from "xlsx-js-style";
import { isNotNullEmptyOrUndefined } from "@/constants/globalFunctions";
import { Orienta } from "@next/font/google";
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
        (evaluation) => evaluation.dispensedSpectacle !== ""
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
        (evaluation) => evaluation.dispensedElectronic !== ""
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
        (evaluation) => evaluation.dispensedOptical !== ""
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
        (evaluation) => evaluation.dispensedNonOptical !== ""
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

// Function that builds a bar graph at a sublevel. This function is called
// with different devices types as the breakdownType
function buildDevicesBreakdownGraph(data, breakdownType) {
  // Future improvement:
  // Can make use of breakdownType, to selectively change the filter parameter
  // Same function to be used for other device types
  // Variable to change: item.dispensedElectronics
  const deviceList = data.reduce((types, hospital) => {
    const filteredEvaluations = hospital.comprehensiveLowVisionEvaluation.filter(
      (evaluation) => evaluation.dispensedElectronic !== ""
    )
    const deviceTypes = filteredEvaluations.map((item) => item.dispensedElectronic.split("; "));
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

  async function downloadFilteredReport() {
    var beneficiaryListAPI;
    try {
      beneficiaryListAPI = await fetch(
        "/api/beneficiaryList?id=" + user.id,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    var beneficiaryList = await beneficiaryListAPI.json();

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

    const wben = XLSX.utils.json_to_sheet(beneficiaryData);
    const wved = XLSX.utils.json_to_sheet(visionEnhancementData);

    const wlved = XLSX.utils.json_to_sheet([]);
    const wclve = XLSX.utils.json_to_sheet([]);

    const wed = XLSX.utils.json_to_sheet(electronicDevicesData);
    const wtd = XLSX.utils.json_to_sheet(trainingData);
    const wced = XLSX.utils.json_to_sheet(counsellingEducationData);

    const wahd = XLSX.utils.json_to_sheet([]);

    XLSX.utils.book_append_sheet(wb, wben, "Beneficiary Sheet");
    XLSX.utils.book_append_sheet(wb, wved, "Vision Enhancement Sheet");
    XLSX.utils.book_append_sheet(wb, wlved, "Low Vision Screening");
    XLSX.utils.book_append_sheet(wb, wclve, "CLVE Sheet");
    XLSX.utils.book_append_sheet(wb, wed, "Electronic Devices Break Up");
    XLSX.utils.book_append_sheet(wb, wtd, "Training Sheet");
    XLSX.utils.book_append_sheet(wb, wced, "Counselling Education Sheet");
    XLSX.utils.book_append_sheet(wb, wahd, "Aggregated Hospital Sheet");

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

    XLSX.writeFile(wb, "filtered_report.xlsx");
  }

  const handleStartDateChange = (e) => {
    setStartDate(moment(e.target.value).toDate());
  };

  const handleEndDateChange = (e) => {
    setEndDate(moment(e.target.value).toDate());
  };

  const [activeGraphTab, setActiveGraphTab] = useState(0);
  const [activeSubGraphTab, setActiveSubGraphTab] = useState(0);
  const handleGraphTabChange = (event, newValue) => {
    setActiveGraphTab(newValue);
    setActiveSubGraphTab(0);
  };

  const handleDevicesGraphTabChange = (event, newValue) => {
    setActiveSubGraphTab(newValue);
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

  const renderGraph = (activeTab, activeSubTab) => {
    switch (activeTab) {
      case 0:
        return <Bar data={beneficiaryGraphData} options={options} />;
      case 1:
        return <Bar data={activitiesGraphData} options={options} />;
      case 2:
        return <Bar data={trainingBreakdownGraphData} options={options} />;
      case 3:
        return <Bar data={counsellingBreakdownGraphData} options={options} />;
      case 4:
        switch (activeSubTab) {
          case 0:
            return <Bar data={devicesGraphData} options={options} />;
          case 1:
            return <Bar data={electronicDevicesGraphData} options={options} />;
          default:
            return null;
        }
      default:
        return null;
    }
  };

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
        {(user.admin || user.hospitalRole[0].admin) && (
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
                  <Tab label="All Activities" />
                  <Tab label="Training Activities" />
                  <Tab label="Counselling Activities" />
                  <Tab label="Devices" />
                </Tabs>
                {activeGraphTab == 4 ?
                <Tabs
                  value={activeSubGraphTab}
                  onChange={handleDevicesGraphTabChange}
                  indicatorColor="primary"
                  textColor="primary"
                  centered
                >
                  <Tab label="All Devices" />
                  <Tab label="Electronic" />
                </Tabs>
                : <></>
                }
                {renderGraph(activeGraphTab, activeSubGraphTab)}
              </Paper>
            </div>
          </div>
        )}
        {user.hospitalRole.length != 0 && !user.hospitalRole[0].admin && (
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
            {renderGraph(activeGraphTab, activeSubGraphTab)}
          </Paper>
        )}
      </Container>
      <br />
    </div>
    </Layout>
  );
}

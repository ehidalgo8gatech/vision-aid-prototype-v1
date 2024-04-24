import { getUserFromSession, allHospitalRoles } from "@/pages/api/user";
import "chart.js/auto";
import { Bar } from "react-chartjs-2";
import {
  getSummaryForAllHospitals,
} from "@/pages/api/hospital";
import { Container } from "react-bootstrap";
import Navigation from "./navigation/Navigation";
import Layout from './components/layout';
import moment from "moment";
import { useState, useEffect } from "react";
import {
  findAllBeneficiary,
} from "@/pages/api/beneficiary";
import GraphCustomizer from "./components/GraphCustomizer";
import { Tab, Tabs, Paper } from "@mui/material";
import XLSX from "xlsx-js-style";
import { Download } from "react-bootstrap-icons";
import { useRouter } from "next/router";
import {
  setAhdHeader,
  setClveHeader,
  setLveHeader,
  filterTrainingSummaryByDateRange,
  getReportData,
} from "@/constants/reportFunctions";
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

// This function is called to load data from the server side.
export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const user = await getUserFromSession(ctx);
    if (user === null) {
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
    const roles = await allHospitalRoles();
    let hospitalIds;
    if (!user.admin) {
      hospitalIds = getHospitalIdsByUsers(user.email, roles);
    }

    // The following is code to download summary data as a CSV file
    const beneficiaryListFromAPI = await findAllBeneficiary(user.admin, hospitalIds);

    let beneficiaryList = [];

    beneficiaryList = beneficiaryListFromAPI.map((beneficiary) => ({
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
    const summary = await getSummaryForAllHospitals(user.admin, hospitalIds);

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
});

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
    (sum, item) =>
      sum +
      item.comprehensiveLowVisionEvaluation.filter(
        (evaluation) => evaluation.dispensedSpectacle !== ""
      ).length,
    0
  );
  const dispensedElectronicCount = data.reduce(
    (sum, item) =>
      sum +
      item.comprehensiveLowVisionEvaluation.filter(
        (evaluation) => evaluation.dispensedElectronic !== ""
      ).length,
    0
  );
  const dispensedOpticalCount = data.reduce(
    (sum, item) =>
      sum +
      item.comprehensiveLowVisionEvaluation.filter(
        (evaluation) => evaluation.dispensedOptical !== ""
      ).length,
    0
  );
  const dispensedNonOpticalCount = data.reduce(
    (sum, item) =>
      sum +
      item.comprehensiveLowVisionEvaluation.filter(
        (evaluation) => evaluation.dispensedNonOptical !== ""
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

// Function that builds a bar graph at a sublevel. This function is called
// with different devices types as the breakdownType
function buildDevicesBreakdownGraph(data, breakdownType) {
  // Future improvement:
  // Can make use of breakdownType, to selectively change the filter parameter
  // Same function to be used for other device types
  // Variable to change: item.dispensedElectronics
  const types = data.reduce((types, hospital) => {
    const filteredEvaluations = hospital.comprehensiveLowVisionEvaluation.filter(
      (evaluation) => evaluation.dispensedElectronic !== ""
    )
    const deviceTypes = filteredEvaluations.map((item) => item.dispensedElectronic);
    return [...types, ...deviceTypes];
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
  const electronicDevicesGraphData =  buildDevicesBreakdownGraph(filteredSummary, "Electronic");

  const downloadFilteredReport = () => {
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
  };

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
            {(user.admin || (user.hospitalRole.length > 0 && user.hospitalRole[0].admin)) && (
              <button
                onClick={() => router.push("/customizedReport")}
                className="btn btn-success border-0 btn-block"
              >
                More Customization
              </button>
            )}
          </div>
          {(user.admin || (user.hospitalRole.length > 0 && user.hospitalRole[0].admin)) && (
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
        {(user.admin || (user.hospitalRole.length > 0 && user.hospitalRole[0].admin)) && (
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

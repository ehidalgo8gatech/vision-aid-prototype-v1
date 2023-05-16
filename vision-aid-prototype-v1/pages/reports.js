import { readUser } from './api/user'
import { getSession } from "next-auth/react";
import { Chart as ChartJS } from 'chart.js/auto'
import { Chart } from 'react-chartjs-2'
import { Bar } from "react-chartjs-2";
import { getSummaryForAllHospitals, getSummaryForHospitalFromID } from "@/pages/api/hospital";
import { Container } from "react-bootstrap";
import Navigation from './navigation/Navigation';
import { Table } from 'react-bootstrap';
import Link from "next/link";
import moment from 'moment';
import { useState, useEffect } from 'react';
import { findAllBeneficiary } from "@/pages/api/beneficiary";
import { CSVLink, CSVDownload } from "react-csv";
import GraphCustomizer from './components/GraphCustomizer';
import { Tab, Tabs, Paper } from '@mui/material';

// This function is called to load data from the server side.
export async function getServerSideProps(ctx) {
  const session = await getSession(ctx)
  if (session == null) {
    console.log("session is null")
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  // If it's a non admin user, we only want to show the summary for their hospital
  const user = await readUser(session.user.email)
  if (user.admin == null) {
    const hospitalSummary = await getSummaryForHospitalFromID(user.hospitalRole.hospitalId);
    return {
      props: {
        user: user,
        summary: JSON.parse(JSON.stringify([hospitalSummary])),
        error: null
      },
    }
  }

  // The user is an admin, so we want to show the summary for all hospitals

  // The following is code to download summary data as a CSV file
  const beneficiaryList = await findAllBeneficiary()
  let flatList = []

  function flatFields(extraInformation, key) {
    let flat = {

    }
    try {
      const ex = JSON.parse(extraInformation)
      for (let i = 0; i < ex.length; i++) {
        const e = ex[i];
        flat[(key + "." + i + "." + e.name).replaceAll(',', ' ')] = (e.value).replaceAll(',', ' ')
      }
    } catch (e) {
      return {}
    }
    return flat
  }

  function flatChildArray(childArray, key) {
    let flat = {

    }
    try {
      for (let i1 = 0; i1 < childArray.length; i1++) {
        const child = childArray[i1];
        for (let i = 0; i < Object.keys(child).length; i++) {
          const jsonKey = Object.keys(child)[i];
          flat[(key + "." + i1 + "." + jsonKey).replaceAll(',', ' ')] = child[jsonKey] == null ? "" : child[jsonKey].toString().replaceAll(',', ' ')
        }
      }
    } catch (e) {
      return {}
    }
    return flat
  }

  function appendFlat(appendFrom, appendTo) {
    Object.keys(appendFrom).forEach(append => {
      appendTo[append] = appendFrom[append]
    })
  }

  for (const beneficiary of beneficiaryList) {
    const visionEnhancementFlat = flatChildArray(beneficiary.Vision_Enhancement, 'visionEnhancement')
    const counselingEducationFlat = flatChildArray(beneficiary.Counselling_Education, 'counselingEducation')
    const comprehensiveLowVisionEvaluationFlat = flatChildArray(beneficiary.Comprehensive_Low_Vision_Evaluation, 'comprehensiveLowVisionEvaluation')
    const lowVisionEvaluationFlat = flatChildArray(beneficiary.Low_Vision_Evaluation, 'lowVisionEvaluation')
    const trainingFlat = flatChildArray(beneficiary.Training, 'training')
    const extraFields = flatFields(beneficiary.extraInformation, 'BeneficiaryExtraField')
    let flat = {
      mrn: beneficiary.mrn.replaceAll(',', ' '),
      hospitalName: beneficiary.hospital == null ? "" : beneficiary.hospital.name.replaceAll(',', ' '),
      beneficiaryName: beneficiary.beneficiaryName == null ? "" : beneficiary.beneficiaryName.replaceAll(',', ' '),
      dateOfBirth: beneficiary.dateOfBirth == null ? "" : beneficiary.dateOfBirth.toString().replaceAll(',', ' '),
      gender: beneficiary.gender == null ? "" : beneficiary.gender.replaceAll(',', ' '),
      phoneNumber: beneficiary.phoneNumber == null ? "" : beneficiary.phoneNumber.replaceAll(',', ' '),
      education: beneficiary.education == null ? "" : beneficiary.education.replaceAll(',', ' '),
      occupation: beneficiary.occupation == null ? "" : beneficiary.occupation.replaceAll(',', ' '),
      districts: beneficiary.districts == null ? "" : beneficiary.districts.replaceAll(',', ' '),
      state: beneficiary.state == null ? "" : beneficiary.state.replaceAll(',', ' '),
      diagnosis: beneficiary.diagnosis == null ? "" : beneficiary.diagnosis.replaceAll(',', ' '),
      vision: beneficiary.vision == null ? "" : beneficiary.vision.replaceAll(',', ' '),
      mDVI: beneficiary.mDVI == null ? "" : beneficiary.mDVI.replaceAll(',', ' '),
      rawExtraFields: beneficiary.extraInformation == null ? "" : beneficiary.extraInformation.replaceAll(',', ' '),
      rawVisionEnhancement: JSON.stringify(beneficiary.Vision_Enhancement).replaceAll(',', ' '),
      rawCounselingEducation: JSON.stringify(beneficiary.Counselling_Education).replaceAll(',', ' '),
      rawComprehensiveLowVisionEvaluation: JSON.stringify(beneficiary.Comprehensive_Low_Vision_Evaluation).replaceAll(',', ' '),
      rawLowVisionEvaluation: JSON.stringify(beneficiary.Low_Vision_Evaluation).replaceAll(',', ' '),
      rawTraining: JSON.stringify(beneficiary.Training).replaceAll(',', ' '),
    }
    appendFlat(extraFields, flat)
    appendFlat(visionEnhancementFlat, flat)
    appendFlat(counselingEducationFlat, flat)
    appendFlat(comprehensiveLowVisionEvaluationFlat, flat)
    appendFlat(lowVisionEvaluationFlat, flat)
    appendFlat(trainingFlat, flat)
    flatList.push(flat)
  }

  // We finally return all the data to the page
  if (user.admin != null) {
    const summary = await getSummaryForAllHospitals();
    return {
      props: {
        user: user,
        summary: JSON.parse(JSON.stringify(summary)),
        beneficiaryFlatList: flatList,
        error: null
      },
    }
  }
}

// This function is used to filter a given training by date range
function filterByDate(training, start, end) {
  // increment end date by one day to include the end date
  start = moment(start).subtract(1, 'day');
  return moment(training.date).isBetween(moment(start).startOf('day'), moment(end).startOf('day'), null, '[]');
}

// This function is used to filter the entire summary data by date range
function filterTrainingSummaryByDateRange(startDate, endDate, summary) {
  const filteredSummary = summary.map((hospital) => {
    const mobileTraining = hospital.mobileTraining.filter((training) => {
      // log data of each training
      return filterByDate(training, startDate, endDate);
    })
    // log the difference in length before and after filter

    const computerTraining = hospital.computerTraining.filter((training) => {
      return filterByDate(training, startDate, endDate);
    })

    const orientationMobilityTraining = hospital.orientationMobilityTraining.filter((training) => {
      return filterByDate(training, startDate, endDate);
    })

    const visionEnhancement = hospital.visionEnhancement.filter((training) => {
      return filterByDate(training, startDate, endDate);
    })

    const counsellingEducation = hospital.counsellingEducation.filter((training) => {
      return filterByDate(training, startDate, endDate);
    })

    const comprehensiveLowVisionEvaluation = hospital.comprehensiveLowVisionEvaluation.filter((training) => {
      return filterByDate(training, startDate, endDate);
    })

    const lowVisionEvaluation = hospital.lowVisionEvaluation.filter((training) => {
      return filterByDate(training, startDate, endDate);
    })

    const beneficiary = hospital.beneficiary

    return {
      ...hospital,
      mobileTraining,
      computerTraining,
      orientationMobilityTraining,
      visionEnhancement,
      counsellingEducation,
      comprehensiveLowVisionEvaluation,
      lowVisionEvaluation,
      beneficiary,
    }
  })

  return filteredSummary
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
    "rgba(119, 221, 119, 0.2)"
  ],
  borderColor: [
    "rgba(255, 99, 132, 1)",
    "rgba(54, 162, 235, 1)",
    "rgba(255, 206, 86, 1)",
    "rgba(75, 192, 192, 1)",
    "rgba(153, 102, 255, 1)",
    "rgba(255, 159, 64, 1)",
    "rgba(255, 99, 132, 1)",
    "rgba(119, 221, 119, 1)"
  ],
  borderWidth: 1,
}

// Function that builds a bar graph to show number of beneficiaries per hospital
function buildBeneficiaryGraph(data) {
  // data is an array of hopital objects
  const simplifiedData = data.map((hospital) => {
    return {
      name: hospital.name,
      value: hospital.beneficiary.length,
    }
  })

  // create a bar graph with graphData
  const graphData = {
    labels: simplifiedData.map((hospital) => hospital.name),
    datasets: [
      {
        label: 'Beneficiaries',
        data: simplifiedData.map((hospital) => hospital.value),
        ...graphOptions,
      },
    ],
  }
  return graphData;
}

// Function that builds a bar graph to show all the activities involved
function buildActivitiesGraph(data){
  //First get the evaluations
  const lowVisionEvaluationCount = data.reduce((sum, item) => sum + item.lowVisionEvaluation.length, 0);
  const comprehensiveLowVisionEvaluationCount = data.reduce((sum, item) => sum + item.comprehensiveLowVisionEvaluation.length, 0);
  const visionEnhancementCount = data.reduce((sum, item) => sum + item.visionEnhancement.length, 0);

  // Then the trainings
  const mobileTrainingCount = data.reduce((sum, item) => sum + item.mobileTraining.length, 0);
  const computerTrainingCount = data.reduce((sum, item) => sum + item.computerTraining.length, 0);
  const orientationMobilityTrainingCount = data.reduce((sum, item) => sum + item.orientationMobilityTraining.length, 0);
  const trainingCount = data.reduce((sum, item) => sum + item.training.length, 0) + mobileTrainingCount + computerTrainingCount + orientationMobilityTrainingCount;

  // Then the counselling
  const counsellingCount = data.reduce((sum, item) => sum + item.counsellingEducation.length, 0);


  const chartData = {
    labels: [
      `Low Vision Evaluation (${lowVisionEvaluationCount})`,
      `Comprehensive Low Vision Evaluation (${comprehensiveLowVisionEvaluationCount})`,
      `Vision Enhancement (${visionEnhancementCount})`,
      `All Training (${trainingCount})`,
      `All Counselling (${counsellingCount})`,
    ],
    datasets: [
      {
        label: "Cumulative Counts",
        data: [
          lowVisionEvaluationCount,
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
function buildBreakdownGraph(data, breakdownType){
  const types = data.reduce((types, hospital) => {
    const hospitalTypes = hospital[breakdownType].map((item) => item.type);
    return [...types, ...hospitalTypes];
  }
  , []);

  const typeCounts = types.reduce((counts, type) => {
    const count = counts[type] || 0;
    return {
      ...counts,
      [type]: count + 1,
    }
  } 
  , {});

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
function buildDevicesGraph(data){
  // The device information is stored inside the comprehensiveLowVisionEvaluation array 
  // Inside the array, there are fields dispensedSpectacle, dispensedElectronic, dispensedOptical, dispensedNonOptical which is either "Yes" or "No"
  // We want to count the number of "Yes" for each field
  const dispensedSpectacleCount = data.reduce((sum, item) => sum + item.comprehensiveLowVisionEvaluation.filter((evaluation) => evaluation.dispensedSpectacle === "Yes").length, 0);
  const dispensedElectronicCount = data.reduce((sum, item) => sum + item.comprehensiveLowVisionEvaluation.filter((evaluation) => evaluation.dispensedElectronic === "Yes").length, 0);
  const dispensedOpticalCount = data.reduce((sum, item) => sum + item.comprehensiveLowVisionEvaluation.filter((evaluation) => evaluation.dispensedOptical === "Yes").length, 0);
  const dispensedNonOpticalCount = data.reduce((sum, item) => sum + item.comprehensiveLowVisionEvaluation.filter((evaluation) => evaluation.dispensedNonOptical === "Yes").length, 0);

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

export default function Summary({ user, summary, beneficiaryFlatList }) {
  // create start date and end data states, start date is set to one year ago, end date is set to today
  const [startDate, setStartDate] = useState(moment().subtract(1, 'year').toDate());
  const [endDate, setEndDate] = useState(moment().toDate());

  const [selectedHospitals, setSelectedHospitals] = useState([]);

  useEffect(() => {
    setSelectedHospitals(summary.map((item) => item.id));
  }, []);

  const handleHospitalSelection = (event) => {
    const hospitalId = parseInt(event.target.value);
    const isChecked = event.target.checked;

    if (isChecked) {
      setSelectedHospitals([...selectedHospitals, hospitalId]);
    } else {
      setSelectedHospitals(selectedHospitals.filter(id => id !== hospitalId));
    }
  };

  const handleSelectAll = () => {
    setSelectedHospitals(summary.map((item) => item.id));
  };

  // filter summary data based on start and end date of the training
  const dateFilteredSummary = filterTrainingSummaryByDateRange(startDate, endDate, summary);
  // filter summary data based on selected hospitals
  const filteredSummary = dateFilteredSummary.filter((item) => selectedHospitals.includes(item.id));

  // generate all the data for required graphs
  const beneficiaryGraphData = buildBeneficiaryGraph(filteredSummary);
  const activitiesGraphData = buildActivitiesGraph(filteredSummary);
  const trainingBreakdownGraphData = buildBreakdownGraph(filteredSummary, "training");
  const counsellingBreakdownGraphData = buildBreakdownGraph(filteredSummary, "counsellingEducation");
  const devicesGraphData = buildDevicesGraph(filteredSummary);

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
          {user.admin != null && (<GraphCustomizer summary={summary} selectedHospitals={selectedHospitals} handleHospitalSelection={handleHospitalSelection} handleSelectAll={handleSelectAll} startDate={startDate} handleStartDateChange={handleStartDateChange} endDate={endDate} handleEndDateChange={handleEndDateChange} />)}
          <div className='col-md-1'></div>
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
      <p>Note this is , seperated if you separate by other delimiter it will not work</p>
      <CSVLink data={beneficiaryFlatList} separator={","}>Download me</CSVLink>
    </div>

  );
}


import { readUser } from './api/user'
import { getSession } from "next-auth/react";
import { Chart as ChartJS } from 'chart.js/auto'
import { Chart } from 'react-chartjs-2'
import { Bar } from "react-chartjs-2";
import { getSummaryForAllHospitals } from "@/pages/api/hospital";
import { Container } from "react-bootstrap";
import Navigation from './navigation/Navigation';
import { Table } from 'react-bootstrap';
import Link from "next/link";
import moment from 'moment';
import { useState } from 'react';

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
  const user = await readUser(session.user.email)
  if (user.admin == null) {
    console.log("user admin is null")
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  const summary = await getSummaryForAllHospitals();
  console.log(summary);
  return {
    props: {
      user: user,
      summary: JSON.parse(JSON.stringify(summary)),
      error: null
    },
  }
}

function filterByDate(training, start, end){
  // increment end date by one day to include the end date
  start = moment(start).subtract(1, 'day');
  return moment(training.date).isBetween(moment(start).startOf('day'), moment(end).startOf('day'), null, '[]');
}

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


export default function Summary({ summary }) {
  // create start date and end data states, start date is set to one year ago, end date is set to today
  const [startDate, setStartDate] = useState(moment().subtract(1, 'year').toDate());
  const [endDate, setEndDate] = useState(moment().toDate());

  // filter summary data based on start and end date of the training
  const filteredSummary = filterTrainingSummaryByDateRange(startDate, endDate, summary);

  //First get the evaluations
  const lowVisionEvaluationCount = filteredSummary.reduce((sum, item) => sum + item.lowVisionEvaluation.length, 0);
  const comprehensiveLowVisionEvaluationCount = filteredSummary.reduce((sum, item) => sum + item.comprehensiveLowVisionEvaluation.length, 0);
  const visionEnhancementCount = filteredSummary.reduce((sum, item) => sum + item.visionEnhancement.length, 0);

  // Then the trainings
  const mobileTrainingCount = filteredSummary.reduce((sum, item) => sum + item.mobileTraining.length, 0);
  const computerTrainingCount = filteredSummary.reduce((sum, item) => sum + item.computerTraining.length, 0);
  const counsellingEducationCount = filteredSummary.reduce((sum, item) => sum + item.counsellingEducation.length, 0);
  const orientationMobilityTrainingCount = filteredSummary.reduce((sum, item) => sum + item.orientationMobilityTraining.length, 0);


  const chartData = {
    labels: [
      `Low Vision Evaluation (${lowVisionEvaluationCount})`,
      `Comprehensive Low Vision Evaluation (${comprehensiveLowVisionEvaluationCount})`,
      `Vision Enhancement (${visionEnhancementCount})`,
      `Mobile Training (${mobileTrainingCount})`,
      `Computer Training (${computerTrainingCount})`,
      `Counselling/Education (${counsellingEducationCount})`,
      `Orientation/Mobility Training (${orientationMobilityTrainingCount})`,
    ],
    datasets: [
      {
        label: "Cumulative Counts",
        data: [
          lowVisionEvaluationCount,
          comprehensiveLowVisionEvaluationCount,
          visionEnhancementCount,
          mobileTrainingCount,
          computerTrainingCount,
          counsellingEducationCount,
          orientationMobilityTrainingCount
        ],
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
      },
    ],
  };

  const handleStartDateChange = (e) => {
    setStartDate(moment(e.target.value).toDate());
  };

  const handleEndDateChange = (e) => {
    setEndDate(moment(e.target.value).toDate());
  };

  return (
    <div>
      <Navigation />
      <Container>
        <h1>Trainings Summary</h1>
        <div className="row">
          <div className="col-md-2">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>List of Hospitals</th>
                </tr>
              </thead>
              <tbody>
                {summary.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div className="col-md-10">
            <div>
              <label htmlFor="startDate">Start Date:</label>
              <input type="date" id="startDate" name="startDate" value={moment(startDate).format('YYYY-MM-DD')} onChange={handleStartDateChange} />
              <label htmlFor="endDate">End Date:</label>
              <input type="date" id="endDate" name="endDate" value={moment(endDate).format('YYYY-MM-DD')} onChange={handleEndDateChange} />
            </div>
            <Bar data={chartData} />
            <h4>Total Number of Beneficiaries: {filteredSummary.reduce((sum, item) => sum + item.beneficiary.length, 0)}</h4>
          </div>
        </div>
      </Container>
    </div>

  );
}


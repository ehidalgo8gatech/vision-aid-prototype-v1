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
  return {
    props: {
      user: user,
      summary: await getSummaryForAllHospitals(),
      error: null
    },
  }
}

export default function Summary({ summary }) {
  //First get the evaluations
  const lowVisionEvaluationCount = summary.reduce((sum, item) => sum + item.lowVisionEvaluation, 0);
  const comprehensiveLowVisionEvaluationCount = summary.reduce((sum, item) => sum + item.comprehensiveLowVisionEvaluation, 0);
  const visionEnhancementCount = summary.reduce((sum, item) => sum + item.visionEnhancement, 0);

  // Then the trainings
  const mobileTrainingCount = summary.reduce((sum, item) => sum + item.mobileTraining, 0);
  const computerTrainingCount = summary.reduce((sum, item) => sum + item.computerTraining, 0);
  const counsellingEducationCount = summary.reduce((sum, item) => sum + item.counsellingEducation, 0);
  const orientationMobilityTrainingCount = summary.reduce((sum, item) => sum + item.orientationMobilityTraining, 0);


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
            <Bar data={chartData} />
            <h4>Total Number of Beneficiaries: {summary.reduce((sum, item) => sum + item.beneficiary, 0)}</h4>
          </div>
        </div>
      </Container>
    </div>

  );
}


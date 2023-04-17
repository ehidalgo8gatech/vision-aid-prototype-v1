import {readUser} from './api/user'
import {getSession} from "next-auth/react";
import { Chart as ChartJS } from 'chart.js/auto'
import { Chart }            from 'react-chartjs-2'
import { Bar } from "react-chartjs-2";
import {getSummaryForAllHospitals} from "@/pages/api/hospital";
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
            summary : await getSummaryForAllHospitals(),
            error: null
        },
    }
}

export default function Summary({ summary }) {
    const labels = summary.map((item) => item.name);
    const mobileTraining = summary.map((item) => item.mobileTraining);
    const computerTraining = summary.map((item) => item.computerTraining);
    const orientationMobilityTraining = summary.map((item) => item.orientationMobilityTraining);
    const visionEnhancement = summary.map((item) => item.visionEnhancement);
    const counsellingEducation = summary.map((item) => item.counsellingEducation);
    const comprehensiveLowVisionEvaluation = summary.map((item) => item.comprehensiveLowVisionEvaluation);
  
    const chartData = {
      labels: ["Hospitals", "Mobile Training", "Computer Training", "Orientation/Mobility Training", "Vision Enhancement", "Counselling/Education", "Comprehensive Low Vision Evaluation"],
      datasets: [
        {
          label: "Cumulative Counts",
          data: [
            labels.length,
            mobileTraining.reduce((a, b) => a + b, 0),
            computerTraining.reduce((a, b) => a + b, 0),
            orientationMobilityTraining.reduce((a, b) => a + b, 0),
            visionEnhancement.reduce((a, b) => a + b, 0),
            counsellingEducation.reduce((a, b) => a + b, 0),
            comprehensiveLowVisionEvaluation.reduce((a, b) => a + b, 0),
          ],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(255, 99, 132, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
            "rgba(255, 99, 132, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };
  
    return (
        <div>
            <Navigation />
        <Container>
          <h1>Summary</h1>
          <Bar data={chartData} options={{}} />
          <Table striped bordered hover>
        <thead>
            <tr>
            <th>Hospital</th>
            <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {summary.map((item) => (
            <tr key={item.id}>
                <td>{item.name}</td>
                <td>
                <Link href={`/requiredfields`}>
                    Configure
                </Link>
                </td>
            </tr>
            ))}
        </tbody>
        </Table>

        </Container>
        </div>
      );
  }


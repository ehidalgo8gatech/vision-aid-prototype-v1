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
import {findAllBeneficiary} from "@/pages/api/beneficiary";
import CsvDownloadButton from 'react-json-to-csv'

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
    const hospitalSummary = await getSummaryForHospitalFromID(user.hospitalRole.hospitalId);
    return {
      props: {
        user: user,
        summary: JSON.parse(JSON.stringify([hospitalSummary])),
        error: null
      },
    }
  }

  const beneficiaryList = await findAllBeneficiary()
  let flatList = []

  function flatFields(extraInformation, key) {
    let flat = {

    }
    try {
      const ex = JSON.parse(extraInformation)
      for (let i = 0; i < ex.length; i++){
        const e = ex[i];
        flat[(key+"."+i+"."+e.name).replaceAll(';', ' ')] = (e.value).replaceAll(';', ' ')
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
      for (let i1 = 0; i1 < childArray.length; i1++){
        const child = childArray[i1];
        for (let i = 0; i < Object.keys(child).length; i++){
          const jsonKey = Object.keys(child)[i];
          flat[(key+"."+i1+"."+jsonKey).replaceAll(';', ' ')] = child[jsonKey] == null ? "" : child[jsonKey].toString().replaceAll(';', ' ')
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
      mrn: beneficiary.mrn.replaceAll(';', ' '),
      hospitalName: beneficiary.hospital == null ? "" : beneficiary.hospital.name.replaceAll(';', ' '),
      beneficiaryName: beneficiary.beneficiaryName ==  null ? "" : beneficiary.beneficiaryName.replaceAll(';', ' '),
      dateOfBirth: beneficiary.dateOfBirth ==  null ? "" :  beneficiary.dateOfBirth.toString().replaceAll(';', ' '),
      gender: beneficiary.gender ==  null ? "" :  beneficiary.gender.replaceAll(';', ' '),
      phoneNumber: beneficiary.phoneNumber ==  null ? "" :  beneficiary.phoneNumber.replaceAll(';', ' '),
      education: beneficiary.education ==  null ? "" :  beneficiary.education.replaceAll(';', ' '),
      occupation: beneficiary.occupation ==  null ? "" :  beneficiary.occupation.replaceAll(';', ' '),
      districts: beneficiary.districts ==  null ? "" :  beneficiary.districts.replaceAll(';', ' '),
      state: beneficiary.state ==  null ? "" :  beneficiary.state.replaceAll(';', ' '),
      diagnosis: beneficiary.diagnosis ==  null ? "" :  beneficiary.diagnosis.replaceAll(';', ' '),
      vision: beneficiary.vision ==  null ? "" :  beneficiary.vision.replaceAll(';', ' '),
      mDVI: beneficiary.mDVI ==  null ? "" :  beneficiary.mDVI.replaceAll(';', ' '),
      rawExtraFields: beneficiary.extraInformation ==  null ? "" :  beneficiary.extraInformation.replaceAll(';', ' '),
      rawVisionEnhancement: JSON.stringify(beneficiary.Vision_Enhancement).replaceAll(';', ' '),
      rawCounselingEducation: JSON.stringify(beneficiary.Counselling_Education).replaceAll(';', ' '),
      rawComprehensiveLowVisionEvaluation: JSON.stringify(beneficiary.Comprehensive_Low_Vision_Evaluation).replaceAll(';', ' '),
      rawLowVisionEvaluation: JSON.stringify(beneficiary.Low_Vision_Evaluation).replaceAll(';', ' '),
      rawTraining: JSON.stringify(beneficiary.Training).replaceAll(';', ' '),
    }
    appendFlat(extraFields, flat)
    appendFlat(visionEnhancementFlat, flat)
    appendFlat(counselingEducationFlat, flat)
    appendFlat(comprehensiveLowVisionEvaluationFlat, flat)
    appendFlat(lowVisionEvaluationFlat, flat)
    appendFlat(trainingFlat, flat)
    flatList.push(flat)
  }

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

function filterByDate(training, start, end) {
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
  const filteredSummary = dateFilteredSummary.filter((item) => selectedHospitals.includes(item.id));


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
          {user.admin != null && (
            <div className="col-md-2">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>List of Hospitals</th>
                    <th>
                      <button type='button' className='btn btn-light' onClick={handleSelectAll}>Select All</button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {summary.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>
                        <input
                          type="checkbox"
                          id={`hospital-${item.id}`}
                          value={item.id}
                          onChange={handleHospitalSelection}
                          checked={selectedHospitals.includes(item.id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
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
      <br/>
      <h1>Download All Beneficiary Data</h1>
      <p>Not this is ; seperated if you separate by other delimiter it will not work</p>
      <CsvDownloadButton data={beneficiaryFlatList} />
    </div>

  );
}


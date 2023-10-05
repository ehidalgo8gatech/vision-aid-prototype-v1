import Link from "next/link";
import styles from "@/styles/Home.module.css";
import Head from "next/head";
import { useState } from "react";
import Image from "next/image";
import { Inter } from "@next/font/google";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import { readUser } from "./api/user";
import Navigation from "./navigation/Navigation";
import UserProfileCard from "./components/UserProfileCard";
import HistoricalLowVisionScreeningForm from "../comps/HistoricalLowVisionScreeningForm";
import HistoricalCLVForm from "../comps/HistoricalCLVForm";
import HistoricalVisionEnhancementForm from "../comps/HistoricalVisionEnhancementForm";
import HistoricalCounselingForm from "../comps/HistoricalCounselingForm";
import HistoricalTrainingForm from "../comps/HistoricalTrainingForm";

export default function HistoricalEvaluationPage(props) {
  let serviceToFetch = props.service;
  if (props.service == "Low_Vision_Screening") {
    serviceToFetch = "Low_Vision_Evaluation";
  }

  const service = props.user[serviceToFetch];
  const currentUser = props.currentUser;
  const [formData, setFormData] = useState({});

  const formatTitle = (title) => {
    return title.split("_").join(" ");
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const filterData = (date, services) => {
    return services.filter(function (value) {
      return formatDate(value["service"].date) === formatDate(date);
    })[0];
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleServiceChange = (date, services) => {
    let historicalDashboard = null;
    const evaluationData = filterData(date, services);
    if (date == undefined || evaluationData == undefined) {
      historicalDashboard = (
        <div className="text-align-left">
          Select a historical evaluation date from the drop-down menu!
        </div>
      );
    } else {
      if (props.service == "Low_Vision_Screening") {
        historicalDashboard = (
          <HistoricalLowVisionScreeningForm
            key={evaluationData.service.id}
            evaluationData={filterData(date, services)}
          />
        );
      } else if (props.service == "Comprehensive_Low_Vision_Evaluation") {
        historicalDashboard = (
          <HistoricalCLVForm
            key={evaluationData.service.id}
            evaluationData={evaluationData}
          />
        );
      } else if (props.service == "Vision_Enhancement") {
        historicalDashboard = (
          <HistoricalVisionEnhancementForm
            key={evaluationData.service.id}
            evaluationData={filterData(date, services)}
          />
        );
      } else if (props.service == "Counselling_Education") {
        historicalDashboard = (
          <HistoricalCounselingForm
            key={evaluationData.service.id}
            evaluationData={filterData(date, services)}
          />
        );
      } else if (props.service == "Training") {
        historicalDashboard = (
          <HistoricalTrainingForm
            key={evaluationData.service.id}
            evaluationData={filterData(date, services)}
          />
        );
      }
    }

    return historicalDashboard;
  };

  const historicalDates = service
    .filter((item) => item.date !== null)
    .map((item) => formatDate(item.date));

  service.sort(function (record1, record2) {
    var date1 = new Date(record1.date);
    var date2 = new Date(record2.date);

    if (date1 > date2) {
      return -1;
    } else if (date1 === date2) {
      return 0;
    } else {
      return 1;
    }
  });

  let serviceEditList = [];

  for (let i = 0; i < service.length; i++) {
    if (currentUser.hospitalRole !== null) {
      if (currentUser.hospitalRole.admin === true && i < 2) {
        serviceEditList.push({ service: service[i], editable: true });
      } else {
        serviceEditList.push({ service: service[i], editable: false });
      }
    } else {
      serviceEditList.push({ service: service[i], editable: true });
    }
  }

  return (
    <div>
      <Navigation />
      <div className="container">
        <h2>{formatTitle(props.service)} Details</h2>
        <hr class="horizontal-line" />
        <div className="row">
          <div className="col-md-6">
            <UserProfileCard
              gender={props.user.gender}
              phoneNumber={props.user.phoneNumber}
              MRN={props.user.mrn}
              dob={formatDate(props.user.dateOfBirth)}
              hospitalName={props.user.hospitalName}
              education={props.user.education}
              districts={props.user.districts}
              state={props.user.state}
              beneficiaryName={props.user.beneficiaryName}
              occupation={props.user.occupation}
              extraInformation={props.user.extraInformation[0].value}
              name={props.user.beneficiaryName}
              mdvi={props.user.mDVI}
            />
          </div>
          <div className="col-md-6">
            <div className="row">
              <div className="text-align-left">
                Select a date:
                <select
                  className="mb-3"
                  name="historyDate"
                  id="historyDate"
                  onChange={handleChange}
                  style={{ width: "200px" }}
                >
                  <option value="">Date Picker</option>
                  {historicalDates.map((date, idx) => (
                    <option key={idx} value={formatDate(date)}>
                      {formatDate(date)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="row">
              {handleServiceChange(formData["historyDate"], serviceEditList)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  var user;
  var service;

  const query = ctx.query;
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
  const currentUser = await readUser(session.user.email);
  try {
    const beneficiary = await await fetch(
      `${process.env.NEXTAUTH_URL}/api/beneficiary?mrn=${query.mrn}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    user = await beneficiary.json();
    service = query.service;
  } catch (error) {
    console.error("Error fetching users:", error);
  }

  if (!user || !service) {
    return {
      notFound: true,
    };
  }

  const benMirror = await fetch(
    `${process.env.NEXTAUTH_URL}/api/beneficiaryMirror?hospital=` +
      user.hospital.name,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );
  const benMirrorJson = await benMirror.json();

  user.hospitalName = user.hospital.name;

  return {
    props: {
      currentUser: currentUser,
      user: user,
      service: service,
      beneficiaryMirror: benMirrorJson,
    },
  };
}

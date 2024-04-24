import { useState } from "react";
import { getUserFromSession } from "@/pages/api/user";
import Navigation from "./navigation/Navigation";
import UserProfileCard from "./components/UserProfileCard";
import HistoricalLowVisionScreeningForm from "../comps/HistoricalLowVisionScreeningForm";
import HistoricalCLVForm from "../comps/HistoricalCLVForm";
import HistoricalVisionEnhancementForm from "../comps/HistoricalVisionEnhancementForm";
import HistoricalCounselingForm from "../comps/HistoricalCounselingForm";
import HistoricalTrainingForm from "../comps/HistoricalTrainingForm";
import { getCounsellingType } from "./api/counsellingType";
import { getTrainingTypes } from "./api/trainingType";
import { getTrainingSubTypes } from "./api/trainingSubType";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

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

    let service;
    let beneficiaryUser;
    const query = ctx.query;
    try {
      const beneficiary = await fetch(
        `${process.env.NEXTAUTH_URL}/api/beneficiary?mrn=${query.mrn}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      beneficiaryUser = await beneficiary.json();
      service = query.service;
    } catch (error) {
      console.error("Error fetching users:", error);
    }

    if (!beneficiaryUser || !service) {
      return {
        notFound: true,
      };
    }

    const benMirror = await fetch(
      `${process.env.NEXTAUTH_URL}/api/beneficiaryMirror?hospital=` +
        beneficiaryUser.hospital.name,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    const benMirrorJson = await benMirror.json();

    beneficiaryUser.hospitalName = beneficiaryUser.hospital.name;

    return {
      props: {
        mrn: query.mrn,
        currentUser: user,
        user: beneficiaryUser,
        service: service,
        beneficiaryMirror: benMirrorJson,
        counselingTypeList: await getCounsellingType(),
        trainingTypeList: await getTrainingTypes(),
        trainingSubTypeList: await getTrainingSubTypes(),
      },
    };
  }
});

export default function HistoricalEvaluationPage(props) {
  let serviceToFetch = props.service;
  if (props.service == "Low_Vision_Screening") {
    serviceToFetch = "Low_Vision_Evaluation";
  }
  let serviceIsATraining = false;
  if (
    props.service === "Training" ||
    props.service === "Counselling_Education"
  ) {
    serviceIsATraining = true;
  }

  const [user, setUser] = useState(props.user);

  const service = user[serviceToFetch];
  const currentUser = props.currentUser;

  service.sort(function (record1, record2) {
    var date1 = new Date(record1.date).getTime();
    var date2 = new Date(record2.date).getTime();
    if (date1 > date2) {
      return -1;
    } else if (date1 == date2) {
      if (record1.sessionNumber > record2.sessionNumber) {
        return -1;
      } else if (record1.sessionNumber < record2.sessionNumber) {
        return 1;
      }
      return 0;
    } else {
      return 1;
    }
  });

  const refetchUser = async () => {
    let user = {};
    try {
      const beneficiary = await fetch(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/beneficiary?mrn=${props.mrn}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      user = await beneficiary.json();
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    user.hospitalName = user.hospital.name;
    setUser(user);
  };

  const formatTitle = (title) => {
    return title.split("_").join(" ");
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const filterData = (entry, services) => {
    return services.filter(function (value) {
      if (serviceIsATraining) {
        return (
          formatDate(value["service"].date) === formatDate(entry.date) &&
          value["service"].type == entry.suppInfo.type &&
          value["service"].sessionNumber == entry.suppInfo.sessionNumber
        );
      } else {
        return (
          formatDate(value["service"].date) === formatDate(entry.date) &&
          value["service"].sessionNumber == entry.suppInfo
        );
      }
    })[0];
  };

  const handleServiceChange = (entry, services) => {
    let historicalDashboard = null;
    const evaluationData = filterData(entry, services);
    if (
      entry.date == undefined ||
      entry.suppInfo == undefined ||
      evaluationData == undefined
    ) {
      historicalDashboard = (
        <div className="text-align-left">No corresponding data found!</div>
      );
    } else {
      let commonProps = { refetchUser, evaluationData };
      if (props.service == "Low_Vision_Screening") {
        historicalDashboard = (
          <HistoricalLowVisionScreeningForm
            {...commonProps}
            key={evaluationData.service.id}
          />
        );
      } else if (props.service == "Comprehensive_Low_Vision_Evaluation") {
        historicalDashboard = (
          <HistoricalCLVForm {...commonProps} key={evaluationData.service.id} />
        );
      } else if (props.service == "Vision_Enhancement") {
        historicalDashboard = (
          <HistoricalVisionEnhancementForm
            {...commonProps}
            key={evaluationData.service.id}
          />
        );
      } else if (props.service == "Counselling_Education") {
        historicalDashboard = (
          <HistoricalCounselingForm
            {...commonProps}
            key={evaluationData.service.id}
            counselingTypeList={props.counselingTypeList}
          />
        );
      } else if (props.service == "Training") {
        historicalDashboard = (
          <HistoricalTrainingForm
            {...commonProps}
            key={evaluationData.service.id}
            trainingTypeList={props.trainingTypeList}
            trainingSubTypeList={props.trainingSubTypeList}
          />
        );
      }
    }

    return historicalDashboard;
  };

  const historicalDates = service
    .filter((item) => item.date !== null)
    .map((item) => {
      if (serviceIsATraining) {
        return {
          date: formatDate(item.date),
          suppInfo: { type: item.type, sessionNumber: item.sessionNumber },
        };
      } else {
        return {
          date: formatDate(item.date),
          suppInfo: item.sessionNumber,
        };
      }
    });
  console.log("Historical dates refreshed.");

  let serviceEditList = [];

  for (let i = 0; i < service.length; i++) {
    if (currentUser.admin) {
      serviceEditList.push({ service: service[i], editable: true });
    } else {
      if (i < 2) {
        serviceEditList.push({ service: service[i], editable: true });
      } else {
        serviceEditList.push({ service: service[i], editable: false });
      }
    }
  }

  return (
    <div>
      <Navigation user={currentUser} />
      <div className="container p-4 mb-3">
        <h2>{formatTitle(props.service)} History</h2>
        <hr className="horizontal-line" />
        <div className="row">
          <div className="col-md-5">
            <UserProfileCard
              gender={user.gender}
              phoneNumber={user.phoneNumber}
              MRN={user.mrn}
              dob={formatDate(user.dateOfBirth)}
              hospitalName={user.hospitalName}
              education={user.education}
              districts={user.districts}
              state={user.state}
              beneficiaryName={user.beneficiaryName}
              occupation={user.occupation}
              extraInformation={user.extraInformation[0].value}
              name={user.beneficiaryName}
              mdvi={user.mDVI}
            />
          </div>
          <div className="col-md-7">
            <div className="row">
              {/* {accordionList} */}
              {historicalDates.length === 0 && (
                <div>
                  <br />
                  <br />
                  <strong>No history for this user!</strong>
                </div>
              )}
              {historicalDates.length > 0 && (
                <div className="accordion" id="historyAccordion">
                  {serviceIsATraining &&
                    historicalDates.map((entry, index) => (
                      <div className="accordion-item" key={index}>
                        <h2
                          className="accordion-header"
                          id={"panelsStayOpen-heading" + index}
                        >
                          <button
                            className="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={"#panelsStayOpen-collapse" + index}
                            aria-expanded="false"
                            aria-controls={"panelsStayOpen-collapse" + index}
                          >
                            <strong>
                              {entry.date} (Type: {entry.suppInfo.type},
                              Session: {entry.suppInfo.sessionNumber})
                            </strong>
                          </button>
                        </h2>
                        <div
                          id={"panelsStayOpen-collapse" + index}
                          className="accordion-collapse collapse"
                          aria-labelledby={"panelsStayOpen-heading" + index}
                          data-bs-parent="#historyAccordion"
                        >
                          <div className="accordion-body">
                            {handleServiceChange(entry, serviceEditList)}
                          </div>
                        </div>
                      </div>
                    ))}
                  {!serviceIsATraining &&
                    historicalDates.map((entry, index) => (
                      <div className="accordion-item" key={index}>
                        <h2
                          className="accordion-header"
                          id={"panelsStayOpen-heading" + index}
                        >
                          <button
                            className="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={"#panelsStayOpen-collapse" + index}
                            aria-expanded="false"
                            aria-controls={"panelsStayOpen-collapse" + index}
                          >
                            <strong>
                              {entry.date} (Session: {entry.suppInfo})
                            </strong>
                          </button>
                        </h2>
                        <div
                          id={"panelsStayOpen-collapse" + index}
                          className="accordion-collapse collapse"
                          aria-labelledby={"panelsStayOpen-heading" + index}
                          data-bs-parent="#historyAccordion"
                        >
                          <div className="accordion-body">
                            {handleServiceChange(entry, serviceEditList)}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

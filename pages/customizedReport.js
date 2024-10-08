import moment from "moment";
import { useState, useEffect, useCallback } from "react";
import Navigation from "./navigation/Navigation";
import Layout from './components/layout';
import { Table } from "react-bootstrap";
import { getSummaryForAllHospitals } from "./api/hospital";
import XLSX from "xlsx-js-style";
import { isNotNullEmptyOrUndefined } from "@/constants/globalFunctions";
import {
  setAhdHeader,
  setClveHeader,
  setLveHeader,
  getAge,
  getReportData,
  filterTrainingSummaryByDateRange,
} from "@/constants/reportFunctions";
import { getSession } from "next-auth/react";
import { readUser, allHospitalRoles } from "./api/user";
import { getTrainingTypes } from "./api/trainingType";

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

  const user = await readUser(session.user.email);
  const roles = await allHospitalRoles();
  let hospitalIds;
  const isAdmin = user.admin != null;
  if (!isAdmin) {
    hospitalIds = getHospitalIdsByUsers(user.id, roles);
  }

  const trainingTypes = await getTrainingTypes();

  const summary = await getSummaryForAllHospitals(isAdmin, hospitalIds);

  return {
    props: {
      user: JSON.parse(JSON.stringify(user)),
      summary: JSON.parse(JSON.stringify(summary)),
      trainingTypes,
    },
  };
}

function ReportCustomizer(props) {
  const { user, summary, trainingTypes } = props;
  const [startDate, setStartDate] = useState(
    moment().subtract(1, "year").toDate()
  );
  const [endDate, setEndDate] = useState(moment().toDate());
  const [selectedHospitals, setSelectedHospitals] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState(["M", "F", "Other"]);
  const [selectedMdvi, setSelectedMdvi] = useState(["Yes", "No", "At Risk"]);
  const [selectedSheets, setSelectedSheets] = useState([
    "Beneficiary",
    "Vision Enhancement",
    "Low Vision Screening",
    "Comprehensive Low Vision Evaluation",
    "Electronic Devices Break Up",
    "Training",
    "Counselling Education",
    "Aggregated Hospital Data",
  ]);
  const today = moment(new Date()).format("YYYY-MM-DD");
  const [selectedTrainingTypes, setSelectedTrainingTypes] =
    useState(trainingTypes);

  const handleSelectAll = useCallback(() => {
      setSelectedHospitals(props.summary.map((item) => item.id));
  }, [props.summary]);

  useEffect(() => {
    handleSelectAll(props.summary);
  }, [handleSelectAll, props.summary]);

  const handleHospitalSelection = (event) => {
    const hospitalId = parseInt(event.target.value);
    const isChecked = event.target.checked;

    if (isChecked) {
      setSelectedHospitals((selectedHospitals) => [
        ...selectedHospitals,
        hospitalId,
      ]);
    } else {
      setSelectedHospitals((selectedHospitals) =>
        selectedHospitals.filter((id) => id !== hospitalId)
      );
    }
  };

  const hospitalTable = summary.map((item) => (
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
  ));

  const updateGender = (e) => {
    if (e.target.checked) {
      setSelectedGenders((selectedGenders) => [
        ...selectedGenders,
        e.target.id,
      ]);
    } else {
      setSelectedGenders((selectedGenders) =>
        selectedGenders.filter((gender) => gender !== e.target.id)
      );
    }
  };

  const updateMdvi = (e) => {
    if (e.target.checked) {
      setSelectedMdvi((selectedMdvi) => [...selectedMdvi, e.target.id]);
    } else {
      setSelectedMdvi((selectedMdvi) =>
        selectedMdvi.filter((mdvi) => mdvi !== e.target.id)
      );
    }
  };

  const updateSheets = (e) => {
    if (e.target.checked) {
      setSelectedSheets((selectedSheets) => [...selectedSheets, e.target.id]);
    } else {
      setSelectedSheets((selectedSheets) =>
        selectedSheets.filter((sheetName) => sheetName !== e.target.id)
      );
    }
  };

  const updateTrainingTypes = (e) => {
    if (e.target.checked) {
      setSelectedTrainingTypes((selectedTrainingTypes) => [
        ...selectedTrainingTypes,
        e.target.id,
      ]);
    } else {
      setSelectedTrainingTypes((selectedTrainingTypes) =>
        selectedTrainingTypes.filter((type) => type !== e.target.id)
      );
    }
  };

  const downloadFilteredReport = async () => {
    try {
      startDate.setUTCHours(0, 0, 0, 0);
      endDate.setUTCHours(23, 59, 59, 999);
      const beneficiaryListAPI = selectedHospitals.map((id) => fetch(
        `/api/beneficiaryList?id=${id}&startDate=${startDate.toUTCString()}&endDate=${endDate.toUTCString()}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      ));
      let promises = await Promise.all(beneficiaryListAPI);
      var finalResult = await Promise.all(promises.map(res => res.json ? res.json().catch(err => err) : res));
    } catch (error) {
      console.error("Error fetching beneficiary list:", error);
    }
    const beneficiaryList = finalResult.flat();
    const dateFilteredBeneficiaryData = filterTrainingSummaryByDateRange(
      startDate,
      endDate,
      beneficiaryList,
      "beneficiary"
    );


    const numTotalBeneficiaries = dateFilteredBeneficiaryData.length;

    const minAge = isNotNullEmptyOrUndefined(
      document.getElementById("minAge").value
    )
      ? document.getElementById("minAge").value
      : 0;

    const maxAge = isNotNullEmptyOrUndefined(
      document.getElementById("maxAge").value
    )
      ? document.getElementById("maxAge").value
      : 100;

    const filteredBeneficiaryData = dateFilteredBeneficiaryData.filter(
      (item) =>
        selectedHospitals.includes(item.hospital.id) &&
        selectedGenders.includes(item.gender) &&
        selectedMdvi.includes(item.mDVI) &&
        minAge <= getAge(item.dateOfBirth) &&
        getAge(item.dateOfBirth) <= maxAge
    );

    const numFilteredBeneficiaries = filteredBeneficiaryData.length;
    
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

    const {
      beneficiaryData,
      visionEnhancementData,
      lowVisionEvaluationData,
      comprehensiveLowVisionEvaluationData,
      electronicDevicesData,
      trainingData,
      counsellingEducationData,
      aggregatedHospitalData,
    } = getReportData(
      filteredBeneficiaryData,
      filteredSummary,
      numTotalBeneficiaries === numFilteredBeneficiaries
    );

    const wb = XLSX.utils.book_new();

    if (selectedSheets.includes("Beneficiary")) {
      const wben = XLSX.utils.json_to_sheet(beneficiaryData);
      XLSX.utils.book_append_sheet(wb, wben, "Beneficiary Sheet");
    }

    if (selectedSheets.includes("Vision Enhancement")) {
      const wved = XLSX.utils.json_to_sheet(visionEnhancementData);
      XLSX.utils.book_append_sheet(wb, wved, "Vision Enhancement Sheet");
    }

    if (selectedSheets.includes("Low Vision Screening")) {
      const wlved = XLSX.utils.json_to_sheet([]);
      XLSX.utils.book_append_sheet(wb, wlved, "Low Vision Screening");
      setLveHeader(wlved);
      XLSX.utils.sheet_add_json(wlved, lowVisionEvaluationData, {
        skipHeader: true,
        origin: -1,
      });
    }

    if (selectedSheets.includes("Comprehensive Low Vision Evaluation")) {
      const wclve = XLSX.utils.json_to_sheet([]);
      XLSX.utils.book_append_sheet(wb, wclve, "CLVE Sheet");
      setClveHeader(wclve);
      XLSX.utils.sheet_add_json(wclve, comprehensiveLowVisionEvaluationData, {
        skipHeader: true,
        origin: -1,
      });
    }

    if (selectedSheets.includes("Electronic Devices Break Up")) {
      const wed = XLSX.utils.json_to_sheet(electronicDevicesData);
      XLSX.utils.book_append_sheet(wb, wed, "Electronic Devices Break Up");
    }

    if (selectedSheets.includes("Training")) {
      let finalTrainingData = trainingData;
      // Check if less number of training types are selected compared to the total number of training types
      if (trainingTypes.length > selectedTrainingTypes.length) {
        // "Type of Training" is a column title in the Training sheet
        finalTrainingData = trainingData.filter((training) =>
          selectedTrainingTypes.includes(training["Type of Training"])
        );
      }
      const wtd = XLSX.utils.json_to_sheet(finalTrainingData);
      XLSX.utils.book_append_sheet(wb, wtd, "Training Sheet");
    }

    if (selectedSheets.includes("Counselling Education")) {
      const wced = XLSX.utils.json_to_sheet(counsellingEducationData);
      XLSX.utils.book_append_sheet(wb, wced, "Counselling Education Sheet");
    }

    if (selectedSheets.includes("Aggregated Hospital Data")) {
      const wahd = XLSX.utils.json_to_sheet([]);
      XLSX.utils.book_append_sheet(wb, wahd, "Aggregated Hospital Sheet");
      setAhdHeader(
        wahd,
        filteredSummary.map((hospital) => hospital.name)
      );
      XLSX.utils.sheet_add_json(wahd, aggregatedHospitalData, {
        skipHeader: true,
        origin: -1,
      });
    }

    XLSX.writeFile(wb, "customized_report.xlsx");
  };

  return (
    <Layout>
    <div className="content">
      <Navigation user={user} />
      <div className="container p-4 mb-3">
        <h1 className="mt-4 mb-4">Customize Report</h1>

        <div className="accordion">
          <div className="accordion-item">
            <h2 className="accordion-header" id="panelsStayOpen-headingOne">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseOne"
                aria-expanded="false"
                aria-controls="panelsStayOpen-collapseOne"
              >
                <strong>Date Range For Trainings</strong>
              </button>
            </h2>
            <div
              id="panelsStayOpen-collapseOne"
              className="accordion-collapse collapse"
              aria-labelledby="panelsStayOpen-headingOne"
            >
              <div className="accordion-body">
                <div className="row">
                  <div className="col-md-4 text-align-left">
                    <label htmlFor="startDate">Start Date: </label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={moment(startDate).format("YYYY-MM-DD")}
                      onChange={(e) =>
                        setStartDate(moment(e.target.value).toDate())
                      }
                      max={today}
                      className="margin-left"
                    />
                  </div>
                  <div className="col-md-4 text-align-left">
                    <label htmlFor="endDate">End Date: </label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={moment(endDate).format("YYYY-MM-DD")}
                      onChange={(e) =>
                        setEndDate(moment(e.target.value).toDate())
                      }
                      min={moment(startDate).format("YYYY-MM-DD")}
                      max={today}
                      className="margin-left"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header" id="panelsStayOpen-headingTwo">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseTwo"
                aria-expanded="false"
                aria-controls="panelsStayOpen-collapseTwo"
              >
                <strong>Hospitals</strong>
              </button>
            </h2>
            <div
              id="panelsStayOpen-collapseTwo"
              className="accordion-collapse collapse"
              aria-labelledby="panelsStayOpen-headingTwo"
            >
              <div className="accordion-body">
                <div className="row">
                  <div className="col-md-6">
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Hospitals</th>
                          <th>
                            <button
                              type="button"
                              className="btn btn-light"
                              onClick={handleSelectAll}
                            >
                              Select All
                            </button>
                          </th>
                        </tr>
                      </thead>
                      <tbody>{summary != null && hospitalTable}</tbody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header" id="panelsStayOpen-headingThree">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseThree"
                aria-expanded="false"
                aria-controls="panelsStayOpen-collapseThree"
              >
                <strong>Gender</strong>
              </button>
            </h2>
            <div
              id="panelsStayOpen-collapseThree"
              className="accordion-collapse collapse"
              aria-labelledby="panelsStayOpen-headingThree"
            >
              <div className="accordion-body">
                <div className="row">
                  <div className="col-md-2 text-align-left">
                    <input
                      type="checkbox"
                      id="M"
                      onChange={(e) => updateGender(e)}
                      checked={selectedGenders.includes("M")}
                    />
                    <label className="margin-left">Male</label>
                  </div>

                  <div className="col-md-2 text-align-left">
                    <input
                      type="checkbox"
                      id="F"
                      onChange={(e) => updateGender(e)}
                      checked={selectedGenders.includes("F")}
                    />
                    <label className="margin-left">Female</label>
                  </div>

                  <div className="col-md-2 text-align-left">
                    <input
                      type="checkbox"
                      id="Other"
                      onChange={(e) => updateGender(e)}
                      checked={selectedGenders.includes("Other")}
                    />
                    <label className="margin-left">Other</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header" id="panelsStayOpen-headingFour">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseFour"
                aria-expanded="false"
                aria-controls="panelsStayOpen-collapseFour"
              >
                <strong>Age</strong>
              </button>
            </h2>
            <div
              id="panelsStayOpen-collapseFour"
              className="accordion-collapse collapse"
              aria-labelledby="panelsStayOpen-headingFour"
            >
              <div className="accordion-body">
                <div className="row">
                  <div className="col-md-4 text-align-left">
                    <label>Minimum Age: </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      id="minAge"
                      className="margin-left"
                    />
                  </div>

                  <div className="col-md-4 text-align-left">
                    <label>Maximum Age: </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      id="maxAge"
                      className="margin-left"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header" id="panelsStayOpen-headingFive">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseFive"
                aria-expanded="false"
                aria-controls="panelsStayOpen-collapseFive"
              >
                <strong>MDVI</strong>
              </button>
            </h2>
            <div
              id="panelsStayOpen-collapseFive"
              className="accordion-collapse collapse"
              aria-labelledby="panelsStayOpen-headingFive"
            >
              <div className="accordion-body">
                <div className="row">
                  <div className="col-md-2 text-align-left">
                    <input
                      type="checkbox"
                      id="Yes"
                      onChange={(e) => updateMdvi(e)}
                      checked={selectedMdvi.includes("Yes")}
                    />
                    <label className="margin-left">Yes</label>
                  </div>

                  <div className="col-md-2 text-align-left">
                    <input
                      type="checkbox"
                      id="No"
                      onChange={(e) => updateMdvi(e)}
                      checked={selectedMdvi.includes("No")}
                    />
                    <label className="margin-left">No</label>
                  </div>

                  <div className="col-md-2 text-align-left">
                    <input
                      type="checkbox"
                      id="At Risk"
                      onChange={(e) => updateMdvi(e)}
                      checked={selectedMdvi.includes("At Risk")}
                    />
                    <label className="margin-left">At Risk</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header" id="panelsStayOpen-headingSix">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseSix"
                aria-expanded="false"
                aria-controls="panelsStayOpen-collapseSix"
              >
                <strong>Sheets To Include</strong>
              </button>
            </h2>
            <div
              id="panelsStayOpen-collapseSix"
              className="accordion-collapse collapse"
              aria-labelledby="panelsStayOpen-headingSix"
            >
              <div className="accordion-body">
                <div className="row">
                  <div className="col-md-6 text-align-left">
                    <input
                      type="checkbox"
                      id="Beneficiary"
                      onChange={(e) => updateSheets(e)}
                      checked={selectedSheets.includes("Beneficiary")}
                    />
                    <label className="margin-left">Beneficiary</label>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 text-align-left">
                    <input
                      type="checkbox"
                      id="Vision Enhancement"
                      onChange={(e) => updateSheets(e)}
                      checked={selectedSheets.includes("Vision Enhancement")}
                    />
                    <label className="margin-left">Vision Enhancement</label>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 text-align-left">
                    <input
                      type="checkbox"
                      id="Low Vision Screening"
                      onChange={(e) => updateSheets(e)}
                      checked={selectedSheets.includes("Low Vision Screening")}
                    />
                    <label className="margin-left">Low Vision Screening</label>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 text-align-left">
                    <input
                      type="checkbox"
                      id="Comprehensive Low Vision Evaluation"
                      onChange={(e) => updateSheets(e)}
                      checked={selectedSheets.includes(
                        "Comprehensive Low Vision Evaluation"
                      )}
                    />
                    <label className="margin-left">
                      Comprehensive Low Vision Evaluation
                    </label>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 text-align-left">
                    <input
                      type="checkbox"
                      id="Electronic Devices Break Up"
                      onChange={(e) => updateSheets(e)}
                      checked={selectedSheets.includes(
                        "Electronic Devices Break Up"
                      )}
                    />
                    <label className="margin-left">
                      Electronic Devices Break Up
                    </label>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 text-align-left">
                    <input
                      type="checkbox"
                      id="Training"
                      onChange={(e) => updateSheets(e)}
                      checked={selectedSheets.includes("Training")}
                    />
                    <label className="margin-left">Training</label>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 text-align-left">
                    <input
                      type="checkbox"
                      id="Counselling Education"
                      onChange={(e) => updateSheets(e)}
                      checked={selectedSheets.includes("Counselling Education")}
                    />
                    <label className="margin-left">Counselling Education</label>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 text-align-left">
                    <input
                      type="checkbox"
                      id="Aggregated Hospital Data"
                      onChange={(e) => updateSheets(e)}
                      checked={selectedSheets.includes(
                        "Aggregated Hospital Data"
                      )}
                    />
                    <label className="margin-left">
                      Aggregated Hospital Data
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {selectedSheets.includes("Training") && (
            <div className="accordion-item">
              <h2 className="accordion-header" id="panelsStayOpen-headingSeven">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapseSeven"
                  aria-expanded="false"
                  aria-controls="panelsStayOpen-collapseSeven"
                >
                  <strong>Training Types</strong>
                </button>
              </h2>
              <div
                id="panelsStayOpen-collapseSeven"
                className="accordion-collapse collapse"
                aria-labelledby="panelsStayOpen-headingSeven"
              >
                <div className="accordion-body">
                  {trainingTypes.map((type) => (
                    <div className="row" key={type}>
                      <div className="col-md-6 text-align-left">
                        <input
                          type="checkbox"
                          id={type}
                          onChange={(e) => updateTrainingTypes(e)}
                          checked={selectedTrainingTypes.includes(type)}
                        />
                        <label className="margin-left">{type}</label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <br />
        <button
          className="btn btn-success border-0 btn-block"
          onClick={() => downloadFilteredReport()}
        >
          Download Customized Report
        </button>
        <br />
        <br />
      </div>
      <br />
    </div>
    </Layout>
  );
}

export default ReportCustomizer;

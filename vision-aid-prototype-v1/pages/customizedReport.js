import moment, { updateLocale } from "moment";
import { useState, useEffect } from "react";
import Navigation from "./navigation/Navigation";
import { Table } from "react-bootstrap";
import { findAllBeneficiary } from "./api/beneficiary";
import { getSummaryForAllHospitals } from "./api/hospital";
import XLSX from "xlsx-js-style";
import { isNotNullEmptyOrUndefined } from "@/constants/globalFunctions";
import {
  setAhdHeader,
  setClveHeader,
  setLveHeader,
  getAge,
  filterTrainingSummaryByDateRange,
  getReportData,
} from "@/constants/reportFunctions";

export async function getServerSideProps(ctx) {
  const beneficiaryListFromAPI = await findAllBeneficiary();

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

  const summary = await getSummaryForAllHospitals();

  return {
    props: {
      summary: JSON.parse(JSON.stringify(summary)),
      beneficiaryList: JSON.parse(JSON.stringify(beneficiaryList)),
    },
  };
}

function ReportCustomizer({ summary, beneficiaryList } = props) {
  const [startDate, setStartDate] = useState(
    moment().subtract(1, "year").toDate()
  );
  const [endDate, setEndDate] = useState(moment().toDate());
  const [selectedHospitals, setSelectedHospitals] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState(["M", "F", "Other"]);
  const [selectedMdvi, setSelectedMdvi] = useState(["Yes", "No", "At Risk"]);
  const today = moment(new Date()).format("YYYY-MM-DD");

  const handleStartDateChange = (e) => {
    setStartDate(moment(e.target.value).toDate());
  };

  const handleEndDateChange = (e) => {
    setEndDate(moment(e.target.value).toDate());
  };

  const handleSelectAll = () => {
    setSelectedHospitals(summary.map((item) => item.id));
  };

  useEffect(() => {
    setSelectedHospitals(summary.map((item) => item.id));
  }, []);

  const handleHospitalSelection = (event) => {
    const hospitalId = parseInt(event.target.value);
    const isChecked = event.target.checked;

    if (isChecked) {
      setSelectedHospitals([...selectedHospitals, hospitalId]);
    } else {
      setSelectedHospitals(selectedHospitals.filter((id) => id !== hospitalId));
    }
  };

  const updateGender = (e) => {
    if (e.target.checked) {
      setSelectedGenders((selectedGenders) => [
        ...selectedGenders,
        e.target.id,
      ]);
    } else {
      setSelectedGenders((selectedGenders) =>
        selectedGenders.filter(function (gender) {
          return gender != e.target.id;
        })
      );
    }
  };

  const updateMdvi = (e) => {
    if (e.target.checked) {
      setSelectedMdvi((selectedMdvi) => [...selectedMdvi, e.target.id]);
    } else {
      setSelectedMdvi((selectedMdvi) =>
        selectedMdvi.filter(function (mdvi) {
          return mdvi != e.target.id;
        })
      );
    }
  };

  const downloadFilteredReport = () => {
    const dateFilteredBeneficiaryData = filterTrainingSummaryByDateRange(
      startDate,
      endDate,
      JSON.parse(JSON.stringify(beneficiaryList)),
      "beneficiary"
    );

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
      computerTrainingData,
      mobileTrainingData,
      orientationMobilityTrainingData,
      trainingData,
      counsellingEducationData,
      aggregatedHospitalData,
    } = getReportData(filteredBeneficiaryData, filteredSummary);

    const wb = XLSX.utils.book_new();

    const wben = XLSX.utils.json_to_sheet(beneficiaryData);
    const wved = XLSX.utils.json_to_sheet(visionEnhancementData);

    const wlved = XLSX.utils.json_to_sheet([]);
    const wclve = XLSX.utils.json_to_sheet([]);

    const wctd = XLSX.utils.json_to_sheet(computerTrainingData);
    const wmtd = XLSX.utils.json_to_sheet(mobileTrainingData);
    const womtd = XLSX.utils.json_to_sheet(orientationMobilityTrainingData);
    const wtd = XLSX.utils.json_to_sheet(trainingData);
    const wced = XLSX.utils.json_to_sheet(counsellingEducationData);

    const wahd = XLSX.utils.json_to_sheet([]);

    XLSX.utils.book_append_sheet(wb, wben, "Beneficiary Sheet");
    XLSX.utils.book_append_sheet(wb, wved, "Vision Enhancement Sheet");
    XLSX.utils.book_append_sheet(wb, wlved, "Low Vision Screening");
    XLSX.utils.book_append_sheet(wb, wclve, "CLVE Sheet");
    XLSX.utils.book_append_sheet(wb, wctd, "Computer Training Sheet");
    XLSX.utils.book_append_sheet(wb, wmtd, "Mobile Training Sheet");
    XLSX.utils.book_append_sheet(wb, womtd, "Orientation Mobile Sheet");
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

    XLSX.writeFile(wb, "customized_report.xlsx");
  };

  return (
    <div>
      <Navigation />
      <div className="container p-4 mb-3">
        <h1 className="mt-4 mb-4">Customize Report</h1>
        <br />
        <br />
        <div>
          <div className="row">
            <div className="col-md-3 text-align-left">
              <strong className="padding-left">Date Range for Trainings</strong>
            </div>
            <div className="col-md-2 text-align-left">
              <label htmlFor="startDate">Start Date: </label>
            </div>
            <div className="col-md-2 text-align-left">
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={moment(startDate).format("YYYY-MM-DD")}
                onChange={handleStartDateChange}
                max={today}
              />
            </div>
            <div className="col-md-2 text-align-left">
              <label htmlFor="endDate">End Date: </label>
            </div>
            <div className="col-md-2 text-align-left">
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={moment(endDate).format("YYYY-MM-DD")}
                onChange={handleEndDateChange}
                min={moment(startDate).format("YYYY-MM-DD")}
                max={today}
              />
            </div>
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-md-3 text-align-left">
            <strong className="padding-left">Gender</strong>
          </div>
          <div className="col-md-2 text-align-left">
            <input
              type="checkbox"
              id="M"
              onClick={(e) => updateGender(e)}
              checked={selectedGenders.includes("M")}
            />
            <label className="padding-left">Male</label>
          </div>

          <div className="col-md-2 text-align-left">
            <input
              type="checkbox"
              id="F"
              onClick={(e) => updateGender(e)}
              checked={selectedGenders.includes("F")}
            />
            <label className="padding-left">Female</label>
          </div>

          <div className="col-md-2 text-align-left">
            <input
              type="checkbox"
              id="Other"
              onClick={(e) => updateGender(e)}
              checked={selectedGenders.includes("Other")}
            />
            <label className="padding-left">Other</label>
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-md-3 text-align-left">
            <strong className="padding-left">Age</strong>
          </div>
          <div className="col-md-2 text-align-left">
            <label>Minimum Age: </label>
          </div>
          <div className="col-md-2 text-align-left">
            <input
              type="number"
              min={0}
              max={100}
              id="minAge"
              className="date-size"
            />
          </div>

          <div className="col-md-2 text-align-left">
            <label>Maximum Age: </label>
          </div>
          <div className="col-md-2 text-align-left">
            <input
              type="number"
              min={0}
              max={100}
              id="maxAge"
              className="date-size"
            />
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-md-3 text-align-left">
            <strong className="padding-left">MDVI</strong>
          </div>

          <div className="col-md-2 text-align-left">
            <input
              type="checkbox"
              id="Yes"
              onClick={(e) => updateMdvi(e)}
              checked={selectedMdvi.includes("Yes")}
            />
            <label className="padding-left">Yes</label>
          </div>

          <div className="col-md-2 text-align-left">
            <input
              type="checkbox"
              id="No"
              onClick={(e) => updateMdvi(e)}
              checked={selectedMdvi.includes("No")}
            />
            <label className="padding-left">No</label>
          </div>

          <div className="col-md-2 text-align-left">
            <input
              type="checkbox"
              id="At Risk"
              onClick={(e) => updateMdvi(e)}
              checked={selectedMdvi.includes("At Risk")}
            />
            <label className="padding-left">At Risk</label>
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-md-3 text-align-left">
            <strong className="padding-left">Hospitals</strong>
          </div>
          <div className="col-md-6">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Hospital</th>
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
              <tbody>
                {summary != null &&
                  summary.map((item) => (
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
        </div>
        <br />
        <button
          class="btn btn-success border-0 btn-block"
          onClick={() => downloadFilteredReport()}
        >
          Download Customized Report
        </button>
        <br />
        <br />
      </div>
      <br />
    </div>
  );
}

export default ReportCustomizer;

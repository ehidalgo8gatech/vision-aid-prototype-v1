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

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { ExpandMoreRounded } from "@mui/icons-material";

export async function getServerSideProps(ctx) {
  const beneficiaryListFromAPI = await findAllBeneficiary();

  console.log("Beneficiary List: ", beneficiaryListFromAPI);

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
  console.log("Summary: ", summary);

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
  const [selectedSheets, setSelectedSheets] = useState([
    "Beneficiary",
    "Vision Enhancement",
    "Low Vision Screening",
    "Comprehensive Low Vision Evaluation",
    "Computer Training",
    "Mobile Training",
    "Orientation Mobility Training",
    "Training",
    "Counselling Education",
    "Aggregated Hospital Data",
  ]);
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

  const updateSheets = (e) => {
    if (e.target.checked) {
      setSelectedSheets((selectedSheets) => [...selectedSheets, e.target.id]);
    } else {
      setSelectedSheets((selectedSheets) =>
        selectedSheets.filter(function (sheetName) {
          return sheetName != e.target.id;
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
      computerTrainingData,
      mobileTrainingData,
      orientationMobilityTrainingData,
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

    if (selectedSheets.includes("Computer Training")) {
      const wctd = XLSX.utils.json_to_sheet(computerTrainingData);
      XLSX.utils.book_append_sheet(wb, wctd, "Computer Training Sheet");
    }

    if (selectedSheets.includes("Mobile Training")) {
      const wmtd = XLSX.utils.json_to_sheet(mobileTrainingData);
      XLSX.utils.book_append_sheet(wb, wmtd, "Mobile Training Sheet");
    }

    if (selectedSheets.includes("Orientation Mobility Training")) {
      const womtd = XLSX.utils.json_to_sheet(orientationMobilityTrainingData);
      XLSX.utils.book_append_sheet(wb, womtd, "Orientation Mobile Sheet");
    }

    if (selectedSheets.includes("Training")) {
      const wtd = XLSX.utils.json_to_sheet(trainingData);
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
    <div>
      <Navigation />
      <div className="container p-4 mb-3">
        <h1 className="mt-4 mb-4">Customize Report</h1>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreRounded />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>
              <strong>Date Range For Trainings</strong>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className="row">
              <div className="col-md-4 text-align-left">
                <label htmlFor="startDate">Start Date: </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={moment(startDate).format("YYYY-MM-DD")}
                  onChange={handleStartDateChange}
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
                  onChange={handleEndDateChange}
                  min={moment(startDate).format("YYYY-MM-DD")}
                  max={today}
                  className="margin-left"
                />
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreRounded />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>
              <strong>Hospitals</strong>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className="row">
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
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreRounded />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>
              <strong>Gender</strong>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className="row">
              <div className="col-md-2 text-align-left">
                <input
                  type="checkbox"
                  id="M"
                  onClick={(e) => updateGender(e)}
                  checked={selectedGenders.includes("M")}
                />
                <label className="margin-left">Male</label>
              </div>

              <div className="col-md-2 text-align-left">
                <input
                  type="checkbox"
                  id="F"
                  onClick={(e) => updateGender(e)}
                  checked={selectedGenders.includes("F")}
                />
                <label className="margin-left">Female</label>
              </div>

              <div className="col-md-2 text-align-left">
                <input
                  type="checkbox"
                  id="Other"
                  onClick={(e) => updateGender(e)}
                  checked={selectedGenders.includes("Other")}
                />
                <label className="margin-left">Other</label>
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreRounded />}
            aria-controls="panel3a-content"
            id="panel3a-header"
          >
            <Typography>
              <strong>Age</strong>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
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
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreRounded />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>
              <strong>MDVI</strong>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className="row">
              <div className="col-md-2 text-align-left">
                <input
                  type="checkbox"
                  id="Yes"
                  onClick={(e) => updateMdvi(e)}
                  checked={selectedMdvi.includes("Yes")}
                />
                <label className="margin-left">Yes</label>
              </div>

              <div className="col-md-2 text-align-left">
                <input
                  type="checkbox"
                  id="No"
                  onClick={(e) => updateMdvi(e)}
                  checked={selectedMdvi.includes("No")}
                />
                <label className="margin-left">No</label>
              </div>

              <div className="col-md-2 text-align-left">
                <input
                  type="checkbox"
                  id="At Risk"
                  onClick={(e) => updateMdvi(e)}
                  checked={selectedMdvi.includes("At Risk")}
                />
                <label className="margin-left">At Risk</label>
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreRounded />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>
              <strong>Sheets To Include</strong>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className="row">
              <div className="col-md-6 text-align-left">
                <input
                  type="checkbox"
                  id="Beneficiary"
                  onClick={(e) => updateSheets(e)}
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
                  onClick={(e) => updateSheets(e)}
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
                  onClick={(e) => updateSheets(e)}
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
                  onClick={(e) => updateSheets(e)}
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
                  id="Computer Training"
                  onClick={(e) => updateSheets(e)}
                  checked={selectedSheets.includes("Computer Training")}
                />
                <label className="margin-left">Computer Training</label>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 text-align-left">
                <input
                  type="checkbox"
                  id="Mobile Training"
                  onClick={(e) => updateSheets(e)}
                  checked={selectedSheets.includes("Mobile Training")}
                />
                <label className="margin-left">Mobile Training</label>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 text-align-left">
                <input
                  type="checkbox"
                  id="Orientation Mobility Training"
                  onClick={(e) => updateSheets(e)}
                  checked={selectedSheets.includes(
                    "Orientation Mobility Training"
                  )}
                />
                <label className="margin-left">
                  Orientation Mobility Training
                </label>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 text-align-left">
                <input
                  type="checkbox"
                  id="Training"
                  onClick={(e) => updateSheets(e)}
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
                  onClick={(e) => updateSheets(e)}
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
                  onClick={(e) => updateSheets(e)}
                  checked={selectedSheets.includes("Aggregated Hospital Data")}
                />
                <label className="margin-left">Aggregated Hospital Data</label>
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
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

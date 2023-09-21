import { Table } from "react-bootstrap";
import Link from "next/link";
import moment from "moment";

export default function ReportsHospitalSelection(props) {
  const {
    summary,
    selectedHospitals,
    handleHospitalSelection,
    handleSelectAll,
    startDate,
    endDate,
    handleStartDateChange,
    handleEndDateChange,
    downloadReportFn,
  } = props;

  const today = moment(new Date()).format("YYYY-MM-DD");

  return (
    <div className="col-md-3">
      <div>
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
      <br />
      <div className="flex-container-vertical">
        <div className="row">
          <div className="col-md-5">
            <label htmlFor="startDate">Start Date:</label>
          </div>
          <div className="col-md-5">
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={moment(startDate).format("YYYY-MM-DD")}
              onChange={handleStartDateChange}
              max={today}
            />
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-md-5">
            <label htmlFor="endDate">End Date:</label>
          </div>
          <div className="col-md-5">
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
      <br />
      <button className="btn btn-success border-0 btn-block" onClick={downloadReportFn}>
        Download Filtered Report
      </button>
    </div>
  );
}

import { Table } from "react-bootstrap";
import { FormControl, Select, MenuItem, Checkbox } from "@mui/material";
import Link from "next/link";
import moment from "moment";
import { createMenu, createOptionMenu } from "@/constants/globalFunctions";

export default function ReportsHospitalSelection(props) {
  const {
    user,
    summary,
    selectedHospitals,
    handleHospitalSelection,
    startDate,
    endDate,
    handleStartDateChange,
    handleEndDateChange,
    handleAllSelect,
  } = props;

  const today = moment(new Date()).format("YYYY-MM-DD");

  return (
    <div>
      <div>
        <p>
          <strong>Customization</strong>
        </p>
        <div>
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
          <br />
          {user != undefined && (user.admin || user.hospitalRole[0].admin) && (
            <div>
              <div>
                <div style={{display: "inline-block"}}>
                  <Checkbox defaultChecked onChange={handleAllSelect} />
                </div>
                <div style={{display: "inline-block"}}>
                  <p>Select hospitals: </p>
                </div>
              </div>
              {/* <br /> */}
              <FormControl fullWidth size="small">
                <Select
                  onChange={handleHospitalSelection}
                  value={selectedHospitals}
                  name="hospitals"
                  multiple
                  renderValue={(selected) => selected.join(", ")}
                  // MenuProps={MenuProps}
                >
                  {createMenu(
                    summary.map((hospital) => hospital.name),
                    true,
                    selectedHospitals
                  )}
                </Select>
              </FormControl>
              {/* <Table striped bordered hover>
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
        </Table> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

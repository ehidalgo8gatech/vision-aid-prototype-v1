import { Table } from 'react-bootstrap';
import Link from "next/link";
import moment from 'moment';

export default function ReportsHospitalSelection(props) {
    const { summary, selectedHospitals, handleHospitalSelection, handleSelectAll, startDate, endDate, handleStartDateChange, handleEndDateChange } = props;
    return (
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
                    {summary != null && summary.map((item) => (
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
            <div>
                <label htmlFor="startDate">Start Date:</label>
                <input type="date" id="startDate" name="startDate" value={moment(startDate).format('YYYY-MM-DD')} onChange={handleStartDateChange} />
                <label htmlFor="endDate">End Date:</label>
                <input type="date" id="endDate" name="endDate" value={moment(endDate).format('YYYY-MM-DD')} onChange={handleEndDateChange} />
            </div>
        </div>
    )
}
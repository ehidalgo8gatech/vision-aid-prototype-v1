import { useRouter } from "next/router";
import ReferencePage from "./ReferencePage";

export default function BeneficiaryServicesTable(props) {
  const router = useRouter();

  const openUserHistoricalEvaluationPage = async (
    mrn = null,
    service = null
  ) => {
    if (mrn)
      router.push(
        `/historicalEvaluationDashboard?mrn=${mrn}&service=${service}`
      );
    else {
      router.push(`/beneficiaryinformation`, undefined, { shallow: true });
    }
  };

  const openNewEvalutaionPage = async (mrn = null, service = null) => {
    if (mrn) {
      router.push(`/newEvaluationDashboard?mrn=${mrn}&service=${service}`);
    } else {
      router.push(`/beneficiaryinformation`);
    }
  };

  return (
    <>
    <ReferencePage></ReferencePage>
    <br></br><br></br>
    <table className="table beneficiary-table table-bordered">
      <thead className="thead-dark">
        <tr>
          <th scope="col">Services</th>
          <th scope="col">Evaluation Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">Comprehensive Low Vision Evaluation</th>
          <td>
            <button
              type="button"
              className="btn btn-success border-0 btn-block"
              onClick={() =>
                openUserHistoricalEvaluationPage(
                  props.user.mrn,
                  "Comprehensive_Low_Vision_Evaluation"
                )
              }
            >
              History
            </button>
            <div className="divider" />
            <button
              type="button"
              className="btn btn-success border-0 btn-block"
              onClick={() =>
                openNewEvalutaionPage(
                  props.user.mrn,
                  "Comprehensive_Low_Vision_Evaluation"
                )
              }
            >
              New Evaluation
            </button>
          </td>
        </tr>
        <tr>
          <th scope="row">Vision Enhancement (less than 7 years old)</th>
          <td>
            <button
              type="button"
              className="btn btn-success border-0 btn-block"
              onClick={() =>
                openUserHistoricalEvaluationPage(
                  props.user.mrn,
                  "Vision_Enhancement"
                )
              }
            >
              History
            </button>
            <div className="divider" />
            <button
              type="button"
              className="btn btn-success border-0 btn-block"
              onClick={() =>
                openNewEvalutaionPage(props.user.mrn, "Vision_Enhancement")
              }
            >
              New Evaluation
            </button>
          </td>
        </tr>
        <tr>
          <th scope="row">Counselling</th>
          <td>
            <button
              type="button"
              className="btn btn-success border-0 btn-block"
              onClick={() =>
                openUserHistoricalEvaluationPage(
                  props.user.mrn,
                  "Counselling_Education"
                )
              }
            >
              History
            </button>
            <div className="divider" />
            <button
              type="button"
              className="btn btn-success border-0 btn-block"
              onClick={() =>
                openNewEvalutaionPage(props.user.mrn, "Counselling_Education")
              }
            >
              New Evaluation
            </button>
          </td>
        </tr>
        <tr>
          <th scope="row">Training</th>
          <td>
            <button
              type="button"
              className="btn btn-success border-0 btn-block"
              onClick={() =>
                openUserHistoricalEvaluationPage(props.user.mrn, "Training")
              }
            >
              History
            </button>
            <div className="divider" />
            <button
              type="button"
              className="btn btn-success border-0 btn-block"
              onClick={() => openNewEvalutaionPage(props.user.mrn, "Training")}
            >
              New Evaluation
            </button>
          </td>
        </tr>
        <tr>
          <th scope="row">Camp_Low Vision Screening</th>
          <td>
            <button
              type="button"
              className="btn btn-success border-0 btn-block"
              onClick={() =>
                openUserHistoricalEvaluationPage(
                  props.user.mrn,
                  "Low_Vision_Screening"
                )
              }
            >
              History
            </button>
            <div className="divider" />
            <button
              type="button"
              className="btn btn-success border-0 btn-block"
              onClick={() =>
                openNewEvalutaionPage(props.user.mrn, "Low_Vision_Screening")
              }
            >
              New Evaluation
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    </>
  );
}

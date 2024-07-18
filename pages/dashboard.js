// pages/dashboard.js
import Navigation from "./navigation/Navigation";
import Layout from './components/layout';
import Head from "next/head";
import { getSession } from "next-auth/react";
import { readUser } from "./api/user";
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { useState } from "react";
import { readBeneficiaryOtherParam } from "./api/beneficiary";

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  if (session == null) {
    return {
      props: {
        user: null
      }
    };
  }
  const user = await readUser(session.user.email);
  let users = await readBeneficiaryOtherParam('Test Hospital');

  
  return {
    props: {
      users: JSON.parse(JSON.stringify(users)),
      user: JSON.parse(JSON.stringify(user)),
    },
  };
}

export default function FeedbackPage(props) {

  const globalFieldOptions = { filter: true }
  const pagination = true;
  const paginationPageSize = 100;
  const paginationPageSizeSelector = [50, 100, 500];
  const [rowData] = useState(props.users);
  
  const [colDefs] = useState([
    { field: "mrn", tooltipField: "mrn", ...globalFieldOptions },
    { field: "beneficiaryName", ...globalFieldOptions },
    { field: "hospitalId", ...globalFieldOptions },
    { field: "dateOfBirth", ...globalFieldOptions },
    { field: "gender", ...globalFieldOptions },
    { field: "phoneNumber", ...globalFieldOptions },
    { field: "education", ...globalFieldOptions },
    { field: "occupation", ...globalFieldOptions },
    { field: "districts", ...globalFieldOptions },
    { field: "state", ...globalFieldOptions },
    { field: "diagnosis", ...globalFieldOptions },
    { field: "vision", ...globalFieldOptions },
    { field: "mDVI", ...globalFieldOptions },
    { field: "extraInformation", ...globalFieldOptions },
    { field: "consent", ...globalFieldOptions },
    { field: "deleted", ...globalFieldOptions }
  ]);

  return (
    <Layout>
      <Navigation user={props.user} />
      <Head>
        <title>Dashboard</title>
      </Head>
        <div className="container-flex" style={{ padding: '1rem' }}>
          <div
            className="ag-theme-quartz" // applying the Data Grid theme
            style={{ height: 'calc(100dvh - 304px)' }} // the Data Grid will fill the size of the parent container
          >
            <AgGridReact
                rowData={rowData}
                columnDefs={colDefs}
                pagination={pagination}
                paginationPageSize={paginationPageSize}
                paginationPageSizeSelector={paginationPageSizeSelector}
            />
          </div>
        </div>
    </Layout>
  );
}

import Navigation from './navigation/Navigation';
import {getSession} from "next-auth/react";
import {readUser} from "@/pages/api/user";
import {readBeneficiaryMirror} from "@/pages/api/beneficiaryMirror";
import {findAllHospital} from "@/pages/api/hospital";

export async function getServerSideProps(ctx) {
    const session = await getSession(ctx)
    if (session == null) {
        console.log("session is null")
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }
    const user = await readUser(session.user.email)
    if (user.admin == null && (user.hospitalRole == null || user.hospitalRole.admin != true)) {
        console.log("user admin is null or is not a manager of hospital")
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }
    return {
        props: {
            user: user,
            hospitals: await findAllHospital(),
            error: null
        },
    }
}

function Users(props) {

    let displayAllHospitals = []
    props.hospitals.forEach(hospital => {
        displayAllHospitals.push((
            <div>
                <div>Hospital Name {hospital.name}</div>
                <div>Hospital Id {hospital.id}</div>
            </div>
        ))
    })
    return(
        <div>
            <Navigation />
            <p>Hospital Information</p>
            {displayAllHospitals}
            <h1 className="text-center mt-4 mb-4">Coming soon!</h1>
        </div>
    )

}

export default Users;
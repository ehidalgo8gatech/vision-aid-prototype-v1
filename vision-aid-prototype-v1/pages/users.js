import Navigation from './navigation/Navigation';
import {getSession} from "next-auth/react";
import {readUser} from "@/pages/api/user";
import {findAllHospital} from "@/pages/api/hospital";
import Router from "next/router";

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

    const addUser = async (e) => {
        e.preventDefault()
        const userEmail = document.getElementById('userEmail').value
        const hospitalElement = document.getElementById('hospitalSelect')
        const hosidx = hospitalElement.selectedIndex;
        const hospitalId = parseInt(hospitalElement.options[hosidx].value);
        console.log("hospitalId " + hospitalId)
        const admin = document.getElementById('manager').options[document.getElementById('manager').selectedIndex].value == 'manager'
        console.log("admin " + admin)
        const user = await insertUserIfRequiredByEmail(userEmail)
        console.log(user.id + hospitalId + admin)
        const response = await fetch('/api/hospitalRole', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                userId: user.id,
                hospitalId: hospitalId,
                admin: admin
            })
        })
        if (response.status !== 200) {
            alert("Something went wrong")
            console.log('something went wrong')
        } else {
            console.log('form submitted successfully !!!')
            alert("Form submitted success")
            Router.reload()
        }
    }

    const insertUserIfRequiredByEmail = async (email) => {
        var response = await fetch('/api/user?email=' + email, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        });
        var json = await response.json()
        if (json != null && json.error == null) {
            console.log("User found in db " + JSON.stringify(json))
            return json;
        }
        console.log("User not found adding to db " + email)
        response = await fetch('/api/user', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: email,
            })
        })
        json = await response.json()
        console.log("user " + JSON.stringify(json))
        return json
    }

    let displayAllHospitals = []
    props.hospitals.forEach(hospital => {
        displayAllHospitals.push((
            <div>
                <br/>
                <div>Hospital Name {hospital.name}</div>
                <div>Hospital Id {hospital.id}</div>
                <br/>
            </div>
        ))
    })

    const hospitalOptions = [];
    for (let i = 0; i < props.hospitals.length; i++) {
    const hospital = props.hospitals[i];
    hospitalOptions.push(
        <option key={hospital.name} value={hospital.id}>
        {hospital.name} (ID {hospital.id})
        </option>
    );
    }

    return(
        <div>
            <Navigation />
            <h1 className="text-center mt-4 mb-4">Hospital Information</h1>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <label htmlFor="hospitalSelect" style={{ marginRight: '10px' }}>Select a hospital</label>
                <select id="hospitalSelect"
                style={{
                    border: "1px solid #ccc",
                    borderRadius: "0.25rem",
                    color: "#495057",
                    backgroundColor: "#fff",
                    boxShadow: "inset 0 1px 1px rgba(0, 0, 0, 0.075)",
                    transition: "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out"
                  }}
                  >
                    <option value="">Hospital Name</option>
                    {hospitalOptions}
                </select>
            </div>
            <br/>
            <form action="#" method="POST" onSubmit={(e) => addUser(e)}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <label htmlFor='email' style={{ marginRight: '10px' }}>User Email</label>
                    <input type="text" className="form-control" id="userEmail" style={{ width: '200px' }} />
                </div>
                <br/>
                <br/>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <label htmlFor='manager' style={{ marginRight: '10px' }}>Role Type</label>
                    <select id="manager" name="role">
                        <option value="manager">Manager</option>
                        <option value="tech">Technician</option>
                    </select>
                </div>
                <br/>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )

}

export default Users;
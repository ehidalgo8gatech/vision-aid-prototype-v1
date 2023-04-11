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
        const hospitalName = document.getElementById('hospitalId').value
        const admin = document.getElementById('manager').checked
        const user = await insertUserIfRequiredByEmail(userEmail)
        const hospital = await fetch('/api/hospital?name=' + hospitalName, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        });
        const hospitalJson = await hospital.json()
        if (hospitalJson == null || hospitalJson.error != null) {
            alert("Can't find hospital name in db " + hospitalName)
            return
        }
        console.log(user.id + hospitalJson.id + admin)
        const response = await fetch('/api/hospitalRole', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                userId: user.id,
                hospitalId: hospitalJson.id,
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
    return(
        <div>
            <Navigation />
            <strong>Hospital Information</strong>
            {displayAllHospitals}
            <form action="#" method="POST" onSubmit={(e) => addUser(e)}>
                <div>
                    <label htmlFor='email'>User Email</label>
                    <input type="text" className="form-control" id="userEmail"/>
                </div>
                <div>
                    <label htmlFor='hospitalId'>Hospital Id</label>
                    <input type="text" className="form-control" id="hospitalId"/>
                </div>
                <div>
                    <label htmlFor='manager'>Manager</label>
                    <input type="checkbox" className="form-check-input" id="manager"/>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )

}

export default Users;
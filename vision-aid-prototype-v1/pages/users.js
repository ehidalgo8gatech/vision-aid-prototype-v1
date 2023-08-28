import Navigation from "./navigation/Navigation";
import { getSession } from "next-auth/react";
import { allUsers, readUser } from "@/pages/api/user";
import { findAllHospital } from "@/pages/api/hospital";
import Router from "next/router";
import { Table } from "react-bootstrap";

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  if (session == null) {
    console.log("session is null");
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const user = await readUser(session.user.email);
  if (
    user.admin == null &&
    (user.hospitalRole == null || user.hospitalRole.admin != true)
  ) {
    console.log("user admin is null or is not a manager of hospital");
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: user,
      hospitals: await findAllHospital(),
      users: await allUsers(),
      error: null,
    },
  };
}

function Users(props) {
  const addUser = async (e) => {
    e.preventDefault();
    const userEmail = document.getElementById("userEmail").value;
    const hospitalElement = document.getElementById("hospitalSelect");
    const hosidx = hospitalElement.selectedIndex;
    const hospitalId = parseInt(hospitalElement.options[hosidx].value);
    const [user, existed] = await insertUserIfRequiredByEmail(userEmail);
    let role = document.getElementById("manager").selectedOptions[0].value;
    let roleIsAdmin = role === "admin";
    let roleIsHospAdmin = role === "manager";

    if (hosidx === 0) {
      if (roleIsAdmin) {
        // add admin in admin table
        const response = await fetch("/api/admin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
          }),
        });
        if (response.status !== 200) {
          alert("Something went wrong");
          console.log("something went wrong");

          // remove entry from user table
          if (!existed) {
            console.log("Inside admin delete");
            deleteUser(user.id);
          }
        } else {
          console.log("form submitted successfully !!!");
          alert("Form submitted success");
          Router.reload();
        }
        return;
      } else {
        alert("Please select a hospital");

        // remove entry from user table
        if (!existed) deleteUser(user.id);
      }
    } else {
      console.log("admin " + roleIsHospAdmin);
      console.log(user.id + hospitalId + roleIsHospAdmin);
      if (user.admin != null || roleIsAdmin) {
        alert("An admin can't be attached to a single hospital");
        if (!existed) deleteUser(user.id);
        return;
      }
      const response = await fetch("/api/hospitalRole", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          hospitalId: hospitalId,
          admin: roleIsHospAdmin,
        }),
      });
      if (response.status !== 200) {
        alert("Something went wrong");
        console.log("something went wrong");

        // remove entry from user table
        if (!existed) deleteUser(user.id);
      } else {
        console.log("form submitted successfully !!!");
        alert("Form submitted success");
        Router.reload();
      }
    }
  };

  const insertUserIfRequiredByEmail = async (email) => {
    var response = await fetch("/api/user?email=" + email, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    let existed = false;
    var json = await response.json();
    if (json != null && json.error == null) {
      console.log("User found in db " + JSON.stringify(json));
      existed = true;
      return [json, existed];
    }
    console.log("User not found adding to db " + email);
    response = await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
      }),
    });
    json = await response.json();
    console.log("user " + JSON.stringify(json));
    console.log([json, existed]);
    return [json, existed];
  };

  let displayAllHospitals = [];
  props.hospitals.forEach((hospital) => {
    displayAllHospitals.push(
      <div>
        <br />
        <div>Hospital Name {hospital.name}</div>
        <div>Hospital Id {hospital.id}</div>
        <br />
      </div>
    );
  });

  const hospitalOptions = [];
  for (let i = 0; i < props.hospitals.length; i++) {
    const hospital = props.hospitals[i];
    hospitalOptions.push(
      <option key={hospital.name} value={hospital.id}>
        {hospital.name} (ID {hospital.id})
      </option>
    );
  }

  const roleOptions = [];

  roleOptions.push(<option value="tech">Technician</option>);
  if (props.user.admin !== null) {
    roleOptions.push(<option value="manager">Manager</option>);
    roleOptions.push(<option value="admin">Admin</option>);
  }

  let usersList = [];
  for (let i = 0; i < props.users.length; i++) {
    const data = props.users[i];
    console.log(data);
    var admin;
    var hospital;
    var hospitalId = null;
    var manager = "FALSE";
    if (data.admin != null) {
      admin = "TRUE";
      manager = "TRUE";
      hospital = "ALL";
    } else {
      admin = "FALSE";
      hospital = "NONE";
      if (data.hospitalRole != null) {
        hospitalId = data.hospitalRole.hospitalId;
        if (data.hospitalRole.admin == true) {
          manager = "TRUE";
        }
        props.hospitals.forEach((hospitalLoop) => {
          if (hospitalLoop.id == hospitalId) {
            console.log(hospitalLoop.id + " " + hospitalId);
            hospital = hospitalLoop.name;
          }
        });
      }
    }
    if (
      props.user.hospitalRole != null &&
      props.user.hospitalRole.hospitalId != hospitalId
    ) {
      continue;
    }
    usersList.push(
      <tr>
        <td>{data.id}</td>
        <td>{data.email}</td>
        <td>{admin}</td>
        <td>{manager}</td>
        <td>{hospital}</td>
      </tr>
    );
  }
  return (
    <div>
      <Navigation />
      <h2 className="text-center mt-4 mb-4">
        <strong>List Of Users</strong>
      </h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>
              <i>User Id</i>
            </th>
            <th>
              <i>User Email</i>
            </th>
            <th>
              <i>Admin</i>
            </th>
            <th>
              <i>Manager</i>
            </th>
            <th>
              <i>Hospital</i>
            </th>
          </tr>
        </thead>
        <tbody>{usersList}</tbody>
      </Table>
      <br />
      <h2 className="text-center mt-4 mb-4">
        <strong>Add User To Hospital</strong>
      </h2>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <label htmlFor="hospitalSelect" style={{ marginRight: "10px" }}>
          Select a hospital
        </label>
        <select
          id="hospitalSelect"
          style={{
            border: "1px solid #ccc",
            borderRadius: "0.25rem",
            color: "#495057",
            backgroundColor: "#fff",
            boxShadow: "inset 0 1px 1px rgba(0, 0, 0, 0.075)",
            transition:
              "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
          }}
        >
          <option value="0">ALL</option>
          {hospitalOptions}
        </select>
      </div>
      <br />
      <form action="#" method="POST" onSubmit={(e) => addUser(e)}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <label htmlFor="email" style={{ marginRight: "10px" }}>
            User Email
          </label>
          <input
            type="text"
            className="form-control"
            id="userEmail"
            style={{ width: "200px" }}
          />
        </div>
        <br />
        <br />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <label htmlFor="manager" style={{ marginRight: "10px" }}>
            Role Type
          </label>
          <select
            id="manager"
            name="role"
            style={{
              border: "1px solid #ccc",
              borderRadius: "0.25rem",
              color: "#495057",
              backgroundColor: "#fff",
              boxShadow: "inset 0 1px 1px rgba(0, 0, 0, 0.075)",
              transition:
                "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
            }}
          >
            {roleOptions}
          </select>
        </div>
        <br />
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

async function deleteUser(userId) {
  console.log("delete user " + userId);
  const deleteConfirmation = await fetch("/api/user", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: userId,
    }),
  });
  if (deleteConfirmation.status !== 200) {
    console.log("something went wrong");
  } else {
    console.log("form submitted successfully !!!");
    Router.reload();
  }
}

export default Users;

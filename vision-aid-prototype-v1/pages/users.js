import Navigation from "./navigation/Navigation";
import { getSession } from "next-auth/react";
import { allUsers, readUser } from "@/pages/api/user";
import { findAllHospital } from "@/pages/api/hospital";
import Router from "next/router";
import { Table } from "react-bootstrap";
import { FormControl, Select, MenuItem, Input, FormLabel } from "@mui/material";
import { createMenu } from "@/constants/globalFunctions";
import { useState } from "react";

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
  const [hosp, setHosp] = useState("");
  const [role, setRole] = useState("");

  const addUser = async (e) => {
    e.preventDefault();
    const userEmail = document.getElementById("userEmail").value;
    // const hospitalElement = document.getElementById("hospitalSelect");
    // console.log(hospitalElement);
    // const hosidx = hospitalElement.selectedIndex;
    console.log(hosp);
    let hospitalId;
    if (hosp === "All") {
      hospitalId = 0;
    } else {
      hospitalId = parseInt(
        hosp.substring(hosp.indexOf("("), hosp.indexOf(")")).substring(4)
      );
    }
    console.log(
      hosp.substring(hosp.indexOf("("), hosp.indexOf(")")).substring(4)
    );
    console.log(hospitalId);
    const [user, existed] = await insertUserIfRequiredByEmail(userEmail);
    // let role = document.getElementById("manager").selectedOptions[0].value;
    let roleIsAdmin = role === "Admin";
    let roleIsHospAdmin = role === "Manager";

    if (hospitalId === 0) {
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
    hospitalOptions.push(hospital.name + " (ID " + hospital.id + ")");
  }

  const roleOptions = [];

  roleOptions.push("Technician");
  if (props.user.admin !== null) {
    roleOptions.push("Manager");
    roleOptions.push("Admin");
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
      <Navigation user={props.user} />
      <div className="row">
        <div className="offset-md-1 col-md-4">
          <br />
          <strong>Add User To Hospital</strong>
          <br />
          {/* <br /> */}
          <div className="container m-4">
            <br />
            <br />
            <form action="#" method="POST" onSubmit={(e) => addUser(e)}>
              <table className="row">
                <tr className="row">
                  <td
                    htmlFor="hospitalSelect"
                    className="col-md-5 flex-container-vertical"
                  >
                    Select a hospital
                  </td>
                  <td className="col-md-7">
                    <FormControl fullWidth size="small">
                      <Select
                        value={hosp}
                        onChange={(e) => setHosp(e.target.value)}
                      >
                        <MenuItem key="All" value="All">
                          ALL
                        </MenuItem>
                        {createMenu(hospitalOptions, "hospitals", false)}
                      </Select>
                    </FormControl>
                  </td>
                </tr>
                <br />
                <tr className="row padding">
                  <td htmlFor="email" className="col-md-5 vertical-align">
                    User Email
                  </td>
                  <td className="col-md-7">
                    <FormControl fullWidth>
                      <Input id="userEmail"></Input>
                    </FormControl>
                  </td>
                </tr>
                <br />
                <tr className="row">
                  <td
                    htmlFor="manager"
                    className="col-md-5 flex-container-vertical"
                  >
                    Role Type
                  </td>
                  <td className="col-md-7">
                    <FormControl fullWidth size="small">
                      <Select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                      >
                        {createMenu(roleOptions, "role", false)}
                      </Select>
                    </FormControl>
                  </td>
                </tr>
              </table>
              <br />
              <button
                type="submit"
                className="btn btn-success border-0 btn-block"
              >
                Submit
              </button>
            </form>
            <br />
          </div>
        </div>
        {/* <hr style="width: 1px; height: 20px; display: inline-block;"></hr> */}
        <div className="offset-md-1 col-md-5">
          <br />
          <strong>List Of Users</strong>
          <br />
          <br />
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
        </div>
      </div>
      <br />
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

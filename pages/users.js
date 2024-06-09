import { useEffect, useState } from 'react';
import Navigation from "./navigation/Navigation";
import Layout from './components/layout';
import SidePanel from "./components/SidePanel";
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { findAllHospital } from "@/pages/api/hospital";
import { allUsers, getUserFromSession } from "@/pages/api/user";
import Modal from './components/Modal';
import { Form } from 'react-bootstrap';
import Table from "./components/Table";
import { useRouter } from 'next/router';
import { PencilSquare, Trash3 } from 'react-bootstrap-icons';
import { createMenu } from "@/constants/globalFunctions";
import { FormControl, Select, MenuItem, Input, Typography, Tooltip } from "@mui/material";

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const user = await getUserFromSession(ctx);
    if (user === null) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    if (
      !user.admin &&
      (user.hospitalRole.length == 0 || user.hospitalRole[0].admin != true)
    ) {
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
        // roles: await allHospitalRoles(),
        error: null,
      },
    };
  }
});

function NewUserModal(props) {
  const { user, modalOpen, setModalOpen } = props;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [admin, setAdmin] = useState(false);

  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
  }

  const handleClose = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setAdmin(false);
    setModalOpen(false);
  }

  const handleSubmit = async () => {
    const response = await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        name: name,
        password: password,
        confirmPassword: confirmPassword,
        admin: admin
      }),
    });
    handleClose();

    if (response.status === 200) {
      refreshData();
    }
  }

  return (
    <Modal
      title="Add User"
      closeText="Cancel"
      submitText="Submit"
      open={modalOpen}
      handleOnSubmit={handleSubmit}
      handleOnClose={handleClose}
    >
      <Form>
        <Form.Group controlId="postName">
          <Form.Label className="text-left">Name</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="postEmail">
          <Form.Label className="text-left">Email</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="postPassword">
          <Form.Label className="text-left">Password</Form.Label>
          <Form.Control
            required
            type="password"
            placeholder="Enter temporary password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="postConfirmPassword">
          <Form.Label className="text-left">Confirm Password</Form.Label>
          <Form.Control
            required
            type="password"
            placeholder="Confirm temporary password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="postAdmin">
          <Form.Label className="text-left">Admin</Form.Label>
          <Tooltip title={(user.admin) ? "" : "Not permitted to create admin users"}>
            <span> {/* This span is required as per: https://mui.com/material-ui/react-tooltip/#disabled-elements */}
              <Form.Check
                disabled={!user.admin}
                type="checkbox"
                checked={admin}
                onChange={(e) => setAdmin(e.target.checked)}
              />
            </span>
          </Tooltip>
        </Form.Group>
      </Form>
    </Modal>
  )
}

function EditUserModal(props) {
  const { user, modalOpen, setModalOpen, userToEdit } = props;

  const [id, setId] = useState(userToEdit.id);
  const [hospitalRole, setHospitalRole] = useState(userToEdit.hospitalRole);
  const [name, setName] = useState(userToEdit.name);
  const [email, setEmail] = useState(userToEdit.email);
  const [admin, setAdmin] = useState(userToEdit.admin);

  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
  }

  const handleClose = () => {
    setName("");
    setEmail("");
    setAdmin(false);
    setModalOpen(false);
    setHospitalRole([]);
  }

  useEffect(() => {
    setId(userToEdit.id);
    setName(userToEdit.name);
    setEmail(userToEdit.email);
    setAdmin(userToEdit.admin);
    setHospitalRole(userToEdit.hospitalRole);
  }, [userToEdit])

  const handleSubmit = async () => {
    const response = await fetch(`/api/user?id=${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        admin: admin,
        hospitalRole: hospitalRole
      }),
    });
    handleClose();

    if (response.status === 200) {
      refreshData();
    }
  }

  return (
    <Modal
      title="Update User"
      closeText="Cancel"
      submitText="Update"
      open={modalOpen}
      handleOnSubmit={handleSubmit}
      handleOnClose={handleClose}
    >
      <Form>
        <Form.Group controlId="postName">
          <Form.Label className="text-left">Name</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="postEmail">
          <Form.Label className="text-left">Email</Form.Label>
          <Form.Control
            required
            disabled
            type="text"
            value={email}
          />
        </Form.Group>
        <Form.Group controlId="postAdmin">
          <Form.Label className="text-left">Admin</Form.Label>
          <Tooltip title={(user.admin) ? "" : "Not permitted to edit admin status of users"}>
            <span> {/* This span is required as per: https://mui.com/material-ui/react-tooltip/#disabled-elements */}
              <Form.Check
                disabled={!user.admin}
                type="checkbox"
                checked={admin}
                onChange={(e) => setAdmin(e.target.checked)}
              />
            </span>
          </Tooltip>
        </Form.Group>
      </Form>
    </Modal>
  )
}

export default function Users(props) {
  const { users, hospitals, user } = props;
  const [tab, setTab] = useState("Users");
  const [selectedUser, setSelectedUser] = useState({
    id: "",
    name: "",
    email: "",
    admin: false,
  });
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [hospitalFormData, setHospitalFormData] = useState({
    role: "",
    hosp: [],
    email: ""
  });

  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
  }

  const handleSelect = (choice) => {
    setTab(choice);
  };

  const handleCreateUserClick = () => {
    setCreateModalOpen(true);
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  }

  const handleDeleteClick = (userToDelete) => {
    if (!user.admin) {
      return;
    }

    setSelectedUser(userToDelete);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    const response = await fetch(`/api/user?id=${selectedUser.id}`, {
      method: "DELETE",
    });
    setDeleteModalOpen(false);
    if (response.status === 204) {
      refreshData();
    }
  }

  const handleHospitalRoleFormUpdate = (key, value) => {
    setHospitalFormData({
      ...hospitalFormData,
      [key]: value
    });
  }

  const updateUserHospitalRole = async (e) => {
    e.preventDefault();

    const user = users.find(u => u.email === hospitalFormData.email);
    if (!user) {
      setHospitalFormData({
        role: "",
        hosp: [],
        email: ""
      });
      return;
    }
    const body = {
      name: user.name,
      admin: user.admin,
      hospitalRole: user.hospitalRole
    };

    // Abstract a list of hospitals IDs from form
    const hospitals = []
    if (hospitalFormData.role === "Manager") {
      // Possible more than one hospital role
      hospitalFormData.hosp.forEach(h => {
        const hospitalIdParts = h.split("=");
        const hospitalId = hospitalIdParts[hospitalIdParts.length-1];
        hospitals.push(parseInt(hospitalId));
      });
    } else {
      // Only one hospital was defined
      const hospitalIdParts = hospitalFormData.hosp.split("=");
      const hospitalId = hospitalIdParts[hospitalIdParts.length-1];
      hospitals.push(parseInt(hospitalId));
    }

    hospitals.forEach(h => {
      const indexOfExistingHospital = body.hospitalRole.findIndex(hRole => hRole.hospitalId === h);
      if (indexOfExistingHospital >= 0) {
        body.hospitalRole[indexOfExistingHospital] = { hospitalId: h, admin: hospitalFormData.role === "Manager" }
      }
      else {
        body.hospitalRole.push({ hospitalId: h, admin: hospitalFormData.role === "Manager" });
      }
    });

    await fetch(`/api/user?id=${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setHospitalFormData({
      role: "",
      hosp: [],
      email: ""
    });
  }

  const hospitalMapping = {};
  hospitals.forEach(hospital => {
    hospitalMapping[hospital.id] = hospital;
  });

  const tableRows = users.map((u) => {
    return (
      <tr key={u.email}>
        <td>{u.name}</td>
        <td>{u.email}</td>
        { u.admin // Admin
          ? <td style={{color: "green"}}>&#10004;</td>
          : <td style={{color: "red"}}>&#10008;</td>
        }
        { u.admin || u.hospitalRole.some(h => h.admin) // Manager
          ? <td style={{color: "green"}}>&#10004;</td>
          : <td style={{color: "red"}}>&#10008;</td>
        }
        { u.admin
          ? <td>ALL</td>
          : <td>{ u.hospitalRole.map((hosp) => hospitalMapping[hosp.hospitalId].name).join(', ') }</td>
        }
        { u.lastLogin === null
          ? <td>Never</td>
          : <td>{new Date(u.lastLogin).toLocaleTimeString('en-us', { month: 'long', day: 'numeric', year: 'numeric' })}</td>
        }
        <td>
          <PencilSquare style={{cursor: "pointer"}} onClick={() => handleEditClick(u)} />
          <Tooltip title={(user.admin) ? "" : "Not permitted to delete users"}>
            <Trash3
              color="red"
              style={{marginLeft: "5px", cursor: (user.admin) ? "pointer" : "not-allowed"}}
              onClick={() => handleDeleteClick(u)}
            />
          </Tooltip>
        </td>
      </tr>
    );
  });

  // Define a list of possible roles to be set
  const roleOptions = [];
  roleOptions.push("Professional");
  if (user.admin) {
    roleOptions.push("Manager");
  }

  const hospitalOptions = [];
  if (user.admin) {
    for (let i = 0; i < hospitals.length; i++) {
      const hospital = hospitals[i];
      hospitalOptions.push(hospital.name + " ID=" + hospital.id);
    }
  } else {
    for (let i = 0; i < hospitals.length; i++) {
      const hospital = hospitals[i];
      for (const hRole of hospital.hospitalRole) {
        if (hRole.userId == user.id) {
          hospitalOptions.push(hospital.name + " ID=" + hospital.id);
          break;
        }
      }
    }
  }

  return (
    <Layout>
      <div className="content">
        <Navigation user={props.user} />
        <div className="d-flex flex-row h-100 flex-grow-1">
          <SidePanel options={['Users', 'Hospitals']} defaultOption="Users" handleSelection={handleSelect} />
          <div className="col-md-8">
            <div className="container m-4 p-4">
              { tab === "Users" &&
                <>
                  <h3 className="text-center mt-4 mb-4">
                    <strong>List of Users</strong>
                  </h3>
                  <Table columns={["Name", "Email", "Admin", "Manager", "Hospital", "Last Login", "Actions"]} rows={tableRows} />
                  <div className="row">
                    <div className="col text-end">
                      <button type="button" className="btn btn-success" onClick={handleCreateUserClick}>
                        Create User
                      </button>
                    </div>
                  </div>
                </>
              }
              { tab === "Hospitals" &&
                <>
                  <h3 className="text-center mt-4 mb-4">
                    <strong>Add Users To Hospitals</strong>
                  </h3>
                  <form action="#" method="POST" onSubmit={(e) => updateUserHospitalRole(e)}>
                    <table className="row">
                      <tr className="row">
                        <td
                          htmlFor="manager"
                          className="col-md-5 flex-container-vertical"
                        >
                          Role
                        </td>
                        <td className="col-md-7">
                          <FormControl fullWidth size="small">
                            <Select
                              value={hospitalFormData.role}
                              onChange={(e) => handleHospitalRoleFormUpdate("role", e.target.value)}
                            >
                              {createMenu(roleOptions, false)}
                            </Select>
                          </FormControl>
                        </td>
                      </tr>
                      <br/>
                      <tr className="row">
                        <td
                          htmlFor="hospitalSelect"
                          className="col-md-5 flex-container-vertical"
                        >
                          Select a hospital
                        </td>
                        <td className="col-md-7">
                          <FormControl fullWidth size="small">
                            {hospitalFormData.role === "Professional" ?
                            <Select
                              value={hospitalFormData.hosp}
                              onChange={(e) => handleHospitalRoleFormUpdate("hosp", e.target.value)}
                            >
                              {createMenu(hospitalOptions, false)}
                            </Select>
                            : (hospitalFormData.role === "Manager" ?
                            <Select
                              value={hospitalFormData.hosp}
                              onChange={(e) => handleHospitalRoleFormUpdate("hosp", e.target.value)}
                              multiple
                              renderValue={(selected) => selected.join(", ")}
                            >
                              {createMenu(hospitalOptions, true, hospitalFormData.hosp)}
                            </Select>
                            :
                            <Select
                              value={hospitalFormData.hosp}
                              disabled
                            >
                              <MenuItem key="ALL" value="ALL">
                                <Typography align="left">
                                    ALL
                                </Typography>
                              </MenuItem>
                            </Select>
                            )}
                          </FormControl>
                        </td>
                      </tr>
                      <br />
                      <tr className="row padding">
                        <td htmlFor="email" className="col-md-5 vertical-align">
                          User Email
                        </td>
                        <td className="col-md-7">
                          <FormControl fullWidth size="small">
                            <Input
                              value={hospitalFormData.email}
                              id="userEmail"
                              autoComplete="off"
                              onChange={(e) => handleHospitalRoleFormUpdate("email", e.target.value)}
                            ></Input>
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
                </>
              }
            </div>
          </div>
        </div>
      </div>
      <NewUserModal user={user} modalOpen={createModalOpen} setModalOpen={setCreateModalOpen} />
      <EditUserModal user={user} modalOpen={editModalOpen} setModalOpen={setEditModalOpen} userToEdit={selectedUser} />
      <Modal
        title="Delete User"
        closeText="Cancel"
        submitText="Confirm"
        open={deleteModalOpen}
        handleOnSubmit={handleDelete}
        handleOnClose={() => setDeleteModalOpen(false)}
      >
        Are you sure you want to delete {selectedUser.name}?
      </Modal>
    </Layout>
  );
}

import { useRouter } from 'next/router';
import { Table } from 'react-bootstrap';

function UserList({ users }) {
  const router = useRouter();
  const openUserPage = (mrn = null) => {
    if (mrn) router.push(`/user?mrn=${mrn}`);
    else router.push(`/beneficiaryinformation`);
  };
  return (
    <>
      {users && users.length > 0 && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>MRN</th>
              <th>Name</th>
              <th>Date of Birth</th>
              <th>Gender</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.mrn}>
                <td>{user.mrn}</td>
                <td>{user.beneficiaryName}</td>
                <td>{(new Date(user.dateOfBirth)).toDateString()}</td>
                <td>{user.gender}</td>
                <td>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      openUserPage(user.mrn);
                    }}
                  >
                    View Details
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}
export default UserList;
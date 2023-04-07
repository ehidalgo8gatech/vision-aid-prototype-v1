import { useState } from 'react';
import { Modal } from 'react-bootstrap';

// function UserList({ users }) {
//     const [selectedUser, setSelectedUser] = useState(null);
  
//     const openModal = (user) => {
//       setSelectedUser(user);
//     };
  
//     const closeModal = () => {
//       setSelectedUser(null);
//     };
  
//     return (
//       <>
//         <div className="row">
//           {users.map((user) => (
//             <div
//               key={user.mrn}
//               className="col-md-4 col-sm-6 col-12 mb-4"
//               onClick={() => openModal(user)}
//             >
//               <div className="card">
//                 <div className="card-body">
//                   <h5 className="card-title">{user.beneficiaryName}</h5>
//                   <p className="card-text">{user.hospital.name}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
  
//         {selectedUser && (
//           <Modal show onHide={closeModal}>
//             <Modal.Header closeButton>
//               <Modal.Title>Beneficiary Details</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//                 <p><strong>MRN:</strong> {selectedUser.mrn}</p>
//                 <p><strong>Name:</strong> {selectedUser.beneficiaryName}</p>
//                 <p><strong>Hospital ID:</strong> {selectedUser.hospitalId}</p>
//                 <p><strong>Date of Birth:</strong> {selectedUser.dateOfBirth}</p>
//                 <p><strong>Gender:</strong> {selectedUser.gender}</p>
//                 <p><strong>Phone Number:</strong> {selectedUser.phoneNumber || 'N/A'}</p>
//                 <p><strong>Education:</strong> {selectedUser.education || 'N/A'}</p>
//                 <p><strong>Occupation:</strong> {selectedUser.occupation || 'N/A'}</p>
//                 <p><strong>Districts:</strong> {selectedUser.districts || 'N/A'}</p>
//                 <p><strong>State:</strong> {selectedUser.state || 'N/A'}</p>
//                 <p><strong>Diagnosis:</strong> {selectedUser.diagnosis || 'N/A'}</p>
//                 <p><strong>Vision:</strong> {selectedUser.vision || 'N/A'}</p>
//                 <p><strong>MDVI:</strong> {selectedUser.mDVI || 'N/A'}</p>
//                 <p><strong>Extra Information:</strong> {selectedUser.extraInformation}</p>

//                 {/* Add related model data */}
//                 {/* Example: */}
//                 <p><strong>Computer Training Sessions:</strong> {selectedUser.Computer_Training}</p>
//             </Modal.Body>
//             <Modal.Footer>
//               <button className="btn btn-secondary" onClick={closeModal}>
//                 Close
//               </button>
//             </Modal.Footer>
//           </Modal>
//         )}
//       </>
//     );
//   }

// components/UserList.js
import { useRouter } from 'next/router';

function UserList({ users }) {
    const router = useRouter();
  
    const openUserPage = (mrn) => {
      router.push(`/user?mrn=${mrn}`);
    };
  
    return (
      <div className="row">
        {users.map((user) => (
          <div
            key={user.mrn}
            className="col-md-4 col-sm-6 col-12 mb-4"
            onClick={() => openUserPage(user.mrn)}
          >
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{user.beneficiaryName}</h5>
                <p className="card-text">{user.email}</p>
              </div>
            </div>
          </div>
        ))}
        <div className='col-md-4 col-sm-6 col-12 mb-4'>
            <div className="card" style={{ backgroundColor: '#6c757d' }}>
              <div className="card-body">
                <h5 className="card-title">Create User</h5>
              </div>
            </div>
          </div>
      </div>
    );
  }
  
export default UserList;

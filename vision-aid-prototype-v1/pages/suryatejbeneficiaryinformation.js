// This function gets called at build time

import React from 'react';
import { useState } from 'react';

function SearchBar({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');
  
    const handleChange = (event) => {
      setSearchTerm(event.target.value);
    };
  
    const handleSubmit = (event) => {
      event.preventDefault();
      onSearch(searchTerm);
    };
  
    return (
      <form onSubmit={handleSubmit} className="mb-3">
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          className="form-control"
          placeholder="Search users"
        />
      </form>
    );
  }

  function UserList({ users }) {
    return (
      <div className="row">
        {users.map((user) => (
          <div key={user.mrn} className="col-md-4 col-sm-6 col-12 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{user.beneficiaryName}</h5>
                <p className="card-text">{user.hospital.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }


function HomePage() {
    const [users, setUsers] = useState([]);

const searchUsers = async (searchTerm) => {
  try {
    const beneficiary = await await fetch('/api/beneficiary?beneficiaryName=' + searchTerm, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    })
    const beneficiaryJson = await beneficiary.json()
    setUsers(beneficiaryJson);
  } catch (error) {
    console.error('Error fetching users:', error);
    setUsers([]);
  }
};

return (
    <div className="container">
    <h1 className="text-center mt-4 mb-4">Beneficiary Search</h1>
    <SearchBar onSearch={searchUsers} />
    <UserList users={users} />
    </div>
);
}
  
  export default HomePage;


// This function gets called at build time

import React from 'react';
import { useState } from 'react';
import AddUserForm from './components/AddUserForm';
import SearchBar from './components/SearchBar';
import UserList from './components/UserList';

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


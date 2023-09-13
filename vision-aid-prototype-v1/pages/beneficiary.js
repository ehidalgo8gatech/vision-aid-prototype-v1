// This function gets called at build time

import React from 'react';
import { useState } from 'react';
import AddUserForm from './components/AddUserForm';
import SearchBar from './components/SearchBar';
import UserList from './components/UserList';
import Navigation from './navigation/Navigation';

function HomePage() {
    const [users, setUsers] = useState([]);
    const [searched, setSearched] = useState(false);

const searchUsers = async (searchTerm) => {
  try {
    const beneficiary = await fetch('/api/beneficiary?beneficiaryName=' + searchTerm, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    })
    const beneficiaryJson = await beneficiary.json()
    setUsers(beneficiaryJson);
    setSearched(true);
  } catch (error) {
    console.error('Error fetching users:', error);
    setUsers([]);
  }
};

return (
    <div>
      <Navigation />
      <h1 className="text-center mt-4 mb-4">Beneficiary Search</h1>
      <div className='container'>
        <SearchBar onSearch={searchUsers} />
        {users.length > 0 && <UserList users={users} />}
        {users.length === 0 && searched && <div><br/><br/><p>No beneficiary matches your search term! Please try again.</p></div>}
      </div>
    </div>
    
);
}
  
  export default HomePage;
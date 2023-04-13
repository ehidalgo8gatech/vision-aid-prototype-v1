import Navigation from './navigation/Navigation';
import { useState, useEffect } from 'react';

function Reports() {
  const [totalUsers, setTotalUsers] = useState();

  useEffect(() => {
    async function fetchUsers() {
      try {
        const beneficiary = await fetch('/api/beneficiary', {
          method: 'GET',
          headers: {'Content-Type': 'application/json'},
        });
        const beneficiaryJson = await beneficiary.json();
        setTotalUsers(beneficiaryJson.length);
      } catch (error) {
        console.error('Error fetching users:', error);
        setTotalUsers();
      }
    }
    fetchUsers();
  }, []);

  return (
    <div>
      <Navigation />
      <h1 className="text-center mt-4 mb-4">Basic Information</h1>
      <div className="row">
            <div className="col-md-6">
                <div className="form-group">
                    <p><strong>Total number of beneficiaries: </strong>{totalUsers}</p>
                </div>
            </div>
     </div>
    </div>
  );
}

export default Reports;

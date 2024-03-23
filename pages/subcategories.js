function requiredFields() {
    function search(e) {
      e.preventDefault();
      const nameSearch = document.getElementById('searchName').value;
      fetch(`/api/beneficiary?beneficiaryName=${nameSearch}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          const container = document.getElementById('searchNameDiv');
          container.innerHTML = '';
          data.forEach(b => {
            const tr = document.createElement('tr');
            const tdCheckbox = document.createElement('td');
            const inputCheckbox = document.createElement('input');
            inputCheckbox.type = 'checkbox';
            inputCheckbox.name = 'selectedBeneficiary';
            tdCheckbox.appendChild(inputCheckbox);
            const tdName = document.createElement('td');
            tdName.classList.add('beneficiary-name');
            tdName.innerText = b.beneficiaryName;
            const tdMRN = document.createElement('td');
            tdMRN.innerText = b.mrn;
            const tdDOB = document.createElement('td');
            tdDOB.innerText = b.dateOfBirth;
            const tdHospitalName = document.createElement('td');
            tdHospitalName.innerText = b.hospital.name;
            tr.appendChild(tdCheckbox);
            tr.appendChild(tdName);
            tr.appendChild(tdMRN);
            tr.appendChild(tdDOB);
            tr.appendChild(tdHospitalName);
            container.appendChild(tr);
          });
        })
        .catch(error => {
          console.error('There was a problem with the search request:', error);
          alert(`Can't find beneficiary name in db ${nameSearch}`);
        });
    }
  
    function displaySelectedBeneficiary() {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
        if (checkboxes.length !== 1) {
          alert('Please select one beneficiary to display');
          return;
        }
        const selectedBeneficiary = checkboxes[0].parentNode.parentNode.querySelector('.beneficiary-name').textContent;
        const selectedBeneficiaryElement = document.getElementById('selectedBeneficiary');
        selectedBeneficiaryElement.textContent = `Selected beneficiary: ${selectedBeneficiary}`;
      }

      function displayTrainingOptions() {
        const subcategory = document.getElementById("subcategories").value;
        const trainingOptionsDiv = document.getElementById("trainingOptions");
        if (subcategory === "training") {
          trainingOptionsDiv.innerHTML = `
            <style>
            .custom-checkbox .form-check-input[type="checkbox"] {
                transform: scale(1.5); /* increase or decrease size as desired */
                margin-right: 10px;
            }
            .training-options {
                margin-top: 20px;
                margin-left: 60px;
              }

            .form-control {
                margin-left: 0px;
                margin-right: 0px;
                }
            .form-check-inline .form-check-input {
                margin-right: 0px;
              }
            
            </style>

            <div className="mt-3">
            <p>Select the field you want to add to the beneficiary. Then, enter the description and click on Submit</p>
            <p>Complementary Information:</p>
            <div className="form-check form-check-inline">
                <input className="form-check-input" type="checkbox" id="mobileTraining" name="mobileTraining" value="Mobile Training">
                <label className="form-check-label" for="mobileTraining">Mobile Training</label>
                <input type="text" className="form-control" id="mobileTrainingInput" name="mobileTrainingInput" placeholder="Enter description">
            </div>
            <div className="form-check form-check-inline">
                <input className="form-check-input" type="checkbox" id="computerTraining" name="computerTraining" value="Computer Training">
                <label className="form-check-label" for="computerTraining">Computer Training</label>
                <input type="text" className="form-control" id="computerTrainingInput" name="computerTrainingInput" placeholder="Enter description">
            </div>
            <div className="form-check form-check-inline">
                <input className="form-check-input" type="checkbox" id="orientationMobility" name="orientationMobility" value="Orientation & Mobility">
                <label className="form-check-label" for="orientationMobility">Orientation & Mobility</label>
                <input type="text" className="form-control" id="orientationMobilityInput" name="orientationMobilityInput" placeholder="Enter description">
            </div>
            <button type="submit" className="btn btn-primary mt-3">
              Submit
            </button>
            </div>
          `;
        } else {
          trainingOptionsDiv.innerHTML = "";
        }
      }
      
      return (
        <div>
          <br/>
          <p>Complementary Information for each Beneficiary</p>
          <form action="#" method="POST" onSubmit={search} className="mb-3">
          <br/>
            <div className="input-group">
              <input type="text" id="searchName" className="form-control" placeholder="Enter name" />
              <label className="input-group-text" htmlFor="searchName">
                Name
              </label>
            </div>
            <br/>
            <button type="submit" className="btn btn-primary mt-3">
              Submit
            </button>
          </form>
          <br/>
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>MRN</th>
                <th>Date Of Birth</th>
                <th>Hospital Name</th>
              </tr>
            </thead>
            <tbody id="searchNameDiv"></tbody>
          </table>
          <br/>
          <button type="button" className="btn btn-primary mt-3" onClick={displaySelectedBeneficiary}>
            Continue with selected Beneficiary
          </button>
          <br/>
          <br/>
          <p id="selectedBeneficiary">Selected Beneficiary:</p>
            <div className="mt-3">
            <label htmlFor="subcategories">Subcategories:</label>
            <br/>
            <br/>
            <select id="subcategories" className="form-select" onChange={displayTrainingOptions}>
                <option value="">Select a subcategory</option>
                <option value="assistive-devices">Assistive Devices</option>
                <option value="training">Training</option>
                <option value="counselling-referrals">Counselling & Referrals</option>
            </select>
            </div>
            <div id="trainingOptions" className="mt-3"></div>
        </div>
      );
}      
  
  export default requiredFields;

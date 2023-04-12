import { useState } from 'react';
import { useRouter } from 'next/router';


function SearchBar({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();
  
    const handleChange = (event) => {
      setSearchTerm(event.target.value);
    };
  
    const handleSubmit = (event) => {
      event.preventDefault();
      onSearch(searchTerm);
    };

    const openUserPage = async (mrn = null) => {
      if (mrn)
        router.push(`/user?mrn=${mrn}`);
      else
        router.push(`/beneficiaryinformation`);
    };
  
    return (
      <form onSubmit={handleSubmit} className="mb-3">
        <div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          className="form-control"
          placeholder="Search users"
        />
        <br/>
        <div>
        <button type="submit" className="btn btn-primary">Submit</button>
        <button type="button" onClick={() => openUserPage()} class="btn btn-success border-0 btn-block" style={{ marginLeft: '10px' }}>Register new beneficiary</button>
        </div>
        </div>
      </form>
    );
  }

export default SearchBar;

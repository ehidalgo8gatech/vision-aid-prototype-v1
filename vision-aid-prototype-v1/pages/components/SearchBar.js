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
        <div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          className="form-control"
          placeholder="Search users"
        />
        <br/>
        <button type="submit" className="btn btn-primary">Submit</button>
        </div>
      </form>
    );
  }

export default SearchBar;
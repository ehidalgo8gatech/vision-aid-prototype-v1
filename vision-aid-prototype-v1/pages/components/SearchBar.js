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

export default SearchBar;
import { useState } from "react";

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showOther, setShowOther] = useState(false);

  const handleInput = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(searchTerm, event.target.id, showOther);
  };

  return (
    <form className="mb-3">
      <div>
        {!showOther && (
          <div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleInput}
              className="form-control"
              placeholder="Enter beneficiary name..."
            />
            <br />
          </div>
        )}
        {!showOther && (
          <div>
            <a href="javascript: ;" onClick={() => setShowOther(true)}>
              Filter by all parameters
            </a>
            <br />
          </div>
        )}
        {showOther && (
          <input
            type="text"
            value={searchTerm}
            onChange={handleInput}
            className="form-control"
            placeholder="Enter other parameters..."
          />
        )}
        <br />
        <div>
          <button
            type="submit"
            onClick={(e) => handleSubmit(e)}
            className="btn btn-primary"
            id="search"
          >
            Search
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e)}
            className="btn btn-success border-0 btn-block"
            style={{ marginLeft: "10px" }}
            id="register"
          >
            Register new beneficiary
          </button>
        </div>
      </div>
    </form>
  );
}

export default SearchBar;

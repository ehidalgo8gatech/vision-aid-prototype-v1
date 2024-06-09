import { useState } from 'react';

export default function SidePanel(props) {
  const { options = [], defaultOption = "", handleSelection } = props;

  const [ selected, setSelected ] = useState(defaultOption);

  const handleClick = (e) => {
    const selectedOption = e.target.innerText;
    if (selectedOption === selected) {
      return;
    }

    setSelected(selectedOption);
    handleSelection(selectedOption);
  };

  const activeStyle = "btn btn-success btn-block active-tab";
  const inactiveStyle = "btn btn-light btn-block"

  return (
    <div className="container col-md-2 m-4 p-4">
      { options.map((option, i) => {
        return (
          <div className="p-2" key={i}>
            <button
              className={`w-100 text-align-left ${
                selected === option
                  ? activeStyle
                  : inactiveStyle
              }`}
              onClick={handleClick}
            >
              {option}
            </button>
          </div>
        );
      })}
    </div>
  );
}

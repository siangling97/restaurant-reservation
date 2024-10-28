import React from "react";
import { useHistory } from "react-router-dom";
import { today, previous, next } from "../utils/date-time";

function DateNavButtons({ currentDate }) {
  const history = useHistory();

  // Handlers //
  const handlePrevious = (event) => {
    event.preventDefault();
    history.push(`/dashboard?date=${previous(currentDate)}`);
  };

  const handleToday = (event) => {
    event.preventDefault();
    history.push(`/dashboard?date=${today()}`);
  };

  const handleNext = (event) => {
    event.preventDefault();
    history.push(`/dashboard?date=${next(currentDate)}`);
  };

  return (
    <div className="btn-toolbar justify-content-center my-3" role="toolbar" aria-label="Toolbar with button">
      <div className="btn-group" role="group">
        <button
          type="button"
          className="btn mx-2"
          style={{
            fontSize: "1.2rem",
            padding: "10px 20px",
            backgroundColor: "#ED872D", // Cadmium Orange color
            color: "#fff", // White text
            border: "2px solid #ED872D", // Border matching the button color
          }}
          onClick={handlePrevious}
        >
          Previous
        </button>
        <button
          type="button"
          className="btn mx-2"
          style={{
            fontSize: "1.2rem",
            padding: "10px 20px",
            backgroundColor: "#ED872D", // Cadmium Orange color
            color: "#fff", // White text
            border: "2px solid #ED872D", // Border matching the button color
          }}
          onClick={handleToday}
        >
          Today
        </button>
        <button
          type="button"
          className="btn mx-2"
          style={{
            fontSize: "1.2rem",
            padding: "10px 20px",
            backgroundColor: "#ED872D", // Cadmium Orange color
            color: "#fff", // White text
            border: "2px solid #ED872D", // Border matching the button color
          }}
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default DateNavButtons;
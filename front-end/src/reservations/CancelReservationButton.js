import React from "react";
import { cancelReservation } from "../utils/api";

function CancelReservationButton({ reservation_id, setReservationsError, loadReservationsAndTables }) {
  
  const handleOk = (event) => {
    event.preventDefault();
    const message = "Do you want to cancel this reservation? This cannot be undone.";
    
    if (window.confirm(message)) {
      const abortController = new AbortController();  // Create an AbortController
      
      cancelReservation(reservation_id, abortController.signal)  // Pass the AbortSignal here
        .then(() => loadReservationsAndTables())  // Reload the reservations and tables after canceling
        .catch(setReservationsError);  // Handle any errors

      return () => abortController.abort();  // Clean up to avoid memory leaks
    }
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-danger"
        onClick={handleOk}
        data-reservation-id-cancel={reservation_id}>
          Cancel
      </button>
    </>
  );
}

export default CancelReservationButton;
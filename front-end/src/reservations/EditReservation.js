import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { readReservation, updateReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";
import ErrorAlert from "../layout/ErrorAlert";

function EditReservation() {
  const history = useHistory();
  const { reservation_id } = useParams();  // Destructure to extract reservation_id

  const [error, setError] = useState(null);
  const [reservation, setReservation] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "12:00 PM", // Default value in 12-hour format with AM/PM
    people: 1, // Default value as a number
  });

  // Load reservation by id //
  useEffect(() => {
    const abortController = new AbortController();  // Create AbortController

    async function loadReservation() {
      try {
        const response = await readReservation(Number(reservation_id), abortController.signal);  // Pass the signal
        setReservation({
          ...response,
          reservation_time: formatTime12Hour(response.reservation_time), // Ensure the time is in 12-hour format
        });
      } catch (error) {
        if (error.name !== "AbortError") { // Only set error if not an abort error
          setError(error);
        }
      }
    }

    loadReservation();

    return () => abortController.abort();  // Abort the fetch if the component unmounts
  }, [reservation_id]);

  // Function to ensure the time is formatted as 12-hour time with AM/PM
  function formatTime12Hour(timeString) {
    const [hour, minute] = timeString.split(":");
    const hourNumber = parseInt(hour);
    const ampm = hourNumber >= 12 ? "PM" : "AM";
    const formattedHour = hourNumber % 12 || 12; // Convert to 12-hour format
    return `${formattedHour}:${minute} ${ampm}`;
  }

  // Handlers //
  const handleChange = ({ target }) => {
    setReservation({ 
      ...reservation, 
      [target.name]: target.name === "people" ? Number(target.value) : target.value  // Ensure people is a number
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();  // Create AbortController

    try {
      await updateReservation(Number(reservation_id), reservation, abortController.signal);  // Pass the signal
      history.push(`/dashboard?date=${reservation.reservation_date.slice(0, 10)}`);
    } catch (error) {
      if (error.name !== "AbortError") { // Only set error if not an abort error
        setError(error);
      }
    }

    return () => abortController.abort();  // Ensure the fetch can be aborted if needed
  };

  return (
    <main>
      <div className="d-md-flex mb-3 flex-column">
        <h1>Edit Reservation</h1>
        <ErrorAlert error={error} setError={setError} />
      </div>

      <ReservationForm
        reservation={reservation}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
      />
    </main>
  );
}

export default EditReservation;
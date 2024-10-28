import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { listTables, updateTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import "./Seat.css";

function Seat() {
  const reservation_id = useParams().reservation_id;
  const history = useHistory();

  const [error, setError] = useState(null);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState({
    reservation_id: reservation_id,
  });

  // Load tables //
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    async function loadTables() {
      try {
        const response = await listTables(signal);
        setTables(response);
      } catch (error) {
        if (error.name !== "AbortError") {
          setError(error);
        }
      }
    }
    loadTables();
    return () => abortController.abort();
  }, []);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    const signal = abortController.signal;

    try {
      console.log("Selected Table ID:", selectedTable.table_id); // Debug log
      await updateTable(selectedTable.table_id, reservation_id, signal);
      history.push(`/dashboard`);
    } catch (error) {
      if (error.name !== "AbortError") {
        setError(error);
      }
    }
  };

  return (
    <main>
      <h1>Seat Reservation</h1>
      <ErrorAlert error={error} />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="table_id">Table Number</label>
          <select
            id="table_id"
            name="table_id"
            className="form-control"
            onChange={(e) => setSelectedTable({ ...selectedTable, table_id: e.target.value })}
          >
            <option value="">Select a table</option>
            {tables.map((table) => (
              <option key={table.table_id} value={table.table_id}>
                {table.table_name} - {table.capacity}
              </option>
            ))}
          </select>
        </div>

        <div className="form-buttons">
          <button 
            type="submit"
            className="btn btn-primary btn-lg">
            Submit
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-lg"
            onClick={() => history.go(-1)}>
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}

export default Seat;
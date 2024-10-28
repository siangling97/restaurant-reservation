import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-time"; // Corrected import

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://restaurant-reservation-1-duek.onrender.com";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");
headers.append("Accept", "application/json"); // Added accept header

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * @param url
 *  the url for the request.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range, the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

/**
 * Retrieves all existing reservations.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservations saved in the database.
 */
export async function listReservations(params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

/**
 * Creates a new reservation.
 * @param reservation
 *  the reservation to save.
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<reservation>}
 *  a promise that resolves to the saved reservation.
 */
export async function createReservation(reservation, signal) {
  const url = `${API_BASE_URL}/reservations`;
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data: reservation }),
    signal,
  };
  return await fetchJson(url, options);
}

/**
 * Reads a reservation by ID.
 * @param reservationId
 *  the ID of the reservation to read.
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<reservation>}
 *  a promise that resolves to the reservation.
 */
export async function readReservation(reservationId, signal) {
  const url = `${API_BASE_URL}/reservations/${reservationId}`;
  return await fetchJson(url, { headers, signal }, {});
}

/**
 * Updates an existing reservation.
 * @param reservationId
 *  the ID of the reservation to update.
 * @param reservation
 *  the reservation data to update.
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<reservation>}
 *  a promise that resolves to the updated reservation.
 */
export async function updateReservation(reservationId, reservation, signal) {
  const url = `${API_BASE_URL}/reservations/${reservationId}`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: reservation }),
    signal,
  };
  return await fetchJson(url, options);
}

/**
 * Cancels a reservation.
 * @param reservationId
 *  the ID of the reservation to cancel.
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<void>}
 *  a promise that resolves when the reservation is canceled.
 */
export async function cancelReservation(reservationId, signal) {
  const url = `${API_BASE_URL}/reservations/${reservationId}/status`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: { status: "cancelled" } }),
    signal,
  };
  return await fetchJson(url, options);
}

/**
 * Lists all tables.
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<[table]>}
 *  a promise that resolves to a possibly empty array of tables saved in the database.
 */
export async function listTables(signal) {
  const url = `${API_BASE_URL}/tables`;
  return await fetchJson(url, { headers, signal }, []);
}

/**
 * Creates a new table.
 * @param table
 *  the table to save.
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<table>}
 *  a promise that resolves to the saved table.
 */
export async function createTable(table, signal) {
  const url = `${API_BASE_URL}/tables`;
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data: table }),
    signal,
  };
  return await fetchJson(url, options);
}

/**
 * Updates a table.
 * @param tableId
 *  the ID of the table to update.
 * @param table
 *  the table data to update.
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<table>}
 *  a promise that resolves to the updated table.
 */
export async function updateTable(tableId, reservationId, signal) {
  const url = `${API_BASE_URL}/tables/${tableId}/seat`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: { reservation_id: reservationId } }),
    signal,
  };
  return await fetchJson(url, options);
}

/**
 * Removes a reservation from a table.
 * @param tableId
 *  the ID of the table to remove the reservation from.
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<void>}
 *  a promise that resolves when the reservation is removed.
 */
export async function removeReservation(tableId, signal) {
  const url = `${API_BASE_URL}/tables/${tableId}/seat`;
  const options = {
    method: "DELETE",
    headers,
    signal,
  };
  return await fetchJson(url, options);
} 
export function getCurrentLocalSortableDate () {
  const date = new Date(); // Current date

  // Extract year, month, and day
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero
  const day = String(date.getDate()).padStart(2, '0'); // Add leading zero

  // Format the date as "YYYY-MM-DD"
  return `${year}-${month}-${day}`;
}
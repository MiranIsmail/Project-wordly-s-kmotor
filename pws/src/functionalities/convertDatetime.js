
function getDate(date) {
  // Convert date to a readable format with date and time IN THE FORMAT: DD/MM/YYYY HH:MM
  const dateObj = new Date(date);
  const formattedDate = dateObj.getDate() + "/" + (dateObj.getMonth() + 1) + "/" + dateObj.getFullYear();
  const minutes = dateObj.getMinutes() === 0 ? "00" : dateObj.getMinutes();
  const formattedTime = dateObj.getHours() + ":" + minutes;
  return formattedDate + " " + formattedTime;
}

export { getDate };
export const formatDate = (dateString) => {
  let date = new Date(dateString);
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let year = date.getFullYear();
  // Ensure the month and day are two digits
  month = month < 10 ? "0" + month : month;
  day = day < 10 ? "0" + day : day;

  // Return the formatted date string
  return `${month}/${day}/${year}`;
};

export const isDate = (dateString) => {
  let thedate = ''
  if (dateString.includes('/')) {
    thedate = dateString;

  } else if (dateString.includes('-')) {
    thedate = formatDate(dateString);
  }
  const date = new Date(Date.parse(thedate));
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0)
  return now <=  date; // return true if the date is in the future
};

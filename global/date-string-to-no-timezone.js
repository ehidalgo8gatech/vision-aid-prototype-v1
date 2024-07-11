export const dateStringToNoTimezone = (dateString) => {
  if (!dateString) {
    return '';
  }
  // Extract the date part without timezone information
  const datePartWithoutTimezone = dateString.split('T')[0];

  // Split the date string into components
  const [yearStr, monthStr, dayStr] = datePartWithoutTimezone.split('-');

  const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
  ];

  // Parse components as integers
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1; // Months are zero-based in JavaScript Date objects
  const day = parseInt(dayStr);

  return `${monthNames[month]} ${day} ${year}`;
};
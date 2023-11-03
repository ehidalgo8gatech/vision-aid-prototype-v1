import moment from "moment/moment";

export function formatDate(date) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  // return moment(date).toLocaleDateString(undefined, options);
  console.log("Original date: " + date);
  console.log("ISO Date: " + new Date(date).toISOString())
  console.log("Converted date: " + new Date(date.substring(0, 10)));
//   var currentDate = new Date();
//   var isoDate = currentDate.toISOString();
//   console.log("Check consistency: ");
//   console.log(currentDate, isoDate);
  console.log("Final date: " + new Date(new Date(date).toISOString()).toLocaleDateString(undefined, options));
  return new Date(new Date(date).toISOString()).toLocaleDateString(undefined, options);
}

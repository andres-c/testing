import { chunk } from "lodash";
var getDateArray = function(start, end) {
  var arr = new Array(),
    dt = new Date(start);

  while (dt <= end) {
    arr.push(new Date(dt));
    dt.setDate(dt.getDate() + 1);
  }

  return arr;
};
var all_dates = getDateArray(new Date(2018, 11, 31), new Date(2019, 11, 31));
var all_weeks = chunk(all_dates, 7);

export function getTodaysWeekNumber() {
  // to simulate you can change the date here in the format : yyyy,mm,dd like new Date(2019,10,7);
  // var dt = new Date();

    // this is the simulator
  var simulate_map = [
    "2019-11-04",
    "2019-11-10",
    "2019-11-17",
    "2019-11-24",
    "2019-12-01"
  ];
  let simulate_week_number = localStorage.getItem("week_number")
    ? +localStorage.getItem("week_number")
    : null;
  let simulate_date =
    simulate_week_number != null
      ? new Date(simulate_map[simulate_week_number])
      : null;
  // simulator ends her
  if (simulate_date) {
    var dt = new Date(simulate_date);
  } else {
    var dt = new Date();
  }



  const week_number = all_weeks.findIndex((i, index) => {
    const found_at = i.findIndex(x => x.toDateString() === dt.toDateString());
    if (found_at > -1) {
      return true;
    }
  });

  // console.log("week_number", week_number);
  return week_number;
}

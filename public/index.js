import { Calendar } from "./calendar"
import * as data from "./data"

const PHASES = [[
  "Childhood (Age 0-13)",
  "Adolescence (Age 13-19)",
  "Early Adulthood (Age 20-34)",
  "Middle Adulthood (Age 35-49)",
  "Mature Adulthood (Age 50-79)",
  "Late Adulthood (Age 80+)"],
  ["#aff05b",
  "#52f667", 
  "#1ddfa3", 
  "#23abd8", 
  "#4c6edb", 
  "#6e40aa"]
];  


const weekday = "sunday";
const dji = data.dji;

const myCal = Calendar(dji, {
  x: d => d.Date,
  y: d => d.Volume,
  weekday,
  width: 940
})

document.querySelector("#chart").appendChild(myCal);

// export default function define(runtime, observer) {
//   const main = runtime.module();
//   main.variable(observer("weekday")).define("weekday", "sunday");
//   main.variable(observer("key1")).define("key1",["Swatches", "d3"], _14);
//   main.variable(observer("chart")).define("chart", ["Calendar","dji","weekday","width"], _chart);
//   main.variable(observer("Swatches")).define("Swatches", ["d3","htl"], _Swatches);
//   main.variable(observer("Calendar")).define("Calendar", ["d3"], _Calendar);
//   return main;
// }

  

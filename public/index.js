// Calendar of life where each week is a cell
// Author: Michael Mund
// Date: 2023-02-05

import { PHASES , weekday } from "./attributes";
import { calendarData } from "./data"
import { swatches } from "./swatches";
import { Calendar } from "./calendar";


// Create the calendar
const myCal = Calendar(calendarData, {
  x: d => d.Date,
  y: d => d.Volume,
  weekday,
  width: 940,
  colorlabels: PHASES[0],
  colorvalues: PHASES[1]
})

// Create and render the swatches legend
document.querySelector("#key").appendChild(swatches("white",PHASES[0],PHASES[1]));

// Create and render the calendar
document.querySelector("#chart").appendChild(myCal);


  

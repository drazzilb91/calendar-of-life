// Calendar of life where each week is a cell
// Author: Michael Mund
// Date: 2023-02-05

import { PHASES , weekday } from "./attributes";
import { swatches } from "./swatches";
import { Calendar } from "./calendar";
import { createAllDates } from "./arrayBuilder";
import { dateSettings } from './attributes.js';

const preparedData = createAllDates(dateSettings);

// Create the calendar
const calendar = Calendar(preparedData, {
  x: d => d[0],
  y: d => d[1],
  weekday,
  width: "100%",
  colorlabels: PHASES[0],
  colorvalues: PHASES[1]
})

// Create and render the swatches legend
document.querySelector("#key").appendChild(swatches("white",PHASES[0],PHASES[1]));

// Create and render the calendar
document.querySelector("#chart").appendChild(calendar);


  

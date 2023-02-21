// Calendar of life where each week is a cell
// Author: Michael Mund
// Date: 2023-02-05

import { PHASES , weekday } from "./attributes";
import { swatches } from "./swatches";
import { Calendar } from "./calendar";
import { createAllDates } from "./arrayBuilder";
import { dateSettings } from './attributes.js';

// retrieve all values for the key "Label" and put them in an array
const labels = dateSettings.map(setting => setting.Label);
const labelcolor = dateSettings.map(setting => setting.Color);

const preparedData = createAllDates(dateSettings);

// Create the calendar
const calendar = Calendar(preparedData, {
  date: d => d[0],
  color: d => d[1],
  name: d => d[2],
  weekday,
  width: "100%",
  colorlabels: labels,
  colorvalues: labelcolor,
})

// Create and render the swatches legend
document.querySelector("#key").appendChild(swatches("white",labels,labelcolor));

// Create and render the calendar
document.querySelector("#chart").appendChild(calendar);


  

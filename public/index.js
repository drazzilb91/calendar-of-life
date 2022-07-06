
import define1 from "./color-legend@808.js";



function _weekday(Inputs){return(
Inputs.select(new Map([
  ["Weekdays only", "weekday"],
  ["Sunday-based weeks", "sunday"],
  ["Monday-based weeks", "monday"],
]))
)}
  

function _chart(Calendar,dji,weekday,width){return(
Calendar(dji, {
  x: d => d.Date,
  y: d => d.Volume,
  weekday,
  width
})
)}


function _6(Calendar,dji,weekday,width){return(
Calendar(dji, {
  x: d => d.Date,
  y: d => d.Volume,
  weekday,
  width
})
)}

function _dji(FileAttachment){return(
FileAttachment("^DJI@2.csv").csv({typed: true})
)}

function _14(Swatches, d3) {
  return (
    Swatches(d3.scaleOrdinal(["Childhood (Age 0-13)", "Adolescence (Age 13-19)", "Early Adulthood (Age 20-34)", "Middle Adulthood (Age 35-49)", "Mature Adulthood (Age 50-79)", "Late Adulthood (Age 80+)"],
      ["#aff05b", "#52f667", "#1ddfa3", "#23abd8", "#4c6edb", "#6e40aa"])
    )
  )
}

function _Calendar(d3){return(
function Calendar(data, {
  x = ([x]) => x, // given d in data, returns the (temporal) x-value
  y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
  title, // given d in data, returns the title text
  width = 928, // width of the chart, in pixels
  cellSize = 15, // width and height of an individual day, in pixels
  weekday = "monday", // either: weekday, sunday, or monday
  formatDay = i => "SMTWTFS"[i], // given a day number in [0, 6], the day-of-week label
  formatMonth = "%b", // format specifier string for months (above the chart)
  yFormat, // format specifier string for values (in the title)
  colors = d3.interpolatePiYG
} = {}) {
  // Compute values.
  const X = d3.map(data, x);
  const Y = d3.map(data, y);
  const I = d3.range(X.length);

  const countDay = weekday === "sunday" ? i => i : i => (i + 6) % 7;
  const timeWeek = weekday === "sunday" ? d3.utcSunday : d3.utcMonday;
  const weekDays = weekday === "weekday" ? 5 : 7;
  const height = cellSize //* (weekDays + 2);

  // Compute a color scale. This assumes a diverging color scheme where the pivot
  // is zero, and we want symmetric difference around zero.
  const max = d3.quantile(Y, 0.9975, Math.abs);
  const color = d3.scaleSequential([0, +max], colors).unknown("none");


  // Construct formats.
  formatMonth = d3.utcFormat(formatMonth);

  // Compute titles.
  if (title === undefined) {
    const formatDate = d3.utcFormat("%B %-d, %Y");
    const formatValue = color.tickFormat(100, yFormat);
    title = i => `${formatDate(X[i])}\n${formatValue(Y[i])}`;
  } else if (title !== null) {
    const T = d3.map(data, title);
    title = i => T[i];
  }

  // Group the index by year, in reverse input order. (Assuming that the input is
  // chronological, this will show years in reverse chronological order.)
  // const years = d3.groups(I, i => X[i].getUTCFullYear()).reverse();
  const years = d3.groups(I, i => X[i].getUTCFullYear());

  function pathMonth(t) {
    const d = Math.max(0, Math.min(weekDays, countDay(t.getUTCDay())));
    const w = timeWeek.count(d3.utcYear(t), t);
    return `${d === 0 ? `M${w * cellSize},0`
        : d === weekDays ? `M${(w + 1) * cellSize},0`
        : `M${(w + 1) * cellSize},0V${d * cellSize}H${w * cellSize}`}V${weekDays * cellSize}`;
  }

  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height * years.length)
      .attr("viewBox", [0, 0, width, height * (years.length+10)])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10);

  const year = svg.selectAll("g")
    .data(years)
    .join("g")
      .attr("transform", (d, i) => `translate(40.5,${height * i + cellSize * 1.5})`);

  year.append("text")
      .attr("x", -5)
      .attr("y", 0.75 * cellSize) // Lowered the year label to align with the first day of the week row (as we will be compressing to one row per week)
      .attr("font-weight", "bold")
      .attr("text-anchor", "end")
      .text(([key]) => key)
      .attr("fill","#FFFFFF");

  var myColor = d3.scaleOrdinal(["Childhood (Age 0-13)", "Adolescence (Age 13-19)", "Early Adulthood (Age 20-34)", "Middle Adulthood (Age 35-49)", "Mature Adulthood (Age 50-79)", "Late Adulthood (Age 80+)"],
    ["#aff05b", "#52f667", "#1ddfa3", "#23abd8", "#4c6edb", "#6e40aa"]);
   
  
    
  const cell = year.append("g")
    .selectAll("rect")
    .data(weekday === "weekday"
        ? ([, I]) => I.filter(i => ![0, 6].includes(X[i].getUTCDay()))
        : ([, I]) => I)
    .join("rect")
      .attr("width", cellSize - 1)
      .attr("height", cellSize - 1)
      .attr("x", i => timeWeek.count(d3.utcYear(X[i]), X[i]) * cellSize + 0.5)
      // .attr("y", i => countDay(X[i].getUTCDay()) * cellSize + 0.5)
      .attr("y", 0)

      .attr("fill", function(d){
        if (X[d] < new Date()) {
          return myColor(Y[d])
        }
        else {          
          return "#000000"
        } 

      })

      .attr("stroke", function(d){return myColor(Y[d]) })
      .attr("stroke", function(d){
        if (X[d] < new Date()) {
          return "#000000"
        }
        else {
          return myColor(Y[d])
        } 
      })
      .attr("stroke-width", "0.5");



  if (title) cell.append("title")
      .text(title);

  return Object.assign(svg.node(), {scales: {color}});
}
)}



export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["^DJI@2.csv", {url: new URL("./files/DJI2.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));

  // uncomment these two lines & comment out the 3rd line if you want to enable the dropdown box to select starting day of the week
  // main.variable(observer("viewof weekday")).define("viewof weekday", ["Inputs"], _weekday);
  // main.variable(observer("weekday")).define("weekday", ["Generators", "viewof weekday"], (G, _) => G.input(_));
  main.variable(observer("weekday")).define("weekday", "sunday");


  main.variable(observer("key1")).define("key1",["Swatches", "d3"], _14);

  main.variable(observer("chart")).define("chart", ["Calendar","dji","weekday","width"], _chart);

  //Two chart options. Different colors.
  main.variable(observer("onecolorchart")).define(["Calendar","dji","weekday","width"], _6);

  main.variable(observer("dji")).define("dji", ["FileAttachment"], _dji);

  main.variable(observer("Calendar")).define("Calendar", ["d3"], _Calendar);

  const child1 = runtime.module(define1);
  main.import("Legend", child1);
  
  const child2 = runtime.module(define1);
  main.import("Swatches", child2);

  return main;
}

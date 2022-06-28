// https://observablehq.com/@d3/calendar@806
import define1 from "./color-legend@808.js";
import define2 from "./example-components.js";

function _weekday(Inputs){return(
Inputs.select(new Map([
  ["Weekdays only", "weekday"],
  ["Sunday-based weeks", "sunday"],
  ["Monday-based weeks", "monday"],
]))
)}

// function _key(Legend,chart){return(
// Legend(chart.scales.color, {title: "Daily change", tickFormat: "+%", marginLeft: 40})
// )}

function _key(Legend,chart){return(
  Legend(chart.scales.color, {title: "Daily change", marginLeft: 40})
  )}

  

function _chart(Calendar,dji,weekday,width){return(
Calendar(dji, {
  x: d => d.Date,
  // y: (d, i, data) => i > 0 ? (d.Close - data[i - 1].Close) / data[i - 1].Close : NaN, // relative change
  y: d => d.Volume,
  // yFormat: "+%", // show percent change on hover
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
    Swatches(d3.scaleOrdinal(["strawberries", "oranges", "pears"], d3.schemeCategory10))
  )
}

function _Calendar(d3){return(
function Calendar(data, {
  x = ([x]) => x, // given d in data, returns the (temporal) x-value
  y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
  title, // given d in data, returns the title text
  width = 928, // width of the chart, in pixels
  cellSize = 10, // width and height of an individual day, in pixels
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
  const height = cellSize * (weekDays + 2);

  // Compute a color scale. This assumes a diverging color scheme where the pivot
  // is zero, and we want symmetric difference around zero.
  const max = d3.quantile(Y, 0.9975, Math.abs);
  // const color = d3.scaleSequential([-max, +max], colors).unknown("none");
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
      .attr("viewBox", [0, 0, width, height * years.length])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10);

  const year = svg.selectAll("g")
    .data(years)
    .join("g")
      .attr("transform", (d, i) => `translate(40.5,${height * i + cellSize * 1.5})`);

  year.append("text")
      .attr("x", -5)
      .attr("y", -5)
      .attr("font-weight", "bold")
      .attr("text-anchor", "end")
      .text(([key]) => key);

  year.append("g")
      .attr("text-anchor", "end")
    .selectAll("text")
    .data(weekday === "weekday" ? d3.range(1, 6) : d3.range(7))
    .join("text")
      .attr("x", -5)
      .attr("y", i => (countDay(i) + 0.5) * cellSize)
      .attr("dy", "0.31em")
      .text(formatDay);

    // Color ranges for the phases of life
  var myColor = d3.scaleOrdinal().domain(data)
    .range(["#f8d4a3", "#e4c0bf", "#cf8ab2", "#fc8cd7", "#7ad2ec", "#9aeea1"]);  

  const cell = year.append("g")
    .selectAll("rect")
    .data(weekday === "weekday"
        ? ([, I]) => I.filter(i => ![0, 6].includes(X[i].getUTCDay()))
        : ([, I]) => I)
    .join("rect")
      .attr("width", cellSize - 1)
      .attr("height", cellSize - 1)
      .attr("x", i => timeWeek.count(d3.utcYear(X[i]), X[i]) * cellSize + 0.5)
      .attr("y", i => countDay(X[i].getUTCDay()) * cellSize + 0.5)
      
      // Note to self: these fill lines can be used to colorize the interior of the cell for the "filled-in" style.
      // First line will make solid white fill, second line fills based on data y-axis value, third line fills based on the array of colors I defined earlier. 
      // .attr("fill", "#FFFFFF")
      // .attr("fill", i => color(Y[i]))
      .attr("fill", function(d){
        if (X[d] < new Date()) {
          return myColor(Y[d])
        }
        else {
          // console.log('Colored date is ',X[d])
          // console.log('Today is ',new Date())
          
          return "#FFFFFF"
        } 
        //console.log('value is %d',d)
        //return myColor(d) 
      })


      
      // Note to self: the second fill line can be used to colorize the border of the cell.
      // First line fills based on data y-axis value, third line fills based on the array of colors I defined earlier. 
      // .attr("stroke", i => color(Y[i]))
      .attr("stroke", function(d){return myColor(Y[d]) })

      .attr("stroke-width", "0.5");



  if (title) cell.append("title")
      .text(title);

  const month = year.append("g")
    .selectAll("g")
    .data(([, I]) => d3.utcMonths(d3.utcMonth(X[I[0]]), X[I[I.length - 1]]))
    .join("g");

  month.filter((d, i) => i).append("path")
      .attr("fill", "none")
      .attr("stroke", "#fff")
      .attr("stroke-width", 0)
      .attr("d", pathMonth);

  month.append("text")
      .attr("x", d => timeWeek.count(d3.utcYear(d), timeWeek.ceil(d)) * cellSize + 2)
      .attr("y", -5)
      .text(formatMonth);

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

  main.variable(observer("key")).define("key", ["Legend","chart"], _key);

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



const PHASES = [[
  "Childhood (Age 0-13)",
  "Adolescence (Age 13-19)",
  "Early Adulthood (Age 20-34)",
  "Refereeing",
  "Middle Adulthood (Age 35-49)",
  "Mature Adulthood (Age 50-79)",
  "Late Adulthood (Age 80+)"],
  ["#aff05b",
  "#52f667", 
  "#1ddfa3", 
  "#FF0000",
  "#23abd8", 
  "#4c6edb", 
  "#6e40aa"]
];  

function _Swatches(d3,htl){return(
  function Swatches(color, {
    columns = null,
    format,
    unknown: formatUnknown,
    swatchSize = 15,
    swatchWidth = swatchSize,
    swatchHeight = swatchSize,
    marginLeft = 0
  } = {}) {
    const id = `-swatches-${Math.random().toString(16).slice(2)}`;
    const unknown = formatUnknown == null ? undefined : color.unknown();
    const unknowns = unknown == null || unknown === d3.scaleImplicit ? [] : [unknown];
    const domain = color.domain().concat(unknowns);
    if (format === undefined) format = x => x === unknown ? formatUnknown : x;
  
    function entity(character) {
      return `&#${character.charCodeAt(0).toString()};`;
    }
  
    if (columns !== null) return htl.html`<div style="display: flex; align-items: center; margin-left: ${+marginLeft}px; min-height: 33px; font: 10px sans-serif;">
    <style>
  
  .${id}-item {
    break-inside: avoid;
    display: flex;
    align-items: center;
    padding-bottom: 1px;
  }
  
  .${id}-label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: calc(100% - ${+swatchWidth}px - 0.5em);
  }
  
  .${id}-swatch {
    width: ${+swatchWidth}px;
    height: ${+swatchHeight}px;
    margin: 0 0.5em 0 0;
  }
  
    </style>
    <div style=${{width: "100%", columns}}>${domain.map(value => {
      const label = `${format(value)}`;
      return htl.html`<div class=${id}-item>
        <div class=${id}-swatch style=${{background: color(value)}}></div>
        <div class=${id}-label title=${label}>${label}</div>
      </div>`;
    })}
    </div>
  </div>`;
  
    return htl.html`<div style="display: flex; align-items: center; min-height: 33px; margin-left: ${+marginLeft}px; font: 10px sans-serif;">
    <style>
  
  .${id} {
    display: inline-flex;
    align-items: center;
    margin-right: 1em;
  }
  
  .${id}::before {
    content: "";
    width: ${+swatchWidth}px;
    height: ${+swatchHeight}px;
    margin-right: 0.5em;
    background: var(--color);
  }
    // Need to update this. Not good practice to edit the imported library script. Need something inside the css or index.js
    </style>
    <div>${domain.map(value => htl.html`<span class="${id}" style="--color: ${color(value)};color:white;">${format(value)}</span>`)}</div>`;
  }
  )}

function _chart(Calendar,dji,weekday,width){return(
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
    Swatches(d3.scaleOrdinal(PHASES[0],PHASES[1])
    )
  )
}

function _Calendar(d3){return(
function Calendar(data, {
  x = ([x]) => x, // given d in data, returns the (temporal) x-value
  y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
  title, // given d in data, returns the title text
  width = 412, // width of the chart, in pixels
  cellSize = 15, // width and height of an individual day, in pixels
  weekday = "weekday", // either: weekday, sunday, or monday
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
  const height = cellSize;

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

  // Group the index by year.
  const years = d3.groups(I, i => X[i].getUTCFullYear());


  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height * years.length)
      .attr("viewBox", [0, 0, width, height * (years.length+10)])
      .attr("style", "max-width: 100%; width: auto; height: intrinsic;")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10);

  const year = svg.selectAll("g")
    .data(years)
    .join("g")
      .attr("transform", (d, i) => `translate(8,${height * i + cellSize * 1.5})`);

  year.append("text")
      .attr("x", -5)
      .attr("y", 0.75 * cellSize) // Lowered the year label to align with the first day of the week row (as we will be compressing to one row per week)
      .attr("font-weight", "bold")
      .attr("text-anchor", "end")
      .text(([key]) => key)
      .attr("fill","#FFFFFF");

  // const myColor = d3.scaleOrdinal(["Childhood (Age 0-13)", "Adolescence (Age 13-19)", "Early Adulthood (Age 20-34)", "Middle Adulthood (Age 35-49)", "Mature Adulthood (Age 50-79)", "Late Adulthood (Age 80+)"],
  //   ["#aff05b", "#52f667", "#1ddfa3", "#23abd8", "#4c6edb", "#6e40aa"]);  
  
  const myColor = d3.scaleOrdinal(PHASES[0], PHASES[1]);  
    
    
  const cell = year.append("g")
    .selectAll("rect")
    .data(([, I]) => I.filter(i => ![0,1,2,3,4, 6].includes(X[i].getUTCDay())))
    .join("rect")
      .attr("width", cellSize - 1)
      .attr("height", cellSize - 1)
      .attr("x", i => timeWeek.count(d3.utcYear(X[i]), X[i]) * cellSize + 0.5)
      .attr("fill", function(d){
        if (X[d] <= new Date()) {
          return myColor(Y[d])
        } else if (timeWeek.count(d3.utcYear(X[d]), X[d]) === timeWeek.count(d3.utcYear(new Date()), new Date()) && X[d].getUTCFullYear() === new Date().getUTCFullYear()) {
          return myColor(Y[d])
        }
        else {          
          return "#000000"
        } 

      })    
      .attr("stroke", function(d){
        if (X[d] < new Date()) {
          return "#000000"
        } else if (timeWeek.count(d3.utcYear(X[d]), X[d]) === timeWeek.count(d3.utcYear(new Date()), new Date()) && X[d].getUTCFullYear() === new Date().getUTCFullYear()) {
          return "#000000"
        }
        else {
          return myColor(Y[d])
        } 
      })
      .attr("stroke-width", "0.5")

      .attr("class", function(d){
        if (timeWeek.count(d3.utcYear(X[d]), X[d]) === timeWeek.count(d3.utcYear(new Date()), new Date()) && X[d].getUTCFullYear() === new Date().getUTCFullYear()) {
          return "cursor"
        }
      })
  return Object.assign(svg.node(), {scales: {color}});
}
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["^DJI@2.csv", {url: new URL("./files/DJI2.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer("weekday")).define("weekday", "sunday");
  main.variable(observer("key1")).define("key1",["Swatches", "d3"], _14);
  main.variable(observer("chart")).define("chart", ["Calendar","dji","weekday","width"], _chart);
  main.variable(observer("dji")).define("dji", ["FileAttachment"], _dji);
  main.variable(observer("Swatches")).define("Swatches", ["d3","htl"], _Swatches);
  main.variable(observer("Calendar")).define("Calendar", ["d3"], _Calendar);
  return main;
}

  

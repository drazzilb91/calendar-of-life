// Author: Michael Mund
// Date: 2023-02-05
// Calendar view representing weeks in a year. Based on original code from ObservableHQ with significant modifications.

// Original copyright notice:
    // Copyright 2021 Observable, Inc.
    // Released under the ISC license.
    // https://observablehq.com/@d3/calendar-view

import { scaleOrdinal , map , range , utcSunday , utcMonday , utcFormat , groups , create , utcYear } from "d3";

export function Calendar(data, {
    x = ([x]) => x, // given d in data, returns the (temporal) x-value
    y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
    title, // given d in data, returns the title text
    width = 826, // width of the chart, in pixels
    maxWidth = 826,
    cellSize = 15, // width and height of an individual day, in pixels
    weekday = "weekday", // either: weekday, sunday, or monday
    formatDay = i => "SMTWTFS"[i], // given a day number in [0, 6], the day-of-week label
    formatMonth = "%b", // format specifier string for months (above the chart)
    yFormat, // format specifier string for values (in the title)
    colorlabels = PHASES[0],
    colorvalues = PHASES[1]
} = {}) {
    // Compute values.
    const X = map(data, x);
    const Y = map(data, y);
    const I = range(X.length);

    const countDay = weekday === "sunday" ? i => i : i => (i + 6) % 7;
    const timeWeek = weekday === "sunday" ? utcSunday : utcMonday;
    const weekDays = weekday === "weekday" ? 5 : 7;
    const cellheight = cellSize;

    // Compute the color scale.
    const myColor = scaleOrdinal(colorlabels,colorvalues);


    // Construct formats.
    formatMonth = utcFormat(formatMonth);

    // Compute titles.
    if (title === undefined) {
        const formatDate = utcFormat("%B %-d, %Y");
        // const formatValue = color.tickFormat(100, yFormat);
        title = i => `${formatDate(X[i])}\n${formatValue(Y[i])}`;
    } else if (title !== null) {
        const T = map(data, title);
        title = i => T[i];
    }

    // Group the index by year.
    const years = groups(I, i => (new Date(X[i])).getUTCFullYear());

    const svgheight = cellSize * ( years.length + 10);

    const svg = create("svg")
        .attr("width", width)
        .attr("viewBox", [0, 0, maxWidth, svgheight])
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("style", `max-width:${maxWidth}px;`);

    const year = svg.selectAll("g")
        .data(years)
        .join("g")
        .attr("transform", (d, i) => `translate(0,${cellheight * i + cellSize * 1.5})`);

    year.append("text")
        .attr("x", 0)
        .attr("y", 0.75 * cellSize) // Lowered the year label to align with the first day of the week row (as we will be compressing to one row per week)
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .text(([key]) => key)
        .attr("fill","#FFFFFF");
    

    
    const cell = year.append("g")
    .selectAll("rect")
    .data(([, I]) => I.filter(i => ![0,1,2,3,4, 6].includes((new Date(X[i])).getUTCDay())))
    .join("rect")
        .attr("width", cellSize - 1)
        .attr("height", cellSize - 1)
        .attr("x", i => 30 + timeWeek.count(utcYear(new Date(X[i])), new Date(X[i])) * cellSize + 0.5)
        .attr("fill", function(d){
            if ((new Date(X[d])) <= (new Date())) {
                return myColor(Y[d])
            } else if (timeWeek.count(utcYear((new Date(X[d]))), (new Date(X[d]))) === timeWeek.count(utcYear(new Date()), new Date()) && (new Date(X[d])).getUTCFullYear() === (new Date()).getUTCFullYear()) {
                return myColor(Y[d])
            }
            else {          
                return "#000000"
            } 
        })    
        .attr("stroke", function(d){
            if ((new Date(X[d])) < (new Date())) {
                return "#000000"
            } else if (timeWeek.count(utcYear(X[d]), X[d]) === timeWeek.count(utcYear(new Date()), new Date()) && X[d].getUTCFullYear() === new Date().getUTCFullYear()) {
                return "#000000"
            }
            else {
                return myColor(Y[d])
            } 
        })
        .attr("stroke-width", "0.5")

        .attr("class", function(d){
            if (timeWeek.count(utcYear((new Date(X[d]))), (new Date(X[d]))) === timeWeek.count(utcYear(new Date()), new Date()) && (new Date(X[d])).getUTCFullYear() === (new Date()).getUTCFullYear()) {
                return "cursor"
            }
        })
    return Object.assign(svg.node());
}
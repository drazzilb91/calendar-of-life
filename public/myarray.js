// Converts an array of phases to an object of dates and colors
import { dateSettings } from './attributes.js';
  



function createDates(periodData={
    "id": 2,
    "Start": "2010-01-01",
    "End": "2010-01-02",
    "Name": "Default",
    "Label": "Default Info",
    "Color": "#FFFFFF" 
}){
    const currentLabel = periodData.Label;
    const currentName = periodData.Name;
    const currentColor = periodData.Color;
    const currentStart = new Date(periodData.Start);
    const currentEnd = new Date (periodData.End);
    
    // determine number of days to create in array
    const numDays = Math.abs(( currentEnd - currentStart ) / 3600 / 24 / 1000) + 1;
    // TODO: Check that the +1 is having the desired behavior
    // console.log(numDays);
    // console.log('The labels are: ${periodData.Label}');

    // create array of dates and colors for each day in the phase and push to array

    let arrayOfDates = [];
    for (let i = 0; i < numDays; i++){
        let currentDate = new Date(currentStart);
        
        currentDate.setDate(currentDate.getDate() + i);
        const strDate = currentDate.toISOString().slice(0,10); 
        arrayOfDates.push([strDate, currentColor]);
    }
    return arrayOfDates;
}



const preparedData = [];
for (let i = 0; i < dateSettings.length; i++){
    preparedData.push(createDates(dateSettings[i]));
}

console.log(preparedData);
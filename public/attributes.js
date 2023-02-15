// Author: Michael Mund
// Date: 2023-02-05
// Customizable attributes for the calendar
export const weekday = "sunday";
export const PHASES = [[
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


export const dateSettings = [
  {
    "id": 0,
    "Start": "1991-05-01",
    "End": "2005-04-30",
    "Name": "Childhood",
    "Label": "Childhood (Age 0-13)",
    "Color": "#aff05b"
  },
  {
    "id": 1,
    "Start": "2005-05-01",
    "End": "2011-04-30",
    "Name": "Adolescence",
    "Label": "Adolescence (Age 14-19)",
    "Color": "#52f667"
  },
  {
    "id": 2,
    "Start": "2011-05-01",
    "End": "2026-04-30",
    "Name": "Adolescence",
    "Label": "Adolescence (Age 20-34)",
    "Color": "#1ddfa3"
  },
  {
    "id": 3,
    "Start": "2026-05-01",
    "End": "2040-04-30",
    "Name": "Middle Adulthood",
    "Label": "Middle Adulthood (Age 35-49)",
    "Color": "#23abd8"
  },
  {
    "id": 4,
    "Start": "2040-05-01",
    "End": "2069-04-30",
    "Name": "Mature Adulthood",
    "Label": "Mature Adulthood (Age 50-79)",
    "Color": "#4c6edb"
  },
  {
    "id": 5,
    "Start": "2069-05-01",
    "End": "2075-04-30",
    "Name": "Late Adulthood",
    "Label": "Late Adulthood (Age 80+)",
    "Color": "#6e40aa"
  },
];

// ? How to ensure dates line up between phases?
// TODO: Implement a checker function that validates the input when received from the user.
// Given small number of anticipated phases, it's alright to keep it this way. I.e., don't need to have objects with different information (e.g., start date only on all items except for final object). This also leaves us open in the future if there becomes a useful reason for having different states between phases.

//   Thinking space
/*
Age? Years ? What about phases like Refereeing? Need to be able to give exact date. --> The end array should have the actual dates. The collector can process things like years and do the math to generate this array in those other cases.

Start date 1991-07-09 , End date 2010-02-01 , Phase name: Childhood , Phase legend label: Childhood (Age 0-13) , Phase fill color 

Planning ahead... may want to store usersettings that holds this info. E.g. firebase. 

For firbase, could have UID with a child (type object) that would be these settings.
*/
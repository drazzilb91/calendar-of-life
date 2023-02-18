# Dev Notes

## Misc.

- How to ensure dates line up between phases?
- TODO: Implement a checker function that validates the input when received from the user.
- Given small number of anticipated phases, it's alright to keep it this way. I.e., don't need to have objects with different information (e.g., start date only on all items except for final object). This also leaves us open in the future if there becomes a useful reason for having different states between phases.

## Thinking space

Age? Years ? What about phases like Refereeing? Need to be able to give exact date. --> The end array should have the actual dates. The collector can process things like years and do the math to generate this array in those other cases.

Start date 1991-07-09 , End date 2010-02-01 , Phase name: Childhood , Phase legend label: Childhood (Age 0-13) , Phase fill color 

Planning ahead... may want to store usersettings that holds this info. E.g. firebase. 

For firbase, could have UID with a child (type object) that would be these settings.

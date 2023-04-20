// This is a function that returns the week number of a date.

Date.prototype.getWeek = function () {
    var target  = new Date(this.valueOf());
    var dayNr   = (this.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    var firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() != 4) {
        target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - target) / 604800000);
}

/**
 * Returns the weeknumber that the provided date falls in.
 *
 * @export
 * @param {Date} dateToCheck
 * @return {number} weeknumber of the provided date Number
 */
export function getWeekNum(dateToCheck){
    const d = new Date(dateToCheck);
    const weekNum = d.getWeek();
    return weekNum;
}

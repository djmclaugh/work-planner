import moment = require('moment');

export function timestampToString(timestamp: number): string {
  if (timestamp === 0) {
    return "--";
  }
  const date = new Date(timestamp);
  return date.toLocaleString();
}

export function timestampToDate(timestamp: number): string {
  if (timestamp === 0) {
    return "--";
  }
  const date = new Date(timestamp);
  return date.toLocaleDateString();
}

export function toRelativeDate(date: Date): string {
  if (!date) {
    return "--";
  };
  const dateMoment = moment(date);
  const nowMoment = moment(new Date());
  if (dateMoment.isSame(nowMoment, 'day')) {
    return "Today";
  }
  if (dateMoment.isSame(nowMoment.clone().add(-1, 'day'), 'day')) {
    return "Yesterday";
  }
  if (dateMoment.isSame(nowMoment.clone().add(1, 'day'), 'day')) {
    return "Tomorrow";
  }
  if (dateMoment.isSame(nowMoment, 'week')) {
    if (dateMoment.isBefore(nowMoment)) {
      return "This past " + dayToString(dateMoment.day());
    } else {
      return "This coming " + dayToString(dateMoment.day());
    }
  }
  if (dateMoment.isSame(nowMoment.clone().add(-1, 'week'), 'week')) {
    return "Last " + dayToString(dateMoment.day());
  }
  if (dateMoment.isSame(nowMoment.clone().add(1, 'week'), 'week')) {
    return "Next " + dayToString(dateMoment.day());
  }
  return date.toLocaleDateString();
}

export function toRelativeWeek(date: Date): string {
  if (!date) {
    return "--";
  };
  const dateMoment = moment(date);
  const nowMoment = moment(new Date());
  if (dateMoment.isSame(nowMoment, 'week')) {
    return "This week";
  }
  if (dateMoment.isSame(nowMoment.add(-1, 'week'), 'week')) {
    return "Last week";
  }
  if (dateMoment.isSame(nowMoment.add(1, 'week'), 'week')) {
    return "Next week";
  }
  return "Week of " + date.toLocaleDateString();
}

function dayToString(day: number): string {
  switch (day) {
    case 0:
      return "Sunday";
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
  }
  throw new Error("Expected a number between 0 and 6 inclusivly");
}

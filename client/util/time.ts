// TODO(djmclaugh): Move away from moment since it is deprecated.
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

export function isPastDate(date: Date): boolean {
  const now = new Date();
  if (date.getFullYear() == now.getFullYear()) {
    if (date.getMonth() == now.getMonth()) {
      return date.getDate() < now.getDate();
    }
    return date.getMonth() < now.getMonth();
  }
  return date.getFullYear() < now.getFullYear();
}

export function numberOfDays(a: Date, b: Date): number {
  if (a.getTime() > b.getTime()) {
    return -numberOfDays(b, a);
  }
  let difference = 0;
  let year = b.getFullYear();
  let month = b.getMonth();
  let date = b.getDate();
  while (year > a.getFullYear() || month > a.getMonth()) {
    difference += date;
    date = (new Date(year, month, 0)).getDate();
    month -= 1;
    if (month < 0) {
      month = 11;
      year -= 1;
    }
  }
  difference += date - a.getDate();
  return difference;
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
  if (dateMoment.isSame(nowMoment.clone().add(-1, 'week'), 'week')) {
    return "Last week";
  }
  if (dateMoment.isSame(nowMoment.clone().add(1, 'week'), 'week')) {
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

// export interface PsuedoTime {
//   hour: number; // [0,23]
//   minute: number; // [0, 60]
// }
export type PsuedoTime = number; // mins since midnight
export type PsuedoTimeDelta = PsuedoTime;

export function timeOf(hour: number, minute?: number): PsuedoTime {
  return Math.round(hour * 60) + (minute ?? 0);
}

export const intervalOf = (hour: number, minute?: number): PsuedoTimeDelta =>
  timeOf(hour, minute);

export const timeToString = (t: PsuedoTime): string => {
  const { hour, minute } = toParts(t);
  return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
};

export const stringToTime = (s: string) => {
  // FIXME more robust
  const [h, m] = s.split(":");
  return timeOf(parseInt(h), parseInt(m));
};

export const humanTime = (t: PsuedoTime) => {
  const { hour, minute } = toParts(t);
  const smin = minute.toString().padStart(2, "0");
  if (hour == 0) {
    return `12:${smin} am`;
  } else if (hour <= 11) {
    return `${hour}:${smin} am`;
  } else if (hour == 12) {
    return `12:${smin} pm`;
  } else {
    return `${hour - 12}:${smin} pm`;
  }
};
export const humanInterval = (t: PsuedoTimeDelta) => {
  const { hour, minute } = toParts(t);
  return `${hour}h${minute}m`;
};

export function toParts(n: number): { hour: number; minute: number } {
  const hour = Math.floor(n / 60);
  const minute = n % 60;
  return { hour, minute };
}

export function subtract(a: PsuedoTime, b: PsuedoTime): PsuedoTimeDelta {
  return a - b;
}

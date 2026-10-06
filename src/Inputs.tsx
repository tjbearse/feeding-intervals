import type { Dispatch } from "react";
import {
  type PsuedoTime,
  timeToString,
  stringToTime,
  type PsuedoTimeDelta,
} from "./PsuedoTime";

export const Number = (props: {
  value: number;
  onChange?: Dispatch<number>;
}) => {
  return (
    <input
      type="number"
      value={props.value}
      onChange={(e) => props?.onChange?.(parseInt(e.target.value))}
    />
  );
};
export const Time = (props: {
  time: PsuedoTime;
  onChange: Dispatch<PsuedoTime>;
}) => {
  return (
    <input
      type="time"
      value={timeToString(props.time)}
      min="00:00"
      max="24:00"
      step={60}
      onChange={(e) => {
        console.log(e.target.value);
        props.onChange(stringToTime(e.target.value));
      }}
    />
  );
};
export const Interval = (props: {
  value: PsuedoTimeDelta;
  onChange: Dispatch<PsuedoTimeDelta>;
}) => {
  return (
    <div>
      <Number value={props.value.hour} />h :{" "}
      <Number value={props.value.minute} />m
    </div>
  );
};

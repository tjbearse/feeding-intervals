import type { ComponentProps, Dispatch } from "react";
import {
  type PsuedoTime,
  timeToString,
  stringToTime,
  type PsuedoTimeDelta,
  toParts,
  timeOf,
} from "./PsuedoTime";
import styled from "styled-components";

const NumberInput = styled.input`
  text-align: right;
  margin-left: 4px;
`;
export const Number = (
  props: {
    value: number;
    onChange?: Dispatch<number>;
  } & Omit<ComponentProps<typeof NumberInput>, "onChange" | "value">,
) => {
  return (
    <NumberInput
      type="number"
      {...props}
      value={props.value}
      onChange={(e) => props?.onChange?.(parseInt(e.target.value) || 0)}
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
        props.onChange(stringToTime(e.target.value));
      }}
      style={{ marginLeft: 4 }}
    />
  );
};
export const Interval = (props: {
  value: PsuedoTimeDelta;
  onChange: Dispatch<PsuedoTimeDelta>;
}) => {
  const { hour, minute } = toParts(props.value);
  const onHourChange = (hourPrime: number) => {
    props.onChange?.(timeOf(hourPrime ?? 0, minute));
  };
  const onMinuteChange = (minutePrime: number) => {
    props.onChange?.(timeOf(hour, minutePrime ?? 0));
  };
  return (
    <div>
      <Number value={hour} size={2} onChange={onHourChange} />h :{" "}
      <Number value={minute} size={2} onChange={onMinuteChange} />m
    </div>
  );
};

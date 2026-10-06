import styled from "styled-components";
import { humanTime, timeOf, timeToString } from "./PsuedoTime";

const TimeGridContainer = styled.div`
  display: grid;
`;
const Hour = styled.div`
  height: 40px;
  border-top: 1px solid black;
`;

export const TimeGrid = () => {
  const hours = Array.from({ length: 24 }).map((_, i) => timeOf(i));
  return (
    <TimeGridContainer>
      {hours.map((h) => (
        <Hour key={timeToString(h)}>{humanTime(h)}</Hour>
      ))}
    </TimeGridContainer>
  );
};

export const Timeline = () => {
  return <TimeGrid></TimeGrid>;
};

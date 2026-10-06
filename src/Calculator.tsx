import styled from "styled-components";
import {
  type PsuedoTime,
  intervalOf,
  timeOf,
  type PsuedoTimeDelta,
  humanTime,
  humanInterval,
  subtract,
} from "./PsuedoTime";
import { useImmer } from "use-immer";
import { Time, Number, Interval } from "./Inputs";
import { useState } from "react";

interface CalculatorState {
  mostRecentFeedTime: PsuedoTime;
  mostRecentFeedCount: number;
  desiredEndFeedTime: PsuedoTime;
  desiredEndFeedCount: number;
  minimumInterval: PsuedoTimeDelta;
  maximumInterval: PsuedoTimeDelta;
  roundIncrement: number;
}

const VStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const HStack = styled.div`
  display: flex;
  flex-direction: Row;
`;
const Box = styled.div`
  border: solid 1px black;
  padding: 8px;
`;
const Grid = styled.div`
  display: flex;
  flex-direction: Row;
  flex-wrap: wrap;
  gap: 8px;
`;
const Heading = styled.h4`
  margin: 0px;
`;
const Label = styled.label``;

export const CalculatorForm = (props: {
  onSubmit: (input: CalculatorState) => void;
}) => {
  const [state, setState] = useImmer<CalculatorState>({
    mostRecentFeedTime: timeOf(0),
    mostRecentFeedCount: 0,
    desiredEndFeedTime: timeOf(18),
    desiredEndFeedCount: 8,
    minimumInterval: intervalOf(2),
    maximumInterval: intervalOf(3, 30),
    roundIncrement: 0,
  });

  return (
    <VStack>
      <Grid>
        <Box>
          <VStack>
            <Heading>Most Recent Feeding</Heading>
            <HStack>
              <Label>Time: </Label>
              <Time
                time={state.mostRecentFeedTime}
                onChange={(t) =>
                  setState((draft) => {
                    draft.mostRecentFeedTime = t;
                  })
                }
              />
            </HStack>
            <HStack>
              <Label>Feed number: </Label>
              <Number
                value={state.mostRecentFeedCount}
                onChange={(n) =>
                  setState((draft) => {
                    draft.mostRecentFeedCount = n ?? 0;
                  })
                }
                size={2}
              />
            </HStack>
          </VStack>
        </Box>
        <Box>
          <VStack>
            <Heading>Desired End Feed</Heading>
            <HStack>
              <Label>Time: </Label>
              <Time
                time={state.desiredEndFeedTime}
                onChange={(t) =>
                  setState((draft) => {
                    draft.desiredEndFeedTime = t;
                  })
                }
              />
            </HStack>
            <HStack>
              <Label>Min feed number: </Label>
              <Number
                value={state.desiredEndFeedCount}
                onChange={(n) =>
                  setState((draft) => {
                    draft.desiredEndFeedCount = n ?? 8;
                  })
                }
                size={2}
              />
            </HStack>
          </VStack>
        </Box>
        <Box>
          <VStack>
            <Heading>Interval Settings</Heading>
            <HStack>
              <Label>Min Interval: </Label>
              <Interval
                value={state.minimumInterval}
                onChange={(t) =>
                  setState((draft) => {
                    draft.minimumInterval = t;
                  })
                }
              />
            </HStack>
            <HStack>
              <Label>Max Interval: </Label>
              <Interval
                value={state.maximumInterval}
                onChange={(t) =>
                  setState((draft) => {
                    draft.maximumInterval = t;
                  })
                }
              />
            </HStack>
            <HStack>
              <Label>Round</Label>
              <Number
                value={state.roundIncrement}
                step={5}
                onChange={(t) =>
                  setState((draft) => {
                    draft.roundIncrement = t;
                  })
                }
              />
            </HStack>
          </VStack>
        </Box>
      </Grid>
      <button onClick={() => props.onSubmit(state)}>Calculate</button>
    </VStack>
  );
};

interface CalculationImpossible {
  kind: "error";
  error: string;
}
interface CalculationSolution {
  kind: "success";
  feedings: PsuedoTime[];
  totalFeedings: number;
}

type CalculatorResult = CalculationImpossible | CalculationSolution;

function solveCalculator(input: CalculatorState): CalculatorResult {
  const feedingsRemaining =
    input.desiredEndFeedCount - input.mostRecentFeedCount;
  const mStart = input.mostRecentFeedTime;
  const mEnd = input.desiredEndFeedTime;

  const mTimeRemain = mEnd - mStart;
  let mInterval = mTimeRemain / feedingsRemaining;

  const mMaxInterval = input.maximumInterval;
  const mMinInterval = input.minimumInterval;
  if (mInterval < mMinInterval) {
    const humanRes = humanInterval(mTimeRemain);
    return {
      kind: "error",
      error: `not enough time, need ${feedingsRemaining} feedings in ${humanRes}`,
    };
  }
  if (mInterval > mMaxInterval) {
    const n = Math.ceil(mTimeRemain / mMaxInterval);
    mInterval = mTimeRemain / n;
  }
  const feedings = [];
  for (let i = mStart + mInterval; i <= mEnd; i += mInterval) {
    let feedingTime = Math.round(i);
    if (input.roundIncrement) {
      feedingTime = roundBy(feedingTime, input.roundIncrement);
    }
    feedings.push(feedingTime);
  }
  return {
    kind: "success",
    feedings,
    totalFeedings: feedings.length + input.mostRecentFeedCount,
  };
}

const Error = styled.p`
  color: red;
`;

export const Calculator = () => {
  const [state, setState] = useState<{
    input: CalculatorState;
    result: CalculatorResult;
  } | null>(null);
  const handleSubmit = (state: CalculatorState) => {
    setState({ input: state, result: solveCalculator(state) });
  };

  return (
    <VStack>
      <CalculatorForm onSubmit={handleSubmit} />

      {state && state.result.kind == "error" && (
        <Error>Error: {state.result.error}</Error>
      )}
      {state && state.result.kind == "success" && (
        <ResultList result={state.result} state={state.input} />
      )}
    </VStack>
  );
};

function ResultList(props: {
  result: CalculationSolution;
  state: CalculatorState;
}) {
  let last = props.state.mostRecentFeedTime;
  let num = props.state.mostRecentFeedCount + 1;
  const feedings = [];
  for (const feed of props.result.feedings) {
    const interval = subtract(feed, last);
    last = feed;
    feedings.push({
      interval,
      time: feed,
      number: num++,
    });
  }
  return (
    <div>
      <ol>
        {feedings.map((f) => (
          <li value={f.number.toString()}>
            {humanTime(f.time)} ({humanInterval(f.interval)})
          </li>
        ))}
      </ol>
      Total feedings: {props.result.totalFeedings}
    </div>
  );
}

function roundBy(n: number, round: number): number {
  return Math.round(n / round) * round;
}

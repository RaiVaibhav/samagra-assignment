import React from "react";
import { ContainerItems, Div } from "../util";

export const DisplayTimes = React.memo((props) => {
  const { startTime, endTime, startSaveTime, startEndTime } = props;
  return (
    <ContainerItems>
      <Div>
        <b>Start:</b> {startTime || 'NA'}
      </Div>
      <Div>
        <b>End:</b> {endTime || 'NA'}
      </Div>
      <Div>
        <b>Start Save:</b> {startSaveTime || 'NA'}
      </Div>
      <Div>
        <b>End Save:</b> {startEndTime || 'NA'}
      </Div>
    </ContainerItems>
  )
})
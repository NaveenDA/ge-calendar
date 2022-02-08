import React from "react";
import styled from "styled-components";
import Input from "../components/input";

const Wrapper = styled.div`
  .row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .col-6 {
    flex-basis: 50%;
  }
`;
const CalendarModifier: React.FC = () => {
  return (
    <Wrapper>
      <Input label="Title" type="text" id="title" />
      <Input label="Start Date" type="datetime-local" id="start-date" />
      <Input label="End Date" type="datetime-local" id="end-date" />
      <Input label="Location" type="text" id="location" />
      <Input label="Notify Before" type="select">
        <option value="5">5 minutes</option>
        <option value="10">10 minutes</option>
        <option value="15">15 minutes</option>
        <option value="30">30 minutes</option>
        <option value="60">1 hour</option>
      </Input>
      <Input label="Description" type="textarea" id="description" />
    </Wrapper>
  );
};

export default CalendarModifier;

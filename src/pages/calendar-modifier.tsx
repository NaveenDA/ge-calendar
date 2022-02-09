import { EVENTS_KEY, NOTIFICATION_KEY } from "../constants";
import React, { useEffect, useRef, useState } from "react";

import DBService from "../services/db";
import Input from "../components/input";
import styled from "styled-components";

interface CalendarModifierProps {
  onSubmit: () => void;
}

const Wrapper = styled.div`
  .row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .col-6 {
    flex-basis: 50%;
  }
  .alert {
    color: #973937;
    padding: 5px;
    background: #fff6f6;
    border: 1px solid #c599998d;
    border-left: 5px solid #973937;
    border-radius: 4px;
    margin: 18px 0;

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      li {
        padding: 5px;
      }
    }
  }
`;
const CalendarModifier: React.FC<CalendarModifierProps> = (props) => {
  const [ErrorMessages, setErrorMessages]: [string[], Function] = useState([]);
  const formRef: any = useRef(null);

  useEffect(() => {
    formRef?.current?.reset();
  }, [props]);

  const onSubmit = async (e: any) => {
    e.preventDefault();

    setErrorMessages([]);
    let errors = [];
    var form = e.target;
    var startDate = form.start.value;
    let start = new Date(startDate);
    // convert into iso
    let startISO = start.toISOString();

    let end = new Date(form.end.value);
    let endISO = end.toISOString();

    /**
     * VALIDATION LAYER
     */
    if (start > end) {
      errors.push("Start date must be before end date");
    }
    if (errors.length > 0) {
      setErrorMessages(errors);
      return;
    }

    let uniqueId =
      Date.now().toString(36) + Math.random().toString(36).substring(2);
    let notification = parseInt(form.notification.value, 10);
    let notificationTime = new Date(start.getTime() - notification * 60000);
    let notificationISO = notificationTime.toISOString();

    var data = {
      id: uniqueId,
      title: form.title.value,
      start: startISO,
      end: endISO,
      location: form.location.value,
      description: form.description.value,
      notification: notificationISO,
    };

    // Save events to local storage
    let oldData = DBService.get(EVENTS_KEY);
    if (!oldData) {
      oldData = {};
    }
    let startDateString = startISO.split("T")[0];
    if (!oldData[startDateString]) {
      oldData[startDateString] = [];
    }

    oldData[startDateString].push(data);
    await DBService.set(EVENTS_KEY, oldData);

    // Save notification to local storage

    if (notification) {
      let oldNotification = DBService.get(NOTIFICATION_KEY);
      if (!oldNotification) {
        oldNotification = {};
      }
      if (!oldNotification[notificationISO]) {
        oldNotification[notificationISO] = [];
      }
      oldNotification[notificationISO].push({
        id: uniqueId,
        title: form.title.value,
        descripton: "Events starts in " + notification + " minutes",
      });

      await DBService.set(NOTIFICATION_KEY, oldNotification);
    }

    props.onSubmit();
  };

  return (
    <Wrapper>
      {ErrorMessages.length > 0 && (
        <div className="alert">
          <ul>
            {ErrorMessages.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      <form onSubmit={onSubmit} ref={formRef}>
        <Input
          required={true}
          name="title"
          label="Title"
          type="text"
          id="title"
        />
        <Input
          required={true}
          name="start"
          label="Start Date"
          type="datetime-local"
          id="start-date"
        />
        <Input
          required={true}
          name="end"
          label="End Date"
          type="datetime-local"
          id="end-date"
        />
        <Input
          required={true}
          name="location"
          label="Location"
          type="text"
          id="location"
        />
        <Input
          label="Notify Before"
          id="notification"
          name="notification"
          type="select"
        >
          <option value="0">No Notification</option>
          <option value="5">5 minutes</option>
          <option value="10">10 minutes</option>
          <option value="15">15 minutes</option>
          <option value="30">30 minutes</option>
          <option value="60">1 hour</option>
        </Input>
        <Input
          label="Description"
          name="description"
          type="textarea"
          id="description"
        />
        <div className="footer">
          <button>Save</button>
        </div>
      </form>
    </Wrapper>
  );
};

export default CalendarModifier;

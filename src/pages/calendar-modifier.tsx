import { EVENTS_KEY, NOTIFICATION_KEY } from "../constants";
import React, { useEffect, useRef, useState } from "react";

import DBService from "../services/db";
import Input from "../components/input";
import styled from "styled-components";

interface CalendarModifierProps {
  onSubmit: () => void;
  mode: "add" | "edit";
  data: any;
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
  const [formData, setformData] = useState({
    title: "",
    start: "",
    end: "",
    location: "",
    notification: "0",
    description: ""
  });

  useEffect(() => {
    if (props.data.notification_time) {
      props.data.notification = props.data.notification_time;
    }
    setformData(props.data);
  }, [props, props.data]);

  const onSubmit = async (e: any) => {
    e.preventDefault();

    setErrorMessages([]);
    let errors = [];
    let form = e.target;
    let startDate = form.start.value;
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
    if (props.mode === "edit") {
      uniqueId = props.data.id;
    }
    let notification = parseInt(form.notification.value, 10);
    let notificationTime = new Date(start.getTime() - notification * 60000);
    let notificationISO = notificationTime.toISOString();

    let data = {
      id: uniqueId,
      title: form.title.value,
      start: startISO,
      end: endISO,
      location: form.location.value,
      description: form.description.value,
      notification: notificationISO,
      notification_time: notification + ""
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

    if (props.mode === "add") {
      oldData[startDateString].push(data);
      await DBService.set(EVENTS_KEY, oldData);
    }
    // Save notification to local storage

    let notificationData;
    if (notification) {
      let oldNotification = DBService.get(NOTIFICATION_KEY);
      if (!oldNotification) {
        oldNotification = {};
      }
      if (!oldNotification[notificationISO]) {
        oldNotification[notificationISO] = [];
      }
      let description = "Events starts in " + notification + " minutes";
      if(notification=== 60){
        description = "Events starts in 1 hour";
      }
       notificationData = {
        id: uniqueId,
        title: form.title.value,
        descripton: description
      }
      if (props.mode === "add") {
        oldNotification[notificationISO].push(notificationData);
        await DBService.set(NOTIFICATION_KEY, oldNotification);
      }
    }
    if (props.mode === "edit") {
      updateEvent(uniqueId, data, notificationData);
    }
    if(props.mode === "add"){
    props.onSubmit();
    }
  };

  const updateEvent = async (id: string, data: any, notification: any) => {
    let events = DBService.get(EVENTS_KEY);
    let _events: any = {};
    if (events) {
      for (let [key, value] of Object.entries(events)) {
        let _value: any = value;
        _value = _value.map((_event: any) => {
          if (_event.id === id) {
            _event = data;
          }
          return _event;
        });
        _events[key] = _value;
      }
     
     await DBService.update(EVENTS_KEY, _events);
    }

    // edit notification
    let oldNotification = DBService.get(NOTIFICATION_KEY);
    if(!oldNotification){
      oldNotification = {};
    }
    let _oldNotification: any = {};
    let hasFindNotification = false;
    if (oldNotification && notification) {
      for (let [key, value] of Object.entries(oldNotification)) {
        let _value: any = value;
        // eslint-disable-next-line no-loop-func
        _value = _value.map((_event: any) => {
          if (_event.id === id) {
            _event = notification;
            hasFindNotification=true;
          }
          return _event;
        });
        _oldNotification[key] = _value;
      }
      if(!hasFindNotification){
        let notificationISO = data.notification;
        if (!_oldNotification[notificationISO]) {
          _oldNotification[notificationISO] = [];
        }
        _oldNotification[notificationISO].push(notification);
      }
      await DBService.update(NOTIFICATION_KEY, _oldNotification);
    }
    props.onSubmit();
  };

  const onChange = (key: string, value: any) => {
    let _formData: any = { ...formData };
    _formData[key] = value;
    setformData(_formData);
  };

  const setDate = (value: string) => {
    let date = new Date(value);
    date = new Date(
      date.getTime() - new Date().getTimezoneOffset() * 60 * 1000
    );
    let isoString = date.toISOString();
    return isoString.substring(0, ((isoString.indexOf("T") | 0) + 6) | 0);
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
          data-value={formData.title || ""}
          value={formData.title || ""}
          onChange={(e: any) => onChange("title", e.target.value)}
        />
        <Input
          required={true}
          name="start"
          label="Start Date"
          type="datetime-local"
          id="start-date"
          data-value={formData.start ? setDate(formData.start) : ""}
          value={formData.start ? setDate(formData.start) : ""}
          onChange={(e: any) => onChange("start", e.target.value)}
        />
        <Input
          required={true}
          name="end"
          label="End Date"
          type="datetime-local"
          id="end-date"
          data-value={formData.end ? setDate(formData.end) : ""}
          value={formData.end ? setDate(formData.end) : ""}
          onChange={(e: any) => onChange("end", e.target.value)}
        />
        <Input
          required={true}
          name="location"
          label="Location"
          type="text"
          id="location"
          data-value={formData.location}
          value={formData.location || ""}
          onChange={(e: any) => onChange("location", e.target.value)}
        />
        <Input
          label="Notify Before"
          id="notification"
          name="notification"
          type="select"
          data-value={formData.notification}
          value={formData.notification + "" || ""}
          onChange={(e: any) => onChange("notification", e.target.value)}
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
          data-value={formData.description}
          value={formData.description || ""}
          onChange={(e: any) => onChange("description", e.target.value)}
        />
        <div className="footer">
          <button>Save</button>
        </div>
      </form>
    </Wrapper>
  );
};

export default CalendarModifier;

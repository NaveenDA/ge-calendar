import { EVENTS_KEY, NOTIFICATION_KEY } from "../constants";
import { FC, memo, useEffect, useLayoutEffect, useState } from "react";

import CalendarModifier from "./calendar-modifier";
import DBService from "../services/db";
import DateTimeService from "../services/datetime";
import Drawer from "../components/drawer";
import Fab from "../components/fab";
import Modal from "../components/modal";
import NotificationService from "../services/notification";
import { addLeadingZero } from "../services/utils";
import styled from "styled-components";
import useInterval from "../hooks/useinterval";
import useWindowSize from "../hooks/usewindowsize";
import { createCSV } from "../services/csv";

const clock = require("../assets/clock.png");
const location = require("../assets/location.png");
const info = require("../assets/info.png");

interface CalendarProps {
  timezone: string;
  monthDate: Date;
}

const Wrapper = styled.div`
  width: 80%;
  margin: 0 auto;

  table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    table-layout: fixed;
  }
  td,
  th {
    border: 1px solid #e8e8e8;
  }
  th {
    border: 1px solid #e8e8e8;
    padding: 5px 10px;
  }
`;

const Cell = styled.td`
  width: ${(props) => props.width}px;
  height: ${(props) => props.width}px;
  position: relative;
  border: 1px solid #e8e8e8;
  padding-top: 2.5em;
  padding-bottom: 5px;
  .day {
    font-size: 2.3rem;
    position: absolute;
    top: 0;
    color: ${(props) => props.color};
    font-weight: bold;
  }
`;

const Event = styled.div`
  padding: 5px;
  background: teal;
  width: 90%;
  margin: 0 auto;
  border-radius: 2px;
  font-size: 12px;
  color: #fff;
  margin-top: 1px;
  cursor: pointer;
  // text ellipsis
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledModal = styled.div`
  h3 {
    font-size: 1.5rem;
    line-height: 1.5;
  }
  hr {
    margin: 12px 0;
  }
  p {
    line-height: 1.5;
  }
  .date {
    font-size: 0.7rem;
  }
  img {
    width: 15px;
    vertical-align: middle;
    margin-right: 5px;
  }
  .desc {
    font-size: 0.9rem;
    font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI",
      Roboto, "Helvetica Neue", Arial, sans-serif;
  }
`;

/**
 *
 */
const Calendar: FC<CalendarProps> = (props) => {
  const { timezone, monthDate } = props;
  const [cellDemension, setcellDemension] = useState(100);
  const [AllEvents, setAllEvents]: [any, Function] = useState({});
  const [SelectedDate, setSelectedDate]: [any, Function] = useState("");
  const [ModalVisible, setModalVisible] = useState(false);
  const [DrawerVisible, setDrawerVisible] = useState(false);
  const [refreshToken, setrefreshToken] = useState(1);
  const [width, height] = useWindowSize();

  /**
   *  Process needs to be done on component mount
   * 1. Get all events from DB
   * 2. Convert all events from utc to local time
   * 3. Create cell demension based on the screen width
   * 4. Render calendar for selected month
   * 5. Check needs to show any notification for the current minute
   */

  // Fetch the data from local storage
  useEffect(() => {
    let data: any = DBService.get(EVENTS_KEY);
    let _data: any = {};
    /**
     * These conversation can be avoided, if we use proper database
     * but for now, we are using local storage
     */
    if (data) {
      for (let [, value] of Object.entries(data)) {
        // Convert the date to local time zone
        //@ts-ignore
        let startDate = value.length > 0 ? value[0].start : "";

        let _key = DateTimeService.format(new Date(startDate), "dd-MM-yyyy");
        _data[_key] = value;
      }
      setAllEvents(_data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthDate, timezone, refreshToken]);

  /**
   * Get the calendar cell demension based on the screen width
   */
  useLayoutEffect(() => {
    let _width = width;
    _width = _width * 0.8;
    setcellDemension(_width / 11);
  }, [props, width, height]);

  /**
   * Get the events for the particular date
   */
  const getEventsForDay = (date: string) => {
    if (AllEvents[date]) {
      return AllEvents[date].map((event: any, index: number) => (
        <Event
          key={index}
          onClick={() => {
            setSelectedDate(event);
            setModalVisible(true);
          }}
        >
          {event.title}
        </Event>
      ));
    } else {
      return null;
    }
  };

  /**
   * Get Notifications for the current minute
   */
  useInterval(() => {
    let notifications = DBService.get(NOTIFICATION_KEY);
    let _notifications: any = {};

    if (notifications) {
      for (let [key, events] of Object.entries(notifications)) {
        let notificationDate = new Date(key);
        let currentDate = new Date();
        //  show the notification only for the current minute
        if (
          currentDate.getMinutes() === notificationDate.getMinutes() &&
          currentDate.getHours() === notificationDate.getHours() &&
          currentDate.getDate() === notificationDate.getDate() &&
          currentDate.getMonth() === notificationDate.getMonth() &&
          currentDate.getFullYear() === notificationDate.getFullYear()
        ) {
          //@ts-ignore
          events.forEach((event: any) => {
            NotificationService.show(event.title, event.description);
          });
          // if current date less than the date of notification
        } else if (currentDate < notificationDate) {
          _notifications[key] = events;
        }
        // older notifications are removed
      }
      DBService.set(NOTIFICATION_KEY, _notifications);
    }
  }, 1000);

  const downloadCSV = () => {
    debugger;
    let headers = [
      "Event",
      "Start Date",
      "Start Time",
      "End Date",
      "End Time",
      "Location",
      "Description"
    ];
    let data: any = [];
    let events = DBService.get(EVENTS_KEY);
    let date = DateTimeService.format(monthDate, "MM-yyyy");
    if (events) {
      for (let [, value] of Object.entries(events)) {
        let _value: any = value;
        _value.forEach((event: any) => {
          let _eventDate = DateTimeService.format(
            new Date(event.start),
            "MM-yyyy"
          );
          if (_eventDate === date) {
            let start = new Date(event.start);
            let end = new Date(event.end);

            data.push({
              Event: event.title,
              "Start Date": DateTimeService.format(start, "MM-dd-yyyy"),
              "Start Time": DateTimeService.format(start, "hh:mm:ss"),
              "End Date": DateTimeService.format(end, "MM-dd-yyyy"),
              "End Time": DateTimeService.format(end, "hh:mm:ss"),
              Location: event.location,
              Description: event.description
            });
          }
        });
      }
      if (data) {
        let csv = createCSV(data, headers);
        let blob = new Blob([csv], { type: "text/csv" });
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = `events-${date}.csv`;
        a.click();
      }
    }
  };
  /**
   * Get the full calendar for the selected month
   */
  const getCalendarMarkup = (): any => {
    let markup = [];
    let cellCount = 1;
    let monthCount = 1;

    let firstDay = new Date(
      monthDate.getFullYear(),
      monthDate.getMonth(),
      1
    ).getDay();

    let totalDaysInMonth = DateTimeService.getDaysInMonth(monthDate);
    let _date_prev = new Date(monthDate.getTime());
    let _date_next = new Date(monthDate.getTime());
    // next Month
    let nextMonthDate = new Date(
      _date_next.setMonth(_date_next.getMonth() + 1)
    );

    // previous Month
    let previousMonthDate = new Date(
      _date_prev.setMonth(_date_prev.getMonth() - 1)
    );

    let lastStartDay = 1;

    let lastMonthDate = DateTimeService.getDaysInMonth(previousMonthDate);
    lastMonthDate = lastMonthDate - firstDay + 1;

    for (let weeks = 1; weeks <= 6; weeks++) {
      let week = [];
      for (let days = 1; days <= 7; days++) {
        // Previous Month
        if (cellCount < firstDay + 1) {
          let day: any = addLeadingZero(lastMonthDate);
          let month: any = addLeadingZero(previousMonthDate.getMonth() + 1);
          let year = previousMonthDate.getFullYear();
          let dateString = `${day}-${month}-${year}`;

          week.push(
            <Cell key={cellCount} width={cellDemension} color="#BFBFBF">
              <span className="day">{lastMonthDate}</span>
              {getEventsForDay(dateString)}
            </Cell>
          );
          lastMonthDate++;
        } else {
          // Current Month
          if (monthCount <= totalDaysInMonth) {
            let day = addLeadingZero(monthCount);
            let month = addLeadingZero(monthDate.getMonth() + 1);
            let year = monthDate.getFullYear();
            let dateString = `${day}-${month}-${year}`;

            // today
            if (
              DateTimeService.isToday(
                new Date(
                  monthDate.getFullYear(),
                  monthDate.getMonth(),
                  monthCount
                ),
                timezone
              )
            ) {
              week.push(
                <Cell key={cellCount} width={cellDemension} color="#e75511">
                  <span className="day">{monthCount}</span>
                  {getEventsForDay(dateString)}
                </Cell>
              );
            } else {
              week.push(
                <Cell key={cellCount} width={cellDemension}>
                  <span className="day">{monthCount}</span>
                  {getEventsForDay(dateString)}
                </Cell>
              );
            }
            monthCount++;
          } else {
            // Next Month
            let day = addLeadingZero(lastStartDay);
            let month = addLeadingZero(nextMonthDate.getMonth() + 1);
            let year = nextMonthDate.getFullYear();
            let dateString = `${day}-${month}-${year}`;

            week.push(
              <Cell key={cellCount} width={cellDemension} color="#BFBFBF">
                <span className="day">{lastStartDay}</span>
                {getEventsForDay(dateString)}
              </Cell>
            );
            lastStartDay++;
          }
        }

        cellCount++;
      }
      markup.push(<tr key={weeks}>{week}</tr>);
    }
    return markup;
  };

  return (
    <Wrapper>
      <table>
        <thead>
          <tr>
            <th>Sun</th>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
            <th>Sat</th>
          </tr>
        </thead>
        <tbody>{getCalendarMarkup()}</tbody>
      </table>
      {ModalVisible && (
        <Modal onClose={() => setModalVisible(false)}>
          <StyledModal>
            <h3>{SelectedDate.title}</h3>
            <hr />
            <p className="date">
              <img src={clock} alt="Clock Icon" />
              {DateTimeService.format(
                new Date(SelectedDate.start),
                "dd-MM-yyyy hh:mm a"
              )}
              <b>-</b>
              {DateTimeService.format(
                new Date(SelectedDate.end),
                "dd-MM-yyyy hh:mm a"
              )}
            </p>
            <p>
              <img src={location} alt="Location Icon" /> {SelectedDate.location}
            </p>
            <p className="desc">
              <img src={info} alt="Info Icon" /> {SelectedDate.description}
            </p>
          </StyledModal>
        </Modal>
      )}
      <Fab
        title="Export Events"
        type="download"
        style={{ bottom: 80 }}
        onClick={() => downloadCSV()}
      />
      <Fab
        type="plus"
        title="Create Event"
        onClick={() => setDrawerVisible(true)}
      />

      <Drawer
        onClose={() => setDrawerVisible(false)}
        visible={DrawerVisible}
        title="Create an Event"
      >
        <CalendarModifier
          onSubmit={() => {
            setrefreshToken(refreshToken + 1);
            setDrawerVisible(false);
          }}
        />
      </Drawer>
    </Wrapper>
  );
};

export default memo(Calendar);

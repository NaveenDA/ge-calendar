import React, { memo, useLayoutEffect, useState } from "react";
import styled from "styled-components";
import DateTimeService from "../services/datetime";

const Wrapper = styled.div`
  width: 90%;
  margin: 0 auto;

  table {
    width: 100%;
    border-collapse: collapse;

    th {
      text-align: left;
      padding: 10px 0;
    }
  }

  .events {
    height: 60px;
    position: absolute;
    width: 100%;
    top: 45px;
    z-index: 100;
    overflow: scroll;
    ::-webkit-scrollbar {
      width: 0; /* Remove scrollbar space */
      background: transparent; /* Optional: just make scrollbar invisible */
    }
    /* Optional: show position indicator in red */
    ::-webkit-scrollbar-thumb {
      background: #ff0000;
    }
  }
  .more {
    position: absolute;
    background: #fff;
    font-size: 12px;
    color: #737373;
    bottom: 0px;
    width: 100%;
    left: 0;
    height: 18px;
    padding: 2px 8px;
    cursor: pointer;
    z-index: 1;
  }
`;

const Cell = styled.td`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  position: relative;
  border: 1px solid #e8e8e8;
  .day {
    font-size: 2.3rem;
    position: relative;
    top: -0.8em;
    color: ${(props) => props.color};
    font-weight: bold;
  }
`;

const Event = styled.div`
  padding: 5px;
  background: teal;
  width: 100%;
  font-size: 12px;
  color: #fff;
  margin-top: 1px;
`;

interface CalendarProps {
  timezone: string;
  monthDate: Date;
}

const Calendar: React.FC<CalendarProps> = (props) => {
  const { timezone, monthDate } = props;
  const [cellDemension, setcellDemension] = useState(100);

  useLayoutEffect(() => {
    let width = window.innerWidth;
    width = width * 0.8;
    setcellDemension(width / 11);
  }, [props]);

  const getEventForDay = (date: string) => {};

  const getCalender = () => {
    let markup = [];
    let date = DateTimeService.getDateforTimezone(monthDate, timezone);
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    let lastDay = DateTimeService.getDaysInMonth(date);

    let nextMonthDate = 0;

    let lastMonthDate: any = new Date(date.setMonth(date.getMonth() - 1));
    lastMonthDate = DateTimeService.getDaysInMonth(lastMonthDate);
    lastMonthDate = lastMonthDate - firstDay + 1;

    let count = 1;
    let monthDay = 1;

    for (let week = 1; week < 7; week++) {
      let weeks = [];
      for (let day = 1; day <= 7; day++) {
        if (count < firstDay + 1) {
          weeks.push(
            <Cell
              key={count}
              height={cellDemension}
              width={cellDemension}
              color="#BFBFBF"
            >
              <span className="day"> {lastMonthDate}</span>
            </Cell>
          );
          lastMonthDate++;
        } else {
          if (lastDay >= monthDay) {
            if (
              DateTimeService.isToday(
                new Date(date.getFullYear(), date.getMonth() + 1, monthDay),
                timezone
              )
            ) {
              weeks.push(
                <Cell
                  key={count}
                  height={cellDemension}
                  width={cellDemension}
                  color="#e75511"
                >
                  <span className="day">{monthDay}</span>
                  <span className="more">8+ More</span>
                  <div className="events">
                    <Event>An event</Event>
                    <Event>An event</Event>
                    <Event>An event</Event>
                    <Event>An event</Event>
                  </div>
                </Cell>
              );
            } else {
              weeks.push(
                <Cell
                  key={count}
                  height={cellDemension}
                  width={cellDemension}
                  color="#000000"
                >
                  <span className="day">{monthDay}</span>
                </Cell>
              );
            }

            monthDay++;
          } else {
            nextMonthDate++;
            weeks.push(
              <Cell
                key={count}
                height={cellDemension}
                width={cellDemension}
                color="#BFBFBF"
              >
                <span className="day"> {nextMonthDate}</span>
              </Cell>
            );
          }
        }

        count++;
      }
      markup.push(<tr key={week}>{weeks}</tr>);
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
        <tbody>{getCalender()}</tbody>
      </table>
    </Wrapper>
  );
};

export default memo(Calendar);

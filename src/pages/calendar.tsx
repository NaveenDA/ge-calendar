import { FC, memo, useEffect, useLayoutEffect, useState } from "react";
import styled from "styled-components";
import Drawer from "../components/drawer";
import Fab from "../components/fab";
import Modal from "../components/modal";
import DateTimeService from "../services/datetime";
import CalendarModifier from "./calendar-modifier";
import { get3MonthsEvents } from "./calender-processor";
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
  p {
    line-height: 1.5;
  }
  .date {
    font-size: 0.7rem;
  }
  img {
    width: 15px;
    vertical-align: middle;
  }
  .desc {
    font-size: 0.9rem;
    font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI",
      Roboto, "Helvetica Neue", Arial, sans-serif;
  }
`;

const Calendar: FC<CalendarProps> = (props) => {
  const { timezone, monthDate } = props;
  const [cellDemension, setcellDemension] = useState(100);
  const [SetOfEvents, setSetOfEvents]: [any, Function] = useState({});
  const [SelectedDate, setSelectedDate]: [any, Function] = useState("");
  const [ModalVisible, setModalVisible] = useState(false);
  const [DrawerVisible, setDrawerVisible] = useState(false);

  useLayoutEffect(() => {
    let width = window.innerWidth;
    width = width * 0.8;
    setcellDemension(width / 11);
  }, [props]);

  const getEventsForDay = (date: string) => {
    if (SetOfEvents[date]) {
      return SetOfEvents[date].map((event: any, index: number) => (
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
          let dateString = `${lastMonthDate}-${
            previousMonthDate.getMonth() + 1
          }-${previousMonthDate.getFullYear()}`;

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
            //new Date("2022-02-09")

            let dateString = `${monthCount}-${
              monthDate.getMonth() + 1
            }-${monthDate.getFullYear()}`;

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
            let dateString = `${lastStartDay}-${
              nextMonthDate.getMonth() + 1
            }-${nextMonthDate.getFullYear()}`;
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

  useEffect(() => {
    setSetOfEvents(get3MonthsEvents(monthDate));
  }, [monthDate]);

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
            <p className="date">
              <img src={clock} alt="Clock Icon" />
              {DateTimeService.getFormattedDate(
                new Date(SelectedDate.start),
                timezone
              )}
              <b>-</b>
              {DateTimeService.getFormattedDate(
                new Date(SelectedDate.end),
                timezone
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
      <Fab onClick={()=>setDrawerVisible(true)} />

      <Drawer
        onClose={() => setDrawerVisible(false)}
        visible={DrawerVisible}
        title="Create an Event"
        footer={
          <>
          <button>Save</button>
          </>
        }
      >
        <CalendarModifier />
      </Drawer>
    </Wrapper>
  );
};

export default memo(Calendar);

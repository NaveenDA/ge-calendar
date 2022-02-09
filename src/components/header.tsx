import React, { memo, useEffect, useState } from "react";

import DateTimeService from "../services/datetime";
import styled from "styled-components";

const Wrapper = styled.header`
  height: 55px;
  background: #fff;
  display: flex;
  flex-direction: row;
  line-height: 55px;
  border-bottom: 1px solid var(--gray);
  overflow: hidden;
  .month-switch {
    justify-content: flex-start;
    flex-basis: 25%;
    padding-left: 12px;
    position: relative;
    .title {
      background: #fff;
      width: 140px;
      display: inline-block;
      height: 45px;
      z-index: 12;
      position: relative;
      margin: 2px;
    }
    input[type="date"] {
      opacity: 1;
      border: none;
      background: transparent;
      position: absolute;
      top: 19px;
      left: 72px;
      outline: none;
    }

    .navigation {
      margin: 0 8px;
      font-size: 21px;
      border-radius: 50%;
      padding: 0 6px;
      text-align: center;
      cursor: pointer;
      user-select: none;
      &:last-child {
        margin-left: 16px;
      }
      &:hover {
        background: #dedede;
      }
    }
  }
  .timezone-switch {
    justify-content: flex-end;
    flex-basis: 25%;
    padding-right: 12px;
    text-align: right;
    select {
      margin-left: 5px;
    }
  }
  .center-space {
    flex-basis: 50%;
    text-align: center;
    font-size: 12px;
    color: gray;
  }
  .value {
    font-size: 0.9rem;
    color: gray;
    padding-left: 12px;
  }
`;

interface HeaderProps {
  timezone: string;
  monthDate: Date;
  setMonthDate: (date: Date) => void;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}

const Header: React.FC<HeaderProps> = (props) => {
  const [monthText, setMonthText] = useState("");
  const { monthDate, timezone, setMonthDate, currentDate } = props;

  useEffect(() => {
    // current month as string
    const currentMonth = DateTimeService.getMonth(monthDate, timezone);
    const getCurrentYear = DateTimeService.getCurrentYear(new Date(), timezone);
    setMonthText(currentMonth + " " + getCurrentYear);
  }, [monthDate, timezone]);

  const navigateMonth = (direction: string) => {
    let date: any = monthDate;
    if (direction === "next") {
      date = date.setMonth(date.getMonth() + 1);
    } else {
      date = date.setMonth(date.getMonth() - 1);
    }
    setMonthDate(new Date(date));
  };

  return (
    <Wrapper>
      <div className="month-switch">
        <span className="navigation" onClick={() => navigateMonth("previous")}>
          {"<"}
        </span>
        <input
          value={monthDate.toISOString().substring(0, 10)}
          type="date"
          onChange={(e) => setMonthDate(new Date(e.target.value))}
        />
        <span className="title">{monthText}</span>
        <span className="navigation" onClick={() => navigateMonth("next")}>
          {">"}
        </span>
      </div>
      <div className="center-space">{currentDate.toLocaleString()}</div>
      <div className="timezone-switch">
        Timezone
        <span className="value">{timezone} </span>
      </div>
    </Wrapper>
  );
};

export default memo(Header);

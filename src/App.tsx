import React, { useEffect, useState } from "react";

import Banner from "./components/banner";
import Calendar from "./pages/calendar";
import DateTimeService from "./services/datetime";
import Header from "./components/header";
import { createGlobalStyle } from "styled-components";
import useInterval from "./hooks/useinterval";

const GlobalStyle = createGlobalStyle`
/**
Global CSS Variables
*/
:root{
    --color-primary: #6150D5;
    --gray: #b4b4b4;
}
/**
Reset CSS
*/
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
/**
Global CSS for Body
 */
body{
    font-family: 'Numans', sans-serif;
  }
`;

const App: React.FC = () => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [monthDate, setMonthDate] = useState(
    DateTimeService.getDateforTimezone(new Date(), timezone)
  );
  const [currentDate, setCurrentDate] = useState(
    DateTimeService.getDateforTimezone(new Date(), timezone)
  );

  useEffect(() => {
    setCurrentDate(DateTimeService.getDateforTimezone(new Date(), timezone));
  }, [timezone]);

  useInterval(() => {
    const date = DateTimeService.getDateforTimezone(new Date(), timezone);
    setCurrentDate(new Date(date.getTime() + 1000));
  }, 1000);

  return (
    <>
      <GlobalStyle />
      <Banner />
      <Header
        timezone={timezone}
        monthDate={monthDate}
        setMonthDate={setMonthDate}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
      />
      <Calendar timezone={timezone} monthDate={monthDate} />
    </>
  );
};

export default App;

import React, { useState } from "react";

import NotificationService from "../services/notification";
import styled from "styled-components";

const Wrapper = styled.div`
  background: #fff8e4;
  color: #717171;

  height: 45px;
  line-height: 45px;
  text-align: center;
  a {
    color: #5f4704;
  }
`;

const Banner: React.FC = () => {
  const [IsEnabled, setIsEnabled] = useState(NotificationService.isGranted());
  const requestPermission = (e: any) => {
    e.preventDefault();
    NotificationService.requestPermission().then(() => {
      setIsEnabled(NotificationService.isGranted());
    });
  };
  if (IsEnabled) {
    return null;
  }
  return (
    <Wrapper>
      Notification is not enabled.{" "}
      <a onClick={requestPermission} href="#notification">
        Click here
      </a>{" "}
      to enable.
    </Wrapper>
  );
};

export default Banner;

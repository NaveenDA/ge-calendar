import React from "react";
import styled from "styled-components";
const plus = require("../assets/plus.png");
const download = require("../assets/download.png");

const Wrapper = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid #e8e8e8;
  position: fixed;
  bottom: 20px;
  right: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  cursor: pointer;
  img {
    width: 100%;
  }
  &:hover {
    background: #e8e8e8;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
    transform: scale(1.1);
  }
`;

const Fab: React.FC<any> = (props) => {
  const images:any = {
    plus,
    download,
  }
  let img = images[props.type];
  return (
    <Wrapper {...props}>
      <img src={img} alt={props.type} />
    </Wrapper>
  );
};

export default Fab;

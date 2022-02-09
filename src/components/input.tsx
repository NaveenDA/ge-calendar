import React from "react";
import styled from "styled-components";

interface InputProps {
  label: string;
  // any other props
  type: string;
  [key: string]: any;
}
const Wrapper = styled.div`
  margin-bottom: 12px;
  label {
    display: block;
    margin-bottom: 10px;
    color: #717171;
  }
  input,
  textarea,
  select {
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #6150d5;
  }
  textarea {
    height: 100px;
  }
  .mark {
    color: #ff0000;
    padding: 0 5px;
  }
`;
const Input: React.FC<InputProps> = (props) => {
  const getMarkup = () => {
    switch (props.type) {
      case "textarea":
        return <textarea {...props} />;
      case "select":
        return <select {...props}>{props.children}</select>;
      default:
        return <input {...props} />;
    }
  };
  return (
    <Wrapper>
      <label htmlFor={props.id ? props.id : null}>
        {props.label}
        {props.required && <span className="mark">*</span>}
      </label>
      {getMarkup()}
    </Wrapper>
  );
};

export default Input;

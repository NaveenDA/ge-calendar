import React from "react";
import styled from "styled-components";

interface DrawerProps {
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  visible: boolean;
}

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
`;
const Wrapper = styled.div`
  // backdrop

  .drawer {
    position: fixed;
    right: -600px;
    top: 0;
    width: 400px;
    height: 100%;
    background: #fff;
    z-index: 110;
    .title {
      height: 50px;
      line-height: 50px;
      text-align: center;
      font-size: 20px;
      border-bottom: 1px solid #e8e8e8;
    }
    .footer {
      height: 50px;
      line-height: 50px;
      text-align: right;
      padding: 0 5px;
      width: 95%;

      font-size: 20px;
      border-top: 1px solid #e8e8e8;
      position: absolute;
      bottom: 0;
    }
    &.active-in {
      transition: right 0.3s ease-in-out;
      right: 0;
    }
    &.active-out {
      transition: right 0.3s ease-in-out;
      right: -600px;
    }
    .content {
      padding: 12px;
    }
    button {
      background: #6150d5;
      border-radius: 6px;
      color: #fff;
      padding: 5px 10px;
      border: none;
      font-size: 16px;
      cursor: pointer;
      &:hover {
        background: #5a4cca;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
      }
    }
  }
`;

const Drawer: React.FC<DrawerProps> = (props) => {
  const { title, children, onClose, visible } = props;
  return (
    <>
      <Wrapper>
        <div
          className={visible ? "drawer active-in" : "drawer active-out"}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="title">{title}</div>
          <div className="content">{children}</div>
        </div>
      </Wrapper>
      {visible && <Backdrop onClick={() => onClose()} />}
    </>
  );
};

export default Drawer;

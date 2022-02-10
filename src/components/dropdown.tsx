import { FC, ReactElement, ReactNode, useState } from "react";
import styled from "styled-components";

interface DropdownItemProps {
  onClick: () => void;
  children: ReactNode;
}

interface DropdownProps {
  title: ReactNode;
  children:
    | ReactElement<DropdownItemProps>
    | Array<ReactElement<DropdownItemProps>>;
}

const Wrapper = styled.div`
  .dropdown-title {
    font-size: 1.2rem;
    color: gray;
    padding-left: 12px;
    cursor: pointer;
  }
  .dropdown-items {
    display: flex;
    flex-direction: column;
    padding-left: 12px;
    position: absolute;
    // shadow md
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    background: #fff;
    padding: 5px;
    height: 0;
    display: none;

    &.visible {
      display: block;
      height: auto;
    }
  }
  .dropdown-item {
    background: #fff;
    padding: 10px 4px;
    cursor: pointer;
    border-radius: 4px;

    font-size: 0.9rem;
    color: gray;
    padding-left: 12px;
    &:hover {
      background-color: #f5f5f5;
    }
  }
`;

export const DropdownItem: FC<DropdownItemProps> = ({ children, onClick }) => {
  return (
    <div className="dropdown-item" onClick={onClick}>
      {children}
    </div>
  );
};

const Dropdown: FC<DropdownProps> = (props) => {
  const [IsVisible, setIsVisible] = useState(false);
  return (
    <Wrapper>
      <div className="dropdown-title" onClick={() => setIsVisible(!IsVisible)}>
        {props.title}
      </div>
      <div
        onClick={() => setIsVisible(false)}
        className={IsVisible ? "dropdown-items visible" : "dropdown-items"}
      >
        {props.children}
      </div>
    </Wrapper>
  );
};

export default Dropdown;

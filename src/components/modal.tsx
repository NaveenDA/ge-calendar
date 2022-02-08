import React from "react";
import styled from "styled-components";

interface ModalProps {
  onClose: () => void;
}
const Wrapper = styled.div`
  // backdrop
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
  // modal
  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    height: 300px;
    background: #fff;
    border-radius: 4px;
    z-index: 110;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    padding:12px;
    // animation zoomIn
    animation: zoomIn 0.3s ease-in-out;
    @keyframes zoomIn {
        from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0);
        }
        to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
    }
}
`;
const Modal: React.FC<ModalProps> = (props) => {
  return (
    <Wrapper onClick={()=>props.onClose()}>
      <div className="modal" onClick={(e)=>{
         e.stopPropagation()}}>{props.children}</div>
    </Wrapper>
  );
};

export default Modal;

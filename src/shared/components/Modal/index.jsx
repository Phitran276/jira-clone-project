import React, {
  Fragment,
  useRef,
  useEffect,
  useCallback,
  useState
} from "react";
import ReactDOM from "react-dom";

import useOnEscapeKeyDown from '../../hooks/onEscapeKeyDown';
import useOnOutsideClick from '../../hooks/onOutsideClick';

import PropTypes from "prop-types";

import {
  ScrollOverlay,
  ClickableOverlay,
  StyledModal,
  CloseIcon,
} from "./Styles";

const $root = document.getElementById("root");

const propTypes = {
  className: PropTypes.string,
  testid: PropTypes.string,
  variant: PropTypes.oneOf(["center", "aside"]),
  width: PropTypes.number,
  withCloseIcon: PropTypes.bool,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  renderLink: PropTypes.func,
  renderContent: PropTypes.func.isRequired,
};

const defaultProps = {
  className: undefined,
  testid: "modal",
  variant: "center",
  width: 600,
  withCloseIcon: true,
  isOpen: undefined,
  onClose: () => {},
  renderLink: () => {},
};

const Modal = ({
  className,
  testid,
  variant,
  width,
  withCloseIcon,
  isOpen: propsIsOpen,
  onClose: tellParentToClose,
  renderLink,
  renderContent,
}) => {

  const [stateIsOpen, setStateOpen] = useState(false);
  const isControlled = typeof propsIsOpen === 'boolean';
  const isOpen = isControlled ? propsIsOpen : stateIsOpen;

  const $modalRef = useRef();
  const $clickableOverlayRef = useRef();

  const closeModal = useCallback(() => {
    tellParentToClose();
    setStateOpen(false);
  }, [propsIsOpen]);

  useOnEscapeKeyDown(propsIsOpen, closeModal);
  useOnOutsideClick($modalRef, propsIsOpen, closeModal, $clickableOverlayRef);

  useEffect(() => {
    if(propsIsOpen){
        document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = 'visible';
    };
  }, [propsIsOpen]);


  return (
    <Fragment>
      {!isControlled ? renderLink({ open: () => setStateOpen(true) }) : ''}
      {isOpen
        ? ReactDOM.createPortal(
            <ScrollOverlay>
              <ClickableOverlay variant={variant} ref={$clickableOverlayRef}>
                <StyledModal
                  className={className}
                  variant={variant}
                  width={width}
                  data-testid={testid} 
                  ref={$modalRef}
                >
                  {withCloseIcon ? (
                    <CloseIcon
                      type="close"
                      variant={variant}
                      onClick={closeModal}
                    />
                  ) : (
                    ""
                  )}
                  {renderContent({close: closeModal})}
                </StyledModal>
              </ClickableOverlay>
            </ScrollOverlay>,
            $root
          )
        : ""}
    </Fragment>
  );
};

Modal.propTypes = propTypes;
Modal.defaultProps = defaultProps;

export default Modal;

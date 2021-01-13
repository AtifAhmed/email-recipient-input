import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
const EmailRecipientInput = ({
  label,
  placeholder,
  inputId,
  value,
  showTotalsComponent,
  recipientList,
  handleChange,
  handleKeyDown,
  handlePaste,
  handleOnFocus,
  handleOnBlur,
  handleDelete,
}) => {
  const handleMouseDown = (event) => {
    event.preventDefault();
  };
  const handleMouseUp = (event) => {
    event.preventDefault();
  };
  let recipientListTotalsComponent = (
    <span className="chip">
      <span className="chip-value chip-totals ">
        +{recipientList.length - 2}
      </span>
    </span>
  );
  const showChips = (_recipientList) => {
    let chipsHtml = [];
    _recipientList.forEach((recipient) => {
      chipsHtml.push(
        <span className="chip" key={recipient.email}>
          <span className="chip-value">{recipient.email}</span>
          <button
            type="button"
            className="chip-delete-button"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onClick={(e) => handleDelete(e, recipient.email)}
          >
            &times;
          </button>
        </span>
      );
    });
    return chipsHtml;
  };
  let first2Chips = showChips(recipientList.slice(0, 2));
  let chips = showTotalsComponent ? first2Chips : showChips(recipientList);
  return (
    <>
      <div
        className="d-flex border-bottom recipient-input-wrapper "
        onClick={handleOnFocus}
        onBlur={handleOnBlur}
      >
        <div className="pl-1 email-label">{label}</div>
        <div className="chips d-flex flex-grow-1 flex-wrap send-type-container">
          {chips}
          {showTotalsComponent ? recipientListTotalsComponent : ""}
          <input
            id={inputId}
            className="chips-input  position-relative"
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
          />
        </div>
      </div>
    </>
  );
};

EmailRecipientInput.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string,
  recipientList: PropTypes.array.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleKeyDown: PropTypes.func.isRequired,
  handlePaste: PropTypes.func.isRequired,
  handleOnFocus: PropTypes.func.isRequired,
  handleOnBlur: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};
export default EmailRecipientInput;

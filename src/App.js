import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import EmailRecipientInput from "./EmailRecipientInput";

const App = () => {
  const [emailToValue, setEmailToValue] = useState("");
  const [showTotalsComponent, setShowTotalsComponent] = useState(false);
  const [errors, setErrors] = useState("");

  const [recipients, setRecipients] = useState([
    { email: "aa@aa.com" },
    { email: "bb@bb.com" },
  ]);

  const handleChange = (event) => {
    setEmailToValue(event.target.value);
    if (event.target.value === "" && errors !== "") {
      setErrors("");
    }
  };
  const handleKeyDown = (event) => {
    if (["Enter", "Tab", ","].includes(event.key)) {
      event.preventDefault();
      addItemToList();
      setEmailToValue("");
    }
  };
  const handlePaste = (event) => {
    event.preventDefault();
    let paste = event.clipboardData.getData("text");
    let emails = paste.match(/[\w\d.-]+@[\w\d.-]+\.[\w\d.-]+/g);
    if (emails) {
      let newEmails = emails.filter((email) => isInList(recipients, email));
      let itemsToBeAdded = newEmails.map(function (val) {
        return { email: val };
      });
      setRecipients([...recipients, ...itemsToBeAdded]);
    }
  };
  const handleOnFocus = (event) => {
    setShowTotalsComponent(false);
  };
  const handleOnBlur = (event) => {
    setShowTotalsComponent(recipients.length > 2);
  };
  const handleDelete = (event, emailToRemove) => {
    event.stopPropagation();
    let newRecipientsList = recipients.filter(function (c) {
      return c.email !== emailToRemove;
    });
    setRecipients(newRecipientsList);
  };
  const handleOnErrorClose = () => {
    setEmailToValue("");
    setErrors("");
  };
  const addItemToList = () => {
    let email = emailToValue.trim();
    if (email && isValid(email)) {
      setRecipients([...recipients, { email: email }]);
    }
  };
  const isValid = (email) => {
    let error = null;
    if (!isInList(recipients, email)) {
      error = `${email} has already been added.`;
    }

    if (!isEmail(email)) {
      error = `${email} is not a valid email address.`;
    }

    if (error) {
      setErrors(error);
      return false;
    }
    setErrors("");
    return true;
  };

  const isInList = (recipients, email) => {
    let emailToBeAdded = recipients.filter(
      (recipient) => recipient.email === email
    );
    return emailToBeAdded.length === 0;
  };
  const isEmail = (email) => {
    return /[\w\d.-]+@[\w\d.-]+\.[\w\d.-]+/.test(email);
  };
  return (
    <div className="App">
      <header className="App-header">Email Input </header>

      <main className="compose-email rounded-top">
        <div style={{ display: "flex" }}>
          <ul>
            <li>type valid email address and press 'Tab' or 'Enter' </li>
            <li>
              type invalid or existing email address and press 'Tab' or 'Enter'
              to see error{" "}
            </li>
            <li>
              copy and paste email addresses to see results e.g cc@cc.com;
              123@hotmail.com; gg@gmail.com{" "}
            </li>
          </ul>
        </div>
        <div className="d-flex flex-column py-1">
          <div className="d-flex flex-row">
            <EmailRecipientInput
              label={"To:"}
              placeholder={"add email"}
              inputId={"emailTo"}
              value={emailToValue}
              showTotalsComponent={showTotalsComponent}
              recipientList={recipients}
              handleChange={(e) => handleChange(e)}
              handleKeyDown={(e) => handleKeyDown(e)}
              handlePaste={(e) => handlePaste(e)}
              handleOnFocus={(e) => handleOnFocus(e)}
              handleOnBlur={(e) => handleOnBlur(e)}
              handleDelete={handleDelete}
            />
          </div>
        </div>
        <div class="d-flex flex-row">
          <div class="d-flex border-bottom recipient-input-wrapper ">
            <div class="pl-1 email-label mr-2">Subject:</div>
            <input
              id="emailSubject"
              name="subject"
              type="text"
              placeholder=""
              className="form-control pl-2 border-0"
            />
          </div>
        </div>

        {errors && (
          <div className="mt-3 mx-4 p-1">
            <div className="d-flex alert alert-danger mb-1  alert-dismissible ">
              <span>
                <strong>Error!!</strong> {errors}
              </span>
              <button
                type="button"
                className="close"
                data-dismiss="alert"
                aria-label="Close"
                onClick={() => handleOnErrorClose()}
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;

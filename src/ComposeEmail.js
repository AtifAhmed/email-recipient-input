// import React, { useEffect, useState } from 'react';
// import EmailRecipientInput from './EmailRecipientInput';
// import HeaderWindowActions from './HeaderWindowActions';
// import EmailEditor from './EmailEditor';
// import { saveApplicationEmail } from 'api/emailApi';
// import { getEmailTemplate } from 'api/emailApi';
// import EmailRecipientType from 'enums/EmailRecipientType';
// import emailType from 'enums/emailType';
// import PropTypes from 'prop-types';
// import { withBreakpoints } from 'react-breakpoints';
// import TextareaAutosize from 'react-autosize-textarea';
// import { ReactComponent as IconInfo } from 'assets/images/info-alt.svg';

// const ComposeEmail = ({
//   recipientDetails,
//   emailTemplate,
//   emailComponentDisplayState,
//   fullScreen,
//   emailSentMessage,
//   breakpoints,
//   currentBreakpoint,
// }) => {
//   let defaultState = { value: '', recipients: [], showTotalsComponent: false };
//   const [_emailsTo, setEmailsTo] = useState({ id: 'emailTo', ...defaultState });
//   const [_emailsCc, setEmailsCc] = useState({ id: 'emailCc', ...defaultState });
//   const [_emailsBcc, setEmailsBcc] = useState({ id: 'emailBcc', ...defaultState });
//   const [_emailSubject, setemailSubject] = useState('');
//   const [_editorData, setEditorData] = useState({ date: '' });
//   const [_isEmailTemplateLoaded, setIsEmailTemplateLoaded] = useState(false);
//   const [_errors, setErrors] = useState('');

//   const [_showCc, setShowCc] = useState(false);
//   const [_showBcc, setShowBcc] = useState(false);
//   const [_showSubjectTextArea, setShowSubjectTextArea] = useState(false);
//   const [_currentSendType, setCurrentSendType] = useState('');
//   const [_recipientInfo, setRecipientInfo] = useState({ name: '', email: '', sendType: '' });
//   const [_inputToDisplay, setInputToDisplay] = useState('');
//   useEffect(() => {
//     if (typeof recipientDetails !== 'undefined' && recipientDetails !== '') {
//       let objEmail = getSendTypeState(EmailRecipientType.To);
//       let newitems = recipientDetails.filter((ar) => !objEmail.sendType.recipients.find((rm) => rm.email === ar.email));
//       objEmail.setStateFunc({
//         id: 'emailTo',
//         value: '',
//         recipients: [...objEmail.sendType.recipients, ...newitems],
//         showTotalsComponent: objEmail.sendType.recipients.length + newitems.length > 2 ? true : false,
//       });
//     } // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [recipientDetails]);

//   useEffect(() => {

//     let isSubscribed = true;
//     getEmailTemplate(emailTemplate.jobId, emailTemplate.emailType)
//       .then((response) => (isSubscribed ? handleEmailTemplateResponse(response) : null))
//       .catch((error) => error.toString())
//       .then(function () {
//         setIsEmailTemplateLoaded(true);
//       });
//     return () => {
//       isSubscribed = false;

//     };
//     function handleEmailTemplateResponse(response) {
//       setemailSubject(response.data.result.subject);
//       setEditorData({ data: response.data.result.content });
//     }

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const addItemToList = (emailList, setEmailListMethod) => {
//     if (!emailList.value) return;
//     let email = emailList.value.trim();
//     if (email && isValid(emailList.recipients, email)) {
//       setEmailListMethod({
//         id: emailList.id,
//         value: '',
//         recipients: [...emailList.recipients, { name: email, email: email }],
//         showTotalsComponent: emailList.showTotalsComponent,
//       });
//     }
//   };

//   const handleChange = (event) => {
//     let objEmail = getSendTypeState(_currentSendType);
//     objEmail.setStateFunc({ ...objEmail.sendType, value: event.target.value });
//     if (event.target.value === '' && _errors !== '') {
//       setErrors('');
//     }
//   };

//   const handleKeyDown = (event) => {
//     if (['Enter', 'Tab', ','].includes(event.key)) {
//       event.preventDefault();
//       let objEmail = getSendTypeState(_currentSendType);
//       addItemToList(objEmail.sendType, objEmail.setStateFunc);
//     }
//   };

//   const handleOnBlur = () => {
//     let objEmail = getSendTypeState(_currentSendType);
//     addItemToList(objEmail.sendType, objEmail.setStateFunc);
//     if (_inputToDisplay === '' && objEmail.sendType.recipients.length > 2) {
//       objEmail.setStateFunc({ ...objEmail.sendType, showTotalsComponent: true });
//     }
//     if (_errors === '') {
//       document.getElementById(objEmail.sendType.id).classList.add('d-none');
//     }
//   };

//   const handleDelete = (event, sendType, emailToRemove) => {
//     event.stopPropagation();
//     let objEmail = getSendTypeState(sendType);
//     let newRecipientsList = objEmail.sendType.recipients.filter(function (c) {
//       return c.email !== emailToRemove;
//     });
//     objEmail.setStateFunc({
//       ...objEmail.sendType,
//       recipients: newRecipientsList,
//       showTotalsComponent: newRecipientsList.count > 2 ? objEmail.sendType.showTotalsComponent : false,
//     });
//     setInputFocus(objEmail.sendType.id);
//   };
//   const handleDeleteRecipientInfo = (event, sendType, emailToRemove) => {
//     setRecipientInfo({ name: '', email: '', sendType: '' });
//     handleDelete(event, sendType, emailToRemove);
//   };
//   const handleOnFocus = (event, sendType) => {
//     let objEmail = getSendTypeState(sendType);
//     setCurrentSendType(sendType);

//     objEmail.setStateFunc({ ...objEmail.sendType, showTotalsComponent: false });
//     //keep this line uncommented and dont remove from code
//     //document.getElementById(objEmail.sendType.id).classList.remove('d-none');
//     setInputFocus(objEmail.sendType.id);
//     if (breakpoints[currentBreakpoint] < breakpoints.tablet) {
//       document.getElementById(objEmail.sendType.id).closest('.recipient-input-wrapper').classList.add('selected');
//       setInputToDisplay(objEmail.sendType.id);
//     }
//   };
//   const handleOnFocusSubject = (event) => {

//   };
//   const handlePaste = (event) => {
//     event.preventDefault();
//     let paste = event.clipboardData.getData('text');
//     let emails = paste.match(/[\w\d.-]+@[\w\d.-]+\.[\w\d.-]+/g);
//     if (emails) {
//       let objEmail = getSendTypeState(_currentSendType);
//       let newEmails = emails.filter((email) => isInList(objEmail.sendType.recipients, email));
//       let itemsToBeAdded = newEmails.map(function (entry) {
//         return { name: entry, email: entry };
//       });
//       objEmail.setStateFunc({ ...objEmail.sendType, recipients: [...objEmail.sendType.recipients, ...itemsToBeAdded] });
//     }
//   };

//   const setInputFocus = (id) => {
//     document.getElementById(id).focus();
//   };

//   const handleOnChipSelected = (e, name, email, sendType) => {
//     if (e.target.classList.contains('clicked')) {
//       e.target.classList.remove('clicked');
//       setRecipientInfo({ name: '', email: '', sendType: '' });
//       return;
//     }
//     let elements = document.getElementsByClassName('chip-value clicked');
//     while (elements.length > 0) {
//       elements[0].classList.remove('clicked');
//     }
//     e.target.classList.add('clicked');
//     setRecipientInfo({ name: name, email: email, sendType: sendType });
//   };
//   const handleOnClickCloseMobileInput = () => {
//     if (_inputToDisplay === 'emailSubject') {
//       setInputToDisplay('');
//       setShowSubjectTextArea(false);
//       return;
//     }
//     let elements = document.getElementsByClassName('recipient-input-wrapper selected');
//     while (elements.length > 0) {
//       elements[0].classList.remove('selected');
//     }
//     setInputToDisplay('');
//     let objEmail = getSendTypeState(_currentSendType);
//     if (objEmail.sendType.recipients.length > 2) {
//       objEmail.setStateFunc({ ...objEmail.sendType, showTotalsComponent: true });
//     }
//     setRecipientInfo({ name: '', email: '', sendType: '' });
//     document.getElementById(objEmail.sendType.id).classList.add('d-none');
//   };
//   const handleOnErrorClose = () => {
//     let objEmail = getSendTypeState(_currentSendType);
//     objEmail.sendType.value = '';
//     setErrors('');
//   };
//   const isValid = (recipients, email) => {
//     let error = null;
//     if (!isInList(recipients, email)) {
//       error = `${email} has already been added.`;
//     }

//     if (!isEmail(email)) {
//       error = `${email} is not a valid email address.`;
//     }

//     if (error) {
//       setErrors(error);
//       return false;
//     }
//     setErrors('');
//     return true;
//   };

//   const isInList = (recipients, email) => {
//     let emailToBeAdded = recipients.filter((recipient) => recipient.email === email);
//     return emailToBeAdded.length === 0;
//   };
//   const getSendTypeState = (emailSendType) => {
//     let state = '';
//     switch (parseInt(emailSendType)) {
//       case EmailRecipientType.Cc:
//         state = { sendType: _emailsCc, setStateFunc: setEmailsCc };
//         break;
//       case EmailRecipientType.Bcc:
//         state = { sendType: _emailsBcc, setStateFunc: setEmailsBcc };
//         break;
//       default:
//         state = { sendType: _emailsTo, setStateFunc: setEmailsTo };
//     }
//     return state;
//   };

//   const isEmail = (email) => {
//     return /[\w\d.-]+@[\w\d.-]+\.[\w\d.-]+/.test(email);
//   };

//   const handleSubjectChange = (event) => {
//     setemailSubject(event.target.value);
//   };

//   const sendEmail = () => {
//     const emailsToApplicationIds = _emailsTo.recipients.map((a) => a.applicationId);
//     saveApplicationEmail('sender@gmail.com', emailsToApplicationIds, _emailSubject, _editorData, emailType.rejectionEmail)
//       .then((response) => {
//         setemailSubject('');
//         if (response.data.result) {
//           setErrors('');
//           emailSentMessage();
//         } else {
//           setErrors('Email did not send');
//         }
//       })
//       .catch((error) => {
//         if (error.response.data.error.validationErrors != null) {
//           setErrors(error.response.data.error.validationErrors[0].message);
//         } else {
//           setErrors(error.response.data.error.message);
//         }
//       });
//   };

//   return (
//     <>
//       <main className="compose-email rounded-top">
//         <HeaderWindowActions emailComponentDisplayState={emailComponentDisplayState} fullScreen={fullScreen} />
//         <div className="compose-email-input-wrapper d-flex flex-column py-1">
//           <div className="d-flex flex-row">
//             {(_inputToDisplay === '' || _inputToDisplay === _emailsTo.id) && (
//               <EmailRecipientInput
//                 label={'To:'}
//                 placeholder={''}
//                 inputId={_emailsTo.id}
//                 value={_emailsTo.value}
//                 showTotalsComponent={_emailsTo.showTotalsComponent}
//                 sendType={EmailRecipientType.To}
//                 inputToDisplay={_inputToDisplay}
//                 recipientList={_emailsTo.recipients}
//                 handleChange={(e) => handleChange(e)}
//                 handleKeyDown={(e) => handleKeyDown(e)}
//                 handlePaste={(e) => handlePaste(e)}
//                 handleOnFocus={(e) => handleOnFocus(e, EmailRecipientType.To)}
//                 handleOnBlur={(e) => handleOnBlur(e)}
//                 handleDelete={handleDelete}
//                 handleOnChipSelected={handleOnChipSelected}
//               />
//             )}
//             {/* {!_showCc && _inputToDisplay === '' && (
//               <div className="px-1 send-type-title border-bottom ">
//                 <button type="button" className="btn btn-link  pr-0" onClick={() => setShowCc(true)}>
//                   Cc
//                 </button>
//               </div>
//             )}
//             {!_showBcc && _inputToDisplay === '' && (
//               <div className="px-1  send-type-title border-bottom">
//                 <button type="button" className="btn btn-link pr-0" onClick={() => setShowBcc(true)}>
//                   Bcc
//                 </button>
//               </div>
//             )} */}
//           </div>
//           {_showCc && (_inputToDisplay === '' || _inputToDisplay === _emailsCc.id) && (
//             <EmailRecipientInput
//               label={'Cc:'}
//               placeholder={''}
//               inputId={_emailsCc.id}
//               value={_emailsCc.value}
//               showTotalsComponent={_emailsCc.showTotalsComponent}
//               sendType={EmailRecipientType.Cc}
//               inputToDisplay={_inputToDisplay}
//               recipientList={_emailsCc.recipients}
//               handleChange={(e) => handleChange(e)}
//               handleKeyDown={(e) => handleKeyDown(e)}
//               handlePaste={(e) => handlePaste(e)}
//               handleOnFocus={(e) => handleOnFocus(e, EmailRecipientType.Cc)}
//               handleOnBlur={(e) => handleOnBlur(e)}
//               handleDelete={handleDelete}
//               handleOnChipSelected={handleOnChipSelected}
//             />
//           )}
//           {_showBcc && (_inputToDisplay === '' || _inputToDisplay === _emailsBcc.id) && (
//             <EmailRecipientInput
//               label={'Bcc:'}
//               placeholder={''}
//               inputId={_emailsBcc.id}
//               value={_emailsBcc.value}
//               showTotalsComponent={_emailsBcc.showTotalsComponent}
//               sendType={EmailRecipientType.Bcc}
//               inputToDisplay={_inputToDisplay}
//               recipientList={_emailsBcc.recipients}
//               handleChange={(e) => handleChange(e)}
//               handleKeyDown={(e) => handleKeyDown(e)}
//               handlePaste={(e) => handlePaste(e)}
//               handleOnFocus={(e) => handleOnFocus(e, EmailRecipientType.Bcc)}
//               handleOnBlur={(e) => handleOnBlur(e)}
//               handleDelete={handleDelete}
//               handleOnChipSelected={handleOnChipSelected}
//             />
//           )}
//           {_recipientInfo.email && (
//             <div className="recipient-info chips border aaaatif">
//               <span className="chip" key={_recipientInfo.email}>
//                 <span className="chip-value">{_recipientInfo.name}</span>
//                 <button
//                   type="button"
//                   className="chip-delete-button"
//                   onClick={(e) => handleDeleteRecipientInfo(e, _recipientInfo.sendType, _recipientInfo.email)}
//                 >
//                   &times;
//                 </button>
//               </span>
//             </div>
//           )}
//           {(_inputToDisplay === '' || _inputToDisplay === 'emailSubject') && (
//             <div className="border-bottom email-subject-wrapper">
//               {(breakpoints[currentBreakpoint] >= breakpoints.tablet || _inputToDisplay !== '') && (
//                 <div className="pl-1 send-type-title">Subject:</div>
//               )}
//               <div className="d-flex flex-grow-1 ">
//                 {!_showSubjectTextArea && (
//                   <input
//                     id="emailSubject"
//                     name="subject"
//                     type="text"
//                     placeholder="Subject:"
//                     className="email-subject form-control"
//                     onChange={handleSubjectChange}
//                     value={_emailSubject}
//                     onClick={handleOnFocusSubject}
//                   />
//                 )}
//                 {_showSubjectTextArea && (
//                   <TextareaAutosize
//                     rows={8}
//                     id="emailSubject"
//                     className="email-subject-text-area chips-input text-area position-relative"
//                     placeholder=""
//                     value={_emailSubject}
//                     onChange={handleSubjectChange}
//                   />
//                 )}
//               </div>
//             </div>
//           )}
//           {_inputToDisplay === '' && (
//             <div className="editor-main">{_isEmailTemplateLoaded && <EmailEditor editorData={_editorData} setEditorData={setEditorData} />}</div>
//           )}
//         </div>
//         {_errors && (
//           <div className="mt-3 mx-4 p-1">
//             <div className="d-flex alert alert-danger mb-1  alert-dismissible ">
//               <IconInfo className="icon icon-info-alt mr-3" />
//               <span>
//                 <strong>Error!!</strong> {_errors}
//               </span>
//               <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => handleOnErrorClose()}>
//                 <span aria-hidden="true">×</span>
//               </button>
//             </div>
//           </div>
//         )}
//         {_inputToDisplay === '' && (
//           <div className="d-flex justify-content-end mb-3 border-top">
//             <button autoFocus type="button" className="btn btn-primary mt-3 mr-6" onClick={sendEmail}>
//               <span>Send</span>
//             </button>
//           </div>
//         )}
//         {breakpoints[currentBreakpoint] < breakpoints.tablet && _inputToDisplay !== '' && _errors === '' && (
//           <div className="d-flex justify-content-end px-4 py-2">
//             <button type="button" className="btn btn-ats-grey" onClick={handleOnClickCloseMobileInput}>
//               Done
//             </button>
//           </div>
//         )}
//       </main>
//     </>
//   );
// };

// export default withBreakpoints(ComposeEmail);

// ComposeEmail.propTypes = {
//   recipientDetails: PropTypes.array.isRequired,
//   emailTemplate: PropTypes.shape({
//     jobId: PropTypes.number.isRequired,
//     emailType: PropTypes.number.isRequired,
//   }),
//   emailComponentDisplayState: PropTypes.shape({
//     isEmailMinimized: PropTypes.bool.isRequired,
//     hideEmailComponent: PropTypes.func.isRequired,
//     setIsEmailMinimized: PropTypes.func.isRequired,
//   }),
//   fullScreen: PropTypes.shape({
//     isFullScreen: PropTypes.bool.isRequired,
//     setFullScreenState: PropTypes.func.isRequired,
//   }),
//   emailSentMessage: PropTypes.func.isRequired,
// };

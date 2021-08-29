import React from "react";

function PopupWithForm({
  title,
  name,
  isOpen,
  buttonText,
  onClose,
  children,
  containerName,
  titleName,
  btnName,
  onSubmit,
  buttonState,
}) {
  return (
    <div className={`popup ${isOpen ? "popup_opened" : ""}`}>
      <div className={`popup__container ${containerName ? containerName : ""}`}>
        <button className="popup__close" type="button" onClick={onClose}>
          &times;
        </button>
        <h2 className={`popup__title ${titleName ? titleName : ""}`}>
          {title}
        </h2>
        <form
          className="popup__form popup__form_profile"
          name={`popup-form-${name}`}
          onSubmit={onSubmit}
          noValidate
        >
          {children}
          <button
            className={`popup__btn ${btnName ? btnName : ""} ${
              !buttonState ? "popup__btn_inactive" : ""
            }`}
            type="submit"
            disabled={!buttonState ? true : ""}
          >
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PopupWithForm;

import React from "react";

function InfoToolTip({ isOpen, isSuccess, onClose }) {
  return (
    <div className={`popup ${isOpen ? "popup_opened" : ""}`}>
      <div className="popup__container">
        <div
          className={`popup__tooltip-image ${
            !isSuccess ? "popup__tooltip-image_unsuccess" : ""
          }`}
        ></div>
        <h2 className={`popup__tooltip_title`}>
          {!isSuccess
            ? "Что-то пошло не так! Попробуйте еще раз."
            : "Вы успешно зарегистрировались!"}
        </h2>
        <button
          className="btn-close btn-close_tooltip"
          type="button"
          onClick={onClose}
        ></button>
      </div>
    </div>
  );
}

export default InfoToolTip;

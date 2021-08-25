import React from "react";

function ImagePopup({ card, onClose }) {
  return (
    <div className={`popup-image popup ${card.link ? "popup_opened" : ""}`}>
      <div className="popup-image__block">
        <button className="popup__close" type="button" onClick={onClose}>
          &times;
        </button>
        <img src={card.link} alt={card.name} className="popup-image__photo" />
        <h2 className="popup-image__descr">{card.name}</h2>
      </div>
    </div>
  );
}

export default ImagePopup;

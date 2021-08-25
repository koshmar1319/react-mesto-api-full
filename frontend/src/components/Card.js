import React from "react";
import likePath from "../images/like.svg";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Card({ card, onCardClick, onCardLike, onCardDelete }) {
  const currentUser = React.useContext(CurrentUserContext);

  const isOwn = card.owner._id === currentUser._id;
  const cardDeleteButtonClassName = `element__delete ${
    isOwn ? "" : "element__delete_inactive"
  }`;

  const isLiked = card.likes.some((i) => i._id === currentUser._id);
  const cardLikeButtonClassName = `element__link ${
    isLiked ? "element__link_active" : ""
  }`;

  function handleClick() {
    onCardClick(card);
  }

  function handleLikeClick() {
    onCardLike(card);
  }

  function handleDeleteClick() {
    onCardDelete(card);
  }

  return (
    <div className="element">
      <img
        src={`${card.link}`}
        onClick={handleClick}
        alt={card.name}
        className="element__image"
      />
      <button
        className={cardDeleteButtonClassName}
        onClick={handleDeleteClick}
        type="button"
      ></button>
      <div className="element__block">
        <h2 className="element__title">{card.name}</h2>
        <div className="element__box">
          <button
            className={cardLikeButtonClassName}
            onClick={handleLikeClick}
            type="button"
          >
            <img
              src={likePath}
              alt="Изображение сердца"
              className="element__icon"
            />
          </button>
          <div className="element__count">{card.likes.length}</div>
        </div>
      </div>
    </div>
  );
}

export default Card;

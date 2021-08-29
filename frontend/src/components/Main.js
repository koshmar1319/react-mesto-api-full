import React from "react";
import editImagePath from "../images/edit.png";
import plusImagePath from "../images/plus.png";
import Card from "./Card";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Main({
  onEditProfile,
  onAddPlace,
  onEditAvatar,
  onCardClick,
  cards,
  onCardLike,
  onCardDelete,
  card,
}) {
  const currentUser = React.useContext(CurrentUserContext);

  return (
    <main className="content">
      <section className="profile">
        <div className="profile__block">
          <button
            className="profile__button profile__button_avatar"
            type="button"
            onClick={onEditAvatar}
          >
            <img
              src={currentUser.avatar}
              alt="Изображение пользователя"
              className="profile__avatar"
            />
          </button>
          <div className="profile__info">
            <div className="profile__author">
              <h1 className="profile__title">{currentUser.name}</h1>
              <button
                className="profile__button profile__button_edit"
                type="button"
                onClick={onEditProfile}
              >
                <img
                  src={editImagePath}
                  alt="Изображение карандаш"
                  className="profile__pencil"
                />
              </button>
            </div>
            <p className="profile__subtitle">{currentUser.about}</p>
          </div>
        </div>
        <button
          className="profile__button profile__button_plus"
          type="button"
          onClick={onAddPlace}
        >
          <img
            src={plusImagePath}
            alt="Изображение плюс"
            className="profile__plus"
          />
        </button>
      </section>

      <section className="elements">
        <ul className="elements__list">
          {cards.map((card) => {
            return (
              <Card
                key={card._id}
                card={card}
                onCardClick={onCardClick}
                onCardLike={onCardLike}
                onCardDelete={onCardDelete}
              />
            );
          })}
        </ul>
      </section>
    </main>
  );
}

export default Main;

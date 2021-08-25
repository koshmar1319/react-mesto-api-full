import React from "react";
import "../index.css";
import Header from "./Header";
import Login from "./Login";
import Register from "./Register";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import api from "../utils/api.js";
import auth from "../utils/auth";
import InfoToolTip from "./InfoToolTip";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import AffirmDeletePopup from "./AffirmDeletePopup";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState({});

  const [cards, setCards] = React.useState([]);
  const [selectedCard, setSelectedCard] = React.useState({});

  const [isAffirmDeletePopupOpen, setAffirmDeletePopupOpen] =
    React.useState(false);
  const [cardToDelete, setCardToDelete] = React.useState({});

  const [isSuccessInfoToolTip, setIsSuccessInfoToolTip] = React.useState(null);
  const [isInfoToolTipPopupOpen, setInfoToolTipPopupOpen] =
    React.useState(false);

  const [isLoading, setIsLoading] = React.useState(true);

  const [userEmail, setUserEmail] = React.useState("");
  const [userPassword, setUserPassword] = React.useState("");

  const [isLoggedIn, setIsLoggedIn] = React.useState(null);
  const history = useHistory();

  React.useEffect(() => {
    handleCheckToken();
    setIsSuccessInfoToolTip(false);
  }, []);

  React.useEffect(() => {
    Promise.all([api.getUserInfo(), api.getInitialCards()])
      .then(([userData, cards]) => {
        setCurrentUser(userData);
        setCards(cards);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function handleEditProfileClick() {
    setIsLoading(false);
    setEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsLoading(false);
    setAddPlacePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsLoading(false);
    setEditAvatarPopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api
      .changeLikeCardStatus(card, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardDelete(card) {
    setIsLoading(true);
    api
      .deleteCard(card)
      .then(() => {
        setCards(cards.filter((i) => i._id !== card._id));
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function affirmCardDelete(card) {
    setIsLoading(false);
    setCardToDelete(card);
    setAffirmDeletePopupOpen(true);
  }

  function handleUpdateUser(data) {
    setIsLoading(true);
    api
      .setUserInfo(data)
      .then((newCard) => {
        setCurrentUser({
          ...currentUser,
          name: newCard.name,
          about: newCard.about,
        });
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateAvatar({ avatar }) {
    setIsLoading(true);
    api
      .setUserAvatar(avatar)
      .then((updateUser) => {
        setCurrentUser({ ...currentUser, avatar: updateUser.avatar });
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleAddCard(card) {
    setIsLoading(true);
    api
      .addCard(card)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function closeInfoToolTipPopup() {
    closeAllPopups();
    if (isSuccessInfoToolTip) {
      handleLogin({ email: userEmail, password: userPassword });
    }
  }

  function closeAllPopups() {
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setEditAvatarPopupOpen(false);
    setAffirmDeletePopupOpen(false);
    setSelectedCard({});
    setCardToDelete({});
    setInfoToolTipPopupOpen(false);
  }

  React.useEffect(() => {
    function handleEscClose(evt) {
      if (evt.key === "Escape") {
        closeAllPopups();
      }
    }
    document.addEventListener("keydown", handleEscClose);
    return () => document.removeEventListener("keydown", handleEscClose);
  }, []);

  React.useEffect(() => {
    function closeOutsidePopup(evt) {
      if (
        evt.target.classList.contains("popup") ||
        evt.target.classList.contains("popup__close")
      ) {
        closeAllPopups();
      }
    }
    document.addEventListener("click", closeOutsidePopup);
    return () => document.removeEventListener("click", closeOutsidePopup);
  }, []);

  function handleRegister(data) {
    auth
      .register(data)
      .then((res) => {
        setUserEmail(res.data.email);
        setUserPassword(data.password);
        setIsSuccessInfoToolTip(true);
        setInfoToolTipPopupOpen(true);
      })
      .catch(() => {
        setIsSuccessInfoToolTip(false);
        setInfoToolTipPopupOpen(true);
      });
  }

  function handleLogin(data) {
    auth
      .login(data)
      .then((res) => {
        localStorage.setItem("jwt", res.token);
        handleCheckToken();
      })
      .catch(() => {
        setIsSuccessInfoToolTip(false);
        setInfoToolTipPopupOpen(true);
      });
  }

  function handleCheckToken() {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      auth
        .checkToken(jwt)
        .then((res) => {
          setUserEmail(res.data.email);
          setIsLoggedIn(true);
          setIsLoading(false);
          history.push("/");
        })
        .catch(() => {
          setIsSuccessInfoToolTip(false);
          setInfoToolTipPopupOpen(true);
        });
    } else {
      setIsLoading(false);
      return;
    }
  }

  function handleSignOut() {
    setIsLoggedIn(false);
    history.push("/sign-in");
    localStorage.removeItem("jwt");
    setUserEmail("");
    setUserPassword("");
    setIsSuccessInfoToolTip(null);
    setIsLoading(false);
  }

  return (
    <div className="container">
      <CurrentUserContext.Provider value={currentUser}>
        <Header
          isLoggedIn={isLoggedIn}
          userEmail={userEmail}
          onSignOut={handleSignOut}
          isLoading={isLoading}
        />
        <Switch>
          <ProtectedRoute
            exact
            path="/"
            component={Main}
            isLoggedIn={isLoggedIn}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            cards={cards}
            onCardLike={handleCardLike}
            onCardDelete={affirmCardDelete}
          />

          <Route path="/sign-up">
            <Register onRegister={handleRegister} />
          </Route>

          <Route path="/sign-in">
            <Login onLogin={handleLogin} isLoading={isLoading} />
          </Route>

          <Route>
            <Redirect to={!isLoggedIn ? "/sign-in" : "/"} />
          </Route>
        </Switch>

        <Footer isLoggedIn={isLoggedIn} />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          isLoading={isLoading}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddCard}
          isLoading={isLoading}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          isLoading={isLoading}
        />

        <AffirmDeletePopup
          isOpen={isAffirmDeletePopupOpen}
          onClose={closeAllPopups}
          onSubmitDelete={handleCardDelete}
          card={cardToDelete}
          isLoading={isLoading}
        />

        <ImagePopup card={selectedCard} onClose={closeAllPopups} />

        <InfoToolTip
          isOpen={isInfoToolTipPopupOpen}
          onClose={closeInfoToolTipPopup}
          isSuccess={isSuccessInfoToolTip}
        />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;

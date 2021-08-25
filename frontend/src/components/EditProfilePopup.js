import React from "react";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { useFormAndValidation } from "../utils/useFormAndValidation";

function EditProfilePopup({ isOpen, onClose, onUpdateUser, isLoading }) {
  const { values, handleChange, errors, isValid, resetForm } =
    useFormAndValidation();

  const currentUser = React.useContext(CurrentUserContext);

  React.useEffect(() => {
    resetForm(currentUser);
  }, [isOpen]);

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateUser({
      name: values.name,
      about: values.about,
    });
  }

  return (
    <PopupWithForm
      title="Редактировать профиль"
      name="profile"
      buttonText={isLoading ? "Сохранение . . ." : "Сохранить"}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      buttonState={isValid}
    >
      <div className="popup__area">
        <input
          className={`popup__input popup__input_type_name`}
          type="text"
          name="name"
          placeholder="Имя"
          minLength="2"
          maxLength="40"
          value={values.name || ""}
          onChange={handleChange}
          required
        />
        <span
          className={`popup__input-error ${
            errors.name ? "popup__input-error_active" : ""
          }`}
        >
          {errors.name}
        </span>
      </div>
      <div className="popup__area">
        <input
          className="popup__input popup__input_type_job"
          type="text"
          name="about"
          placeholder="О себе"
          minLength="2"
          maxLength="200"
          value={values.about || ""}
          onChange={handleChange}
          required
        />
        <span
          className={`popup__input-error ${
            errors.about ? "popup__input-error_active" : ""
          }`}
        >
          {errors.about}
        </span>
      </div>
    </PopupWithForm>
  );
}

export default EditProfilePopup;

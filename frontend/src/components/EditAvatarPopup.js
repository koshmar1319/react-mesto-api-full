import React from "react";
import PopupWithForm from "./PopupWithForm";
import { useFormAndValidation } from "../utils/useFormAndValidation";

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar, isLoading }) {
  const { values, handleChange, errors, isValid, resetForm } =
    useFormAndValidation();

  React.useEffect(() => {
    resetForm({ link: "" });
  }, [isOpen]);

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateAvatar({ avatar: values.link });
  }

  return (
    <PopupWithForm
      containerName="popup-upd__container"
      titleName="popup-upd__title"
      btnName="popup-upd__btn"
      title="Обновить аватар"
      name="update"
      buttonText={isLoading ? "Сохранение . . ." : "Сохранить"}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      buttonState={isValid}
    >
      <div className="popup__area">
        <input
          className="popup-upd__input popup__input"
          type="url"
          name="link"
          placeholder="Ссылка на аватар"
          value={values.link || ""}
          onChange={handleChange}
          required
        />
        <span
          className={`popup__input-error popup-upd__input-error ${
            errors.link ? "popup__input-error_active" : ""
          }`}
          id="popup-upd-error"
        >
          {errors.link}
        </span>
      </div>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;

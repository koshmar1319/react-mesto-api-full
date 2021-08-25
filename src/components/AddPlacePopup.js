import React from "react";
import PopupWithForm from "./PopupWithForm";
import { useFormAndValidation } from "../utils/useFormAndValidation";

function AddPlacePopup({ isOpen, onClose, onAddPlace, isLoading }) {
  const { values, handleChange, errors, isValid, resetForm } =
    useFormAndValidation();

  React.useEffect(() => {
    resetForm({ title: "", link: "" });
  }, [isOpen]);

  function handleAddPlaceSubmit(e) {
    e.preventDefault();
    onAddPlace({ name: values.title, link: values.link });
  }

  return (
    <PopupWithForm
      title="Новое место"
      name="card"
      buttonText={isLoading ? "Создание . . ." : "Создать"}
      onSubmit={handleAddPlaceSubmit}
      isOpen={isOpen}
      onClose={onClose}
      buttonState={isValid}
    >
      <div className="popup__area">
        <input
          className="popup__input popup__input_type_place"
          type="text"
          name="title"
          placeholder="Название"
          minLength="2"
          maxLength="30"
          value={values.title || ""}
          onChange={handleChange}
          onClose={onClose}
          required
        />
        <span
          className={`popup__input-error ${
            errors.title ? "popup__input-error_active" : ""
          }`}
        >
          {errors.title}
        </span>
      </div>
      <div className="popup__area">
        <input
          className="popup__input popup__input_type_link"
          type="url"
          name="link"
          placeholder="Ссылка на картинку"
          value={values.link || ""}
          onChange={handleChange}
          onClose={onClose}
          required
        />
        <span
          className={`popup__input-error ${
            errors.link ? "popup__input-error_active" : ""
          }`}
        >
          {errors.link}
        </span>
      </div>
    </PopupWithForm>
  );
}

export default AddPlacePopup;

const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    match: /^((https?):\/\/)(www.)?.([\da-z.-]{2,})([/\w.-]*)*\/?$/gmi,
    validate: {
      validator(avatar) {
        return validator.isURL(avatar, { require_protocol: true });
      },
      message: 'Введите корректный адрес ссылки на аватар',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: 'Введите корректный адрес электронной почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
}, { versionKey: false });

// function deleteVisiblePassword() {
//   const obj = this.toObject();
//   delete obj.password;
//   return obj;
// }

// userSchema.methods.toJSON = deleteVisiblePassword;

module.exports = mongoose.model('user', userSchema);

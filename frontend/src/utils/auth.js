import { authSettings } from "./utils";

class Auth {
  constructor({ baseUrl }) {
    this._baseUrl = baseUrl;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(`Ошибка ${res.status}`);
    }
  }

  register({ email, password }) {
    return fetch(`${this._baseUrl}/signup`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password, email }),
    }).then(this._checkResponse);
  }

  login({ email, password }) {
    return fetch(`${this._baseUrl}/signin`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password, email }),
    }).then(this._checkResponse);
  }

  signOut(email) {
    return fetch(`${this.baseUrl}/users/signout`, {
      method: "GET",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "email": email
      }),
    }).then(this._checkResponse);
  }

  checkToken() {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(this._checkResponse);
  }
}

const auth = new Auth(authSettings);
export default auth;

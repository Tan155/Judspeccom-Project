export class User {
  constructor({ username, email, password }) {
    this.username = username;
    this.email = email;
    this.password = password;
  }
}

export class UserFactory {
  static createUser(userData) {
    return new User(userData);
  }
}

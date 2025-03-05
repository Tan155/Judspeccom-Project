class User {
  constructor({ username, email, password }) {
    this.username = username;
    this.email = email;
    this.password = password;
  }
}

class UserFactory {
  createUser(userData) {
    return new User(userData);
  }
}

const userFactory = new UserFactory();
export default userFactory;

export class UserInexistError extends Error {
  constructor() {
    super("User inexist! CPF invalid");
  }
}

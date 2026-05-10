import { AppError } from "./app-error";

export default class Unauthorized extends AppError {
  constructor(message = "User not authenticated.") {
    super(message, 401, "UNAUTHORIZED");
  }
}

import { AppError } from "./app-error";

export default class NotFound extends AppError {
  constructor(message = "Resource not found.") {
    super(message, 404, "NOT_FOUND");
  }
}

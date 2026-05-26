export type CreateTaskFormErrors = {
  title?: { errors: string[] };
  description?: { errors: string[] };
  dueDate?: { errors: string[] };
  severity?: { errors: string[] };
};

export type CreateTaskFormState = {
  success: boolean;
  message: string;
  errors?: CreateTaskFormErrors;
  errorCode?: string;
};

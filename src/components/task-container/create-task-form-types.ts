export type CreateTaskFormErrors = {
  taskId?: { errors: string[] };
  title?: { errors: string[] };
  description?: { errors: string[] };
  dueDate?: { errors: string[] };
  severity?: { errors: string[] };
  tags?: { errors: string[] };
};

export type CreateTaskFormState = {
  success: boolean;
  message: string;
  errors?: CreateTaskFormErrors;
  errorCode?: string;
};

export const initialTaskFormState: CreateTaskFormState = {
  success: false,
  message: "",
};

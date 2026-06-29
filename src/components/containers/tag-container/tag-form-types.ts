export type TagFormErrors = {
  tagId?: { errors: string[] };
  title?: { errors: string[] };
  color?: { errors: string[] };
  description?: { errors: string[] };
};

export type TagFormState = {
  success: boolean;
  message: string;
  errors?: TagFormErrors;
  errorCode?: string;
};

export const initialTagFormState: TagFormState = {
  success: false,
  message: "",
};

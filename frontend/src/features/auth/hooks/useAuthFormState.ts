import { useState, type ChangeEvent } from "react";

export type AuthFormErrors<TValues> = Partial<Record<keyof TValues, string>>;
export type AuthSubmitStatus = "idle" | "success" | "error";

export const useAuthFormState = <
  TValues extends Record<keyof TValues, string>,
>(
  initialValues: TValues
) => {
  const [values, setValues] = useState<TValues>(initialValues);
  const [errors, setErrors] = useState<AuthFormErrors<TValues>>({});
  const [status, setStatus] = useState<AuthSubmitStatus>("idle");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const fieldName = event.target.name as keyof TValues;

    setValues(
      (currentValues) =>
        ({
          ...currentValues,
          [fieldName]: event.target.value,
        }) as TValues
    );
    setErrors((currentErrors) => ({
      ...currentErrors,
      [fieldName]: undefined,
    }));

    if (feedback) {
      setFeedback(null);
      setStatus("idle");
    }
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    errors,
    status,
    feedback,
    isSubmitting,
    setErrors,
    setStatus,
    setFeedback,
    setIsSubmitting,
    handleChange,
    resetForm,
  };
};

import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { registerUser } from "./api";
import AuthTextField from "./AuthTextField";
import type { RegisterFormValues } from "./types";

type RegisterFormErrors = Partial<Record<keyof RegisterFormValues, string>>;
type SubmitStatus = "idle" | "success" | "error";

const initialValues: RegisterFormValues = {
  email: "",
  password: "",
  confirmPassword: "",
};

const validateRegisterForm = (
  values: RegisterFormValues,
): RegisterFormErrors => {
  const errors: RegisterFormErrors = {};
  const email = values.email.trim();

  if (!email) {
    errors.email = "Renseignez votre adresse email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Adresse email invalide.";
  }

  if (!values.password) {
    errors.password = "Choisissez un mot de passe.";
  } else if (values.password.length < 8) {
    errors.password = "Le mot de passe doit contenir au moins 8 caractères.";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Confirmez votre mot de passe.";
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Les mots de passe ne correspondent pas.";
  }

  return errors;
};

const getSuccessMessage = (message: string) => {
  return message === "User created" ? "Votre compte a été créé." : message;
};

const RegisterForm = () => {
  const [values, setValues] = useState<RegisterFormValues>(initialValues);
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const fieldName = event.target.name as keyof RegisterFormValues;

    setValues((currentValues) => ({
      ...currentValues,
      [fieldName]: event.target.value,
    }));
    setErrors((currentErrors) => ({
      ...currentErrors,
      [fieldName]: undefined,
    }));

    if (feedback) {
      setFeedback(null);
      setStatus("idle");
    }
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateRegisterForm(values);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setStatus("error");
      setFeedback("Corrigez les champs indiqués pour continuer.");
      return;
    }

    setIsSubmitting(true);
    setStatus("idle");
    setFeedback(null);

    try {
      const response = await registerUser({
        email: values.email.trim(),
        password: values.password,
      });

      setValues(initialValues);
      setErrors({});
      setStatus("success");
      setFeedback(getSuccessMessage(response.message));
    } catch (error) {
      setStatus("error");
      setFeedback(
        error instanceof Error
          ? error.message
          : "Impossible de créer le compte pour le moment.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-5" noValidate onSubmit={handleSubmit}>
      <AuthTextField
        id="register-email"
        label="Adresse email"
        name="email"
        type="email"
        value={values.email}
        error={errors.email}
        placeholder="vous@example.com"
        autoComplete="email"
        onChange={handleChange}
      />

      <AuthTextField
        id="register-password"
        label="Mot de passe"
        name="password"
        type="password"
        value={values.password}
        error={errors.password}
        placeholder="8 caractères minimum"
        autoComplete="new-password"
        onChange={handleChange}
      />

      <AuthTextField
        id="register-confirm-password"
        label="Confirmation"
        name="confirmPassword"
        type="password"
        value={values.confirmPassword}
        error={errors.confirmPassword}
        placeholder="Répétez votre mot de passe"
        autoComplete="new-password"
        onChange={handleChange}
      />

      {feedback ? (
        <p
          className={`rounded-md border px-3 py-2 text-sm ${
            status === "success"
              ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
              : "border-red-400/30 bg-red-400/10 text-red-200"
          }`}
          role={status === "success" ? "status" : "alert"}
        >
          {feedback}
        </p>
      ) : null}

      <button
        className="h-11 w-full rounded-md bg-emerald-400 px-4 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Création..." : "Créer mon compte"}
      </button>
    </form>
  );
};

export default RegisterForm;

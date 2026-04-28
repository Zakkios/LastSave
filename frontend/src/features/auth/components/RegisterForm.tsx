import type { SubmitEvent } from "react";
import { useNavigate } from "react-router";
import { registerUser } from "../api";
import AuthFormFeedback from "../AuthFormFeedback";
import AuthSubmitButton from "../AuthSubmitButton";
import AuthTextField from "../AuthTextField";
import type { RegisterFormValues } from "../types";
import {
  useAuthFormState,
  type AuthFormErrors,
} from "../hooks/useAuthFormState";
import { isValidEmail } from "../validation";
import { getRegistrationSuccessFlash } from "../api/authFlash";

type RegisterFormErrors = AuthFormErrors<RegisterFormValues>;

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
  } else if (!isValidEmail(email)) {
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

const RegisterForm = () => {
  const navigate = useNavigate();
  const {
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
  } = useAuthFormState(initialValues);

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
      await registerUser({
        email: values.email.trim(),
        password: values.password,
      });

      resetForm();
      navigate("/login", {
        replace: true,
        state: {
          flash: getRegistrationSuccessFlash(),
        },
      });
    } catch (error) {
      setStatus("error");
      setFeedback(
        error instanceof Error
          ? error.message
          : "Impossible de créer le compte pour le moment.",
      );
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
        <AuthFormFeedback
          message={feedback}
          status={status === "success" ? "success" : "error"}
        />
      ) : null}

      <AuthSubmitButton
        isSubmitting={isSubmitting}
        submittingLabel="Création..."
      >
        Créer mon compte
      </AuthSubmitButton>
    </form>
  );
};

export default RegisterForm;

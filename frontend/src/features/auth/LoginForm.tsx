import type { SubmitEvent } from "react";
import { useLocation, useNavigate } from "react-router";
import { loginUser } from "./api";
import AuthFormFeedback from "./AuthFormFeedback";
import AuthSubmitButton from "./AuthSubmitButton";
import AuthTextField from "./AuthTextField";
import type { LoginFormValues } from "./types";
import { useAuth } from "./useAuth";
import { useAuthFormState, type AuthFormErrors } from "./useAuthFormState";
import { isValidEmail } from "./validation";

type LoginFormErrors = AuthFormErrors<LoginFormValues>;

const initialValues: LoginFormValues = {
  email: "",
  password: "",
};

const getRedirectPath = (state: unknown) => {
  if (!state || typeof state !== "object" || !("from" in state)) {
    return "/";
  }

  const from = (state as {
    from?: {
      hash?: unknown;
      pathname?: unknown;
      search?: unknown;
    };
  }).from;

  if (!from || typeof from.pathname !== "string") {
    return "/";
  }

  const search = typeof from.search === "string" ? from.search : "";
  const hash = typeof from.hash === "string" ? from.hash : "";

  return `${from.pathname}${search}${hash}`;
};

const validateLoginForm = (values: LoginFormValues): LoginFormErrors => {
  const errors: LoginFormErrors = {};
  const email = values.email.trim();

  if (!email) {
    errors.email = "Renseignez votre adresse email.";
  } else if (!isValidEmail(email)) {
    errors.email = "Adresse email invalide.";
  }

  if (!values.password) {
    errors.password = "Renseignez votre mot de passe.";
  }

  return errors;
};

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshUser } = useAuth();
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

    const validationErrors = validateLoginForm(values);

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
      await loginUser({
        email: values.email.trim(),
        password: values.password,
      });

      const currentUser = await refreshUser();

      if (!currentUser) {
        throw new Error("Connexion réussie, mais la session est introuvable.");
      }

      resetForm();
      setStatus("success");
      setFeedback("Connexion réussie.");
      navigate(getRedirectPath(location.state), { replace: true });
    } catch (error) {
      setStatus("error");
      setFeedback(
        error instanceof Error
          ? error.message
          : "Impossible de se connecter pour le moment."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-5" noValidate onSubmit={handleSubmit}>
      <AuthTextField
        id="login-email"
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
        id="login-password"
        label="Mot de passe"
        name="password"
        type="password"
        value={values.password}
        error={errors.password}
        placeholder="Votre mot de passe"
        autoComplete="current-password"
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
        submittingLabel="Connexion..."
      >
        Se connecter
      </AuthSubmitButton>
    </form>
  );
};

export default LoginForm;

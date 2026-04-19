type AuthFormFeedbackStatus = "success" | "error";

interface AuthFormFeedbackProps {
  message: string;
  status: AuthFormFeedbackStatus;
}

const AuthFormFeedback = ({ message, status }: AuthFormFeedbackProps) => {
  return (
    <p
      className={`rounded-md border px-3 py-2 text-sm ${
        status === "success"
          ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
          : "border-red-400/30 bg-red-400/10 text-red-200"
      }`}
      role={status === "success" ? "status" : "alert"}
    >
      {message}
    </p>
  );
};

export default AuthFormFeedback;

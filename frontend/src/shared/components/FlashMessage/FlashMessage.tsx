import variantClasses from "./flashMessage.styles";
import type { FlashMessageProps } from "./flashMessage.types";

const FlashMessage = ({
  message,
  variant = "info",
  onClose,
}: FlashMessageProps) => {
  if (!message) {
    return null;
  }

  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-md border px-4 py-3 my-3 text-sm ${variantClasses[variant]}`}
      role="alert"
    >
      <p>{message}</p>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-current opacity-70 hover:opacity-100"
          aria-label="Fermer le message"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default FlashMessage;

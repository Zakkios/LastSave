export type FlashMessageVariant = "success" | "error" | "warning" | "info";

export type FlashMessageProps = {
  message: string;
  variant?: FlashMessageVariant;
  onClose?: () => void;
};

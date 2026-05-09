import type { FlashMessageVariant } from "./flashMessage.types";

const variantClasses: Record<FlashMessageVariant, string> = {
  success: "border-green-700 bg-green-950/60 text-green-200",
  error: "border-red-700 bg-red-950/60 text-red-200",
  warning: "border-yellow-700 bg-yellow-950/60 text-yellow-200",
  info: "border-blue-700 bg-blue-950/60 text-blue-200",
};

export default variantClasses;

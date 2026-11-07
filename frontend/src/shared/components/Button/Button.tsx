import { getButtonClassName } from "./button.styles";
import type { ButtonProps } from "./button.types";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={getButtonClassName(variant, size, className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

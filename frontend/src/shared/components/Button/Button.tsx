import { sizeClasses, variantClasses } from "./button.styles";
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
      className={`
        inline-flex items-center justify-center rounded-md font-medium
        transition-colors disabled:cursor-not-allowed disabled:opacity-50
        cursor-pointer
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

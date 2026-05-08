import type { ButtonHTMLAttributes, ReactNode } from "react";
import Button from "../../shared/components/Button/Button";

interface AuthSubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isSubmitting: boolean;
  submittingLabel: string;
}

const AuthSubmitButton = ({
  children,
  isSubmitting,
  submittingLabel,
  ...props
}: AuthSubmitButtonProps) => {
  return (
    <>
      <Button
        variant="primary"
        size="sm"
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3"
        {...props}
      >
        {isSubmitting ? submittingLabel : children}
      </Button>
    </>
  );
};

export default AuthSubmitButton;

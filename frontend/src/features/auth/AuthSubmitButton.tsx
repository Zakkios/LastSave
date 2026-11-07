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
        className="h-11 w-full"
        {...props}
      >
        {isSubmitting ? submittingLabel : children}
      </Button>
    </>
  );
};

export default AuthSubmitButton;

import { Link } from "react-router";
import { getButtonClassName } from "./button.styles";
import type { ButtonLinkProps } from "./button.types";

// Lien avec l'apparence d'un bouton. Remplace <Link><Button /></Link> :
// un bouton dans un lien n'est pas du HTML valide (deux arrêts au clavier).
const ButtonLink = ({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonLinkProps) => {
  return (
    <Link className={getButtonClassName(variant, size, className)} {...props} />
  );
};

export default ButtonLink;

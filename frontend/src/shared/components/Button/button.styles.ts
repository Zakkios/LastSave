import type { ButtonSize, ButtonVariant } from "./button.types";

// Direction artistique : une seule couleur d'accent, l'indigo, pour les actions.
// Le vert est réservé au statut « Terminé » et aux messages de réussite, le rose
// aux suppressions. Les couleurs (et la couleur du contour au clavier) sont
// portées par chaque variante, pour ne jamais avoir deux classes en conflit.
const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:cursor-not-allowed disabled:opacity-50";

export const variantClasses: Record<ButtonVariant, string> = {
  // Action principale d'un écran : une seule de préférence.
  primary:
    "bg-indigo-600 font-semibold text-white hover:bg-indigo-500 focus-visible:ring-indigo-400",
  // Indigo léger : boutons d'en-tête de page (« Ajouter un manga », « Ajouter un jeu »).
  // Colorés sans peser autant qu'un primary, même à deux côte à côte.
  tonal:
    "border border-indigo-500/30 bg-indigo-500/10 font-medium text-indigo-300 hover:border-indigo-400/50 hover:bg-indigo-500/20 hover:text-indigo-200 focus-visible:ring-indigo-400",
  // Action secondaire, ou plusieurs actions de même importance.
  secondary:
    "border border-zinc-800 bg-zinc-900 text-zinc-200 hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-50 focus-visible:ring-indigo-400",
  // Comme secondary, mais rose au survol : quitter l'appli (se déconnecter).
  "secondary-danger":
    "border border-zinc-800 bg-zinc-900 text-zinc-200 hover:border-rose-900/60 hover:bg-rose-500/10 hover:text-rose-300 focus-visible:ring-rose-400",
  // Action discrète : annuler, fermer.
  ghost:
    "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-50 focus-visible:ring-indigo-400",
  // Confirmer une suppression.
  danger:
    "bg-rose-600 font-semibold text-white hover:bg-rose-500 focus-visible:ring-rose-400",
  // Proposer une suppression, sans attirer l'œil.
  "danger-ghost":
    "text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 focus-visible:ring-rose-400",
};

export const sizeClasses: Record<ButtonSize, string> = {
  // Petites actions dans une carte (le +1 du suivi de lecture).
  xs: "px-2.5 py-1 text-xs",
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-5 py-3 text-lg",
};

export const getButtonClassName = (
  variant: ButtonVariant,
  size: ButtonSize,
  className = "",
): string =>
  `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

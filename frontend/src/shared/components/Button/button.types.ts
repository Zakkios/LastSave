import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { LinkProps } from "react-router";

// Hiérarchie des actions (voir button.styles.ts) :
// primary (action principale d'une fiche ou d'une fenêtre), tonal (en-tête de page),
// secondary (à égalité ou en second), secondary-danger (rose au survol : se déconnecter),
// ghost (discrète), danger (confirmer une suppression), danger-ghost (proposer une suppression).
export type ButtonVariant =
  | "primary"
  | "tonal"
  | "secondary"
  | "secondary-danger"
  | "ghost"
  | "danger"
  | "danger-ghost";
export type ButtonSize = "xs" | "sm" | "md" | "lg";

export type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

// Un lien qui a l'apparence d'un bouton (navigation vers une autre page).
export type ButtonLinkProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} & Omit<LinkProps, "className">;

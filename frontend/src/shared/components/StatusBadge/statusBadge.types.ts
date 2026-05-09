export type StatusVariant = "to_read" | "reading" | "completed" | "dropped";

export type StatusBadgeProps = {
  label: string;
  status: StatusVariant;
};
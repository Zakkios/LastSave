export type AuthFlashStatus = "success" | "error";

export interface AuthFlashMessage {
  message: string;
  status: AuthFlashStatus;
}

interface AuthFlashRouteState {
  flash?: unknown;
}

const registrationSuccessMessage =
  "Inscription réussie. Vous pouvez maintenant vous connecter.";

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

export const getRegistrationSuccessFlash = (): AuthFlashMessage => ({
  message: registrationSuccessMessage,
  status: "success",
});

export const getAuthFlashFromState = (
  state: unknown
): AuthFlashMessage | null => {
  if (!isRecord(state) || !("flash" in state)) {
    return null;
  }

  const { flash } = state as AuthFlashRouteState;

  if (!isRecord(flash)) {
    return null;
  }

  const { message, status } = flash;

  if (
    typeof message !== "string" ||
    (status !== "success" && status !== "error")
  ) {
    return null;
  }

  return { message, status };
};

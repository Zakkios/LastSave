import { useState } from "react";
import { useNavigate } from "react-router";
import { logoutUser } from "../api";
import { useAuth } from "./useAuth";

const useLogout = () => {
  const navigate = useNavigate();
  const { clearUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    setLoading(true);

    try {
      await logoutUser();
    } finally {
      clearUser();
      setLoading(false);
      navigate("/login", { replace: true });
    }
  };

  return { logout, loading };
};

export default useLogout;

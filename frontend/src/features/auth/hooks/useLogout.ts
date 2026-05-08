import { useNavigate } from "react-router";
import { logoutUser } from "../api";
import { useState } from "react";

const useLogout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const logout = async () => {
    setLoading(true);
    await logoutUser();
    setLoading(false);
    navigate("/login");
  };

  return { logout, loading };
};

export default useLogout;

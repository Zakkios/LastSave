import { useNavigate } from "react-router";
import { logoutUser } from "../api";

const useLogout = () => {
  const navigate = useNavigate();

  const logout = async () => {
    await logoutUser();
    navigate("/login");
  };

  return logout;
};

export default useLogout;

import { useNavigate } from "react-router-dom";
import Logo from "../../ui/icons/Logo";

function AuthHeader() {
  const navigate = useNavigate();
  return (
    <div
      className="hover:cursor-pointer "
      onClick={() => navigate("/dashboard")}
    >
      <Logo width="180" height="36" />
    </div>
  );
}

export default AuthHeader;

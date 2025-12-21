import { useNavigate } from "react-router-dom";
import Logo from "../../ui/icons/Logo";
import { ArrowBigLeft } from "lucide-react";

function AuthHeader() {
  const navigate = useNavigate();
  return (
    <div
      className="hover:cursor-pointer "
      onClick={() => navigate("/")}
    >
      <div className="hidden sm:block">
        <Logo width="180" height="36" />
      </div>

      <div className="block sm:hidden mt-8 ml-8 hover:bg-blue-200 p-2 rounded-2xl">
        <ArrowBigLeft size={28} className=""/>
      </div>
    </div>
  );
}

export default AuthHeader;

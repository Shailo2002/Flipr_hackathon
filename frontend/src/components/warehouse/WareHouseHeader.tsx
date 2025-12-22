import { useNavigate } from "react-router-dom";
import Logo from "../../ui/icons/Logo";
import { useEffect, useRef, useState } from "react";
import { CircleUser } from "lucide-react";
import { useDispatch } from "react-redux";
import { clearUserData } from "../../redux/userSlice";
import axios from "axios";
import { Backend_Url } from "../../env";
import toast from "react-hot-toast";

function WareHouseHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogOut = async () => {
    try {
      console.log("logout button");

      const response = await axios.get(`${Backend_Url}/api/auth/signout`, {
        withCredentials: true,
      });
      dispatch(clearUserData());

      toast.success("logout successfully");
    } catch (error) {
      console.log("error: ", error);

      const message =
        error?.response?.data?.message || "Error while logging out";

      toast.error(message);
    }
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="flex justify-between items-center p-3 px-8 shadow border-slate-50">
      <div className="hover:cursor-pointer " onClick={() => navigate("/")}>
        <div className="">
          <Logo width="180" height="36" />
        </div>
      </div>

      <div className="flex justify-center items-center gap-4">
        <div className="relative" ref={menuRef}>
          <CircleUser
            size={40}
            className="cursor-pointer text-blue-600"
            onClick={() => setMenuOpen((o) => !o)}
          />

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 rounded-xl border border-blue-200 bg-white opacity-80 shadow-lg ">
              <button className="block w-full px-4 py-2 text-left text-blue-600" onClick={() => handleLogOut()}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WareHouseHeader;

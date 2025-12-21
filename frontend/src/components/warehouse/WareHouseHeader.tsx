import { useNavigate } from "react-router-dom";
import Logo from "../../ui/icons/Logo";
import Input from "../../ui/Input";
import { useState } from "react";
import { CircleUser } from "lucide-react";

function WareHouseHeader() {
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();
  return (
    <div className="flex justify-between items-center p-3 px-6 shadow border-slate-50">
      <div className="hover:cursor-pointer " onClick={() => navigate("/")}>
        <div className="">
          <Logo width="180" height="36" />
        </div>
      </div>

      <div className="flex justify-center items-center gap-4">
        <Input
          type="text"
          placeholder="search shipments"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <CircleUser size={40} className="text-blue-600 cursor-pointer"/>
      </div>
    </div>
  );
}

export default WareHouseHeader;

import { useEffect, useState } from "react";
import Input from "../ui/Input";
import { Button } from "../ui/Button";
import { Store, Truck} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthHeader from "../components/auth_components/AuthHeader";
import {
  DealerSingUpSchema,
  WareHouseSingUpShema,
} from "../schemas/AuthSchema";
import toast from "react-hot-toast";
import { Backend_Url } from "../env";
import axios from "axios";
import SelectInputArray from "../components/auth_components/SelectInputArray";
import { MAJOR_CITIES } from "../constants/Constants";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("WAREHOUSE");
  const [companyName, setCompanyName] = useState("");
  const [managerName, setManagerName] = useState("");
  const [location, setLocation] = useState("");
  const [dealerName, setDealerName] = useState("");
  const [serviceAreas, setServiceAreas] = useState<string[]>([]);
  const [truckTypes, setTruckTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleWareHouseSignUp = async () => {
    if (loading) return;
    setLoading(true);
    const payload = {
      email: email.trim(),
      password,
      role,
      warehouse: {
        companyName,
        managerName,
        location,
      },
    };

    const validateData = WareHouseSingUpShema.safeParse(payload);

    if (!validateData.success) {
      const messages = validateData.error.issues.map((e) => e.message);
      messages.forEach((m) => toast.error(m));
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${Backend_Url}/api/auth/signup`,
        payload
      );

      if (response.data?.success) {
        setEmail("");
        setPassword("");
        setCompanyName("");
        setManagerName("");
        setLocation("");

        toast.success("Signup successful");
        navigate("/signin");
      }
    } catch (error: any) {
      console.log("error: ", error);

      const message =
        error?.response?.data?.message || "Error while signing up";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDealerSignUp = async () => {
    if (loading) return;
    setLoading(true);
    const payload = {
      email: email.trim(),
      password,
      role,
      dealer: {
        dealerName,
        truckTypes,
        serviceAreas,
      },
    };

    const validateData = DealerSingUpSchema.safeParse(payload);

    if (!validateData.success) {
      const messages = validateData.error.issues.map((e) => e.message);
      messages.forEach((m) => toast.error(m));
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${Backend_Url}/api/auth/signup`,
        payload
      );

      console.log("dealer response : ", response);

      if (response.data?.success) {
        setEmail("");
        setPassword("");
        setTruckTypes([]);
        setServiceAreas([]);
        setDealerName("");
        toast.success("Signup successful");
        navigate("/signin");
      }
    } catch (error: any) {
      console.log("error: ", error);

      const message =
        error?.response?.data?.message || "Error while signing up";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    try {
      if (role === "WAREHOUSE") {
        await handleWareHouseSignUp();
      } else if (role === "DEALER") {
        await handleDealerSignUp();
      }
    } catch (error) {
      console.log("error : ", error);
    }
  };

  useEffect(() => {
    if (role === "WAREHOUSE") {
      setDealerName("");
      setServiceAreas([]);
      setTruckTypes([]);
    } else {
      setCompanyName("");
      setManagerName("");
      setLocation("");
    }
  }, [role]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-screen bg-gradient-to-b from-white to-blue-200 opacity-99">
      <img
        src="Vector.svg"
        className="hidden sm:flex absolute top-1/2 -z-10 "
      />
      <div className="absolute top-4 left-4">
        <AuthHeader />
      </div>
      <div className="col-span-1 flex justify-center items-center p-0 sm:p-4">
        <div className="sm:bg-white sm:shadow-lg sm:rounded-xl p-0 sm:p-6 space-y-2 sm:border border-slate-100">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold">
              Create Your <span className="text-blue-600">Account</span>
            </h1>
            <div className="text-slate-500 text-sm text-center mb-6">
              Join us to streamline your logistics journey
            </div>
          </div>

          <div>
            <Input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email"
            />
          </div>

          <div>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
            />
          </div>

          <div className="my-4 text-gray">
            <div className="font-semibold p-2 text-gray-900 text-sm">
              Select Your Role
            </div>
            <div className="grid grid-cols-2 gap-6 px-2">
              <div
                className={`col-span-1 shadow rounded-lg text-center flex justify-center items-center gap-2 p-3 text-gray-900 text-sm  ${
                  role === "WAREHOUSE"
                    ? "bg-blue-200 sm:bg-blue-100"
                    : "hover:bg-slate-50 bg-white"
                } cursor-pointer `}
                onClick={() => setRole("WAREHOUSE")}
              >
                <Store className="text-blue-600" />
                WareHouse
              </div>
              <div
                className={`col-span-1 shadow rounded-lg text-center flex justify-center items-center gap-2 p-3 text-gray-900 ${
                  role === "DEALER"
                    ? "bg-blue-200 sm:bg-blue-100"
                    : "hover:bg-slate-50 bg-white"
                } cursor-pointer `}
                onClick={() => setRole("DEALER")}
              >
                <Truck className="text-blue-600" />
                Dealer
              </div>
            </div>
          </div>

          {role == "WAREHOUSE" ? (
            <div>
              <div>
                <Input
                  type="text"
                  placeholder="company Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>

              <div>
                <Input
                  type="text"
                  placeholder="manager Name"
                  value={managerName}
                  onChange={(e) => setManagerName(e.target.value)}
                />
              </div>

              <div>
                <Input
                  type="text"
                  placeholder="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div>
              <div>
                <Input
                  type="text"
                  placeholder="dealer Name"
                  value={dealerName}
                  onChange={(e) => setDealerName(e.target.value)}
                />
              </div>
              <div className="mb-2">
                <SelectInputArray
                  options={[
                    "MINI_TRUCK",
                    "LCV_14FT",
                    "LCV_17FT",
                    "TRUCK_19FT",
                    "TRUCK_22FT",
                    "TRUCK_24FT",
                    "TRUCK_32FT_SXL",
                    "TRUCK_40FT",
                  ]}
                  array={truckTypes}
                  setArray={setTruckTypes}
                  placeholder="Select truck types"
                />
              </div>

              <SelectInputArray
                options={MAJOR_CITIES}
                array={serviceAreas}
                setArray={setServiceAreas}
                placeholder="Select truck types"
              />

              {/* <InputArray
                array={serviceAreas}
                setArray={setServiceAreas}
                placeholder="Service Areas"
              /> */}

              {/* <InputArray
                array={truckTypes}
                setArray={setTruckTypes}
                placeholder="Truck Types"
              /> */}
            </div>
          )}

          <div className="flex items-center justify-center p-2 mt-4">
            <Button
              variant="primary"
              size="md"
              text="Sign Up"
              onClick={() => handleSignUp()}
              loading={loading}
              disabled={loading}
              className="cursor-pointer"
            />
          </div>

          <div className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <span
              className="text-blue-600 font-medium cursor-pointer hover:underline"
              onClick={() => navigate("/signin")}
            >
              Sign In
            </span>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex relative col-span-1 flex justify-end items-center">
        <img src="Background_crop.svg" className="w-136 h-auto" />
      </div>
    </div>
  );
}

export default SignupPage;

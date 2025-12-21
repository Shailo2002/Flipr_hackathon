import { useState } from "react";
import Input from "../ui/Input";
import { Button } from "../ui/Button";
import { useNavigate } from "react-router-dom";
import AuthHeader from "../components/auth_components/AuthHeader";
import { SignInSchema } from "../schemas/AuthSchema";
import axios from "axios";
import toast from "react-hot-toast";
import { Backend_Url } from "../env";

function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async () => {
    if (loading) return;

    const payload = { email: email.trim(), password };

    const validateData = SignInSchema.safeParse(payload);

    if (!validateData.success) {
      const messages = validateData.error.issues.map((e) => e.message);
      messages.forEach((m) => toast.error(m));
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post(
        `${Backend_Url}/api/auth/signin`,
        payload,
        { withCredentials: true }
      );

      console.log("response : ", response);
      if (response.data?.success) {
        setEmail("");
        setPassword("");

        toast.success("Signin successful");
        if (response?.data?.data.role === "WAREHOUSE") {
          navigate("/warehouse-dashboard");
        } else if (response?.data?.data.role === "DEALER") {
          navigate("/dealer-dashboard");
        } else {
          navigate("/");
        }
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-screen w-full bg-gradient-to-t from-white to-blue-200 opacity-99">
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
              SingIn Your <span className="text-blue-600">Account</span>
            </h1>
            <div className="text-slate-500 text-sm text-center mb-6">
              Access your logistics dashboard
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

          <div className="flex items-center justify-center mt-4 p-2">
            <Button
              variant="primary"
              size="md"
              text="Sign In"
              onClick={() => handleSignIn()}
              loading={loading}
              disabled={loading}
            />
          </div>

          <div className="text-center text-sm text-gray-600">
            Want to create a new account?{" "}
            <span
              className="text-blue-600 font-medium cursor-pointer hover:underline"
              onClick={() => navigate("/signup")}
            >
              Sign Up
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

export default SignInPage;

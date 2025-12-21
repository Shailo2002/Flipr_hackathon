import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";

import LandingPage from "./pages/LandingPage";
import DealerDashboard from "./pages/DealerDashboard";
import WareHouseDashboard from "./pages/WareHouseDashboard";
import SignInPage from "./pages/SignInPage";
import SignupPage from "./pages/SignUpPage";
import useGetCurrentUser from "./hooks/useGetCurrentUser";

function App() {
  const { userData, loading } = useSelector((state: any) => state.user);
  useGetCurrentUser();

  if (loading & userData) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route
          path="/signin"
          element={
            !userData ? (
              <SignInPage />
            ) : userData?.role === "WAREHOUSE" ? (
              <Navigate to="/warehouse-dashboard" replace />
            ) : (
              <Navigate to="/dealer-dashboard" replace />
            )
          }
        />
        <Route
          path="/signup"
          element={
            !userData ? (
              <SignupPage />
            ) : userData?.role === "WAREHOUSE" ? (
              <Navigate to="/warehouse-dashboard" replace />
            ) : (
              <Navigate to="/dealer-dashboard" replace />
            )
          }
        />

        {/* Dealer Dashboard */}
        <Route
          path="/dealer-dashboard"
          element={
            userData && userData.role === "DEALER" ? (
              <DealerDashboard />
            ) : (
              <Navigate to="/signin" replace />
            )
          }
        />

        {/* Warehouse Dashboard */}
        <Route
          path="/warehouse-dashboard"
          element={
            userData && userData.role === "WAREHOUSE" ? (
              <WareHouseDashboard />
            ) : (
              <Navigate to="/signin" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

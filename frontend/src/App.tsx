import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import LandingPage from "./pages/LandingPage";
import SignInPage from "./pages/SignInPage";
import { Toaster } from "react-hot-toast";
import DealerDashboard from "./pages/DealerDashboard";
import WareHouseDashboard from "./pages/WareHouseDashboard";
import SignupPage from "./pages/SignInPage";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dealer-dashboard" element={<DealerDashboard />} />
        <Route path="/warehouse-dashboard" element={<WareHouseDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

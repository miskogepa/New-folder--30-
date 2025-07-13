import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";

// Dummy stranice za primer
function EdcPage() {
  return <div style={{ padding: 32 }}>Moj EDC stranica</div>;
}
function BackpackPage() {
  return <div style={{ padding: 32 }}>Ranac stranica</div>;
}
function HealthPage() {
  return <div style={{ padding: 32 }}>Zdravlje stranica</div>;
}

// Dummy user (dok ne povežemo sa Zustandom)
const dummyUser = { username: "demo" };

function Layout({ children }) {
  const location = useLocation();
  const hideNavbar = ["/login", "/register"].includes(location.pathname);
  return (
    <>
      {!hideNavbar && <Navbar user={dummyUser} />}
      {children}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/edc" element={<EdcPage />} />
          <Route path="/backpack" element={<BackpackPage />} />
          <Route path="/health" element={<HealthPage />} />
          <Route path="*" element={<Navigate to="/edc" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

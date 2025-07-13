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
import EdcAddItem from "./pages/EdcAddItem";
import Navbar from "./components/Navbar";
import { useUserStore } from "./store/userStore";

// Dummy stranice za primer
function EdcPage() {
  const { user } = useUserStore();

  return (
    <div style={{ padding: 32 }}>
      <h1>Moj EDC stranica</h1>
      {user ? (
        <div>
          <p>Dobrodošli, {user.username}!</p>
          <a
            href="/edc/add"
            style={{ color: "blue", textDecoration: "underline" }}
          >
            Dodaj novi predmet
          </a>
        </div>
      ) : (
        <div>
          <p>Molimo prijavite se da vidite svoju EDC kolekciju.</p>
          <a
            href="/login"
            style={{ color: "blue", textDecoration: "underline" }}
          >
            Prijavi se
          </a>
        </div>
      )}
    </div>
  );
}
function BackpackPage() {
  return <div style={{ padding: 32 }}>Ranac stranica</div>;
}
function HealthPage() {
  return <div style={{ padding: 32 }}>Zdravlje stranica</div>;
}

function Layout({ children }) {
  const location = useLocation();
  const hideNavbar = ["/login", "/register"].includes(location.pathname);
  return (
    <>
      {!hideNavbar && <Navbar />}
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
          <Route path="/edc/add" element={<EdcAddItem />} />
          <Route path="/backpack" element={<BackpackPage />} />
          <Route path="/health" element={<HealthPage />} />
          <Route path="*" element={<Navigate to="/edc" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

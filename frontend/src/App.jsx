import React, { useState } from "react";
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
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  useColorMode,
  Divider,
} from "@chakra-ui/react";
import EdcItemList from "./components/EdcItemList";
import EdcItemEditModal from "./components/EdcItemEditModal";

const lightColors = {
  bg: "#A5ABAC",
  card: "#656A69",
  input: "#445253",
  text: "#2F3237",
  accent: "#3C4341",
};
const darkColors = {
  bg: "#505143",
  card: "#6A6352",
  input: "#878568",
  text: "#D5CCAB",
  accent: "#A3A289",
};

function EdcPage() {
  const { user } = useUserStore();
  const { colorMode } = useColorMode();
  const colors = colorMode === "light" ? lightColors : darkColors;
  const [editItem, setEditItem] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = (item) => setEditItem(item);
  const handleModalClose = () => setEditItem(null);
  const handleUpdated = () => setRefreshKey((k) => k + 1);

  return (
    <Box
      minH="100vh"
      bg={colors.bg}
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDir="column"
      py={8}
    >
      <VStack
        spacing={6}
        p={8}
        bg={colors.card}
        borderRadius="lg"
        boxShadow="lg"
        minW="350px"
        maxW="400px"
        w="100%"
      >
        <Heading size="md" color={colors.text}>
          Moj EDC stranica
        </Heading>
        {user ? (
          <>
            <Text color={colors.text} fontSize="lg">
              Dobrodošli, <b>{user.username}</b>!
            </Text>
            <Button
              as="a"
              href="/edc/add"
              colorScheme="teal"
              width="100%"
              bg={colors.accent}
              color={colors.text}
              _hover={{ bg: colors.text, color: colors.card }}
            >
              Dodaj novi predmet
            </Button>
          </>
        ) : (
          <>
            <Text color={colors.text} fontSize="lg">
              Molimo prijavite se da vidite svoju EDC kolekciju.
            </Text>
            <Button
              as="a"
              href="/login"
              variant="outline"
              width="100%"
              color={colors.text}
              borderColor={colors.accent}
              _hover={{ bg: colors.accent, color: colors.card }}
            >
              Prijavi se
            </Button>
          </>
        )}
      </VStack>
      {user && (
        <Box mt={8} w="100%" maxW="700px">
          <Divider mb={6} borderColor={colors.accent} />
          <EdcItemList onEdit={handleEdit} key={refreshKey} />
          <EdcItemEditModal
            isOpen={!!editItem}
            onClose={handleModalClose}
            item={editItem}
            onUpdated={handleUpdated}
          />
        </Box>
      )}
    </Box>
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

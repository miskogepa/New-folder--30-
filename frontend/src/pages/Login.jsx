import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  useColorMode,
  useColorModeValue,
  VStack,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";

// Custom paleta iz plan.md
const lightColors = {
  bg: "#A5ABAC", // METALLIC SILVER
  card: "#656A69", // DIM GRAY
  input: "#445253", // OUTER SPACE
  text: "#2F3237", // DARK CHARCOAL
  accent: "#3C4341", // ARSENIC
};
const darkColors = {
  bg: "#505143", // OLIVE DRAB CAMOUFLAGE
  card: "#6A6352", // BOY RED
  input: "#878568", // CAMOUFLAGE GREEN
  text: "#D5CCAB", // DARK VANILLA
  accent: "#A3A289", // GRULLO
};

export default function Login() {
  const { colorMode, toggleColorMode } = useColorMode();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  const colors = colorMode === "light" ? lightColors : darkColors;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Greška pri prijavi");
      setUser(data.user, data.token);
      navigate("/edc");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      bg={colors.bg}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <VStack
        spacing={6}
        p={8}
        bg={colors.card}
        borderRadius="lg"
        boxShadow="lg"
        minW="350px"
      >
        <Heading size="lg" color={colors.text}>
          Prijava
        </Heading>
        <form style={{ width: "100%" }} onSubmit={handleSubmit}>
          <FormControl mb={4} isRequired>
            <FormLabel color={colors.text}>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              bg={colors.input}
              color={colors.text}
              borderColor={colors.accent}
              _placeholder={{ color: colors.accent }}
            />
          </FormControl>
          <FormControl mb={4} isRequired>
            <FormLabel color={colors.text}>Lozinka</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              bg={colors.input}
              color={colors.text}
              borderColor={colors.accent}
              _placeholder={{ color: colors.accent }}
            />
          </FormControl>
          {error && (
            <Text color="red.400" mb={2}>
              {error}
            </Text>
          )}
          <Button
            colorScheme="teal"
            type="submit"
            width="100%"
            isLoading={loading}
            bg={colors.accent}
            color={colors.text}
            _hover={{ bg: colors.text, color: colors.card }}
          >
            Prijavi se
          </Button>
        </form>
        <Button
          onClick={toggleColorMode}
          variant="outline"
          width="100%"
          color={colors.text}
          borderColor={colors.accent}
          _hover={{ bg: colors.accent, color: colors.card }}
        >
          Promeni temu ({colorMode === "light" ? "Dark" : "Light"})
        </Button>
        <Text fontSize="sm" color={colors.text}>
          Nemaš nalog?{" "}
          <a href="/register" style={{ color: colors.accent }}>
            Registruj se
          </a>
        </Text>
      </VStack>
    </Box>
  );
}

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

export default function Login() {
  const { colorMode, toggleColorMode } = useColorMode();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

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
      bg={useColorModeValue("gray.100", "gray.900")}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <VStack
        spacing={6}
        p={8}
        bg={useColorModeValue("white", "gray.800")}
        borderRadius="lg"
        boxShadow="lg"
        minW="350px"
      >
        <Heading size="lg">Prijava</Heading>
        <form style={{ width: "100%" }} onSubmit={handleSubmit}>
          <FormControl mb={4} isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </FormControl>
          <FormControl mb={4} isRequired>
            <FormLabel>Lozinka</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
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
          >
            Prijavi se
          </Button>
        </form>
        <Button onClick={toggleColorMode} variant="outline" width="100%">
          Promeni temu ({colorMode === "light" ? "Dark" : "Light"})
        </Button>
        <Text fontSize="sm">
          Nemaš nalog?{" "}
          <a href="/register" style={{ color: "#319795" }}>
            Registruj se
          </a>
        </Text>
      </VStack>
    </Box>
  );
}

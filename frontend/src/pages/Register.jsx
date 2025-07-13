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

export default function Register() {
  const { colorMode, toggleColorMode } = useColorMode();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Greška pri registraciji");
      navigate("/login");
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
        <Heading size="lg">Registracija</Heading>
        <form style={{ width: "100%" }} onSubmit={handleSubmit}>
          <FormControl mb={4} isRequired>
            <FormLabel>Korisničko ime</FormLabel>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormControl>
          <FormControl mb={4} isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl mb={4} isRequired>
            <FormLabel>Lozinka</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            Registruj se
          </Button>
        </form>
        <Button onClick={toggleColorMode} variant="outline" width="100%">
          Promeni temu ({colorMode === "light" ? "Dark" : "Light"})
        </Button>
        <Text fontSize="sm">
          Već imaš nalog?{" "}
          <a href="/login" style={{ color: "#319795" }}>
            Prijavi se
          </a>
        </Text>
      </VStack>
    </Box>
  );
}

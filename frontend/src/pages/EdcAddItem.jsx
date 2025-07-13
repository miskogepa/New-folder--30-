import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  VStack,
  Select,
  Text,
  SimpleGrid,
  IconButton,
  Collapse,
  useColorMode,
  useToast,
} from "@chakra-ui/react";
import {
  FaLightbulb,
  FaKey,
  FaWallet,
  FaPen,
  FaBook,
  FaBottleWater,
} from "react-icons/fa6";
import {
  GiSwissArmyKnife,
  GiFirstAidKit,
  GiWatch,
  GiKnifeFork,
} from "react-icons/gi";
import { useUserStore } from "../store/userStore";
import { edcItemsAPI } from "../services/api";

const ICONS = [
  { id: "lampa", icon: <FaLightbulb size={28} />, label: "Lampa" },
  { id: "multitool", icon: <GiSwissArmyKnife size={28} />, label: "Multitool" },
  { id: "sat", icon: <GiWatch size={28} />, label: "Sat" },
  { id: "prva_pomoc", icon: <GiFirstAidKit size={28} />, label: "Prva pomoć" },
  { id: "kljucevi", icon: <FaKey size={28} />, label: "Ključevi" },
  { id: "novcanik", icon: <FaWallet size={28} />, label: "Novčanik" },
  { id: "notes", icon: <FaBook size={28} />, label: "Notes" },
  { id: "olovka", icon: <FaPen size={28} />, label: "Olovka" },
  { id: "voda", icon: <FaBottleWater size={28} />, label: "Voda" },
  { id: "hrana", icon: <GiKnifeFork size={28} />, label: "Hrana" },
];

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

export default function EdcAddItem() {
  const { colorMode } = useColorMode();
  const colors = colorMode === "light" ? lightColors : darkColors;
  const { user, token } = useUserStore();
  const toast = useToast();

  // Provera da li je korisnik prijavljen
  if (!user || !token) {
    return (
      <Box
        minH="100vh"
        bg={colors.bg}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack
          spacing={4}
          p={8}
          bg={colors.card}
          borderRadius="lg"
          boxShadow="lg"
        >
          <Heading size="md" color={colors.text}>
            Prijavite se
          </Heading>
          <Text color={colors.text}>
            Morate biti prijavljeni da biste dodali predmet u EDC kolekciju.
          </Text>
        </VStack>
      </Box>
    );
  }

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [icon, setIcon] = useState("");
  const [showUsageLimit, setShowUsageLimit] = useState(false);
  const [usageLimit, setUsageLimit] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!name || !type || !icon) {
      setError("Popuni sva obavezna polja i izaberi ikonicu.");
      return;
    }

    if (!user || !token) {
      setError("Morate biti prijavljeni da biste dodali predmet.");
      return;
    }

    setLoading(true);
    try {
      const itemData = {
        name: name.trim(),
        type: type,
        icon: icon,
        ...(showUsageLimit &&
          usageLimit && { usageLimit: parseInt(usageLimit) }),
      };

      await edcItemsAPI.addItem(itemData, token);

      setSuccess(true);
      setName("");
      setType("");
      setIcon("");
      setUsageLimit("");
      setShowUsageLimit(false);

      toast({
        title: "Uspešno!",
        description: "Predmet je dodat u vašu EDC kolekciju.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Error adding item:", err);
      const errorMessage = err.message || "Greška pri dodavanju predmeta.";
      setError(errorMessage);

      toast({
        title: "Greška!",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
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
        maxW="400px"
        w="100%"
      >
        <Heading size="md" color={colors.text}>
          Dodaj predmet u Moj EDC
        </Heading>
        <form style={{ width: "100%" }} onSubmit={handleSubmit}>
          <FormControl mb={4} isRequired>
            <FormLabel color={colors.text}>Naziv predmeta</FormLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              bg={colors.input}
              color={colors.text}
              borderColor={colors.accent}
              _placeholder={{ color: colors.accent }}
            />
          </FormControl>
          <FormControl mb={4} isRequired>
            <FormLabel color={colors.text}>Tip predmeta</FormLabel>
            <Select
              placeholder="Izaberi tip"
              value={type}
              onChange={(e) => setType(e.target.value)}
              bg={colors.input}
              color={colors.text}
              borderColor={colors.accent}
              _placeholder={{ color: colors.accent }}
            >
              <option value="lampa">Lampa</option>
              <option value="multitool">Multitool</option>
              <option value="sat">Sat</option>
              <option value="prva_pomoc">Prva pomoć</option>
              <option value="kljucevi">Ključevi</option>
              <option value="novcanik">Novčanik</option>
              <option value="notes">Notes</option>
              <option value="olovka">Olovka</option>
              <option value="voda">Voda</option>
              <option value="hrana">Hrana</option>
            </Select>
          </FormControl>
          <FormControl mb={4} isRequired>
            <FormLabel color={colors.text}>Izaberi ikonicu</FormLabel>
            <SimpleGrid columns={5} spacing={2}>
              {ICONS.map((ic) => (
                <IconButton
                  key={ic.id}
                  aria-label={ic.label}
                  icon={ic.icon}
                  bg={icon === ic.id ? colors.accent : colors.input}
                  color={icon === ic.id ? colors.text : colors.text}
                  border={
                    icon === ic.id
                      ? `2px solid ${colors.text}`
                      : `1px solid ${colors.accent}`
                  }
                  onClick={() => setIcon(ic.id)}
                  _hover={{ bg: colors.accent, color: colors.card }}
                />
              ))}
            </SimpleGrid>
          </FormControl>
          <Button
            variant="outline"
            width="100%"
            mb={2}
            onClick={() => setShowUsageLimit((v) => !v)}
            color={colors.text}
            borderColor={colors.accent}
            _hover={{ bg: colors.accent, color: colors.card }}
          >
            {showUsageLimit
              ? "Ukloni ograničenje upotrebe"
              : "Dodaj ograničenje upotrebe"}
          </Button>
          <Collapse in={showUsageLimit} animateOpacity>
            <FormControl mb={4}>
              <FormLabel color={colors.text}>
                Koliko puta dnevno možeš da koristiš ovaj predmet?
              </FormLabel>
              <Input
                type="number"
                min={1}
                value={usageLimit}
                onChange={(e) => setUsageLimit(e.target.value)}
                bg={colors.input}
                color={colors.text}
                borderColor={colors.accent}
                _placeholder={{ color: colors.accent }}
              />
            </FormControl>
          </Collapse>
          {error && (
            <Text color="red.400" mb={2}>
              {error}
            </Text>
          )}
          {success && (
            <Text color="green.400" mb={2}>
              Predmet uspešno dodat!
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
            Dodaj predmet
          </Button>
        </form>
      </VStack>
    </Box>
  );
}

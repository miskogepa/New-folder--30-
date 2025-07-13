import React, { useEffect, useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  IconButton,
  Spinner,
  useColorMode,
  SimpleGrid,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { FaEdit } from "react-icons/fa";
import { edcItemsAPI } from "../services/api";
import { useUserStore } from "../store/userStore";
import { ICONS } from "../constants/edcIcons";

const lightColors = {
  card: "#656A69",
  input: "#445253",
  text: "#2F3237",
  accent: "#3C4341",
};
const darkColors = {
  card: "#6A6352",
  input: "#878568",
  text: "#D5CCAB",
  accent: "#A3A289",
};

function getIconById(id) {
  const found = ICONS.find((ic) => ic.id === id);
  return found ? found.icon : null;
}

export default function EdcItemList({ onEdit }) {
  const { colorMode } = useColorMode();
  const colors = colorMode === "light" ? lightColors : darkColors;
  const { token } = useUserStore();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await edcItemsAPI.getItems(token);
        setItems(data);
      } catch (err) {
        setError(err.message || "Greška pri učitavanju predmeta.");
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [token]);

  if (loading) {
    return (
      <Box w="100%" textAlign="center" py={8}>
        <Spinner size="lg" color={colors.accent} />
      </Box>
    );
  }
  if (error) {
    return (
      <Box w="100%" textAlign="center" py={8}>
        <Text color="red.400">{error}</Text>
      </Box>
    );
  }
  if (!items.length) {
    return (
      <Box w="100%" textAlign="center" py={8}>
        <Text color={colors.text}>Nema predmeta u tvojoj EDC kolekciji.</Text>
      </Box>
    );
  }

  return (
    <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} w="100%">
      {items.map((item) => (
        <Box
          key={item._id}
          bg={colors.input}
          borderRadius="md"
          boxShadow="md"
          p={4}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <HStack spacing={3} align="center">
            <Box fontSize="2xl">{getIconById(item.icon)}</Box>
            <VStack align="start" spacing={0}>
              <Text color={colors.text} fontWeight="bold">
                {item.name}
              </Text>
              <Text color={colors.accent} fontSize="sm">
                {item.type}
              </Text>
              {item.usageLimit && (
                <Text color={colors.accent} fontSize="xs">
                  Ograničenje: {item.usageLimit} / dan
                </Text>
              )}
            </VStack>
          </HStack>
          <IconButton
            aria-label="Izmeni"
            icon={<FaEdit />}
            size="sm"
            color={colors.text}
            bg={colors.accent}
            _hover={{ bg: colors.text, color: colors.input }}
            onClick={() => onEdit && onEdit(item)}
          />
        </Box>
      ))}
    </SimpleGrid>
  );
}

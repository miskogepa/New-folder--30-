import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  IconButton,
  Collapse,
  useColorMode,
  useToast,
  Text,
} from "@chakra-ui/react";
import { ICONS } from "../constants/edcIcons";
import { edcItemsAPI } from "../services/api";
import { useUserStore } from "../store/userStore";

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

export default function EdcItemEditModal({ isOpen, onClose, item, onUpdated }) {
  const { colorMode } = useColorMode();
  const colors = colorMode === "light" ? lightColors : darkColors;
  const { token } = useUserStore();
  const toast = useToast();

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [icon, setIcon] = useState("");
  const [showUsageLimit, setShowUsageLimit] = useState(false);
  const [usageLimit, setUsageLimit] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (item) {
      setName(item.name || "");
      setType(item.type || "");
      setIcon(item.icon || "");
      setUsageLimit(item.usageLimit ? String(item.usageLimit) : "");
      setShowUsageLimit(!!item.usageLimit);
      setError("");
    }
  }, [item, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name || !type || !icon) {
      setError("Popuni sva obavezna polja i izaberi ikonicu.");
      return;
    }
    setLoading(true);
    try {
      const updateData = {
        name: name.trim(),
        type,
        icon,
        ...(showUsageLimit &&
          usageLimit && { usageLimit: parseInt(usageLimit) }),
      };
      await edcItemsAPI.updateItem(item._id, updateData, token);
      toast({
        title: "Uspešno!",
        description: "Predmet je izmenjen.",
        status: "success",
        duration: 2500,
        isClosable: true,
      });
      onUpdated && onUpdated();
      onClose();
    } catch (err) {
      setError(err.message || "Greška pri izmeni predmeta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg={colors.card} color={colors.text}>
        <ModalHeader>Izmeni predmet</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
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
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} mr={3} variant="ghost">
              Otkaži
            </Button>
            <Button
              colorScheme="teal"
              type="submit"
              isLoading={loading}
              bg={colors.accent}
              color={colors.text}
              _hover={{ bg: colors.text, color: colors.card }}
            >
              Sačuvaj izmene
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  VStack,
  HStack,
  Text,
  useColorMode,
  useToast,
} from "@chakra-ui/react";
import {
  FaGlassWater,
  FaAppleWhole,
  FaDumbbell,
  FaPills,
  FaPersonRunning,
  FaBed,
  FaHeart,
  FaBrain,
} from "react-icons/fa6";
import { useUserStore } from "../store/userStore";

const ICON_OPTIONS = [
  { key: "water", icon: <FaGlassWater size={24} />, label: "" },
  { key: "food", icon: <FaAppleWhole size={24} />, label: "" },
  { key: "training", icon: <FaDumbbell size={24} />, label: "" },
  { key: "supplements", icon: <FaPills size={24} />, label: "" },
  { key: "running", icon: <FaPersonRunning size={24} />, label: "" },
  { key: "sleep", icon: <FaBed size={24} />, label: "" },
  { key: "heart", icon: <FaHeart size={24} />, label: "" },
  { key: "brain", icon: <FaBrain size={24} />, label: "" },
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

export default function HealthSectionEditModal({
  isOpen,
  onClose,
  item,
  onUpdated,
}) {
  const { colorMode } = useColorMode();
  const colors = colorMode === "light" ? lightColors : darkColors;
  const { token } = useUserStore();
  const toast = useToast();

  const [formData, setFormData] = useState({
    label: "",
    limit: 1,
    iconKey: "water",
  });

  useEffect(() => {
    if (item) {
      setFormData({
        label: item.label || "",
        limit: item.limit || 1,
        iconKey: item.iconKey || "water",
      });
    }
  }, [item]);

  const handleSave = async () => {
    if (!formData.label.trim()) {
      toast({
        title: "Greška",
        description: "Ime je obavezno",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (formData.limit < 1) {
      toast({
        title: "Greška",
        description: "Limit mora biti veći od 0",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      // Pozovi callback sa ažuriranim podacima
      onUpdated({
        ...item,
        ...formData,
      });

      onClose();
    } catch (error) {
      console.error("Greška pri ažuriranju:", error);
      toast({
        title: "Greška",
        description: "Nije moguće ažurirati health item",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleIconSelect = (iconKey) => {
    setFormData((prev) => ({
      ...prev,
      iconKey,
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent bg={colors.card} color={colors.text}>
        <ModalHeader>Izmeni Health Item</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Ime</FormLabel>
              <Input
                value={formData.label}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, label: e.target.value }))
                }
                placeholder="Unesite ime..."
                bg={colors.input}
                borderColor={colors.accent}
                _focus={{ borderColor: colors.text }}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Limit (koliko puta se može koristiti)</FormLabel>
              <NumberInput
                value={formData.limit}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    limit: parseInt(value) || 1,
                  }))
                }
                min={1}
                max={20}
                bg={colors.input}
                borderColor={colors.accent}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel>Ikona</FormLabel>
              <HStack spacing={3} flexWrap="wrap">
                {ICON_OPTIONS.map((iconOption) => (
                  <Button
                    key={iconOption.key}
                    size="sm"
                    variant="ghost"
                    colorScheme={
                      formData.iconKey === iconOption.key ? "teal" : "gray"
                    }
                    onClick={() => handleIconSelect(iconOption.key)}
                    bg={
                      formData.iconKey === iconOption.key
                        ? colors.accent
                        : "transparent"
                    }
                    color={
                      formData.iconKey === iconOption.key
                        ? colors.card
                        : colors.text
                    }
                    border="none"
                    boxShadow="none"
                    _hover={{
                      bg:
                        formData.iconKey === iconOption.key
                          ? colors.accent
                          : colors.input,
                      border: "none",
                      boxShadow: "none",
                    }}
                    _active={{ border: "none", boxShadow: "none" }}
                    _focus={{ border: "none", boxShadow: "none" }}
                  >
                    <VStack spacing={1}>
                      {iconOption.icon}
                      <Text fontSize="xs">{iconOption.label}</Text>
                    </VStack>
                  </Button>
                ))}
              </HStack>
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose} color={colors.text}>
            Otkaži
          </Button>
          <Button
            colorScheme="teal"
            onClick={handleSave}
            bg={colors.accent}
            color={colors.text}
            _hover={{ bg: colors.text, color: colors.card }}
          >
            Sačuvaj
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

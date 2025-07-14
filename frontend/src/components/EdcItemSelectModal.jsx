import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Button,
  Box,
  Spinner,
  useColorMode,
} from "@chakra-ui/react";
import { useUserStore } from "../store/userStore";
import { edcItemsAPI } from "../services/api";
import { ICONS } from "../constants/edcIcons";

function getIconById(id) {
  const found = ICONS.find((ic) => ic.id === id);
  return found ? found.icon : null;
}

export default function EdcItemSelectModal({
  isOpen,
  onClose,
  edcType,
  onSelect,
}) {
  const { colorMode } = useColorMode();
  const { token } = useUserStore();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !edcType) return;
    setLoading(true);
    edcItemsAPI
      .getItems(token)
      .then((data) => {
        setItems(data.filter((item) => item.type === edcType));
      })
      .finally(() => setLoading(false));
  }, [isOpen, edcType, token]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay />
      <ModalContent bg={colorMode === "light" ? "#656A69" : "#6A6352"}>
        <ModalHeader>Izaberi varijantu</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {loading ? (
            <Spinner />
          ) : items.length === 0 ? (
            <Text>Nema predmeta ovog tipa u tvojoj kolekciji.</Text>
          ) : (
            <VStack spacing={4} align="stretch">
              {items.map((item) => (
                <HStack
                  key={item._id}
                  spacing={4}
                  p={3}
                  borderRadius="md"
                  bg={colorMode === "light" ? "#A5ABAC" : "#505143"}
                  _hover={{
                    bg: colorMode === "light" ? "#3C4341" : "#A3A289",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                >
                  <Box fontSize="2xl">{getIconById(item.icon)}</Box>
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold">{item.name}</Text>
                    <Text fontSize="sm">{item.type}</Text>
                  </VStack>
                </HStack>
              ))}
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

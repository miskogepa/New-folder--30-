import React, { useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  useColorMode,
  SimpleGrid,
} from "@chakra-ui/react";
import {
  FaGlassWater,
  FaAppleWhole,
  FaDumbbell,
  FaPills,
} from "react-icons/fa6";
import UsageCircleIcon from "./UsageCircleIcon";

const HEALTH_ITEMS = [
  {
    key: "water",
    label: "Voda",
    icon: <FaGlassWater size={40} color="#00BFFF" />,
    color: "#00BFFF",
    defaultLimit: 8,
  },
  {
    key: "food",
    label: "Hrana",
    icon: <FaAppleWhole size={40} color="#A3A289" />,
    color: "#A3A289",
    defaultLimit: 3,
  },
  {
    key: "training",
    label: "Trening",
    icon: <FaDumbbell size={40} color="#D5CCAB" />,
    color: "#D5CCAB",
    defaultLimit: 1,
  },
  {
    key: "supplements",
    label: "Suplementi",
    icon: <FaPills size={40} color="#6A6352" />,
    color: "#6A6352",
    defaultLimit: 2,
  },
];

const lightColors = {
  card: "#656A69",
  text: "#2F3237",
  accent: "#3C4341",
};
const darkColors = {
  card: "#6A6352",
  text: "#D5CCAB",
  accent: "#A3A289",
};

export default function HealthSection() {
  const { colorMode } = useColorMode();
  const colors = colorMode === "light" ? lightColors : darkColors;
  // Lokalni state za demo, kasnije povezujemo sa backendom
  const [usages, setUsages] = useState({
    water: 0,
    food: 0,
    training: 0,
    supplements: 0,
  });
  const [limits, setLimits] = useState({
    water: 8,
    food: 3,
    training: 1,
    supplements: 2,
  });

  const handleUse = (key) => {
    setUsages((prev) => ({
      ...prev,
      [key]: Math.min(prev[key] + 1, limits[key]),
    }));
  };

  return (
    <Box
      bg={colors.card}
      borderRadius="lg"
      boxShadow="lg"
      p={6}
      w="100%"
      maxW="700px"
      mx="auto"
    >
      <Text
        fontSize="xl"
        fontWeight="bold"
        color={colors.text}
        mb={4}
        textAlign="center"
      >
        Zdravlje
      </Text>
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
        {HEALTH_ITEMS.map((item) => (
          <VStack key={item.key} spacing={2}>
            <UsageCircleIcon
              maxUses={limits[item.key]}
              used={usages[item.key]}
              onUse={() => handleUse(item.key)}
              icon={item.icon}
              activeColor={item.color}
              size={90}
            />
            <Text color={colors.text} fontWeight="medium">
              {item.label}
            </Text>
            <Text color={colors.accent} fontSize="sm">
              {usages[item.key]} / {limits[item.key]}
            </Text>
            {/* Kasnije: dugme/modal za podešavanje limita */}
          </VStack>
        ))}
      </SimpleGrid>
    </Box>
  );
}

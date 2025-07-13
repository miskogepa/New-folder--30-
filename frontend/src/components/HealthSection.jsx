import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Text,
  useColorMode,
  SimpleGrid,
  Spinner,
  useToast,
  Input,
  HStack,
  Button,
} from "@chakra-ui/react";
import {
  FaGlassWater,
  FaAppleWhole,
  FaDumbbell,
  FaPills,
} from "react-icons/fa6";
import UsageCircleIcon from "./UsageCircleIcon";
import { useUserStore } from "../store/userStore";
import { healthAPI } from "../services/api";

const HEALTH_ITEMS = [
  {
    key: "water",
    label: "Voda",
    icon: <FaGlassWater size={40} color="#D5CCAB" />,
    color: "#A3A289",
    defaultLimit: 8,
  },
  {
    key: "food",
    label: "Hrana",
    icon: <FaAppleWhole size={40} color="#D5CCAB" />,
    color: "#A3A289",
    defaultLimit: 3,
  },
  {
    key: "training",
    label: "Trening",
    icon: <FaDumbbell size={40} color="#D5CCAB" />,
    color: "#D5CCAB",
    defaultLimit: 2,
  },
  {
    key: "supplements",
    label: "Suplementi",
    icon: <FaPills size={40} color="#D5CCAB" />,
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

function getToday() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export default function HealthSection() {
  const { colorMode } = useColorMode();
  const colors = colorMode === "light" ? lightColors : darkColors;
  const { user, token } = useUserStore();
  const toast = useToast();
  const [usages, setUsages] = useState({
    water: 0,
    food: 0,
    training: 0,
    supplements: 0,
  });
  const [limits, setLimits] = useState({
    water: 8,
    food: 3,
    training: 2,
    supplements: 2,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [date] = useState(getToday());

  // Fetch health log on mount
  useEffect(() => {
    if (!user || !token) return;
    setLoading(true);
    setError("");
    healthAPI
      .getHealthLog(date, token)
      .then((data) => {
        setUsages({
          water: data.water || 0,
          food: data.food || 0,
          training: data.training || 0,
          supplements: data.supplements || 0,
        });
        setLimits({
          water: data.waterLimit || 8,
          food: data.foodLimit || 3,
          training: data.trainingLimit || 2,
          supplements: data.supplementsLimit || 2,
        });
      })
      .catch((err) => {
        setError(err.message || "Greška pri učitavanju zdravlja.");
      })
      .finally(() => setLoading(false));
  }, [user, token, date]);

  // Save to backend
  const saveHealth = (newUsages, newLimits) => {
    if (!user || !token) return;
    setSaving(true);
    healthAPI
      .updateHealthLog(
        {
          userId: user.id || user._id,
          date,
          water: newUsages.water,
          food: newUsages.food,
          training: newUsages.training,
          supplements: newUsages.supplements,
          waterLimit: newLimits.water,
          foodLimit: newLimits.food,
          trainingLimit: newLimits.training,
          supplementsLimit: newLimits.supplements,
        },
        token
      )
      .then(() => {
        toast({
          title: "Sačuvano!",
          status: "success",
          duration: 1200,
          isClosable: true,
        });
      })
      .catch((err) => {
        toast({
          title: "Greška pri čuvanju!",
          description: err.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      })
      .finally(() => setSaving(false));
  };

  const handleUse = (key) => {
    const newUsages = {
      ...usages,
      [key]: Math.min(usages[key] + 1, limits[key]),
    };
    setUsages(newUsages);
    saveHealth(newUsages, limits);
  };

  const handleLimitChange = (key, value) => {
    const newLimits = {
      ...limits,
      [key]: Math.max(1, parseInt(value) || 1),
    };
    setLimits(newLimits);
    // Reset usage if new limit is lower
    const newUsages = {
      ...usages,
      [key]: Math.min(usages[key], newLimits[key]),
    };
    setUsages(newUsages);
    saveHealth(newUsages, newLimits);
  };

  if (loading) {
    return (
      <Box w="100%" textAlign="center" py={12}>
        <Spinner size="xl" color={colors.accent} />
      </Box>
    );
  }
  if (error) {
    return (
      <Box w="100%" textAlign="center" py={12}>
        <Text color="red.400">{error}</Text>
      </Box>
    );
  }

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
              activeColor="rgb(211,92,45)"
              size={90}
            />
            <Text color={colors.text} fontWeight="medium">
              {item.label}
            </Text>
            <Text color={colors.accent} fontSize="sm">
              {usages[item.key]} / {limits[item.key]}
            </Text>
            <HStack spacing={1}>
              <Text color={colors.text} fontSize="xs">
                Limit:
              </Text>
              <Input
                type="number"
                value={limits[item.key]}
                min={1}
                max={99}
                size="xs"
                width="48px"
                onChange={(e) => handleLimitChange(item.key, e.target.value)}
                isDisabled={saving}
                bg={colors.card}
                color={colors.text}
                borderColor={colors.accent}
                _placeholder={{ color: colors.accent }}
              />
            </HStack>
          </VStack>
        ))}
      </SimpleGrid>
      {saving && (
        <Text color={colors.accent} fontSize="sm" mt={2} textAlign="center">
          Čuvanje...
        </Text>
      )}
    </Box>
  );
}

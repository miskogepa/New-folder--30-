import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  useColorMode,
  SimpleGrid,
  useToast,
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
    defaultLimit: 1,
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

export default function HealthSection() {
  const { colorMode } = useColorMode();
  const colors = colorMode === "light" ? lightColors : darkColors;
  const { user, token } = useUserStore();
  const toast = useToast();

  // State za health podatke
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
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Učitaj health podatke za današnji datum
  useEffect(() => {
    if (user && token) {
      loadHealthData();
    }
  }, [user, token, currentDate]);

  const loadHealthData = async () => {
    if (!user || !token) return;

    setLoading(true);
    try {
      const response = await healthAPI.getHealthLog(currentDate, token);

      // Ako postoje podaci za današnji datum, koristi ih
      if (response && response.length > 0) {
        const todayData = response[0]; // Uzmi prvi log za današnji datum
        setUsages({
          water: todayData.water || 0,
          food: todayData.food || 0,
          training: todayData.training || 0,
          supplements: todayData.supplements || 0,
        });
      } else {
        // Ako nema podataka, resetuj na 0
        setUsages({
          water: 0,
          food: 0,
          training: 0,
          supplements: 0,
        });
      }
    } catch (error) {
      console.error("Greška pri učitavanju health podataka:", error);
      toast({
        title: "Greška",
        description: "Nije moguće učitati podatke o zdravlju",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUse = async (key) => {
    if (!user || !token) {
      toast({
        title: "Greška",
        description:
          "Morate biti prijavljeni da biste koristili ove funkcionalnosti",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const newValue = Math.min(usages[key] + 1, limits[key]);

    // Optimistički update UI-a
    setUsages((prev) => ({
      ...prev,
      [key]: newValue,
    }));

    try {
      // Pošalji podatke na backend
      await healthAPI.updateHealthLog(
        {
          date: currentDate,
          [key]: newValue,
        },
        token
      );

      toast({
        title: "Uspešno",
        description: `${
          HEALTH_ITEMS.find((item) => item.key === key)?.label
        } ažuriran`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Greška pri ažuriranju:", error);

      // Vrati na prethodnu vrednost ako je došlo do greške
      setUsages((prev) => ({
        ...prev,
        [key]: usages[key],
      }));

      toast({
        title: "Greška",
        description: "Nije moguće ažurirati podatke",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Ako korisnik nije prijavljen, prikaži poruku
  if (!user) {
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
        <Text color={colors.text} textAlign="center">
          Molimo prijavite se da biste koristili funkcionalnosti praćenja
          zdravlja.
        </Text>
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
      <Text fontSize="sm" color={colors.accent} mb={4} textAlign="center">
        {new Date(currentDate).toLocaleDateString("sr-RS", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
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
              disabled={loading}
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

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
  IconButton,
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
  FaPenToSquare,
} from "react-icons/fa6";
import UsageCircleIcon from "./UsageCircleIcon";
import HealthSectionEditModal from "./HealthSectionEditModal";
import { useUserStore } from "../store/userStore";
import { healthAPI, healthItemsAPI } from "../services/api";

// Mapiranje ikona po ključevima
const ICON_MAP = {
  water: <FaGlassWater size={40} color="#D5CCAB" />,
  food: <FaAppleWhole size={40} color="#D5CCAB" />,
  training: <FaDumbbell size={40} color="#D5CCAB" />,
  supplements: <FaPills size={40} color="#D5CCAB" />,
  running: <FaPersonRunning size={40} color="#D5CCAB" />,
  sleep: <FaBed size={40} color="#D5CCAB" />,
  heart: <FaHeart size={40} color="#D5CCAB" />,
  brain: <FaBrain size={40} color="#D5CCAB" />,
};

// Default health items (ako nema podataka u bazi)
const DEFAULT_HEALTH_ITEMS = [
  {
    key: "water",
    label: "Voda",
    iconKey: "water",
    color: "#A3A289",
    limit: 8,
  },
  {
    key: "food",
    label: "Hrana",
    iconKey: "food",
    color: "#A3A289",
    limit: 3,
  },
  {
    key: "training",
    label: "Trening",
    iconKey: "training",
    color: "#D5CCAB",
    limit: 1,
  },
  {
    key: "supplements",
    label: "Suplementi",
    iconKey: "supplements",
    color: "#6A6352",
    limit: 2,
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
  const [usages, setUsages] = useState({});
  const [healthItems, setHealthItems] = useState(DEFAULT_HEALTH_ITEMS);
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });

  // Modal state
  const [editItem, setEditItem] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Funkcija za formatiranje datuma
  const formatDateForAPI = (date) => {
    const d = new Date(date);
    // Koristi lokalni datum umesto UTC
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // YYYY-MM-DD format
  };

  // Učitaj health items i podatke za današnji datum
  useEffect(() => {
    if (user && token) {
      loadHealthItems();
    }
  }, [user, token]);

  // Učitaj health podatke kada se healthItems promene
  useEffect(() => {
    if (user && token && healthItems.length > 0) {
      loadHealthData();
    }
  }, [user, token, healthItems, currentDate]);

  const loadHealthItems = async () => {
    if (!user || !token) return;

    try {
      const response = await healthItemsAPI.getHealthItems(token);

      if (response && response.length > 0) {
        // Proveri da li nedostaju neki default items
        const existingKeys = response.map((item) => item.key);
        const missingItems = DEFAULT_HEALTH_ITEMS.filter(
          (item) => !existingKeys.includes(item.key)
        );

        if (missingItems.length > 0) {
          // Kreiraj nedostajuće items
          await createMissingHealthItems(missingItems);
          // Ponovo učitaj sve items
          const updatedResponse = await healthItemsAPI.getHealthItems(token);
          setHealthItems(updatedResponse);
        } else {
          setHealthItems(response);
        }

        // Inicijalizuj usages za sve item-e
        const initialUsages = {};
        (response.length > 0 ? response : DEFAULT_HEALTH_ITEMS).forEach(
          (item) => {
            initialUsages[item.key] = 0;
          }
        );
        setUsages(initialUsages);
      } else {
        // Ako nema podataka u bazi, kreiraj default health items
        await createDefaultHealthItems();
      }
    } catch (error) {
      console.error("Greška pri učitavanju health items:", error);
      // Koristi default ako ne može da učita sa backend-a
      setHealthItems(DEFAULT_HEALTH_ITEMS);
      const initialUsages = {};
      DEFAULT_HEALTH_ITEMS.forEach((item) => {
        initialUsages[item.key] = 0;
      });
      setUsages(initialUsages);
    }
  };

  const createMissingHealthItems = async (missingItems) => {
    try {
      const createdItems = [];

      for (const item of missingItems) {
        const newItem = await healthItemsAPI.createHealthItem(item, token);
        createdItems.push(newItem);
      }

      toast({
        title: "Uspešno",
        description: `Kreirano ${createdItems.length} nedostajućih health items`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Greška pri kreiranju nedostajućih health items:", error);
      toast({
        title: "Greška",
        description: "Nije moguće kreirati nedostajuće health items",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const createDefaultHealthItems = async () => {
    try {
      const createdItems = [];

      // Kreiraj sve default health items u bazi
      for (const defaultItem of DEFAULT_HEALTH_ITEMS) {
        const newItem = await healthItemsAPI.createHealthItem(
          defaultItem,
          token
        );
        createdItems.push(newItem);
      }

      setHealthItems(createdItems);

      // Inicijalizuj usages
      const initialUsages = {};
      createdItems.forEach((item) => {
        initialUsages[item.key] = 0;
      });
      setUsages(initialUsages);

      toast({
        title: "Uspešno",
        description: "Default health items su kreirani",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Greška pri kreiranju default health items:", error);
      // Ako ne može da kreira u bazi, koristi default lokalno
      setHealthItems(DEFAULT_HEALTH_ITEMS);
      const initialUsages = {};
      DEFAULT_HEALTH_ITEMS.forEach((item) => {
        initialUsages[item.key] = 0;
      });
      setUsages(initialUsages);
    }
  };

  const loadHealthData = async () => {
    if (!user || !token) return;

    setLoading(true);
    try {
      const formattedDate = formatDateForAPI(currentDate);
      const response = await healthAPI.getHealthLog(formattedDate, token);

      // Ako postoje podaci za današnji datum, koristi ih
      if (response && response.length > 0) {
        const todayData = response[0]; // Uzmi prvi log za današnji datum

        // Dinamički ažuriraj usages za sve health item-e
        setUsages((prev) => {
          const updatedUsages = { ...prev };

          // Ažuriraj samo one ključeve koji postoje u health items
          healthItems.forEach((item) => {
            if (todayData[item.key] !== undefined) {
              updatedUsages[item.key] = todayData[item.key] || 0;
            }
          });

          return updatedUsages;
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

    const item = healthItems.find((item) => item.key === key);
    if (!item) return;

    const newValue = Math.min((usages[key] || 0) + 1, item.limit);

    // Optimistički update UI-a
    setUsages((prev) => ({
      ...prev,
      [key]: newValue,
    }));

    try {
      const formattedDate = formatDateForAPI(currentDate);
      // Pošalji podatke na backend
      await healthAPI.updateHealthLog(
        {
          date: formattedDate,
          [key]: newValue,
        },
        token
      );

      toast({
        title: "Uspešno",
        description: `${item.label} ažuriran`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Greška pri ažuriranju:", error);

      // Vrati na prethodnu vrednost ako je došlo do greške
      setUsages((prev) => ({
        ...prev,
        [key]: usages[key] || 0,
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

  const handleEditItem = (item) => {
    setEditItem(item);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditItem(null);
    setIsEditModalOpen(false);
  };

  const handleItemUpdated = async (updatedItem) => {
    try {
      if (updatedItem._id) {
        // Ažuriraj postojeći item
        await healthItemsAPI.updateHealthItem(
          updatedItem._id,
          updatedItem,
          token
        );
      } else {
        // Kreiraj novi item
        const newItem = await healthItemsAPI.createHealthItem(
          updatedItem,
          token
        );
        updatedItem = newItem;
      }

      // Ažuriraj lokalni state
      setHealthItems((prev) =>
        prev.map((item) => (item.key === updatedItem.key ? updatedItem : item))
      );

      toast({
        title: "Uspešno",
        description: `${updatedItem.label} je ažuriran`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Greška pri ažuriranju health item-a:", error);
      toast({
        title: "Greška",
        description: "Nije moguće ažurirati health item",
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

      {/* Dugme za kreiranje default items ako nedostaju */}
      {healthItems.length < 4 && (
        <Box mb={4} textAlign="center">
          <Button
            size="sm"
            onClick={createDefaultHealthItems}
            colorScheme="teal"
            bg={colors.accent}
            color={colors.text}
            _hover={{ bg: colors.text, color: colors.card }}
          >
            Kreiraj default health items
          </Button>
        </Box>
      )}

      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
        {healthItems.map((item) => (
          <VStack key={item.key} spacing={2} position="relative">
            <UsageCircleIcon
              maxUses={item.limit}
              used={usages[item.key] || 0}
              onUse={() => handleUse(item.key)}
              icon={ICON_MAP[item.iconKey] || ICON_MAP.water}
              activeColor="rgb(211,92,45)"
              size={90}
              disabled={loading}
            />
            <Text color={colors.text} fontWeight="medium">
              {item.label}
            </Text>
            <Text color={colors.accent} fontSize="sm">
              {usages[item.key] || 0} / {item.limit}
            </Text>
            <IconButton
              size="sm"
              icon={<FaPenToSquare />}
              onClick={() => handleEditItem(item)}
              variant="ghost"
              color={colors.accent}
              _hover={{ bg: colors.input }}
              position="absolute"
              top={0}
              right={0}
              aria-label="Izmeni"
            />
          </VStack>
        ))}
      </SimpleGrid>

      <HealthSectionEditModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        item={editItem}
        onUpdated={handleItemUpdated}
      />
    </Box>
  );
}

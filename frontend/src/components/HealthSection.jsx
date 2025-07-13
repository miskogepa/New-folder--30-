import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Text,
  useColorMode,
  SimpleGrid,
  Spinner,
  useToast,
  Button,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
} from "@chakra-ui/react";
import {
  FaGlassWater,
  FaAppleWhole,
  FaDumbbell,
  FaPills,
  FaCarrot,
  FaHeart,
  FaBed,
  FaLeaf,
  FaBicycle,
} from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import UsageCircleIcon from "./UsageCircleIcon";
import { useUserStore } from "../store/userStore";
import { healthAPI } from "../services/api";
import { healthCustomAPI } from "../services/api";

const ICON_OPTIONS = [
  { id: "glass", icon: <FaGlassWater size={32} /> },
  { id: "apple", icon: <FaAppleWhole size={32} /> },
  { id: "dumbbell", icon: <FaDumbbell size={32} /> },
  { id: "pills", icon: <FaPills size={32} /> },
  { id: "carrot", icon: <FaCarrot size={32} /> },
  { id: "heart", icon: <FaHeart size={32} /> },
  { id: "bed", icon: <FaBed size={32} /> },
  { id: "leaf", icon: <FaLeaf size={32} /> },
  { id: "bicycle", icon: <FaBicycle size={32} /> },
];

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
  const [customUsages, setCustomUsages] = useState({});
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
  const [editKey, setEditKey] = useState(null);
  const [editValue, setEditValue] = useState(1);
  const [customLabels, setCustomLabels] = useState({});
  const [customIcons, setCustomIcons] = useState({});
  const [editLabel, setEditLabel] = useState("");
  const [editIcon, setEditIcon] = useState(ICON_OPTIONS[0].id);
  const [customItems, setCustomItems] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newIcon, setNewIcon] = useState(ICON_OPTIONS[0].id);
  const [newLimit, setNewLimit] = useState(1);
  const [customLoading, setCustomLoading] = useState(false);

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
        setCustomUsages(data.customUsage || {});
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

  // Fetch custom items on mount
  useEffect(() => {
    if (!user || !token) return;
    setCustomLoading(true);
    healthCustomAPI
      .getCustomItems(token)
      .then(setCustomItems)
      .catch(() => setCustomItems([]))
      .finally(() => setCustomLoading(false));
  }, [user, token]);

  // Save to backend
  const saveHealth = (newUsages, newLimits, newCustomUsages = {}) => {
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
          customUsage: newCustomUsages,
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
    saveHealth(newUsages, limits, customUsages);
  };

  // Dodavanje nove custom stavke
  const handleAddCustom = async () => {
    if (!newLabel.trim()) return;
    setCustomLoading(true);
    try {
      const item = await healthCustomAPI.addCustomItem(
        { label: newLabel, iconId: newIcon, limit: newLimit },
        token
      );
      setCustomItems((prev) => [...prev, item]);
      setAddModalOpen(false);
      setNewLabel("");
      setNewIcon(ICON_OPTIONS[0].id);
      setNewLimit(1);
      toast({ title: "Stavka dodata!", status: "success", duration: 1500 });
    } catch (err) {
      toast({
        title: "Greška pri dodavanju",
        description: err.message,
        status: "error",
      });
    } finally {
      setCustomLoading(false);
    }
  };

  // Modal save
  const handleEditSave = async () => {
    if (!editKey) return;

    // Ako je custom item, ažuriraj ga u backend-u
    if (customItems.find((item) => item._id === editKey)) {
      try {
        await healthCustomAPI.updateCustomItem(
          editKey,
          {
            label: editLabel,
            iconId: editIcon,
            limit: parseInt(editValue) || 1,
          },
          token
        );
        // Ažuriraj lokalno stanje
        setCustomItems((prev) =>
          prev.map((item) =>
            item._id === editKey
              ? {
                  ...item,
                  label: editLabel,
                  iconId: editIcon,
                  limit: parseInt(editValue) || 1,
                }
              : item
          )
        );
        toast({
          title: "Stavka ažurirana!",
          status: "success",
          duration: 1500,
        });
      } catch (err) {
        toast({
          title: "Greška pri ažuriranju",
          description: err.message,
          status: "error",
        });
        return;
      }
    } else {
      // Za default items
      const newLimits = {
        ...limits,
        [editKey]: Math.max(1, parseInt(editValue) || 1),
      };
      setLimits(newLimits);
      // Reset usage if novi limit je manji
      const newUsages = {
        ...usages,
        [editKey]: Math.min(usages[editKey], newLimits[editKey]),
      };
      setUsages(newUsages);
      saveHealth(newUsages, newLimits, customUsages);
      setCustomLabels({ ...customLabels, [editKey]: editLabel });
      setCustomIcons({ ...customIcons, [editKey]: editIcon });
    }
    setEditKey(null);
  };

  // Kada se otvori modal, popuni vrednost
  useEffect(() => {
    if (editKey) {
      // Proveri da li je custom item
      const customItem = customItems.find((item) => item._id === editKey);
      if (customItem) {
        setEditValue(customItem.limit);
        setEditLabel(customItem.label);
        setEditIcon(customItem.iconId);
      } else {
        // Default item
        setEditValue(limits[editKey] || 1);
        setEditLabel(
          customLabels[editKey] ||
            HEALTH_ITEMS.find((i) => i.key === editKey)?.label ||
            ""
        );
        setEditIcon(customIcons[editKey] || ICON_OPTIONS[0].id);
      }
    }
  }, [editKey, customItems]);

  // Modal za edit limit biće dodat kasnije

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

  // Prikaz svih stavki (default + custom)
  const allItems = [
    ...HEALTH_ITEMS.map((item) => {
      const label = customLabels[item.key] || item.label;
      const iconId = customIcons[item.key];
      const iconObj = ICON_OPTIONS.find((ic) => ic.id === iconId);
      const icon = iconObj ? iconObj.icon : item.icon;
      return {
        ...item,
        label,
        icon,
        isCustom: false,
        key: item.key,
        limit: limits[item.key],
        usage: usages[item.key],
      };
    }),
    ...customItems.map((item) => {
      const iconObj = ICON_OPTIONS.find((ic) => ic.id === item.iconId);
      return {
        ...item,
        icon: iconObj ? iconObj.icon : ICON_OPTIONS[0].icon,
        isCustom: true,
        key: item._id,
        limit: item.limit,
        usage: customUsages[item._id] || 0,
      };
    }),
  ];

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
      <Button
        colorScheme="teal"
        mb={4}
        onClick={() => setAddModalOpen(true)}
        isLoading={customLoading}
      >
        Dodaj novu stavku
      </Button>
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
        {allItems.map((item) => (
          <VStack key={item.key} spacing={2}>
            <UsageCircleIcon
              maxUses={item.limit}
              used={item.usage}
              onUse={() => {
                if (item.isCustom) {
                  const newCustomUsages = {
                    ...customUsages,
                    [item.key]: Math.min(
                      (customUsages[item.key] || 0) + 1,
                      item.limit
                    ),
                  };
                  setCustomUsages(newCustomUsages);
                  saveHealth(usages, limits, newCustomUsages);
                } else {
                  handleUse(item.key);
                }
              }}
              icon={item.icon}
              activeColor="rgb(211,92,45)"
              size={90}
            />
            <Text color={colors.text} fontWeight="medium">
              {item.label}
            </Text>
            <Text color={colors.accent} fontSize="sm">
              {item.usage} / {item.limit}
            </Text>
            <HStack spacing={2}>
              <Button
                leftIcon={<FaEdit />}
                size="xs"
                colorScheme="teal"
                variant="outline"
                onClick={() => setEditKey(item.key)}
                isDisabled={saving}
              >
                Edit
              </Button>
              {item.isCustom && (
                <Button
                  size="xs"
                  colorScheme="red"
                  variant="outline"
                  onClick={async () => {
                    if (
                      window.confirm(
                        "Da li ste sigurni da želite da obrišete ovu stavku?"
                      )
                    ) {
                      try {
                        await healthCustomAPI.deleteCustomItem(item.key, token);
                        setCustomItems((prev) =>
                          prev.filter(
                            (customItem) => customItem._id !== item.key
                          )
                        );
                        // Ukloni usage iz customUsages
                        const newCustomUsages = { ...customUsages };
                        delete newCustomUsages[item.key];
                        setCustomUsages(newCustomUsages);
                        saveHealth(usages, limits, newCustomUsages);
                        toast({
                          title: "Stavka obrisana!",
                          status: "success",
                          duration: 1500,
                        });
                      } catch (err) {
                        toast({
                          title: "Greška pri brisanju",
                          description: err.message,
                          status: "error",
                        });
                      }
                    }
                  }}
                >
                  Delete
                </Button>
              )}
            </HStack>
          </VStack>
        ))}
      </SimpleGrid>
      {saving && (
        <Text color={colors.accent} fontSize="sm" mt={2} textAlign="center">
          Čuvanje...
        </Text>
      )}
      {/* Modal za dodavanje nove stavke */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        isCentered
      >
        <ModalOverlay />
        <ModalContent bg={colors.card} color={colors.text}>
          <ModalHeader>Dodaj novu health stavku</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={2} color={colors.text}>
              Naslov:
            </Text>
            <Input
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              size="lg"
              mb={3}
              bg={colors.input}
              color={colors.text}
              borderColor={colors.accent}
              _placeholder={{ color: colors.accent }}
            />
            <Text mb={2} color={colors.text}>
              Izaberi ikonicu:
            </Text>
            <SimpleGrid columns={5} spacing={2} mb={3}>
              {ICON_OPTIONS.map((ic) => (
                <Button
                  key={ic.id}
                  onClick={() => setNewIcon(ic.id)}
                  bg={newIcon === ic.id ? colors.accent : colors.input}
                  color={colors.text}
                  border={
                    newIcon === ic.id
                      ? `2px solid ${colors.text}`
                      : `1px solid ${colors.accent}`
                  }
                  _hover={{ bg: colors.accent, color: colors.card }}
                  size="lg"
                  p={2}
                >
                  {ic.icon}
                </Button>
              ))}
            </SimpleGrid>
            <Text mb={2} color={colors.text}>
              Dnevni limit:
            </Text>
            <Input
              type="number"
              min={1}
              max={99}
              value={newLimit}
              onChange={(e) => setNewLimit(e.target.value)}
              size="lg"
              bg={colors.input}
              color={colors.text}
              borderColor={colors.accent}
              _placeholder={{ color: colors.accent }}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => setAddModalOpen(false)}
              mr={3}
              variant="ghost"
            >
              Otkaži
            </Button>
            <Button
              colorScheme="teal"
              onClick={handleAddCustom}
              isLoading={customLoading}
              bg={colors.accent}
              color={colors.text}
              _hover={{ bg: colors.text, color: colors.card }}
            >
              Dodaj
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Modal za edit limit, label i ikonicu ostaje kao pre */}
      <Modal isOpen={!!editKey} onClose={() => setEditKey(null)} isCentered>
        <ModalOverlay />
        <ModalContent bg={colors.card} color={colors.text}>
          <ModalHeader>Izmeni stavku</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={2} color={colors.text}>
              Novi naslov:
            </Text>
            <Input
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              size="lg"
              mb={3}
              bg={colors.input}
              color={colors.text}
              borderColor={colors.accent}
              _placeholder={{ color: colors.accent }}
            />
            <Text mb={2} color={colors.text}>
              Izaberi ikonicu:
            </Text>
            <SimpleGrid columns={5} spacing={2} mb={3}>
              {ICON_OPTIONS.map((ic) => (
                <Button
                  key={ic.id}
                  onClick={() => setEditIcon(ic.id)}
                  bg={editIcon === ic.id ? colors.accent : colors.input}
                  color={colors.text}
                  border={
                    editIcon === ic.id
                      ? `2px solid ${colors.text}`
                      : `1px solid ${colors.accent}`
                  }
                  _hover={{ bg: colors.accent, color: colors.card }}
                  size="lg"
                  p={2}
                >
                  {ic.icon}
                </Button>
              ))}
            </SimpleGrid>
            <Text mb={2} color={colors.text}>
              Dnevni limit:
            </Text>
            <Input
              type="number"
              min={1}
              max={99}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              size="lg"
              bg={colors.input}
              color={colors.text}
              borderColor={colors.accent}
              _placeholder={{ color: colors.accent }}
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setEditKey(null)} mr={3} variant="ghost">
              Otkaži
            </Button>
            <Button
              colorScheme="teal"
              onClick={handleEditSave}
              isLoading={saving}
              bg={colors.accent}
              color={colors.text}
              _hover={{ bg: colors.text, color: colors.card }}
            >
              Sačuvaj
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

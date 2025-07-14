import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Grid,
  VStack,
  useColorMode,
  IconButton,
  Flex,
} from "@chakra-ui/react";
import { DEFAULT_HEALTH_ITEMS } from "../constants/healthItems";
import { ICONS as EDC_ICONS } from "../constants/edcIcons";
// HealthSection ikone (isti kao u HealthSection.jsx)
import {
  FaGlassWater,
  FaAppleWhole,
  FaDumbbell,
  FaPills,
} from "react-icons/fa6";
import { GiBackpack } from "react-icons/gi";
import EdcItemSelectModal from "../components/EdcItemSelectModal";
import {
  backpacksAPI,
  itemUsageAPI,
  healthAPI,
  edcItemsAPI,
} from "../services/api";
import { useUserStore } from "../store/userStore";
import UsageCircleIcon from "../components/UsageCircleIcon";
import { useHealthStore } from "../store/healthStore";

const HEALTH_ICON_MAP = {
  water: <FaGlassWater size={32} color="#D5CCAB" />,
  food: <FaAppleWhole size={32} color="#D5CCAB" />,
  training: <FaDumbbell size={32} color="#D5CCAB" />,
  supplements: <FaPills size={32} color="#6A6352" />,
};

const GRID_ROWS = 6;
const GRID_COLS = 3;
const GRID_SIZE = GRID_ROWS * GRID_COLS;

export default function Backpack() {
  const { colorMode } = useColorMode();
  const { user, token } = useUserStore();
  const { usages, loadHealthLog, updateUsage, healthItems, loadHealthItems } =
    useHealthStore();
  const [gridItems, setGridItems] = useState(Array(GRID_SIZE).fill(null));
  const [backpackId, setBackpackId] = useState(null);
  // State za praćenje koja ćelija se drži (drag)
  const [draggedGridIdx, setDraggedGridIdx] = useState(null);
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalGridIdx, setModalGridIdx] = useState(null);
  const [modalEdcType, setModalEdcType] = useState(null);
  // Ukloni nepotrebni lokalni state gridHealthUsages.
  const [currentDate, setCurrentDate] = useState(getTodayDateString());
  const [edcItems, setEdcItems] = useState([]);

  // Premesti getIconById ovde, unutar komponente
  function getIconById(id) {
    const edcItem = edcItems.find((item) => item._id === id);
    let iconId = id;
    if (edcItem) {
      iconId = edcItem.icon || edcItem.type;
    }
    const found = EDC_ICONS.find((ic) => ic.id === iconId);
    console.log(
      "getIconById called with id:",
      id,
      "iconId:",
      iconId,
      "found:",
      found
    );
    return found ? found.icon : null;
  }

  // Helper funkcija za današnji datum
  function getTodayDateString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Fetch grid i health items na mount-u
  useEffect(() => {
    async function fetchGridAndHealthItems() {
      if (!token) return;
      try {
        await loadHealthItems(token);
        const today = getTodayDateString();
        const res = await backpacksAPI.getBackpacksByDate(today, token);
        let grid = Array(GRID_SIZE).fill(null);
        if (res && res.grid && Array.isArray(res.grid)) {
          grid = [...res.grid];
        }
        setGridItems(grid);
        setBackpackId(res && res._id ? res._id : null);
      } catch (err) {
        setGridItems(Array(GRID_SIZE).fill(null));
        setBackpackId(null);
      }
    }
    fetchGridAndHealthItems();
  }, [token, loadHealthItems]);

  // Fetch EDC predmete korisnika na mount-u
  useEffect(() => {
    async function fetchEdcItems() {
      if (!token) return;
      try {
        const items = await edcItemsAPI.getItems(token);
        setEdcItems(items);
      } catch (err) {
        setEdcItems([]);
      }
    }
    fetchEdcItems();
  }, [token]);

  // Dodajem useEffect za učitavanje health loga na mount-u i promenu datuma/tokena
  useEffect(() => {
    if (token) loadHealthLog(currentDate, token);
  }, [currentDate, token, loadHealthLog]);

  // Sync grid sa backendom na svaku promenu
  const syncGrid = useCallback(
    async (newGrid) => {
      if (!token) return;
      const today = getTodayDateString();
      try {
        const payload = { date: today, grid: newGrid };
        const res = await backpacksAPI.createBackpack(payload, token);
        setBackpackId(res && res._id ? res._id : null);
      } catch (err) {
        // Optionally handle error
      }
    },
    [token]
  );

  // Handler za dodavanje ikonice u grid
  const handleAddToGrid = (item) => {
    const firstEmpty = gridItems.findIndex((cell) => cell === null);
    if (firstEmpty !== -1) {
      let gridItem = null;
      if (item.iconKey || item.icon) {
        gridItem = { type: "health", healthKey: item.iconKey || item.icon };
      } else if (item._id) {
        gridItem = { type: "edc", edcItemId: item._id };
      } else if (item.id) {
        gridItem = { type: "edc", edcItemId: item.id };
      }
      if (gridItem) {
        const newGrid = [...gridItems];
        newGrid[firstEmpty] = gridItem;
        setGridItems(newGrid);
        syncGrid(newGrid);
      }
    }
  };

  // Handler za prevlačenje (drag & drop)
  const handleDragStart = (e, item) => {
    // Za health ikonice šalji type: 'health', iconKey; za EDC šalji type: 'edc', id
    if (item.iconKey) {
      e.dataTransfer.setData(
        "application/json",
        JSON.stringify({ type: "health", iconKey: item.iconKey, key: item.key })
      );
    } else if (item.id) {
      e.dataTransfer.setData(
        "application/json",
        JSON.stringify({ type: "edc", id: item.id, edcType: item.id })
      );
    }
  };

  const handleDrop = (e, idx) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("application/json");
    if (!data) return;
    const dropData = JSON.parse(data);
    let gridItem = null;
    if (dropData.type === "health") {
      gridItem = { type: "health", healthKey: dropData.iconKey };
      const newGrid = [...gridItems];
      newGrid[idx] = gridItem;
      setGridItems(newGrid);
      syncGrid(newGrid);
    } else if (dropData.type === "edc") {
      setModalGridIdx(idx);
      setModalEdcType(dropData.id);
      setModalOpen(true);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Handler za drag iz grida
  const handleGridDragStart = (e, idx) => {
    setDraggedGridIdx(idx);
    e.dataTransfer.setData("text/plain", idx.toString());
  };

  // Handler za drop van grida (na Flex parent)
  const handleOuterDrop = (e) => {
    e.preventDefault();
    if (draggedGridIdx !== null) {
      const newGrid = [...gridItems];
      newGrid[draggedGridIdx] = null;
      setGridItems(newGrid);
      setDraggedGridIdx(null);
      syncGrid(newGrid);
    }
  };

  const handleOuterDragOver = (e) => {
    e.preventDefault();
  };

  // Kada korisnik izabere varijantu iz modala
  const handleSelectEdcVariant = async (selectedItem) => {
    if (modalGridIdx === null) return;
    console.log("handleSelectEdcVariant selectedItem:", selectedItem);
    const newGrid = [...gridItems];
    const edcItemId = selectedItem._id || selectedItem.id;
    console.log("handleSelectEdcVariant edcItemId:", edcItemId);
    newGrid[modalGridIdx] = { type: "edc", edcItemId };
    console.log("handleSelectEdcVariant newGrid:", newGrid);
    setGridItems(newGrid);
    setModalOpen(false);
    setModalGridIdx(null);
    setModalEdcType(null);
    syncGrid(newGrid);
  };

  // Handler za korišćenje health ikonice u gridu
  const handleGridHealthUse = (iconKey, limit) => {
    const newValue = Math.min((usages[iconKey] || 0) + 1, limit);
    updateUsage(iconKey, newValue, currentDate, token);
  };
  // Handler za reset health ikonice u gridu
  const handleGridHealthReset = (iconKey) => {
    updateUsage(iconKey, 0, currentDate, token);
  };

  return (
    <Flex
      direction="row"
      w="100vw"
      h="100vh"
      overflow="hidden"
      onDrop={handleOuterDrop}
      onDragOver={handleOuterDragOver}
    >
      {/* Leva strana: GRID */}
      <Box flex="1" overflowY="auto" p={2} position="relative">
        {/* Grid container sa siluetom ranca iznad ćelija */}
        <Box
          position="relative"
          maxW="400px"
          mx="auto"
          h={{ base: "90vh", md: "80vh" }}
        >
          {/* Silueta ranca iznad grida */}
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            zIndex={5}
            fontSize="25vw"
            opacity={0.25}
            pointerEvents="none"
            userSelect="none"
            w="100%"
            h="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <GiBackpack
              style={{
                width: "90%",
                height: "90%",
                color: "#D5CCAB",
                opacity: 0.2,
              }}
            />
          </Box>
          <Grid
            templateRows={`repeat(${GRID_ROWS}, 1fr)`}
            templateColumns={`repeat(${GRID_COLS}, 1fr)`}
            gap={0}
            h="100%"
            w="100%"
            bg={colorMode === "light" ? "gray.200" : "#2F3237"}
            borderRadius="lg"
            boxShadow="lg"
            position="relative"
            zIndex={3}
          >
            {gridItems.map((item, idx) => (
              <Box
                key={idx}
                bg={colorMode === "light" ? "gray.100" : "#3C4341"}
                borderRadius="none"
                display="flex"
                alignItems="center"
                justifyContent="center"
                minH="60px"
                minW="60px"
                aspectRatio="1/1"
                position="relative"
                border="1.5px solid #505143"
                zIndex={4}
                onDrop={(e) => handleDrop(e, idx)}
                onDragOver={handleDragOver}
                draggable={!!item}
                onDragStart={
                  item ? (e) => handleGridDragStart(e, idx) : undefined
                }
              >
                {item
                  ? item.type === "health"
                    ? (() => {
                        const healthItem = healthItems.find(
                          (h) => h.iconKey === item.healthKey
                        );
                        return (
                          <UsageCircleIcon
                            maxUses={healthItem?.limit || 1}
                            used={usages[item.healthKey] || 0}
                            onUse={() =>
                              handleGridHealthUse(
                                item.healthKey,
                                healthItem?.limit || 1
                              )
                            }
                            onReset={() =>
                              handleGridHealthReset(item.healthKey)
                            }
                            icon={HEALTH_ICON_MAP[item.healthKey]}
                            activeColor="#D55C2D"
                            size={60}
                          />
                        );
                      })()
                    : getIconById(item.edcItemId)
                  : null}
              </Box>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* Desna strana: SIDEBAR */}
      <VStack
        spacing={4}
        align="center"
        justify="flex-start"
        p={2}
        minW="80px"
        maxW="100px"
        h="100vh"
        bg={colorMode === "light" ? "gray.300" : "#505143"}
        overflowY="auto"
      >
        {/* Prvo health ikonice (bez labela, iste kao u HealthSection.jsx) */}
        {healthItems &&
          healthItems.length > 0 &&
          healthItems.map((item) => (
            <IconButton
              key={item.key || item.iconKey || item.icon}
              aria-label={item.label}
              icon={HEALTH_ICON_MAP[item.iconKey] || HEALTH_ICON_MAP[item.icon]}
              size="lg"
              variant="ghost"
              onClick={() => handleAddToGrid({ ...item })}
              draggable={true}
              onDragStart={(e) => handleDragStart(e, { ...item })}
            />
          ))}
        {/* Zatim EDC ikonice (bez labela) */}
        {EDC_ICONS.map((item, idx) => (
          <IconButton
            key={item.id || idx}
            aria-label={item.label || "EDC"}
            icon={item.icon}
            size="lg"
            variant="ghost"
            onClick={() => handleAddToGrid(item)}
            draggable={true}
            onDragStart={(e) => handleDragStart(e, item)}
          />
        ))}
      </VStack>
      <EdcItemSelectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        edcType={modalEdcType}
        onSelect={handleSelectEdcVariant}
      />
    </Flex>
  );
}

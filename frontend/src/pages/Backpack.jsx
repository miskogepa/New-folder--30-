import React, { useState } from "react";
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
  const [gridItems, setGridItems] = useState(Array(GRID_SIZE).fill(null));

  // Handler za dodavanje ikonice u grid (za sada samo klik, kasnije drag&drop)
  const handleAddToGrid = (item) => {
    const firstEmpty = gridItems.findIndex((cell) => cell === null);
    if (firstEmpty !== -1) {
      const newGrid = [...gridItems];
      newGrid[firstEmpty] = item;
      setGridItems(newGrid);
    }
  };

  return (
    <Flex direction="row" w="100vw" h="100vh" overflow="hidden">
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
                opacity: 0.20,
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
              >
                {item ? item.icon : null}
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
        {DEFAULT_HEALTH_ITEMS.map((item) => (
          <IconButton
            key={item.key}
            aria-label={item.label}
            icon={HEALTH_ICON_MAP[item.iconKey]}
            size="lg"
            variant="ghost"
            onClick={() =>
              handleAddToGrid({ ...item, icon: HEALTH_ICON_MAP[item.iconKey] })
            }
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
          />
        ))}
      </VStack>
    </Flex>
  );
}

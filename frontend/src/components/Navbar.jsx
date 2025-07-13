import React from "react";
import {
  Box,
  Flex,
  Button,
  Spacer,
  useColorMode,
  Link,
  HStack,
  Text,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  useDisclosure,
  Show,
  Hide,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useUserStore } from "../store/userStore";

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = (
    <>
      <Link
        as={RouterLink}
        to="/edc"
        fontWeight="bold"
        fontSize={{ base: "lg", md: "md" }}
      >
        Moj EDC
      </Link>
      <Link
        as={RouterLink}
        to="/backpack"
        fontWeight="bold"
        fontSize={{ base: "lg", md: "md" }}
      >
        Ranac
      </Link>
      <Link
        as={RouterLink}
        to="/health"
        fontWeight="bold"
        fontSize={{ base: "lg", md: "md" }}
      >
        Zdravlje
      </Link>
    </>
  );

  return (
    <Box
      as="nav"
      w="100%"
      bg={colorMode === "light" ? "gray.200" : "gray.700"}
      px={{ base: 2, md: 6 }}
      py={3}
      boxShadow="md"
    >
      <Flex align="center" justify="space-between">
        {/* Desktop meni */}
        <Hide below="md">
          <HStack spacing={6}>{navLinks}</HStack>
        </Hide>
        {/* Mobile meni - hamburger */}
        <Show below="md">
          <IconButton
            icon={<HamburgerIcon />}
            variant="ghost"
            aria-label="Otvori meni"
            onClick={onOpen}
            fontSize="2xl"
          />
          <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerBody>
                <VStack align="start" spacing={6} mt={10}>
                  {navLinks}
                  <Button onClick={toggleColorMode} w="100%">
                    {colorMode === "light" ? "Dark" : "Light"} tema
                  </Button>
                  <Button colorScheme="red" onClick={handleLogout} w="100%">
                    Logout
                  </Button>
                  {user && (
                    <Text fontSize="sm">
                      Prijavljen kao: <b>{user.username}</b>
                    </Text>
                  )}
                </VStack>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </Show>
        {/* Desktop dugmad */}
        <Hide below="md">
          <Flex align="center">
            {user && (
              <Text mr={4} fontSize="sm">
                Prijavljen kao: <b>{user.username}</b>
              </Text>
            )}
            <Button onClick={toggleColorMode} mr={2}>
              {colorMode === "light" ? "Dark" : "Light"} tema
            </Button>
            <Button colorScheme="red" onClick={handleLogout}>
              Logout
            </Button>
          </Flex>
        </Hide>
      </Flex>
    </Box>
  );
}

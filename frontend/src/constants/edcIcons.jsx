import {
  FaLightbulb,
  FaKey,
  FaWallet,
  FaPen,
  FaBook,
  FaBottleWater,
} from "react-icons/fa6";
import {
  GiSwissArmyKnife,
  GiFirstAidKit,
  GiWatch,
  GiKnifeFork,
} from "react-icons/gi";

export const ICONS = [
  { id: "lampa", icon: <FaLightbulb size={28} />, label: "Lampa" },
  { id: "multitool", icon: <GiSwissArmyKnife size={28} />, label: "Multitool" },
  { id: "sat", icon: <GiWatch size={28} />, label: "Sat" },
  { id: "prva_pomoc", icon: <GiFirstAidKit size={28} />, label: "Prva pomoć" },
  { id: "kljucevi", icon: <FaKey size={28} />, label: "Ključevi" },
  { id: "novcanik", icon: <FaWallet size={28} />, label: "Novčanik" },
  { id: "notes", icon: <FaBook size={28} />, label: "Notes" },
  { id: "olovka", icon: <FaPen size={28} />, label: "Olovka" },
  { id: "voda", icon: <FaBottleWater size={28} />, label: "Voda" },
  { id: "hrana", icon: <GiKnifeFork size={28} />, label: "Hrana" },
];

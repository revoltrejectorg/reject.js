import { ColorResolvable } from "discord.js";

export function rgbToHex(rgb: number) {
  return `#${rgb.toString(16).padStart(6, "0")}`;
}

export function discordJSColorToHex(color: ColorResolvable) {
  switch (color) {
    case "DEFAULT": return "#000000";
    case "AQUA": return "#1abc9c";
    case "GREEN": return "#2ecc71";
    case "BLUE": return "#3498db";
    case "PURPLE": return "#9b59b6";
    case "LUMINOUS_VIVID_PINK": return "#e91e63";
    case "GOLD": return "#f1c40f";
    case "ORANGE": return "#e67e22";
    case "RED": return "#e74c3c";
    case "GREY": return "#95a5a6";
    case "NAVY": return "#34495e";
    case "DARK_AQUA": return "#11806a";
    case "DARK_GREEN": return "#1f8b4c";
    case "DARK_BLUE": return "#206694";
    case "DARK_PURPLE": return "#71368a";
    case "DARK_VIVID_PINK": return "#ad1457";
    case "DARK_GOLD": return "#c27c0e";
    case "DARK_ORANGE": return "#a84300";
    case "DARK_RED": return "#992d22";
    case "DARK_GREY": return "#979c9f";
    case "DARKER_GREY": return "#7f8c8d";
    case "LIGHT_GREY": return "#bcbdc0";
    case "DARK_NAVY": return "#2c3e50";
    case "BLURPLE": return "#7289da";
    case "DARK_BUT_NOT_BLACK": return "#2e2f30";
    case "NOT_QUITE_BLACK": return "#23272a";
    case "RANDOM": return "#ffffff";
    default: return "#000000";
  }
}

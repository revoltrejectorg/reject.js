import { ColorResolvable } from "discord.js";
import { rgbToHex } from "./converters";

export const colorsMap: { [key: string]: string } = {
  DEFAULT: "#000000",
  AQUA: "#1abc9c",
  GREEN: "#2ecc71",
  BLUE: "#3498db",
  PURPLE: "#9b59b6",
  LUMINOUS_VIVID_PINK: "#e91e63",
  GOLD: "#f1c40f",
  ORANGE: "#e67e22",
  RED: "#e74c3c",
  GREY: "#95a5a6",
  NAVY: "#34495e",
  DARK_AQUA: "#11806a",
  DARK_GREEN: "#1f8b4c",
  DARK_BLUE: "#206694",
  DARK_PURPLE: "#71368a",
  DARK_VIVID_PINK: "#ad1457",
  DARK_GOLD: "#c27c0e",
  DARK_ORANGE: "#a84300",
  DARK_RED: "#992d22",
  DARK_GREY: "#8e8e8e",
  DARKER_GREY: "#7f8c8d",
  LIGHT_GREY: "#bcbdc0",
  DARK_NAVY: "#2c3e50",
  BLURPLE: "#7289da",
  DARK_BUT_NOT_BLACK: "#2f3640",
  NOT_QUITE_BLACK: "#23272a",
};

export function discordJSColorToHex(color: ColorResolvable) {
  if (color === "Random") {
    return rgbToHex(Math.floor(Math.random() * (0xffffff + 1)));
  }

  // eslint-disable-next-line dot-notation
  return colorsMap[color.toString()] ?? colorsMap["DEFAULT"];
}

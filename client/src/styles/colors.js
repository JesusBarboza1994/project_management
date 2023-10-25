const basicColors = {
  pink:{
   dark: "#BF5F82",
   medium: "#F48FB1",
   light: "#FFC1E3",
   shallow: "rgba(244, 143, 177, 0.15)",
  },
  white : "#FFFFFF",

  black : {
    dark : "#0B090A",
    light : "#363636",
    medium : "#161A1D",
  },

  red : {
    dark : "#660708",
    medium : "#A4161A",
    light : "#BA181B",
    highlight : "#E5383B",
  },

  gray : {
    medium : "#B1A7A6",
    light : "#D3D3D3",
    highlight : "#F5F3F4",
  },
  
  
};
export const colors = {
  randomColors: { pink: "#FFB6C1", red:"#FFA07A", orange:"#FFD700", green:"#98FB98", purple:"#DDA0DD", yellow:"#F0E68C", blue:"#87CEEB", salmon:"#FFC0CB"},
  primary:{
    dark:basicColors.red.dark,
    medium:basicColors.red.medium,
    light:basicColors.red.light,
    highlight:basicColors.red.highlight
  },
  secondary:{
    light: basicColors.black.light
  },
  tertiary:{
    dark: basicColors.gray.medium
  },
  font: {
    text:basicColors.gray.dark,
    title:basicColors.black.dark,
  },
  icon: {
    primary:basicColors.red.medium,
    secondary:basicColors.gray.light,
  },
  background : {
    blank: basicColors.white,
    light: basicColors.gray.light,
    medium: basicColors.black.medium
  }
}
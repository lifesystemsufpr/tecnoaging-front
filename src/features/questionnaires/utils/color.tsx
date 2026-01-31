import { Classification } from "../types/domain";

export const getSeverityColor = (status: Classification) => {
  switch (status) {
    case "Em Risco de Fragilização":
    case "Potencialmente Frágil":
      return "#FF9800";
    case "Frágil":
      return "#D32F2F";
    case "Robusto":
      return "#4CAF50";
    default:
      return "#BDBDBD";
  }
};

export const getBadgeStyles = (status: Classification) => {
  switch (status) {
    case "Em Risco de Fragilização":
    case "Potencialmente Frágil":
      return {
        backgroundColor: "#FFF3E0",
        color: "#E65100",
        borderColor: "#FFB74D",
      };
    case "Frágil":
      return {
        backgroundColor: "#FFEBEE",
        color: "#C62828",
        borderColor: "#EF9A9A",
      };
    case "Robusto":
      return {
        backgroundColor: "#E8F5E9",
        color: "#2E7D32",
        borderColor: "#81C784",
      };
    default:
      return {
        backgroundColor: "#F5F5F5",
        color: "#616161",
        borderColor: "#E0E0E0",
      };
  }
};

import * as React from "react";
import MuiButton, { ButtonProps as MuiButtonProps } from "@mui/material/Button";

type LegacySize = "sm" | "md";
type LegacyVariant = "primary" | "outline";

export interface ButtonProps {
  children: React.ReactNode;
  size?: LegacySize;
  variant?: LegacyVariant;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

// Mapas p/ MUI
const mapSize: Record<LegacySize, MuiButtonProps["size"]> = {
  sm: "small",
  md: "medium",
};

const mapVariant: Record<LegacyVariant, MuiButtonProps["variant"]> = {
  primary: "contained",
  outline: "outlined",
};

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  className,
  disabled = false,
}) => {
  return (
    <MuiButton
      size={mapSize[size]}
      variant={mapVariant[variant]}
      color="primary"
      startIcon={startIcon as any}
      endIcon={endIcon as any}
      onClick={onClick}
      className={className}
      disabled={disabled}
    >
      {children}
    </MuiButton>
  );
};

export default Button;

"use client";

import {
  Box,
  Card,
  CardActionArea,
  Chip,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { TestTypeConfig } from "./testTypeCard.types";

interface TestTypeCardProps {
  config: TestTypeConfig;
  selected?: boolean;
  onClick?: () => void;
}

export default function TestTypeCard({
  config,
  selected = false,
  onClick,
}: TestTypeCardProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const Icon = config.icon;

  const cardContent = (
    <Card
      variant="outlined"
      sx={{
        position: "relative",
        overflow: "visible",
        border: selected
          ? `2px solid ${config.color}`
          : `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"}`,
        borderRadius: 3,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        opacity: config.active ? 1 : 0.55,
        filter: config.active ? "none" : "grayscale(40%)",
        background: selected
          ? `linear-gradient(135deg, ${alpha(config.color, isDark ? 0.15 : 0.08)}, ${alpha(config.color, isDark ? 0.05 : 0.02)})`
          : isDark
            ? "rgba(255,255,255,0.03)"
            : "rgba(0,0,0,0.01)",
        "&:hover": config.active
          ? {
              transform: "translateY(-4px)",
              boxShadow: `0 8px 24px ${alpha(config.color, 0.25)}`,
              border: `2px solid ${alpha(config.color, 0.6)}`,
            }
          : {
              opacity: 0.7,
            },
      }}
    >
      {/* Badge de status */}
      {!config.active && (
        <Chip
          icon={<LockIcon sx={{ fontSize: 14 }} />}
          label="Em breve"
          size="small"
          sx={{
            position: "absolute",
            top: -10,
            right: 12,
            zIndex: 2,
            fontSize: 11,
            fontWeight: 600,
            height: 22,
            bgcolor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)",
            color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.5)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"}`,
            "& .MuiChip-icon": {
              color: "inherit",
            },
          }}
        />
      )}

      <CardActionArea
        disabled={!config.active}
        onClick={config.active ? onClick : undefined}
        sx={{
          px: 2.5,
          py: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1.5,
          cursor: config.active ? "pointer" : "default",
        }}
      >
        {/* Ícone com fundo circular */}
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `linear-gradient(135deg, ${alpha(config.color, 0.2)}, ${alpha(config.color, 0.1)})`,
            border: `2px solid ${alpha(config.color, config.active ? 0.4 : 0.2)}`,
            transition: "all 0.3s ease",
          }}
        >
          <Icon
            sx={{
              fontSize: 28,
              color: config.active
                ? config.color
                : isDark
                  ? "rgba(255,255,255,0.4)"
                  : "rgba(0,0,0,0.3)",
            }}
          />
        </Box>

        {/* Label */}
        <Typography
          variant="subtitle1"
          fontWeight={700}
          sx={{
            color: config.active
              ? config.color
              : isDark
                ? "rgba(255,255,255,0.5)"
                : "rgba(0,0,0,0.4)",
            letterSpacing: 0.5,
          }}
        >
          {config.label}
        </Typography>

        {/* Descrição */}
        <Typography
          variant="caption"
          sx={{
            color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)",
            textAlign: "center",
            lineHeight: 1.3,
            minHeight: 32,
          }}
        >
          {config.description}
        </Typography>

        {/* Indicador de ativo */}
        {config.active && (
          <Chip
            label="Ativo"
            size="small"
            sx={{
              mt: 0.5,
              fontSize: 11,
              fontWeight: 600,
              height: 22,
              bgcolor: alpha(config.color, 0.15),
              color: config.color,
              border: `1px solid ${alpha(config.color, 0.3)}`,
            }}
          />
        )}
      </CardActionArea>
    </Card>
  );

  if (!config.active) {
    return (
      <Tooltip
        title="Funcionalidade disponível em breve. Este teste será adicionado em futuras atualizações."
        arrow
        placement="top"
        slotProps={{
          tooltip: {
            sx: {
              bgcolor: isDark ? "rgba(30,30,30,0.95)" : "rgba(50,50,50,0.95)",
              color: "#fff",
              fontSize: 12,
              py: 1.2,
              px: 2,
              borderRadius: 2,
              maxWidth: 220,
              textAlign: "center",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            },
          },
          arrow: {
            sx: {
              color: isDark ? "rgba(30,30,30,0.95)" : "rgba(50,50,50,0.95)",
            },
          },
        }}
      >
        <Box>{cardContent}</Box>
      </Tooltip>
    );
  }

  return cardContent;
}

"use client";

import { Box, Card, CardContent, Typography } from "@/core/components/ui";
import { Lock } from "lucide-react";
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
  const isDark = false;
  const Icon = config.icon;

  function hexToRgba(hex: string, alpha = 1) {
    const h = hex.replace("#", "");
    const bigint = parseInt(
      h.length === 3
        ? h
            .split("")
            .map((c) => c + c)
            .join("")
        : h,
      16
    );
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  const cardContent = (
    <Card
      variant="outlined"
      className={`relative overflow-visible rounded-lg transition-all ${selected ? "border-2" : "border"}`}
      onClick={config.active ? onClick : undefined}
      role={config.active ? "button" : undefined}
      style={{
        opacity: config.active ? 1 : 0.55,
        filter: config.active ? "none" : "grayscale(40%)",
        borderColor: selected ? config.color : undefined,
      }}
    >
      {!config.active && (
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 12,
            zIndex: 2,
          }}
        >
          <div
            className="inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold"
            style={{
              background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)",
              color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.5)",
              border: isDark
                ? "1px solid rgba(255,255,255,0.15)"
                : "1px solid rgba(0,0,0,0.1)",
            }}
          >
            <Lock size={14} />
            <span style={{ marginLeft: 6 }}>Em breve</span>
          </div>
        </div>
      )}

      <CardContent
        className="px-4 py-3 flex flex-col items-center gap-3"
        style={{ cursor: config.active ? "pointer" : "default" }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `linear-gradient(135deg, ${hexToRgba(config.color, 0.2)}, ${hexToRgba(config.color, 0.1)})`,
            border: `2px solid ${hexToRgba(config.color, config.active ? 0.4 : 0.2)}`,
            transition: "all 0.3s ease",
          }}
        >
          <Icon
            size={28}
            color={
              config.active
                ? config.color
                : isDark
                  ? "rgba(255,255,255,0.4)"
                  : "rgba(0,0,0,0.3)"
            }
          />
        </div>

        <Typography
          className="text-sm font-bold text-center"
          style={{
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

        <Typography
          className="text-xs text-center"
          style={{
            color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)",
            lineHeight: 1.3,
            minHeight: 32,
          }}
        >
          {config.description}
        </Typography>
      </CardContent>
    </Card>
  );

  if (!config.active) {
    return (
      <div title="Funcionalidade disponível em breve. Este teste será adicionado em futuras atualizações.">
        <Box>{cardContent}</Box>
      </div>
    );
  }

  return cardContent;
}

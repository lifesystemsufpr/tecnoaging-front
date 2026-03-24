import * as React from "react";
import { Box, Card, Typography, Skeleton } from "@mui/material";

export const ProfileSkeleton = () => (
  <Card
    sx={{
      margin: "20px auto",
      padding: 3,
      boxShadow: 3,
    }}
  >
    {/* Cabeçalho - Avatar e Título */}
    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
      {/* Avatar (DB) */}
      <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
      <Box>
        {/* Nome (Dr. Bruno Lima) e Status */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Skeleton
            variant="text"
            width={150}
            height={28}
            sx={{ fontSize: "1.5rem", mr: 1 }}
          />
          <Skeleton
            variant="rectangular"
            width={70}
            height={20}
            sx={{ borderRadius: 1 }}
          />
          <Skeleton
            variant="rectangular"
            width={40}
            height={20}
            sx={{ borderRadius: 1, ml: 1 }}
          />
        </Box>
        {/* Atualizado em... */}
        <Skeleton
          variant="text"
          width={120}
          height={16}
          sx={{ fontSize: "0.875rem" }}
        />
      </Box>
    </Box>

    {/* Linha Divisória (opcional, dependendo do design real) */}
    {/* Você pode usar um Divider aqui, ou apenas o espaçamento. */}

    <Box sx={{ mt: 3 }}>
      {/* Campos de Informação - Nome, CPF, Telefone, etc. */}

      {/* Nome */}
      <Typography variant="body2" sx={{ fontWeight: "bold", mt: 2 }}>
        <Skeleton variant="text" width={50} />
      </Typography>
      <Skeleton variant="text" width={180} height={24} />

      {/* CPF */}
      <Typography variant="body2" sx={{ fontWeight: "bold", mt: 2 }}>
        <Skeleton variant="text" width={40} />
      </Typography>
      <Skeleton variant="text" width={150} height={24} />

      {/* Telefone */}
      <Typography variant="body2" sx={{ fontWeight: "bold", mt: 2 }}>
        <Skeleton variant="text" width={60} />
      </Typography>
      <Skeleton variant="text" width={130} height={24} />

      {/* Gênero */}
      <Typography variant="body2" sx={{ fontWeight: "bold", mt: 2 }}>
        <Skeleton variant="text" width={50} />
      </Typography>
      <Skeleton variant="text" width={100} height={24} />

      {/* Campo de estudo */}
      <Typography variant="body2" sx={{ fontWeight: "bold", mt: 2 }}>
        <Skeleton variant="text" width={100} />
      </Typography>
      <Skeleton variant="text" width={200} height={24} />

      {/* Instituição */}
      <Typography variant="body2" sx={{ fontWeight: "bold", mt: 2 }}>
        <Skeleton variant="text" width={80} />
      </Typography>
      <Skeleton variant="text" width={250} height={24} />
    </Box>
  </Card>
);

export default ProfileSkeleton;

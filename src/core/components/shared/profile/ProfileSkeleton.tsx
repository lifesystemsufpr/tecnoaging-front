import * as React from "react";
import { Card, Box, Skeleton } from "@/core/components/ui";

export const ProfileSkeleton = () => (
  <Card variant="elevated" className="border-gray-200">
    {/* Cabeçalho - Avatar e Título */}
    <Box display="flex" align="center" gap={2} mb={3}>
      {/* Avatar (DB) */}
      <Skeleton variant="circular" w={40} h={40} className="mr-2" />
      <Box>
        {/* Nome (Dr. Bruno Lima) e Status */}
        <Box display="flex" align="center" gap={1}>
          <Skeleton variant="text" w={150} h={28} />
          <Skeleton variant="rectangular" w={70} h={20} />
          <Skeleton variant="rectangular" w={40} h={20} />
        </Box>
        {/* Atualizado em... */}
        <Skeleton variant="text" w={120} h={16} />
      </Box>
    </Box>

    {/* Linha Divisória (opcional, dependendo do design real) */}
    {/* Você pode usar um Divider aqui, ou apenas o espaçamento. */}

    <Box mt={3}>
      {/* Campos de Informação - Nome, CPF, Telefone, etc. */}

      {/* Nome */}
      <Skeleton variant="text" w={50} />
      <Skeleton variant="text" w={180} h={24} />

      {/* CPF */}
      <Skeleton variant="text" w={40} />
      <Skeleton variant="text" w={150} h={24} />

      {/* Telefone */}
      <Skeleton variant="text" w={60} />
      <Skeleton variant="text" w={130} h={24} />

      {/* Gênero */}
      <Skeleton variant="text" w={50} />
      <Skeleton variant="text" w={100} h={24} />

      {/* Campo de estudo */}
      <Skeleton variant="text" w={100} />
      <Skeleton variant="text" w={200} h={24} />

      {/* Instituição */}
      <Skeleton variant="text" w={80} />
      <Skeleton variant="text" w={250} h={24} />
    </Box>
  </Card>
);

export default ProfileSkeleton;

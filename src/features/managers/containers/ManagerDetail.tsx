import { DetailManagerCard } from "../components/DetailManagerCard";
import { useDetailManager } from "../hooks/useDetailManager";
import { UserDetailHeader } from "@/core/components/shared/profile/UserDetailHeader";
import { UserDetailContent } from "@/core/components/shared";
import ProfileSkeleton from "@/core/components/shared/profile/ProfileSkeleton";
import { Separator, Typography } from "@/core/components/ui";

export interface DetailManagerProps {
  managerId: string;
}

export function ManagerDetail({ managerId }: DetailManagerProps) {
  const { data, isLoading, isError } = useDetailManager({ managerId });

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (isError || !data) {
    return <Typography>Erro ao carregar detalhes do Administrador.</Typography>;
  }

  return (
    <>
      <UserDetailHeader
        active={data.active}
        name={data.fullName}
        entity={"Administrador"}
        updatedAt={data.updatedAt}
      />

      <Separator className="my-6" />

      <UserDetailContent userData={data} />

      <DetailManagerCard manager={data} />
    </>
  );
}

import { SystemRoles } from "@/types/enums/system-roles";
import { Home, User, Users, Building2, Stethoscope } from "lucide-react";

interface NavItem {
  icon: React.ReactNode;
  name: string;
  path?: string;
  roles: SystemRoles[];
  subItems?: { name: string; path: string; pro: boolean }[];
}

export const navItems: NavItem[] = [
  {
    icon: <Home size={18} />,
    name: "Home",
    path: "/home",
    roles: [
      SystemRoles.HEALTH_PROFESSIONAL,
      SystemRoles.RESEARCHER,
      SystemRoles.PATIENT,
    ],
  },
  {
    icon: <Users size={18} />,
    name: "Usuários",
    path: "/users/researchers",
    roles: [SystemRoles.MANAGER],
    subItems: [
      {
        name: "Pesquisadores",
        path: "/users/researchers",
        pro: false,
      },
      {
        name: "Profissionais de Saúde",
        path: "/users/health-professionals",
        pro: false,
      },
      {
        name: "Participantes",
        path: "/users/participants",
        pro: false,
      },
    ],
  },
  {
    icon: <User size={18} />,
    name: "Participantes",
    path: "/users/participants",
    roles: [SystemRoles.HEALTH_PROFESSIONAL],
  },
  {
    icon: <Building2 size={18} />,
    name: "Instituições",
    path: "/institutions",
    roles: [SystemRoles.MANAGER],
    subItems: [
      {
        name: "Instituições de Saúde",
        path: "/health-unit",
        pro: false,
      },
      {
        name: "Instituições de Ensino",
        path: "/institutions",
        pro: false,
      },
    ],
  },
  {
    icon: <Stethoscope size={18} />,
    name: "Avaliações",
    roles: [SystemRoles.MANAGER, SystemRoles.RESEARCHER],
    subItems: [
      {
        name: "30 Seconds Sit to Stand",
        path: "/30sts",
        pro: false,
      },
    ],
  },
  {
    icon: <Stethoscope size={18} />,
    name: "Questionários",
    roles: [
      SystemRoles.MANAGER,
      SystemRoles.RESEARCHER,
      SystemRoles.HEALTH_PROFESSIONAL,
    ],
    path: "/questionnaires",
  },
];

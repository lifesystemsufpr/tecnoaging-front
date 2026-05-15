"use client";

import React from "react";
import { Pencil, LogOut, ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import {
  Avatar,
  Box,
  Typography,
  Dropdown,
  DropdownItem,
} from "@/core/components/ui";
import { useRouter } from "next/navigation";

export default function UserDropdown() {
  const { data: session, status } = useSession();
  const navigate = useRouter();
  const user = session?.user;
  const profile = session?.user?.role;
  const isPatient = profile === "patient";

  const handleLogout = () => {
    signOut({ callbackUrl: `${window.location.origin}/login` });
  };

  if (status === "loading") {
    return (
      <div className="flex items-center gap-3 animate-pulse">
        <div className="h-11 w-11 rounded-full bg-gray-300 dark:bg-gray-700" />
        <div className="flex flex-col gap-1">
          <div className="h-3 w-28 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="h-2 w-20 bg-gray-300 dark:bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  const dropdownItems: DropdownItem[] = [
    {
      label: user.username,
      disabled: true,
    },
    {
      label: "Editar Perfil",
      Icon: Pencil,
      onSelect: () => {
        navigate.push("/profile");
      },
    },
    {
      label: "Sair da conta",
      Icon: LogOut,
      onSelect: handleLogout,
    },
  ];

  return (
    <div className="relative">
      <Dropdown
        items={dropdownItems}
        trigger={({ open, toggle, close }) => (
          <Box
            onClick={(e) => {
              e.stopPropagation();
              toggle();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                toggle();
              }
            }}
            role="button"
            tabIndex={0}
            aria-haspopup="true"
            aria-expanded={open}
            display="flex"
            direction="row"
            align="center"
            gap={8}
            p={2}
            className="cursor-pointer select-none focus:outline-none rounded-md"
          >
            <Avatar />

            <ArrowDownIcon
              size={15}
              color="black"
              className={`transition-transform duration-200 ease-out ${
                open ? "rotate-180" : "rotate-0"
              }`}
            />
          </Box>
        )}
        placement="bottom-end"
        menuClassName="mt-0"
      />
    </div>
  );
}

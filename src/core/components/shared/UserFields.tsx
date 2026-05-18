"use client";

import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import type { UserFormData } from "@/lib/validators/user";
import { GENDER } from "@/types/enums/gender";
import { Input, Label, Select, IconButton } from "@/core/components/ui";
import { Eye, EyeOff } from "lucide-react";

const genderToBr = (g: string) => {
  switch (g) {
    case "MALE":
      return "Masculino";
    case "FEMALE":
      return "Feminino";
    case "OTHER":
      return "Outro";
    default:
      return g;
  }
};

interface UserFieldsProps {
  isEdit?: boolean;
  isPatient?: boolean;
}

export default function UserFields({
  isEdit = false,
  isPatient = false,
}: UserFieldsProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext<UserFormData>();

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-4">
      {/* Nome Completo */}
      <div>
        <Label htmlFor="fullName">Nome Completo *</Label>
        <Controller
          name="fullName"
          control={control}
          render={({ field }) => (
            <Input
              id="fullName"
              placeholder="Nome completo"
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              errorMessage={errors.fullName?.message}
            />
          )}
        />
      </div>

      {/* CPF + Senha */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Label htmlFor="cpf">CPF *</Label>
          <Controller
            name="cpf"
            control={control}
            render={({ field }) => (
              <Input
                id="cpf"
                placeholder="000.000.000-00"
                mask="cpf"
                unmask={false}
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                errorMessage={errors.cpf?.message}
              />
            )}
          />
        </div>

        <div className="flex-1">
          {!isPatient ? (
            <>
              <Label htmlFor="password">
                Senha {!isEdit && "*"}
              </Label>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 8 caracteres"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    errorMessage={errors.password?.message}
                    rightElement={
                      <IconButton
                        icon={showPassword ? EyeOff : Eye}
                        ariaLabel={
                          showPassword ? "Ocultar senha" : "Mostrar senha"
                        }
                        size="sm"
                        variant="ghost"
                        color="neutral"
                        onClick={() => setShowPassword((prev) => !prev)}
                      />
                    }
                  />
                )}
              />
            </>
          ) : (
            <>
              <Label htmlFor="password-info">Senha (Data de Nascimento)</Label>
              <Input
                id="password-info"
                value="Será a data de nascimento"
                disabled
              />
            </>
          )}
        </div>
      </div>

      {/* Telefone + Gênero */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Label htmlFor="phone">Telefone *</Label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Input
                id="phone"
                placeholder="(00) 90000-0000"
                mask="phone"
                unmask={false}
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                errorMessage={errors.phone?.message}
              />
            )}
          />
        </div>

        <div className="flex-1">
          <Label htmlFor="gender">Gênero Biológico</Label>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Select
                id="gender"
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
              >
                {Object.entries(GENDER).map(([key, value]) => (
                  <option key={key} value={key}>
                    {genderToBr(value)}
                  </option>
                ))}
              </Select>
            )}
          />
          {errors.gender && (
            <p className="text-xs text-destructive mt-1">
              {errors.gender.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

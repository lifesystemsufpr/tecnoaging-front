"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { healthUnitSchema, UF_LIST } from "@/lib/validators/health-unit";
import { HealthUnit } from "@/types/domain/Health-unit";
import { useCallback, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

import { Input, Label, Select, Button } from "@/core/components/ui";

type HealthUnitFormData = z.infer<typeof healthUnitSchema>;

interface HealthUnitFormProps {
  onSubmit?: (data: Partial<HealthUnit>) => void;
  initialValues?: Partial<HealthUnit>;
  submitLabel?: string;
}

export function HealthUnitForm({
  onSubmit,
  initialValues,
  submitLabel = "Salvar",
}: HealthUnitFormProps) {
  const [cepLoading, setCepLoading] = useState(false);

  const defaultValues: HealthUnitFormData = useMemo(
    () => ({
      id: initialValues?.id ?? undefined,
      name: initialValues?.name ?? "",
      zipCode: (initialValues?.zipCode ?? "").replace(/\D/g, "").slice(0, 8),
      street: initialValues?.street ?? "",
      number: initialValues?.number?.toString?.() ?? "",
      complement: initialValues?.complement ?? "",
      city: initialValues?.city ?? "",
      state: (initialValues?.state as HealthUnitFormData["state"]) ?? "",
      neighborhood: initialValues?.neighborhood ?? "",
    }),
    [initialValues]
  );

  const {
    control,
    handleSubmit,
    clearErrors,
    setError,
    setValue,
    register,
    formState: { isSubmitting, errors },
  } = useForm<HealthUnitFormData>({
    resolver: zodResolver(healthUnitSchema),
    defaultValues,
    mode: "onBlur",
  });

  const handleCepLookup = useCallback(
    async (raw: string) => {
      const cep = (raw || "").replace(/\D/g, "");
      if (cep.length !== 8) {
        setError("zipCode", { type: "manual", message: "CEP deve ter 8 dígitos" });
        return;
      }
      setCepLoading(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await res.json();
        if (data?.erro) {
          setError("zipCode", { type: "manual", message: "CEP não encontrado" });
          setValue("street", "");
          setValue("neighborhood", "");
          setValue("city", "");
          setValue("state", "");
          return;
        }
        clearErrors("zipCode");
        setValue("street", data.logradouro ?? "");
        setValue("neighborhood", data.bairro ?? "");
        setValue("city", data.localidade ?? "");
        setValue("state", (data.uf ?? "").toUpperCase());
      } catch {
        setError("zipCode", { type: "manual", message: "Erro ao consultar CEP" });
      } finally {
        setCepLoading(false);
      }
    },
    [clearErrors, setError, setValue]
  );

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit || (() => {}))}
      className="flex flex-col gap-6 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-[hsl(var(--foreground))]">
          {initialValues
            ? "Editar Unidade de Saúde"
            : "Cadastrar Unidade de Saúde"}
        </h2>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          {initialValues
            ? "Altere as informações necessárias e salve as alterações."
            : "Preencha os dados abaixo para registrar uma nova unidade no sistema."}
        </p>
      </div>

      {/* Nome */}
      <div>
        <Label htmlFor="hu-name">Nome da Unidade *</Label>
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <Input
              id="hu-name"
              placeholder="Nome da unidade de saúde"
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              errorMessage={fieldState.error?.message}
            />
          )}
        />
      </div>

      {/* CEP + Logradouro */}
      <div className="flex gap-4">
        <div className="w-40">
          <Label htmlFor="hu-zipCode">CEP *</Label>
          <Controller
            name="zipCode"
            control={control}
            render={({ field }) => (
              <Input
                id="hu-zipCode"
                placeholder="00000-000"
                mask="cep"
                unmask={true}
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={() => handleCepLookup(field.value ?? "")}
                name={field.name}
                errorMessage={errors.zipCode?.message}
                rightElement={
                  cepLoading ? (
                    <span className="animate-spin h-4 w-4 border-2 border-foreground-subtle border-t-transparent rounded-full" />
                  ) : undefined
                }
              />
            )}
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="hu-street">Logradouro (Rua/Avenida) *</Label>
          <Input
            id="hu-street"
            placeholder="Rua, Avenida..."
            errorMessage={errors.street?.message}
            {...register("street")}
          />
        </div>
      </div>

      {/* Número + Complemento + Bairro */}
      <div className="flex gap-4">
        <div className="w-28">
          <Label htmlFor="hu-number">Número *</Label>
          <Input
            id="hu-number"
            placeholder="Nº"
            errorMessage={errors.number?.message}
            {...register("number")}
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="hu-complement">Complemento</Label>
          <Input
            id="hu-complement"
            placeholder="Apto, Bloco..."
            errorMessage={errors.complement?.message}
            {...register("complement")}
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="hu-neighborhood">Bairro *</Label>
          <Input
            id="hu-neighborhood"
            placeholder="Bairro"
            errorMessage={errors.neighborhood?.message}
            {...register("neighborhood")}
          />
        </div>
      </div>

      {/* Cidade + UF */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Label htmlFor="hu-city">Cidade *</Label>
          <Input
            id="hu-city"
            placeholder="Cidade"
            errorMessage={errors.city?.message}
            {...register("city")}
          />
        </div>
        <div className="w-28">
          <Label htmlFor="hu-state">UF *</Label>
          <Controller
            name="state"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Select
                  id="hu-state"
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                  onBlur={field.onBlur}
                  name={field.name}
                >
                  <option value="">UF</option>
                  {UF_LIST.map((uf) => (
                    <option key={uf} value={uf}>
                      {uf}
                    </option>
                  ))}
                </Select>
                {fieldState.error && (
                  <p className="text-xs text-destructive mt-1">
                    {fieldState.error.message}
                  </p>
                )}
              </>
            )}
          />
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <Button type="submit" loading={isSubmitting}>
          {isSubmitting ? "Salvando..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}

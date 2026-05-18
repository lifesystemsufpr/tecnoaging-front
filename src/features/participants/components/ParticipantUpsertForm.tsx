"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useCallback, useState } from "react";

import { Input, Label, Select, Button } from "@/core/components/ui";
import UserFields from "@/core/components/shared/UserFields";
import { Participant } from "@/core/types";
import {
  patientCreateSchema,
  PatientFormData,
  patientUpdateSchema,
  UserFormData,
} from "@/core/libs/validators";
import {
  mapEntityToFormDefaults,
  mapPatientCreate,
  mapPatientUpdate,
} from "@/core/libs/mappers/user";
import { ScholarShip, SocioEconomicLevel, SystemRoles } from "@/core/enums";
import { socioLabel } from "@/core/utils";

import { UF_LIST } from "@/lib/validators/health-unit";
import { createPatient, updatePatient } from "@/services/api-patient";
interface ParticipantUpsertFormProps {
  editUser?: Participant | null;
  onSuccess?: () => void;
}

type FormValues = PatientFormData;

export function ParticipantUpsertForm({
  editUser,
  onSuccess,
}: ParticipantUpsertFormProps) {
  const isEdit = !!editUser;
  const { data: session } = useSession();
  const [step, setStep] = useState(0);
  const [cepLoading, setCepLoading] = useState(false);

  const schema = isEdit ? patientUpdateSchema : patientCreateSchema;

  const methods = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: isEdit
      ? (mapEntityToFormDefaults({
          ...editUser,
          role: SystemRoles.PATIENT,
        } as never) as unknown as FormValues)
      : {
          role: SystemRoles.PATIENT,
          fullName: "",
          cpf: "",
          password: "",
          phone: "",
          gender: "MALE",
          birthDate: "",
          weight: undefined,
          height: undefined,
          socioEconomicLevel: undefined,
          scholarShip: undefined,
          zipCode: "",
          street: "",
          number: "",
          complement: "",
          city: "",
          state: "",
          neighborhood: "",
        },
    mode: "onBlur",
    shouldUnregister: false,
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    setError,
    clearErrors,
    trigger,
    register,
  } = methods;

  // CEP lookup
  const handleCepLookup = useCallback(
    async (raw: string) => {
      const cep = (raw || "").replace(/\D/g, "");
      if (cep.length !== 8) {
        setError("zipCode", {
          type: "manual",
          message: "CEP deve ter 8 dígitos",
        });
        return;
      }
      setCepLoading(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await res.json();
        if (data?.erro) {
          setError("zipCode", {
            type: "manual",
            message: "CEP não encontrado",
          });
          setValue("state", "");
          setValue("city", "");
          setValue("neighborhood", "");
          setValue("street", "");
          return;
        }
        clearErrors("zipCode");
        setValue("state", data.uf || "");
        setValue("city", data.localidade || "");
        setValue("neighborhood", data.bairro || "");
        setValue("street", data.logradouro || "");
      } catch {
        setError("zipCode", {
          type: "manual",
          message: "Erro ao consultar CEP",
        });
      } finally {
        setCepLoading(false);
      }
    },
    [clearErrors, setError, setValue]
  );

  // Step 0 validation
  const step0Fields: Array<keyof PatientFormData | `${string}.${string}`> = [
    "birthDate",
    "weight",
    "height",
    "fullName",
    "cpf",
    "phone",
    "password",
  ];

  const handleNextStep = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ok = await trigger(step0Fields as any, { shouldFocus: true });
    if (ok) setStep(1);
  };

  const onSubmit = async (raw: FormValues) => {
    try {
      if (!session?.accessToken) throw new Error("Sem token de acesso");

      if (isEdit && editUser) {
        const payload = mapPatientUpdate(raw as unknown as UserFormData);
        await updatePatient(session.accessToken, editUser.id, payload);
        toast.success("Participante atualizado!");
      } else {
        const payload = mapPatientCreate(raw as unknown as UserFormData);
        await createPatient({
          access_token: session.accessToken,
          patientData: payload,
        });
        toast.success("Participante criado!");
      }

      onSuccess?.();
    } catch (err) {
      const message = (err as Error)?.message || String(err);
      if (message.includes("Unexpected token 'T'")) {
        toast.error("Erro no servidor. Funcionalidade não implementada.");
      } else {
        toast.error(message);
      }
      console.error("Submission error:", err);
    }
  };

  const onError = () => {
    toast.error("Erros no formulário, verifique os campos.");
  };

  return (
    <FormProvider {...methods}>
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit, onError)}
        className="flex flex-col gap-6 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div>
          <h2 className="text-xl font-semibold text-[hsl(var(--foreground))]">
            {isEdit ? "Editar Participante" : "Cadastrar Participante"}
          </h2>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            {isEdit
              ? "Altere as informações e salve."
              : "Preencha o formulário abaixo para cadastrar um novo participante."}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {/* ═══════ STEP 0 ═══════ */}
          <div className={step === 0 ? "block" : "hidden"}>
            {/* Campos compartilhados */}
            <UserFields isEdit={isEdit} isPatient />

            {/* Data de Nascimento */}
            <div className="mt-4">
              <Label htmlFor="birthDate">Data de Nascimento *</Label>
              <Controller
                name="birthDate"
                control={control}
                render={({ field }) => (
                  <Input
                    id="birthDate"
                    type="date"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    errorMessage={
                      (errors as Record<string, { message?: string }>).birthDate
                        ?.message
                    }
                  />
                )}
              />
            </div>

            {/* Peso + Altura */}
            <div className="mt-4 flex gap-4">
              <div className="flex-1">
                <Label htmlFor="weight">Peso (kg) *</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="Ex: 70"
                  errorMessage={errors.weight?.message}
                  {...register("weight", {
                    setValueAs: (v) => {
                      const s = String(v ?? "")
                        .replace(",", ".")
                        .trim();
                      if (s === "") return undefined;
                      const n = Number(s);
                      return Number.isNaN(n) ? undefined : n;
                    },
                  })}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="height">Altura (cm) *</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="Ex: 170"
                  errorMessage={errors.height?.message}
                  {...register("height", {
                    setValueAs: (v) => {
                      const s = String(v ?? "")
                        .replace(",", ".")
                        .trim();
                      if (s === "") return undefined;
                      const n = Number(s);
                      return Number.isNaN(n) ? undefined : n;
                    },
                  })}
                />
              </div>
            </div>

            {/* Botão Próximo */}
            <div className="mt-6 flex justify-end">
              <Button type="button" onClick={handleNextStep}>
                Próximo
              </Button>
            </div>
          </div>

          {/* ═══════ STEP 1 ═══════ */}
          <div className={step === 1 ? "block" : "hidden"}>
            {/* Socioeconômico + Escolaridade */}
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="socioEconomicLevel">Nível Socioeconômico</Label>
                <Controller
                  name="socioEconomicLevel"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="socioEconomicLevel"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                    >
                      <option value="">Selecione...</option>
                      {Object.values(SocioEconomicLevel).map((level) => (
                        <option key={level} value={level}>
                          {socioLabel(level)}
                        </option>
                      ))}
                    </Select>
                  )}
                />
                {errors.socioEconomicLevel && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.socioEconomicLevel.message}
                  </p>
                )}
              </div>
              <div className="flex-1">
                <Label htmlFor="scholarShip">Escolaridade *</Label>
                <Controller
                  name="scholarShip"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="scholarShip"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                    >
                      <option value="">Selecione...</option>
                      {Object.entries(ScholarShip).map(([key, value]) => (
                        <option key={key} value={key}>
                          {value}
                        </option>
                      ))}
                    </Select>
                  )}
                />
                {errors.scholarShip && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.scholarShip.message}
                  </p>
                )}
              </div>
            </div>

            {/* CEP + UF */}
            <div className="mt-4 flex gap-4">
              <div className="flex-1">
                <Label htmlFor="zipCode">CEP *</Label>
                <Controller
                  name="zipCode"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="zipCode"
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
              <div className="w-28">
                <Label htmlFor="state">UF *</Label>
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="state"
                      value={field.value ?? ""}
                      onChange={field.onChange}
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
                  )}
                />
                {errors.state && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.state.message}
                  </p>
                )}
              </div>
            </div>

            {/* Cidade + Bairro */}
            <div className="mt-4 flex gap-4">
              <div className="flex-1">
                <Label htmlFor="city">Cidade *</Label>
                <Input
                  id="city"
                  placeholder="Cidade"
                  errorMessage={errors.city?.message}
                  {...register("city")}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="neighborhood">Bairro *</Label>
                <Input
                  id="neighborhood"
                  placeholder="Bairro"
                  errorMessage={errors.neighborhood?.message}
                  {...register("neighborhood")}
                />
              </div>
            </div>

            {/* Rua + Número */}
            <div className="mt-4 flex gap-4">
              <div className="flex-[2]">
                <Label htmlFor="street">Rua *</Label>
                <Input
                  id="street"
                  placeholder="Logradouro"
                  errorMessage={errors.street?.message}
                  {...register("street")}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="number">Número *</Label>
                <Input
                  id="number"
                  placeholder="Nº"
                  errorMessage={errors.number?.message}
                  {...register("number")}
                />
              </div>
            </div>

            {/* Complemento */}
            <div className="mt-4">
              <Label htmlFor="complement">Complemento</Label>
              <Input
                id="complement"
                placeholder="Apto, Bloco, etc."
                errorMessage={errors.complement?.message}
                {...register("complement")}
              />
            </div>

            {/* Botões */}
            <div className="mt-6 flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(0)}
              >
                Voltar
              </Button>
              <Button type="submit" loading={isSubmitting}>
                {isEdit ? "Salvar alterações" : "Cadastrar"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

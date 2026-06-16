import { useCallback, useState } from "react";
import { useUpdateParticipant } from "./useUpdateParticipant";
import { useCreateParticipant } from "./useCreateParticipant";
import { Gender, ScholarShip, SocioEconomicLevel } from "@/core/enums";
import { Participant } from "@/core/types";
import { ParticipantNestedFormData } from "@/core/libs/validators";
import {
  participantNestedCreateSchema,
  participantNestedUpdateSchema,
  participantStep1Schema,
} from "@/core/libs/validators/index";
import { formatCPF, formatPhone, sanatizeCPF } from "@/core/utils";
import { fetchEnderecoViaCEP } from "@/core/utils/api";
import { toast } from "sonner";
import { extractFieldErrors, ValidationApiError } from "@/core/api";

function buildInitialFormData(
  editUser?: Participant | null
): ParticipantNestedFormData {
  return {
    birthday: editUser?.birthday ?? "",
    scholarship:
      (editUser?.scholarship as unknown as keyof typeof ScholarShip) ??
      ("NONE" as keyof typeof ScholarShip),
    socio_economic_level:
      editUser?.socio_economic_level ?? SocioEconomicLevel.A,
    weight: editUser?.weight ?? (undefined as unknown as number),
    height: editUser?.height ?? (undefined as unknown as number),
    zipCode: editUser?.zipCode ?? "",
    street: editUser?.street ?? "",
    number: editUser?.number ?? "",
    complement: editUser?.complement ?? "",
    neighborhood: editUser?.neighborhood ?? "",
    city: editUser?.city ?? "",
    state: editUser?.state ?? "",
    user: {
      fullName: editUser?.fullName ?? "",
      cpf: editUser?.cpf ? formatCPF(editUser.cpf) : "",
      phone: editUser?.phone ? formatPhone(editUser.phone) : "",
      gender: (editUser?.gender as Gender) ?? Gender.MALE,
      password: undefined,
      active: editUser?.active ?? true,
    },
  };
}

const STEP1_FIELDS = [
  "user.fullName",
  "user.cpf",
  "user.phone",
  "user.gender",
  "birthday",
  "weight",
  "height",
];

function formatBirthDayPassword(birthDay: string): string {
  if (!birthDay) return "";
  const date = new Date(birthDay);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = String(date.getFullYear());
  return `${dd}${mm}${yyyy}`;
}

interface UseParticipantFormOptions {
  editUser?: Participant | null;
  onSuccess?: () => void;
}

export function useParticipantForm({
  editUser,
  onSuccess,
}: UseParticipantFormOptions) {
  const updateMutation = useUpdateParticipant();
  const createMutation = useCreateParticipant();
  const isEdit = !!editUser;

  const [step, setStep] = useState(0);
  const [cepLoading, setCepLoading] = useState(false);
  const [formData, setFormData] = useState<ParticipantNestedFormData>(() =>
    buildInitialFormData(editUser)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const clearError = useCallback((path: string) => {
    setErrors((prev) => {
      if (!prev[path]) return prev;
      const next = { ...prev };
      delete next[path];
      return next;
    });
  }, []);

  // Generic setter using lodash path syntax (e.g. "user.fullName")
  function setField(path: string, value: unknown) {
    setFormData((prev) => {
      const parts = path.split(".");
      if (parts.length === 1) {
        return { ...prev, [parts[0]]: value };
      }
      const [parent, child] = parts;
      return {
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value,
        },
      };
    });
  }

  const handleCepLookup = useCallback(
    async (raw: string) => {
      const cep = (raw || "").replace(/\D/g, "");
      if (cep.length !== 8) {
        setErrors((prev) => ({ ...prev, zipCode: "CEP deve ter 8 dígitos" }));
        return;
      }
      setCepLoading(true);
      try {
        const res = await fetchEnderecoViaCEP(cep);
        if (res?.erro) {
          setErrors((prev) => ({ ...prev, zipCode: "CEP não encontrado" }));
          setFormData((prev) => ({
            ...prev,
            state: "",
            city: "",
            neighborhood: "",
            street: "",
          }));
          return;
        }
        clearError("zipCode");
        setFormData((prev) => ({
          ...prev,
          state: res.uf || "",
          city: res.localidade || "",
          neighborhood: res.bairro || "",
          street: res.logradouro || "",
        }));
      } catch {
        setErrors((prev) => ({ ...prev, zipCode: "Erro ao consultar CEP" }));
      } finally {
        setCepLoading(false);
      }
    },
    [clearError]
  );

  const applyZodErrors = (
    issues: { path: (string | number)[]; message: string }[]
  ) => {
    const nextErrors: Record<string, string> = {};
    issues.forEach((issue) => {
      const key = issue.path.join(".");
      if (!nextErrors[key]) nextErrors[key] = issue.message;
    });
    setErrors(nextErrors);
    return nextErrors;
  };

  const handleNextStep = useCallback(() => {
    const step1Data = {
      birthday: formData.birthday,
      weight: formData.weight,
      height: formData.height,
      user: formData.user,
    };
    const result = participantStep1Schema.safeParse(step1Data);
    if (result.success) {
      setErrors({});
      setStep(1);
      return;
    }
    applyZodErrors(result.error.issues);
  }, [formData]);

  const handleValidate = useCallback(() => {
    const schema = isEdit
      ? participantNestedUpdateSchema
      : participantNestedCreateSchema;
    const result = schema.safeParse(formData);
    if (result.success) {
      setErrors({});
      return true;
    }
    const nextErrors = applyZodErrors(result.error.issues);
    const hasStep1Error = Object.keys(nextErrors).some((k) =>
      STEP1_FIELDS.includes(k)
    );
    if (hasStep1Error) setStep(0);
    return false;
  }, [formData, isEdit]);

  const handleSubmit = useCallback(() => {
    if (!handleValidate()) return;

    const sanitizedCpf = sanatizeCPF(formData.user.cpf);
    const password = isEdit
      ? formData.user.password || undefined
      : formatBirthDayPassword(formData.birthday);

    const payload = {
      ...formData,
      user: {
        ...formData.user,
        cpf: sanitizedCpf,
        password,
      },
    };

    if (isEdit && editUser) {
      updateMutation.mutate(
        { id: editUser.id!, data: payload },
        {
          onSuccess: () => {
            toast.success("Participante atualizado com sucesso!");
            onSuccess?.();
          },
          onError: (error) => {
            const apiError = error as ValidationApiError;
            toast.error(apiError.message || "Erro ao atualizar participante");
            if (apiError.data?.details?.fields) {
              setErrors(extractFieldErrors(apiError.data));
            }
          },
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Participante cadastrado com sucesso!");
          onSuccess?.();
        },
        onError: (error) => {
          const apiError = error as ValidationApiError;
          toast.error(apiError.message || "Erro ao cadastrar participante");
          if (apiError.data?.details?.fields) {
            setErrors(extractFieldErrors(apiError.data));
          }
        },
      });
    }
  }, [
    formData,
    handleValidate,
    isEdit,
    editUser,
    updateMutation,
    createMutation,
    onSuccess,
  ]);

  return {
    step,
    setStep,
    formData,
    errors,
    cepLoading,
    isEdit,
    setField,
    clearError,
    handleCepLookup,
    handleNextStep,
    handleSubmit,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
  };
}

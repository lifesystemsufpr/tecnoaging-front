import { SystemRoles } from "@/types/enums/system-roles";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
  Button,
} from "@mui/material";
import ResearcherForm from "./ResearcherForm";
import { useForm, FormProvider, Controller, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  userSchema,
  UserFormData,
  userUpdateSchema,
  UserUpdateFormData,
} from "@/lib/validators/user";
import { Researcher } from "@/types/domain/Reseracher";
import { createResearcher, updateResearcher } from "@/services/api-researcher";
import { useSession } from "next-auth/react";
import {
  mapEntityToFormDefaults,
  mapHealthProCreate,
  mapHealthProUpdate,
  mapPatientCreate,
  mapPatientUpdate,
  mapResearcherCreate,
  mapResearcherUpdate,
} from "@/lib/mappers/userMappers";
import { useState } from "react";
import { toast } from "sonner";
import { Patient } from "@/types/domain/Patient";
import PatientForm from "./PatientForm";
import { createPatient, updatePatient } from "@/services/api-patient";
import { HealthProfessional } from "@/types/domain/Health-professional";
import HealthProfessionalForm from "./HealthProfessionalForm";
import {
  createHealthProfessional,
  updateHealthProfessional,
} from "@/services/api-health-professional";

interface UserUpsertFormProps {
  lockedRole?: SystemRoles;
  editUser?: Researcher | Patient | HealthProfessional | null;
  onHandle?: () => void;
}

const mapRoleToTitle = (role: SystemRoles | undefined) => {
  switch (role) {
    case SystemRoles.RESEARCHER:
      return "Pesquisador";
    case SystemRoles.PATIENT:
      return "Paciente";
    case SystemRoles.HEALTH_PROFESSIONAL:
      return "Profissional de Saúde";
    default:
      return "Usuário";
  }
};

export function UserCreateForm({
  lockedRole,
  editUser,
  onHandle,
}: UserUpsertFormProps) {
  const isEdit = !!editUser;
  const roleFromEntity =
    ((editUser as any)?.role as SystemRoles) ||
    ((editUser as any)?.user?.role as SystemRoles) ||
    undefined;

  const { data: session } = useSession();

  type FormValues = UserFormData | UserUpdateFormData;

  const resolver: Resolver<FormValues, any> = isEdit
    ? (zodResolver(userUpdateSchema) as Resolver<FormValues, any>)
    : (zodResolver(userSchema) as Resolver<FormValues, any>);

  const methods = useForm<UserFormData>({
    resolver,
    defaultValues: isEdit
      ? mapEntityToFormDefaults(editUser as any)
      : {
          role: (lockedRole
            ? lockedRole
            : SystemRoles.RESEARCHER) as SystemRoles.RESEARCHER,
          fullName: "",
          cpf: "",
          password: "",
          email: "",
          institution: "",
          fieldOfStudy: "",
          gender: "MALE",
          specialization: "",
        },
    mode: "onBlur",
    shouldUnregister: true,
  });

  const { handleSubmit, control, watch } = methods;
  const role = watch("role");

  const [errors, setErrors] = useState<any>(null);

  const onSubmit = async (raw: any) => {
    const data = raw as UserFormData | UserUpdateFormData;
    try {
      if (!session?.accessToken) throw new Error("Sem token de acesso");
      setErrors(null);

      if (isEdit) {
        switch (roleFromEntity ?? data.role) {
          case SystemRoles.RESEARCHER: {
            const payload = mapResearcherUpdate(data as UserUpdateFormData);
            await updateResearcher({
              id: (editUser as Researcher).id,
              data: payload,
              access_token: session.accessToken,
            });

            break;
          }
          case SystemRoles.PATIENT: {
            const payload = mapPatientUpdate(data as UserFormData);
            await updatePatient(
              session.accessToken,
              (editUser as Patient).id,
              payload
            );
            break;
          }
          case SystemRoles.HEALTH_PROFESSIONAL: {
            const payload = mapHealthProUpdate(data as UserUpdateFormData);
            await updateHealthProfessional({
              id: (editUser as HealthProfessional).id,
              data: payload,
              accessToken: session.accessToken,
            });
            break;
          }
        }
      } else {
        switch (data.role) {
          case SystemRoles.RESEARCHER: {
            const requestData = mapResearcherCreate(data as UserFormData);
            await createResearcher({
              data: requestData,
              access_token: session.accessToken,
            });
            break;
          }
          case SystemRoles.PATIENT: {
            const requestData = mapPatientCreate(data as UserFormData);
            await createPatient({
              access_token: session.accessToken,
              patientData: requestData,
            });
            break;
          }
          case SystemRoles.HEALTH_PROFESSIONAL: {
            const requestData = mapHealthProCreate(data as UserFormData);
            await createHealthProfessional({
              accessToken: session.accessToken,
              data: requestData,
            });
            break;
          }
        }
      }
      toast.success(isEdit ? "Usuário atualizado!" : "Usuário criado!");
      if (onHandle) onHandle();
    } catch (err) {
      if (err && (err as any).message.includes("Unexpected token 'T'")) {
        toast.error("Erro no servidor. Funcionalidade não implementada.");
      } else {
        toast.error(`${(err as any).message || err}`);
      }
      console.error("Submission error:", err);
      setErrors(err);
    } finally {
      if (errors) {
        return;
      }
    }
  };

  const onError = (err: any) => {
    console.warn("Form errors:", err);
    toast.error("Erros no formulário, verifique os campos.");
  };

  const roleDisabled = !!lockedRole || isEdit;

  return (
    <FormProvider {...methods}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit, onError)}
        noValidate
      >
        <Box>
          <Typography variant="h6" gutterBottom>
            {isEdit
              ? `Editar ${mapRoleToTitle(roleFromEntity)}`
              : `Cadastrar ${mapRoleToTitle(lockedRole)}`}
          </Typography>
          <Typography variant="body2" gutterBottom>
            {isEdit
              ? "Altere as informações e salve."
              : "Preencha o formulário abaixo para cadastrar um novo usuário."}
          </Typography>
        </Box>

        <Box mt={2} sx={{ display: "none" }}>
          <FormControl sx={{ width: "100%" }}>
            <FormLabel id="user-role-radio-group-label">Perfil</FormLabel>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  row
                  {...field}
                  aria-labelledby="user-role-radio-group-label"
                >
                  <FormControlLabel
                    value={SystemRoles.PATIENT}
                    control={<Radio />}
                    label="Paciente"
                    disabled={roleDisabled}
                  />
                  <FormControlLabel
                    value={SystemRoles.RESEARCHER}
                    control={<Radio />}
                    label="Pesquisador"
                    disabled={roleDisabled}
                  />
                  <FormControlLabel
                    value={SystemRoles.HEALTH_PROFESSIONAL}
                    control={<Radio />}
                    label="Profissional de Saúde"
                    disabled={roleDisabled}
                  />
                </RadioGroup>
              )}
            />
          </FormControl>
        </Box>

        <Box mt={2}>
          {/* Renderização condicional do sub-form */}
          {role === SystemRoles.RESEARCHER && (
            <ResearcherForm isEdit={isEdit} />
          )}
          {role === SystemRoles.PATIENT && <PatientForm isEdit={isEdit} />}
          {role === SystemRoles.HEALTH_PROFESSIONAL && (
            <HealthProfessionalForm isEdit={isEdit} />
          )}
        </Box>

        {lockedRole && lockedRole !== SystemRoles.PATIENT && (
          <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
            <Button type="submit" variant="contained">
              {isEdit ? "Salvar alterações" : "Cadastrar"}
            </Button>
          </Box>
        )}
      </Box>
    </FormProvider>
  );
}

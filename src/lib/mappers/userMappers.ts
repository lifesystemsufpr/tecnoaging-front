// lib/mappers/userMappers.ts
import { SystemRoles } from "@/types/enums/system-roles";
import type { UserFormData, UserUpdateFormData } from "@/lib/validators/user";
import type { Researcher } from "@/types/domain/Reseracher";
import { PatientRequest } from "@/types/api/Patient";
import { GENDER } from "@/types/enums/gender";
import { SocioEconomicLevel } from "@/types/enums/socio-economic-level";
import { ScholarShip } from "@/types/enums/scholar-ship";
import { HealthProfessionalRequest } from "@/types/api/Health-professional";
import { Patient } from "@/types/domain/Patient";
import { sanatizeCPF, sanatizePhone } from "@/utils/sanatize";
import { formatCpf } from "@/utils/format";
import { UF_LIST } from "@/types/enums/uf-list";

type HealthProfessional = any;

type AnyUserEntity = (Researcher | Patient | HealthProfessional) & {
  role: SystemRoles;
};

const toDateInput = (iso?: string | null) =>
  iso ? new Date(iso).toISOString().slice(0, 10) : "";

const normalizeEnumKey = <E extends Record<string, string>>(
  enumObj: E,
  v: unknown,
  fallback?: keyof E
): keyof E | undefined => {
  if (typeof v !== "string") return fallback;
  if (Object.prototype.hasOwnProperty.call(enumObj, v)) {
    return v as keyof E;
  }

  const entry = Object.entries(enumObj).find(([, value]) => value === v);
  return (entry?.[0] as keyof E | undefined) ?? fallback;
};
export function mapEntityToFormDefaults(
  entity: AnyUserEntity
): UserUpdateFormData {
  const role = entity.role || (entity as any)?.user?.role;
  switch (role) {
    case SystemRoles.RESEARCHER: {
      const r = entity as Researcher;
      return {
        role: SystemRoles.RESEARCHER,
        fullName: r.fullName,
        cpf: formatCpf(r.cpf),
        password: "",
        email: r.email,
        phone: r.phone ?? "",
        institution: r.institutionId ?? "",
        fieldOfStudy: r.fieldOfStudy ?? "",
        gender: r.gender ?? "OTHER",
      };
    }
    case SystemRoles.PATIENT: {
      const p = entity as Patient;
      return {
        role: SystemRoles.PATIENT,
        fullName: p.fullName ?? "",
        cpf: formatCpf(p.cpf) ?? "",
        password: "",
        confirmPassword: "",
        gender: (p.gender ?? p.gender ?? "OTHER") as
          | "MALE"
          | "FEMALE"
          | "OTHER",
        phone: p.phone ?? p.phone ?? "",

        // paciente
        birthDate: toDateInput(p.birthday),
        weight: typeof p.weight === "number" ? p.weight : undefined,
        height: typeof p.height === "number" ? p.height : undefined,

        socioEconomicLevel: normalizeEnumKey(
          SocioEconomicLevel,
          p.socio_economic_level
        ),
        scholarShip:
          normalizeEnumKey(ScholarShip, p.scholarship, "NONE") ?? "NONE",

        // endereço
        zipCode: p.zipCode ?? "",
        state: normalizeEnumKey(UF_LIST, p.state) ?? "",
        city: p.city ?? "",
        neighborhood: p.neighborhood ?? "",
        street: p.street ?? "",
        number: p.number ?? "",
        complement: p.complement ?? "",
      } as any;
    }
    case SystemRoles.HEALTH_PROFESSIONAL: {
      const hp = entity as HealthProfessional;
      return {
        role: SystemRoles.HEALTH_PROFESSIONAL,
        fullName: hp.fullName,
        cpf: formatCpf(hp.cpf),
        password: "",
        confirmPassword: "",
        gender: hp.gender ?? "OTHER",
        phone: hp.phone ?? "",
        email: hp.email,
        specialization: hp.speciality ?? "",
      } as any;
    }
  }
}

// Para CREATE (pesquisador)
export function mapResearcherCreate(data: UserFormData) {
  if (data.role !== SystemRoles.RESEARCHER) {
    throw new Error("Invalid role for researcher creation");
  }

  return {
    user: {
      fullName: data.fullName,
      cpf: sanatizeCPF(data.cpf),
      password: data.password,
      gender: GENDER[data.gender],
      phone: sanatizePhone(data.phone),
    },
    email: data.email,
    institutionId: data.institution,
    fieldOfStudy: data.fieldOfStudy ?? "Sem campo",
  };
}

// Para UPDATE (pesquisador)
export function mapResearcherUpdate(data: UserUpdateFormData) {
  if (data.role !== SystemRoles.RESEARCHER) {
    throw new Error("Invalid role for researcher update");
  }

  const payload: any = {
    user: {
      fullName: data.fullName,
      cpf: sanatizeCPF(data.cpf),
      phone: sanatizePhone(data.phone) || "",
      gender: data.gender || "OTHER",
    },
    email: data.email,
    institutionId: data.institution,
    fieldOfStudyId: data.fieldOfStudy,
    specialityId: data.specialization ?? "",
  };
  if (data.password && data.password.trim().length > 0) {
    payload.user.password = data.password;
  }
  return payload;
}

export function mapPatientCreate(data: UserFormData): PatientRequest {
  if (data.role !== SystemRoles.PATIENT) {
    throw new Error("Invalid role for patient creation");
  }

  const socioLevel =
    typeof data.socioEconomicLevel === "number"
      ? SocioEconomicLevel[data.socioEconomicLevel]
      : data.socioEconomicLevel;

  return {
    user: {
      cpf: sanatizeCPF(data.cpf),
      fullName: data.fullName,
      gender: GENDER[data.gender],
      phone: sanatizePhone(data.phone) || "",
      password: data.password,
    },
    birthday: data.birthDate,
    scholarship: String(data.scholarShip),
    socio_economic_level: String(socioLevel),
    weight: data.weight,
    height: data.height,
    zipCode: data.zipCode,
    street: data.street,
    number: data.number,
    complement: data.complement || "",
    neighborhood: data.neighborhood,
    city: data.city,
    state: data.state,
  };
}

export function mapPatientUpdate(data: UserFormData): PatientRequest {
  if (data.role !== SystemRoles.PATIENT) {
    throw new Error("Invalid role for patient update");
  }
  const socioLevel =
    typeof data.socioEconomicLevel === "number"
      ? SocioEconomicLevel[data.socioEconomicLevel]
      : data.socioEconomicLevel;
  return {
    user: {
      cpf: sanatizeCPF(data.cpf),
      fullName: data.fullName,
      phone: data.phone ? sanatizePhone(data.phone) : "",
      gender: GENDER[data.gender],
    },
    birthday: data.birthDate,
    scholarship: String(data.scholarShip),
    socio_economic_level: String(socioLevel),
    weight: data.weight,
    height: data.height,

    zipCode: data.zipCode,
    street: data.street,
    number: data.number,
    complement: data.complement || "",
    neighborhood: data.neighborhood,
    city: data.city,
    state: data.state,
  };
}

export function mapHealthProCreate(
  data: UserFormData
): HealthProfessionalRequest {
  if (data.role !== SystemRoles.HEALTH_PROFESSIONAL) {
    throw new Error("Invalid role for health professional creation");
  }
  return {
    user: {
      fullName: data.fullName,
      cpf: sanatizeCPF(data.cpf),
      gender: GENDER[data.gender],
      phone: sanatizePhone(data.phone) || "",
      password: data.password,
    },
    email: data.email,
    speciality: data.specialization,
  };
}

export function mapHealthProUpdate(
  data: UserFormData
): HealthProfessionalRequest {
  if (data.role !== SystemRoles.HEALTH_PROFESSIONAL) {
    throw new Error("Invalid role for health professional update");
  }
  return {
    user: {
      fullName: data.fullName,
      cpf: sanatizeCPF(data.cpf),
      phone: data.phone ? sanatizePhone(data.phone) : "",
      gender: GENDER[data.gender],
      password: data.password,
    },
    email: data.email,
    speciality: data.specialization,
  };
}

import { Evaluation } from "@/types/domain/Evaluation";
import { GENDER } from "@/types/enums/gender";
import { ScholarShip } from "@/types/enums/scholar-ship";
import { SocioEconomicLevel } from "@/types/enums/socio-economic-level";

const MOCK_EVALUATION: Evaluation = {
  id: "db23c232-841b-484f-b21f-c83f8c0e4c46",
  type: "5TSTS",
  patientId: "c6097a7c-4fc3-49f2-922b-2e76ef38f80a",
  healthProfessionalId: "3e314388-946b-4962-970e-15435527e4d6",
  healthcareUnitId: "c6ef0e54-ccaa-4d29-a8fc-6ba2c91614ea",
  date: "2025-09-10T00:00:00.000Z",
  time_init: "2025-09-10T01:42:28.474Z",
  time_end: "2025-09-10T01:42:43.474Z",
  updatedAt: "2025-09-10T01:42:28.476Z",
  totalTime: "00:00:15",
  patient: {
    id: "c6097a7c-4fc3-49f2-922b-2e76ef38f80a",
    fullName: "João da Silva",
    cpf: "12345678900",
    gender: GENDER.MALE,
    weight: 80,
    height: 175,
    phone: "11999999999",
    birthday: "1980-01-15",
    scholarship: ScholarShip.HIGHER_EDUCATION_COMPLETE,
    socio_economic_level: SocioEconomicLevel.C,
    zipCode: "01000-000",
    street: "Rua Exemplo",
    number: "123",
    city: "São Paulo",
    state: "SP",
    neighborhood: "Centro",
  },
  healthProfessional: {
    id: "3e314388-946b-4962-970e-15435527e4d6",
    user: {
      fullName: "Dra. Ana Costa",
      cpf: "00987654321",
      gender: GENDER.FEMALE,
      phone: "11988888888",
    },
    email: "ana.costa@example.com",
    speciality: "Fisioterapeuta",
  },
  healthcareUnit: {
    id: "c6ef0e54-ccaa-4d29-a8fc-6ba2c91614ea",
    name: "Clínica Bem Estar",
    zipCode: "01000-000",
    street: "Rua Exemplo",
    number: "123",
    city: "São Paulo",
    state: "SP",
    neighborhood: "Centro",
  },
  sensorData: [
    {
      id: "1eee5551-2fc0-40fb-b93b-01359f3005e2",
      timestamp: "2025-09-10T01:42:28.474Z",
      accel_x: 0.1,
      accel_y: 0.2,
      accel_z: 1.5,
      gyro_x: 0.3,
      gyro_y: 0.4,
      gyro_z: 0.5,
      evaluationId: "db23c232-841b-484f-b21f-c83f8c0e4c46",
    },
    {
      id: "26b6107d-b891-44f8-86da-d9197f8b089b",
      timestamp: "2025-09-10T01:42:28.574Z",
      accel_x: 0.12,
      accel_y: 0.23,
      accel_z: 0.8,
      gyro_x: 0.34,
      gyro_y: 0.45,
      gyro_z: 0.56,
      evaluationId: "db23c232-841b-484f-b21f-c83f8c0e4c46",
    },
  ],
};

const MOCK_ALL_EVALUATIONS: Evaluation[] = [
  {
    ...MOCK_EVALUATION,
    id: "1",
    date: "2025-09-01T00:00:00.000Z",
    totalTime: "00:00:18",
  },
  {
    ...MOCK_EVALUATION,
    id: "2",
    date: "2025-09-05T00:00:00.000Z",
    totalTime: "00:00:16",
  },
  MOCK_EVALUATION,
];

export const evaluationsApi = {
  getEvaluationDetails: async (id: string): Promise<Evaluation> => {
    console.log(`Fetching evaluation details for id: ${id}`);
    return new Promise((resolve) =>
      setTimeout(() => resolve(MOCK_EVALUATION), 500)
    );
  },
  getAllEvaluations: async (): Promise<Evaluation[]> => {
    console.log("Fetching all evaluations");
    return new Promise((resolve) =>
      setTimeout(() => resolve(MOCK_ALL_EVALUATIONS), 500)
    );
  },
};

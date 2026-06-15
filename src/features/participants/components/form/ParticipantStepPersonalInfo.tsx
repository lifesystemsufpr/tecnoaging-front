import { Box, Button, Grid, Input, Label, Select } from "@/core/components/ui";
import { Gender } from "@/core/enums";
import { ParticipantNestedFormData } from "@/core/libs/validators";
import { fmtNumber } from "@/core/utils";

interface StepPersonalInfoProps {
  formData: ParticipantNestedFormData;
  errors: Record<string, string>;
  onChange: (path: string, value: any) => void;
  onClearError: (path: string) => void;
  onNext: () => void;
}

export function ParticipantStepPersonalInfo({
  formData,
  errors,
  onChange,
  onClearError,
  onNext,
}: StepPersonalInfoProps) {
  return (
    <Grid container spacing={24}>
      <Grid item xs={12}>
        <Label htmlFor="fullName">Nome Completo</Label>
        <Input
          id="fullName"
          mask="name"
          max={250}
          min={4}
          placeholder="Nome Completo"
          value={formData.user.fullName}
          errorMessage={errors["user.fullName"]}
          onChange={(e) => {
            onClearError("user.fullName");
            onChange("user.fullName", e.target.value);
          }}
          type="text"
          size="lg"
          required
        />
      </Grid>

      <Grid item xs={12} lg={6}>
        <Label htmlFor="cpf">CPF</Label>
        <Input
          id="cpf"
          placeholder="CPF"
          type="text"
          size="lg"
          mask="cpf"
          value={formData.user.cpf}
          errorMessage={errors["user.cpf"]}
          onChange={(e) => {
            onClearError("user.cpf");
            onChange("user.cpf", e.target.value);
          }}
        />
      </Grid>

      <Grid item xs={6} lg={6}>
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          placeholder="A senha será a data de nascimento do participante"
          type="password"
          size="lg"
          disabled
          value=""
        />
      </Grid>

      <Grid item xs={12} lg={6}>
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          placeholder="Telefone"
          type="text"
          size="lg"
          mask="phone"
          value={formData.user.phone}
          errorMessage={errors["user.phone"]}
          onChange={(e) => {
            onClearError("user.phone");
            onChange("user.phone", e.target.value);
          }}
        />
      </Grid>

      <Grid item xs={12} lg={6}>
        <Label htmlFor="gender">Gênero</Label>
        <Select
          id="gender"
          className="h-12"
          value={formData.user.gender}
          onChange={(e) => {
            onClearError("user.gender");
            onChange("user.gender", e.target.value);
          }}
        >
          <option value={Gender.FEMALE}>Feminino</option>
          <option value={Gender.MALE}>Masculino</option>
        </Select>
      </Grid>

      <Grid item xs={12} lg={12}>
        <Label htmlFor="birthDay">Data de Nascimento</Label>
        <Input
          id="birthDay"
          type="date"
          size="lg"
          value={formData.birthday}
          errorMessage={errors["birthday"]}
          onChange={(e) => {
            onClearError("birthday");
            onChange("birthday", e.target.value);
          }}
          required
        />
      </Grid>

      <Grid item xs={12} lg={6}>
        <Label htmlFor="weight">Peso (kg)</Label>
        <Input
          id="weight"
          placeholder="Ex: 70"
          type="number"
          size="lg"
          value={
            formData.weight !== undefined && !isNaN(formData.weight)
              ? String(formData.weight)
              : ""
          }
          errorMessage={errors["weight"]}
          onChange={(e) =>
            onChange(
              "weight",
              e.target.value ? fmtNumber(Number(e.target.value)) : undefined
            )
          }
          required
        />
      </Grid>

      <Grid item xs={12} lg={6}>
        <Label htmlFor="height">Altura (cm)</Label>
        <Input
          id="height"
          placeholder="Ex: 170"
          type="number"
          size="lg"
          value={
            formData.height !== undefined && !isNaN(formData.height)
              ? String(formData.height)
              : ""
          }
          errorMessage={errors["height"]}
          onChange={(e) =>
            onChange(
              "height",
              e.target.value ? fmtNumber(Number(e.target.value)) : undefined
            )
          }
          required
        />
      </Grid>

      <Grid item xs={12}>
        <Box display="flex" direction="row" justify="flex-end" gap={12} mt={12}>
          <Button variant="default" color="primary" size="lg" onClick={onNext}>
            Próximo
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}

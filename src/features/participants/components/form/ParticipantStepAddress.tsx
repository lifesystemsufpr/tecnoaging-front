import {
  Box,
  Button,
  Grid,
  Input,
  Label,
  Select,
  Typography,
} from "@/core/components/ui";
import { ScholarShip, SocioEconomicLevel, UF_LIST } from "@/core/enums";
import { ParticipantNestedFormData } from "@/core/libs/validators";
import { socioLabel } from "@/core/utils";

interface StepAddressProps {
  formData: ParticipantNestedFormData;
  errors: Record<string, string>;
  cepLoading: boolean;
  onChange: (path: string, value: any) => void;
  onClearError: (path: string) => void;
  onCepBlur: () => void;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isEdit: boolean;
}

export function ParticipantStepAddress({
  formData,
  errors,
  cepLoading,
  onChange,
  onClearError,
  onCepBlur,
  onBack,
  onSubmit,
  isSubmitting,
  isEdit,
}: StepAddressProps) {
  return (
    <Grid container spacing={24}>
      <Grid item xs={12} lg={6}>
        <Label htmlFor="scholarship">Escolaridade</Label>
        <Select
          id="scholarship"
          className="h-12"
          value={formData.scholarship}
          onChange={(e) => {
            onClearError("scholarship");
            onChange("scholarship", e.target.value);
          }}
        >
          <option value="">Selecione...</option>
          {Object.entries(ScholarShip).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </Select>
        {errors["scholarship"] && (
          <Typography variant="small" color="accent">
            {errors["scholarship"]}
          </Typography>
        )}
      </Grid>

      <Grid item xs={12} lg={6}>
        <Label htmlFor="socio_economic_level">Nível Socioeconômico</Label>
        <Select
          id="socio_economic_level"
          className="h-12"
          value={formData.socio_economic_level}
          onChange={(e) => {
            onClearError("socio_economic_level");
            onChange("socio_economic_level", e.target.value);
          }}
        >
          <option value="">Selecione...</option>
          {Object.values(SocioEconomicLevel).map((level) => (
            <option key={level} value={level}>
              {socioLabel(level)}
            </option>
          ))}
        </Select>
        {errors["socio_economic_level"] && (
          <Typography variant="small" color="accent">
            {errors["socio_economic_level"]}
          </Typography>
        )}
      </Grid>

      <Grid item xs={12} lg={6}>
        <Label htmlFor="zipCode">CEP</Label>
        <Input
          id="zipCode"
          placeholder="00000-000"
          type="text"
          size="lg"
          mask="cep"
          value={formData.zipCode}
          errorMessage={errors["zipCode"]}
          onChange={(e) => {
            onClearError("zipCode");
            onChange("zipCode", e.target.value);
          }}
          onBlur={onCepBlur}
          required
        />
      </Grid>

      <Grid item xs={12} lg={6}>
        <Label htmlFor="state">UF</Label>
        <Select
          id="state"
          className="h-12"
          value={formData.state}
          onChange={(e) => {
            onClearError("state");
            onChange("state", e.target.value);
          }}
          disabled={cepLoading}
        >
          <option value="">Selecione...</option>
          {Object.values(UF_LIST).map((uf) => (
            <option key={uf} value={uf}>
              {uf}
            </option>
          ))}
        </Select>
        {errors["state"] && (
          <Typography variant="small" color="accent">
            {errors["state"]}
          </Typography>
        )}
      </Grid>

      <Grid item xs={12} lg={6}>
        <Label htmlFor="city">Cidade</Label>
        <Input
          id="city"
          placeholder="Cidade"
          type="text"
          size="lg"
          value={formData.city}
          errorMessage={errors["city"]}
          onChange={(e) => {
            onClearError("city");
            onChange("city", e.target.value);
          }}
          required
          disabled={cepLoading}
        />
      </Grid>

      <Grid item xs={12} lg={6}>
        <Label htmlFor="neighborhood">Bairro</Label>
        <Input
          id="neighborhood"
          placeholder="Bairro"
          type="text"
          size="lg"
          value={formData.neighborhood}
          errorMessage={errors["neighborhood"]}
          onChange={(e) => {
            onClearError("neighborhood");
            onChange("neighborhood", e.target.value);
          }}
          required
          disabled={cepLoading}
        />
      </Grid>

      <Grid item xs={12} lg={8}>
        <Label htmlFor="street">Rua</Label>
        <Input
          id="street"
          placeholder="Logradouro"
          type="text"
          size="lg"
          value={formData.street}
          errorMessage={errors["street"]}
          onChange={(e) => {
            onClearError("street");
            onChange("street", e.target.value);
          }}
          required
          disabled={cepLoading}
        />
      </Grid>

      <Grid item xs={12} lg={4}>
        <Label htmlFor="number">Número</Label>
        <Input
          id="number"
          placeholder="Nº"
          type="text"
          size="lg"
          value={formData.number}
          errorMessage={errors["number"]}
          onChange={(e) => {
            onClearError("number");
            onChange("number", e.target.value);
          }}
          required
        />
      </Grid>

      <Grid item xs={12}>
        <Label htmlFor="complement">Complemento</Label>
        <Input
          id="complement"
          placeholder="Apto, Bloco, etc."
          type="text"
          size="lg"
          value={formData.complement ?? ""}
          errorMessage={errors["complement"]}
          onChange={(e) => {
            onClearError("complement");
            onChange("complement", e.target.value);
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <Box
          display="flex"
          direction="row"
          justify="space-between"
          gap={12}
          mt={12}
        >
          <Button variant="outline" size="lg" onClick={onBack}>
            Voltar
          </Button>
          <Button
            variant="default"
            color="primary"
            size="lg"
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Salvando..."
              : isEdit
                ? "Salvar Alterações"
                : "Cadastrar Participante"}
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}

import { HealthUnit } from "../domain/Health-unit";

export interface HealthUnitRequest extends Omit<HealthUnit, "id"> {
  children?: React.ReactNode;
}

export interface HealthUnitResponse extends HealthUnit {
  children?: React.ReactNode;
}

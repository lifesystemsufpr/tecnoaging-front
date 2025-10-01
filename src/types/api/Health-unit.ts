import { HealthUnit } from "../domain/Health-unit";

export interface HealthUnitRequest extends Omit<HealthUnit, "id"> {}

export interface HealthUnitResponse extends HealthUnit {}

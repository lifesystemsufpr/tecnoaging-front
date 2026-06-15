import { describe, it, expect } from "vitest";
import {
  formatCpf,
  formatDateBr,
  calcularIdadeAnos,
  formatPhoneBR,
  genderPt,
} from "./format";

describe("formatCpf", () => {
  it("formata 11 dígitos no padrão CPF", () => {
    expect(formatCpf("12345678901")).toBe("123.456.789-01");
  });
  it("remove não-dígitos antes de formatar", () => {
    expect(formatCpf("123.456.789-01")).toBe("123.456.789-01");
  });
  // Adversarial: vazio/undefined não pode quebrar.
  it("retorna string vazia para entrada vazia", () => {
    expect(formatCpf("")).toBe("");
    expect(formatCpf(undefined)).toBe("");
  });
});

describe("formatPhoneBR", () => {
  it("formata celular de 11 dígitos", () => {
    expect(formatPhoneBR("41912345678")).toBe("(41) 91234-5678");
  });
  it("formata fixo de 10 dígitos", () => {
    expect(formatPhoneBR("4133221100")).toBe("(41) 3322-1100");
  });
  it("retorna travessão para nulo", () => {
    expect(formatPhoneBR(null)).toBe("—");
  });
  it("devolve a entrada original quando o tamanho é inesperado", () => {
    expect(formatPhoneBR("123")).toBe("123");
  });
});

describe("calcularIdadeAnos", () => {
  it("calcula idade cheia quando o aniversário já passou no ano", () => {
    expect(calcularIdadeAnos("1950-01-10", "2026-06-14")).toBe(76);
  });
  // Borda: aniversário ainda não chegou no ano de referência.
  it("subtrai 1 quando o aniversário ainda não chegou", () => {
    expect(calcularIdadeAnos("1950-12-31", "2026-06-14")).toBe(75);
  });
  it("retorna 0 quando falta data", () => {
    expect(calcularIdadeAnos(undefined, "2026-06-14")).toBe(0);
    expect(calcularIdadeAnos("1950-01-10", undefined)).toBe(0);
  });
});

describe("formatDateBr", () => {
  it("formata data ISO em pt-BR", () => {
    expect(formatDateBr("2026-06-14T00:00:00")).toBe("14/06/2026");
  });
  it("usa fallback quando não há data", () => {
    expect(formatDateBr(undefined)).toBe("Sem informação");
  });
});

describe("genderPt", () => {
  it.each([
    ["MALE", "Masculino"],
    ["FEMALE", "Feminino"],
    ["OTHER", "Outro"],
    ["?", "—"],
  ])("traduz %s → %s", (input, expected) => {
    expect(genderPt(input)).toBe(expected);
  });
});

/* eslint-disable @typescript-eslint/no-explicit-any */
export const buildQueryString = (params: Record<string, any>) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value != null && value !== "") {
      search.set(key, String(value));
    }
  });
  const queryString = search.toString();
  return queryString ? `?${queryString}` : "";
};

interface EnderecoViaCEP {
  cep: string;
  logradouro: string;
  complemento: string;
  unidade: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

export const fetchEnderecoViaCEP = async (
  cep: string
): Promise<EnderecoViaCEP> => {
  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  if (!response.ok) {
    throw new Error("Erro ao buscar endereço");
  }
  const data = await response.json();
  if (data.erro) {
    throw new Error("CEP não encontrado");
  }
  return data;
};
